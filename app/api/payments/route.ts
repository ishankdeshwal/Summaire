import { handleCheckoutSessionCompleted, handlePaymentIntentSucceeded, handleSubscriptionDeleted, createOrUpdateUser } from "@/lib/payments";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { GetDbConnection } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
export const POST = async (req: NextRequest) => {
  const payload = await req.text();
  const sign = req.headers.get("stripe-signature");
  let event;
  const endPointSecret = process.env.STRIPE_WEBHOOK_SECRET!;



  try {
    event = stripe.webhooks.constructEvent(payload, sign!, endPointSecret);


    switch (event.type) {
      case "checkout.session.completed":
        const sessionId = event.data.object.id;
        try {
          const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['line_items']
          });
          await handleCheckoutSessionCompleted({ session, stripe });
        } catch (error) {
          console.error('Error processing checkout session:', error);
          return NextResponse.json(
            { error: "Failed to process checkout session" },
            { status: 500 }
          );
        }
        break;

      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        try {
          await handlePaymentIntentSucceeded({ paymentIntent, stripe });
        } catch (error) {
          console.error('Error processing payment intent:', error);
          return NextResponse.json(
            { error: "Failed to process payment intent" },
            { status: 500 }
          );
        }
        break;

      case 'customer.subscription.deleted':
        const subscription = event.data.object
        const subscriptionId = event.data.object.id
        await handleSubscriptionDeleted({ subscriptionId, stripe })
        break;

      case "invoice.payment_succeeded":
        const invoice = event.data.object;
        // Handle invoice payment - this is common with payment links
        try {
          const customerId = invoice.customer as string;
          const customer = await stripe.customers.retrieve(customerId);

          if ("email" in customer && customer.email) {
            const sql = await GetDbConnection();

            // For invoice payments, we need to get the price from the invoice line items
            const invoiceWithItems = await stripe.invoices.retrieve(invoice.id!, {
              expand: ['lines.data.price']
            });

            const priceId = (invoiceWithItems.lines.data[0] as { price?: { id: string } })?.price?.id;

            if (priceId) {
              await createOrUpdateUser({
                sql,
                email: customer.email,
                fullName: customer.name || "",
                customerId,
                priceId,
                status: "active",
              });

            }
          }
        } catch (error) {
          console.error('Error processing invoice payment:', error);
        }
        break;

      default:
        // Unhandled event type
        break;
    }

  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: "Failed to trigger webhooks" },
      { status: 400 }
    );
  }
  return NextResponse.json({
    status: "success",
    message: "Hello From stripe  API",
  });
};
