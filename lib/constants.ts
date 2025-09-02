import { isDev } from "@/utils/helper";

export const pricingPlans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "Get started with AI summaries",
    items: [
      "3 PDF summary per month",
      "Standard processing speed",
      "Basic AI summaries",
      "Community support",
    ],
    paymentLink: "",
    priceId: "",
  },
  {
    id: "basic",
    name: "Basic",
    price: 49,
    description: "Perfect for occasional Use",
    items: [
      "5 PDF summaries per month",
      "Standard processing speed",
      "Email Support",
      "Basic AI summaries",
    ],
    paymentLink: process.env.NEXT_PUBLIC_STRIPE_LINK_BASIC || (isDev
      ? "https://buy.stripe.com/test_00w9AN8Ar6Mgegggrt2sM01"
      : ""),
    priceId: isDev ? "price_1S24FZ7vVuxJhE5DSkDY7mdv" : "",
  },
  {
    id: "pro",
    name: "Pro",
    price: 149,
    description: "For professionals and teams",
    items: [
      "1000 PDF summaries per month",
      "Priority Processing",
      "24/7 priority Support",
      "MarkDown Export",
      "Advanced AI summaries",
    ],
    paymentLink: process.env.NEXT_PUBLIC_STRIPE_LINK_PRO || (isDev
      ? "https://buy.stripe.com/test_cNifZb8Ar6Mgegggrt2sM00"
      : ""),
    priceId: isDev ? "price_1S24Ig7vVuxJhE5DDvIkf3Gi" : "",
  },
];

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
}
export const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
}