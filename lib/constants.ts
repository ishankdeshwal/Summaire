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
    paymentLink: "",
    priceId: "basic_plan", // Razorpay plan identifier
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
    paymentLink: "",
    priceId: "pro_plan", // Razorpay plan identifier
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