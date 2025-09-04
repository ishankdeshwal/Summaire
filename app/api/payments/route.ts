import { handleRazorpayPaymentSuccess, createOrUpdateUser } from "@/lib/razorpay-payments";
import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpayPayment, getRazorpayPayment, getRazorpayOrder } from "@/lib/razorpay";
import { GetDbConnection } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export const POST = async (req: NextRequest) => {
  try {
    const { order_id, payment_id, signature, email, name } = await req.json();

    if (!order_id || !payment_id || !signature) {
      return NextResponse.json(
        { error: "Missing required payment parameters" },
        { status: 400 }
      );
    }

    // Verify the payment signature
    const isValidSignature = verifyRazorpayPayment(order_id, payment_id, signature);
    
    if (!isValidSignature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Get payment and order details from Razorpay
    const [payment, order] = await Promise.all([
      getRazorpayPayment(payment_id),
      getRazorpayOrder(order_id)
    ]);

    // Extract plan information from order notes
    const planId = String(order.notes?.planId || '');
    const planName = String(order.notes?.planName || '');
    const priceId = String(order.notes?.priceId || '');

    if (!planId || !priceId) {
      return NextResponse.json(
        { error: "Invalid order data" },
        { status: 400 }
      );
    }

    // Get current user from Clerk
    const user = await currentUser();
    const clerkUserId = user?.id;

    // Handle successful payment
    await handleRazorpayPaymentSuccess({
      payment,
      order,
      email: email || payment.email || "",
      name: name || payment.notes?.name || "",
      planId,
      priceId,
      planName,
      clerkUserId,
    });

    return NextResponse.json({
      status: "success",
      message: "Payment processed successfully",
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    );
  }
};