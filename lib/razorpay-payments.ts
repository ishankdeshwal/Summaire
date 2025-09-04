import { GetDbConnection } from "@/lib/db";

// Razorpay payment and order types
interface RazorpayPayment {
  id: string;
  amount: string | number;
  currency: string;
  status: string;
  email?: string;
  notes?: Record<string, string>;
  created_at: number;
}

interface RazorpayOrder {
  id: string;
  amount: string | number;
  currency: string;
  status: string;
  notes?: any;
  created_at: number;
}

export async function handleRazorpayPaymentSuccess({
  payment,
  order,
  email,
  name,
  planId,
  priceId,
  planName,
  clerkUserId,
}: {
  payment: RazorpayPayment;
  order: RazorpayOrder;
  email: string;
  name: string;
  planId: string;
  priceId: string;
  planName: string;
  clerkUserId?: string;
}) {
  try {
    const sql = await GetDbConnection();

    // Create or update user
    await createOrUpdateUser({
      sql,
      email,
      fullName: name,
      customerId: payment.id, // Razorpay payment ID used as unique identifier
      priceId,
      status: "active",
      clerkUserId,
    });

    // Insert payment record
    try {
      await createRazorpayPayment({
        sql,
        payment,
        order,
        priceId,
        userEmail: email,
      });
    } catch (paymentError) {
      console.error("Payment record creation failed:", paymentError);
      // Do NOT throw here → user creation must still succeed
    }
  } catch (error) {
    console.error("Error handling Razorpay payment:", error);
    throw error;
  }
}

export async function createOrUpdateUser({
  sql,
  email,
  fullName,
  customerId,
  priceId,
  status,
  clerkUserId,
}: {
  sql: any; // ✅ Fixed typing issue
  email: string;
  fullName: string;
  customerId: string;
  priceId: string;
  status: string;
  clerkUserId?: string;
}) {
  try {
    const existingUser = await sql`SELECT * FROM users WHERE email = ${email}`;

    if (existingUser.length > 0) {
      await sql`
        UPDATE users 
        SET 
          full_name = ${fullName},
          customer_id = ${customerId},
          price_id = ${priceId},
          status = ${status},
          clerk_user_id = ${clerkUserId || existingUser[0].clerk_user_id},
          updated_at = NOW()
        WHERE email = ${email}
      `;
    } else {
      await sql`
        INSERT INTO users (
          email, 
          full_name, 
          customer_id, 
          price_id, 
          status, 
          clerk_user_id, 
          created_at, 
          updated_at
        )
        VALUES (
          ${email}, 
          ${fullName}, 
          ${customerId}, 
          ${priceId}, 
          ${status}, 
          ${clerkUserId || null}, 
          NOW(), 
          NOW()
        )
      `;
    }
  } catch (error) {
    console.error("Error creating/updating user:", error);
    throw error;
  }
}

export async function createRazorpayPayment({
  sql,
  payment,
  order,
  priceId,
  userEmail,
}: {
  sql: any;
  payment: RazorpayPayment;
  order: RazorpayOrder;
  priceId: string;
  userEmail: string;
}) {
  try {
    await sql`
      INSERT INTO payments (
        payment_id,
        order_id,
        user_email,
        amount,
        currency,
        status,
        price_id,
        payment_method,
        created_at
      ) VALUES (
        ${payment.id},
        ${order.id},
        ${userEmail},
        ${Number(payment.amount)},
        ${payment.currency},
        ${payment.status},
        ${priceId},
        'razorpay',
        NOW()
      )
      ON CONFLICT (payment_id) DO NOTHING
    `;
  } catch (error) {
    console.error("Error inserting payment:", error);
    throw error;
  }
}

export async function createOrUpdateUserForSignIn({
  sql,
  email,
  fullName,
  clerkUserId,
}: {
  sql: any;
  email: string;
  fullName?: string;
  clerkUserId?: string;
}) {
  try {
    const existingUser = await sql`SELECT * FROM users WHERE email = ${email}`;

    if (existingUser.length > 0) {
      if (clerkUserId) {
        await sql`
          UPDATE users 
          SET 
            clerk_user_id = ${clerkUserId},
            updated_at = NOW()
          WHERE email = ${email}
        `;
      }
    } else {
      await sql`
        INSERT INTO users (
          email, 
          full_name, 
          clerk_user_id, 
          price_id, 
          status, 
          created_at, 
          updated_at
        )
        VALUES (
          ${email}, 
          ${fullName || ""}, 
          ${clerkUserId || null}, 
          'free', 
          'active', 
          NOW(), 
          NOW()
        )
      `;
    }
  } catch (error) {
    console.error("Error creating/updating user for sign-in:", error);
    throw error;
  }
}
