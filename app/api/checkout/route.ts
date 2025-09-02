import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export const POST = async (req: NextRequest) => {
    try {
        const { priceId, successUrl, cancelUrl } = await req.json();

        if (!priceId) {
            return NextResponse.json(
                { error: "Price ID is required" },
                { status: 400 }
            );
        }

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
            metadata: {
                priceId: priceId,
            },
        });

        return NextResponse.json({
            sessionId: session.id,
            url: session.url
        });

    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create checkout session" },
            { status: 500 }
        );
    }
};
