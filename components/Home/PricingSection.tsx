import { pricingPlans } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckIcon, Crown } from "lucide-react";
import CurrentPlanStatus from "./CurrentPlanStatus";
type PriceType = {
  name: string;
  price: number;
  description: string;
  items: string[];
  id: string;
  paymentLink: string;
  priceId: string;
};

const PricingCard = ({
  name,
  price,
  description,
  items,
  id,
  paymentLink,
}: PriceType) => {
  const isFree = id === "free";
  const isPro = id === "pro";

  return (
    <div className="relative w-full max-w-lg hover:scale-105 hover-transition-all duration-300">
      <div
        className={cn(
          "relative flex flex-col h-full gap-4 lg:gap-8  z-10 p-8 rounded-xl border-[1px] border-gray-500/20 rounded-2xl",
          isPro && "border-rose-500 gap-5 border-2",
          isFree && "border-gray-300 gap-5 border-2"
        )}
      >
        {isPro && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="bg-rose-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              <Crown className="w-4 h-4" />
              Most Popular
            </div>
          </div>
        )}

        <div className="flex justify-between items-center gap-4 ">
          <div>
            <p className="text-lg lg:text-xl font-bold capitalize">{name}</p>
            <p className="text-base-content/80 mt-2">{description}</p>
          </div>
        </div>
        <div className=" flex gap-2 ">
          <p className="text-5xl tracking-tight font-extrabold">
            {isFree ? "Free" : `₹${price}`}
          </p>
          {!isFree && (
            <div className="flex flex-col justify-end mb-[4px]">
              <p className="text-xs uppercase font-semibold">Rs.</p>
              <p className="text-xs">/month</p>
            </div>
          )}
        </div>

        <div className="space-y-2.5 leading-relaxed text-base flex-1">
          {items.map((item, idx) => (
            <li className="flex items-center gap-2" key={idx}>
              <CheckIcon color="green" size={18} />
              <span>{item}</span>
            </li>
          ))}
        </div>
        <div className="space-y-2  flex justify-center w-full">
          {isFree ? (
            <div className="w-full rounded-full flex items-center justify-center gap-2 bg-gray-100 text-gray-600 border-2 border-gray-300 py-2">
              Current Plan
            </div>
          ) : (
            <a
              href={paymentLink}
              className={cn(
                "w-full rounded-full flex items-center justify-center gap-2 bg-linear-to-r from-rose-800 to-rose-500 hover:from-rose-500 hover:to-rose-800 text-white border-2 py-2 transition-colors",
                isPro
                  ? "from-rose-900"
                  : "border-rose-100 from-rose-400 to-rose-500"
              )}
            >
              Buy Now
              <ArrowRight size={18} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default function PricingSection() {
  return (
    <section className="relative overflow-hidden " id="pricing">
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-12">
        <div className="flex items-center justify-center w-full pb-12">
          <h2 className="uppercase font-bold text-xl mb-8 text-rose-500">
            Pricing
          </h2>
        </div>

        <CurrentPlanStatus />

        <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.id} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
