"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";

interface RazorpayButtonProps {
  priceId: string;
  planName: string;
  amount: number;
  description: string;
  className?: string;
  children?: React.ReactNode;
}
interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function RazorpayButton({
  priceId,
  planName,
  amount,
  description,
  className,
  children,
}: RazorpayButtonProps) {

  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const loadRazorpayScript = (): Promise<void> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      script.onerror = () => {
        console.error("Failed to load Razorpay script");
        setIsLoading(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      // Load Razorpay script
      await loadRazorpayScript();

      // Create order
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/#pricing`,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create payment order: ${errorData.error || 'Unknown error'}`);
      }

      const orderData = await response.json();

      // Check if key is present
      if (!orderData.key) {
        throw new Error("Payment configuration error - missing Razorpay key");
      }

      // Configure Razorpay options
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: orderData.name,
        description: orderData.description,
        order_id: orderData.orderId,
        prefill: {
          name: user?.fullName || user?.firstName || "",
          email: user?.emailAddresses[0]?.emailAddress || "",
        },
        theme: orderData.theme,
        handler: async function (response: RazorpayResponse) {
          // Handle successful payment
          try {
            const paymentResponse = await fetch("/api/payments", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                email: user?.emailAddresses[0]?.emailAddress || "",
                name: user?.fullName || user?.firstName || "",
              }),
            });

            if (paymentResponse.ok) {
              // Emit a custom event to notify other components about successful payment
              window.dispatchEvent(new CustomEvent('paymentSuccess', {
                detail: {
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id
                }
              }));
              
              // Force a page refresh to update all components
              setTimeout(() => {
                window.location.href = `/success?order_id=${response.razorpay_order_id}&payment_id=${response.razorpay_payment_id}`;
              }, 1000);
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            alert("Payment verification failed. Please contact support.");
          }
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
          },
        },
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      alert("Payment failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className={cn(
        "w-full rounded-full flex items-center justify-center gap-2 bg-linear-to-r from-rose-800 to-rose-500 hover:from-rose-500 hover:to-rose-800 text-white border-2 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      {isLoading ? (
        "Processing..."
      ) : (
        <>
          {children || "Buy Now"}
          <ArrowRight size={18} />
        </>
      )}
    </button>
  );
}
