import Razorpay from 'razorpay';

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('Razorpay environment variables are missing!');
}

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export interface RazorpayOrderData {
  amount: number; 
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface RazorpayPaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export async function createRazorpayOrder(orderData: RazorpayOrderData) {
  try {
    const order = await razorpay.orders.create({
      amount: orderData.amount,
      currency: orderData.currency,
      receipt: orderData.receipt,
      notes: orderData.notes || {},
    });
    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
}

export function verifyRazorpayPayment(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  
  return expectedSignature === signature;
}

export async function getRazorpayPayment(paymentId: string) {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error('Error fetching Razorpay payment:', error);
    throw error;
  }
}

// Get Razorpay order details
export async function getRazorpayOrder(orderId: string) {
  try {
    const order = await razorpay.orders.fetch(orderId);
    return order;
  } catch (error) {
    console.error('Error fetching Razorpay order:', error);
    throw error;
  }
}
