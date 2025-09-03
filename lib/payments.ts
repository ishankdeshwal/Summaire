import { GetDbConnection } from '@/lib/db';
import Stripe from "stripe";


export async function handleCheckoutSessionCompleted({
  session,
  stripe,
}: {
  session: Stripe.Checkout.Session;
  stripe: Stripe;
}) {
  const customerId = session.customer as string;
  const customer = await stripe.customers.retrieve(customerId);
  const priceId = session.line_items?.data[0]?.price?.id;
  if ("email" in customer && priceId) {
    const { email, name } = customer;
    const sql = await GetDbConnection();

    await createOrUpdateUser({
      sql,
      email: email as string,
      fullName: name as string,
      customerId,
      priceId: priceId as string,
      status: "active",
    });
    try {
      await createPayment({
        sql,
        session,
        priceId: priceId as string,
        userEmail: email as string,
      });
    } catch (paymentError) {
      console.error('Failed to create payment record:', paymentError);
      // Don't throw here - user creation succeeded, payment creation failed
      // This allows the user to still get their plan even if payment tracking fails
    }
  }
}

export async function createOrUpdateUser({
  sql,
  email,
  fullName,
  customerId,
  priceId,
  status,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sql: any;
  email: string;
  fullName: string;
  customerId: string;
  priceId: string;
  status: string;
}) {
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    if (user.length === 0) {
      // Create new user
      await sql`INSERT INTO users (email,full_name,customer_id,price_id,status) VALUES (${email},${fullName},${customerId},${priceId},${status})`;
    } else {
      // Update existing user with new payment info
      await sql`UPDATE users SET full_name=${fullName}, customer_id=${customerId}, price_id=${priceId}, status=${status} WHERE email=${email}`;
    }
  } catch (error) {
    console.error("Error creating or updating user:", error);
    throw error; // rethrow to ensure payment creation fails if user creation/update fails
  }
}

export async function createOrUpdateUserForSignIn({
  sql,
  email,
  fullName,
  clerkUserId,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sql: any;
  email: string;
  fullName?: string;
  clerkUserId?: string;
}) {
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    if (user.length === 0) {
      // Create new user with default inactive status (no payment yet)
      await sql`INSERT INTO users (email, full_name, status) VALUES (${email}, ${fullName || null}, 'inactive')`;
      console.log(`New user created for sign-in: ${email}`);
    } else {
      // Update full name if provided and not already set
      if (fullName && !user[0].full_name) {
        await sql`UPDATE users SET full_name=${fullName} WHERE email=${email}`;
      }
      console.log(`Existing user signed in: ${email}`);
    }
  } catch (error) {
    console.error("Error creating or updating user for sign-in:", error);
    throw error;
  }
}

export async function handlePaymentIntentSucceeded({
  paymentIntent,
  stripe,
}: {
  paymentIntent: Stripe.PaymentIntent;
  stripe: Stripe;
}) {
  try {
    // Get customer information
    const customerId = paymentIntent.customer as string;
    if (!customerId) {
      console.error("No customer ID found in payment intent");
      return;
    }

    const customer = await stripe.customers.retrieve(customerId);
    if (!("email" in customer) || !customer.email) {
      console.error("No customer email found");
      return;
    }

    const sql = await GetDbConnection();

    // For payment links, we need to determine the price_id from the payment intent metadata or amount
    // Since payment links don't always include price_id in metadata, we'll use the amount to determine the plan
    const amount = paymentIntent.amount;
    let priceId = "unknown";

    // Map amounts to price IDs based on your actual pricing
    if (amount === 4900) { // ₹49.00 in cents (Basic plan)
      priceId = "price_1S24FZ7vVuxJhE5DSkDY7mdv"; // Basic plan price ID
    } else if (amount === 14900) { // ₹149.00 in cents (Pro plan)
      priceId = "price_1S24Ig7vVuxJhE5DDvIkf3Gi"; // Pro plan price ID
    }



    // Create or update user
    await createOrUpdateUser({
      sql,
      email: customer.email,
      fullName: customer.name || "",
      customerId,
      priceId,
      status: "active",
    });

    // Create payment record
    try {
      await createPaymentFromIntent({
        sql,
        paymentIntent,
        priceId,
        userEmail: customer.email,
      });
    } catch (paymentError) {
      console.error('Failed to create payment record from intent:', paymentError);
      // Don't throw here - user creation succeeded, payment creation failed
    }

  } catch (error) {
    console.error("Error processing payment intent:", error);
    throw error;
  }
}

export async function createPayment({
  sql,
  session,
  priceId,
  userEmail,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sql: any;
  session: Stripe.Checkout.Session;
  priceId: string;
  userEmail: string;
}) {
  try {
    const { amount_total, id, customer_email, status } = session;



    await sql`
      INSERT INTO payments (
        amount,
        status,
        stripe_payment_id,
        price_id,
        user_email
      ) VALUES (
        ${amount_total},
        ${status},
        ${id},
        ${priceId},
        ${userEmail}
      )
    `;


  } catch (error) {
    console.error("Error inserting payment:", error);
    throw error; // rethrow if you want the caller to handle
  }
}

export async function createPaymentFromIntent({
  sql,
  paymentIntent,
  priceId,
  userEmail,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sql: any;
  paymentIntent: Stripe.PaymentIntent;
  priceId: string;
  userEmail: string;
}) {
  try {
    const { amount, id, status } = paymentIntent;



    await sql`
      INSERT INTO payments (
        amount,
        status,
        stripe_payment_id,
        price_id,
        user_email
      ) VALUES (
        ${amount},
        ${status},
        ${id},
        ${priceId},
        ${userEmail}
      )
    `;


  } catch (error) {
    console.error("Error inserting payment from intent:", error);
    throw error;
  }
}

export async function handleSubscriptionDeleted({ subscriptionId, stripe }: { subscriptionId: string, stripe: Stripe }) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const customerId = subscription.customer as string;

    // Update user status to inactive
    const sql = await GetDbConnection();
    await sql`UPDATE users SET status = 'inactive' WHERE customer_id = ${customerId}`;

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}