import { NextRequest, NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/razorpay";
import { pricingPlans } from "@/lib/constants";

export const POST = async (req: NextRequest) => {
    try {
        // Check if Razorpay environment variables are set
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return NextResponse.json(
                { error: "Payment service configuration error" },
                { status: 500 }
            );
        }

        const { priceId, successUrl, cancelUrl } = await req.json();

        if (!priceId) {
            return NextResponse.json(
                { error: "Price ID is required" },
                { status: 400 }
            );
        }

        // Find the plan details
        const plan = pricingPlans.find(p => p.priceId === priceId);
        if (!plan) {
            return NextResponse.json(
                { error: "Invalid plan" },
                { status: 400 }
            );
        }

        // Create Razorpay order
        const order = await createRazorpayOrder({
            amount: plan.price * 100, // Convert to paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            notes: {
                planId: plan.id,
                planName: plan.name,
                priceId: priceId,
            },
        });

        // Check if public key is available
        const publicKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        if (!publicKey) {
            return NextResponse.json(
                { error: "Payment service configuration error - missing public key" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: publicKey,
            name: "Sommaire",
            description: plan.description,
            prefill: {
                email: "",
                name: "",
            },
            theme: {
                color: "#ef4444", // rose-500 color
            },
            successUrl: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/success?order_id={order_id}&payment_id={payment_id}`,
            cancelUrl: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
        });

    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create payment order" },
            { status: 500 }
        );
    }
};
