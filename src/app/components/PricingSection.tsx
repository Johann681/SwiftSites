"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { plans } from "@/lib/constants";

export default function PricingSection() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <section className="relative bg-gray-50 py-24 px-6 overflow-hidden">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-semibold">
          SwiftSites Pricing Plans
        </h2>
        <p className="mt-2 text-sm md:text-base text-gray-500">
          Choose a plan to launch and scale your website effortlessly. Start
          free, upgrade anytime.
        </p>

        {/* Billing toggle with animation */}
        <div className="mt-6 relative inline-flex border rounded-full bg-white shadow-sm">
          {/* Sliding background */}
          <motion.div
            layout
            className="absolute top-0 left-0 w-1/2 h-full bg-indigo-600 rounded-full"
            animate={{
              x: billing === "monthly" ? 0 : "100%",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <button
            onClick={() => setBilling("monthly")}
            className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition ${
              billing === "monthly" ? "text-white" : "text-gray-600"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition ${
              billing === "yearly" ? "text-white" : "text-gray-600"
            }`}
          >
            Yearly
          </button>
        </div>
      </motion.div>

      {/* Plans Grid */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 relative z-10">
        {plans.map((plan, idx) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            className={`relative flex flex-col justify-between rounded-2xl border p-8 shadow-sm hover:shadow-xl transition bg-gradient-to-br ${
              plan.popular
                ? "border-indigo-600 from-indigo-50 to-white"
                : "border-gray-200 from-white to-gray-50"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white text-xs rounded-full font-semibold shadow-md">
                Most Popular
              </div>
            )}

            {/* Plan Info */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {plan.name}
              </h3>

              {/* Only show price if numbers exist */}
              {typeof plan.monthly === "number" &&
                typeof plan.yearly === "number" && (
                  <p className="text-3xl font-bold text-gray-900">
                    ${billing === "monthly" ? plan.monthly : plan.yearly}
                    <span className="text-sm font-normal text-gray-500 ml-1">
                      {billing === "monthly" ? "/mo" : "/yr"}
                    </span>
                  </p>
                )}

              <ul className="mt-3 space-y-2 text-gray-600 text-sm leading-relaxed">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 before:content-['✓'] before:text-indigo-600"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button */}
            <Button
              className={`mt-6 w-full rounded-lg font-medium ${
                plan.popular
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "bg-gray-900 hover:bg-gray-800 text-white"
              } py-3`}
            >
              {plan.action}
            </Button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
