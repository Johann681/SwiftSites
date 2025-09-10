"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free Trial",
    monthly: null,
    yearly: null,
    features: [
      "Try SwiftSites risk-free",
      "Manage 1 project",
      "Basic support",
      "Limited analytics",
    ],
    action: "Contact Us",
    popular: false,
  },
  {
    name: "Pro",
    monthly: 79,
    yearly: 799,
    features: [
      "Manage up to 50 projects",
      "Priority email support",
      "Advanced analytics dashboard",
      "Custom branding options",
      "Automated notifications",
    ],
    action: "Get Pro",
    popular: true,
  },
  {
    name: "Enterprise",
    monthly: "Custom",
    yearly: "Custom",
    features: [
      "Unlimited projects",
      "Dedicated account manager",
      "Full analytics & reporting",
      "Custom integrations",
      "Team accounts",
      "24/7 support",
    ],
    action: "Contact Sales",
    popular: false,
  },
];

export default function PricingSection() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <section className="relative bg-gray-50 py-24 px-6 overflow-hidden">
      {/* Background shapes */}
      <div className="absolute -top-24 -left-32 w-72 h-72 bg-gradient-to-tr from-indigo-300 to-purple-400 opacity-20 rounded-full blur-3xl animate-slow-spin"></div>
      <div className="absolute -bottom-32 -right-24 w-96 h-96 bg-gradient-to-tr from-pink-300 to-yellow-300 opacity-20 rounded-full blur-3xl animate-slow-spin-slow"></div>

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-semibold">SwiftSites Pricing Plans</h2>
        <p className="mt-2 text-sm md:text-base text-gray-500">
          Choose a plan to launch and scale your website effortlessly. Start free, upgrade anytime.
        </p>

        {/* Billing toggle */}
        <div className="mt-6 inline-flex border rounded-full bg-white shadow-sm">
          <button
            onClick={() => setBilling("monthly")}
            className={`px-4 py-1 rounded-full transition ${
              billing === "monthly" ? "bg-indigo-600 text-white" : "text-gray-600"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={`px-4 py-1 rounded-full transition ${
              billing === "yearly" ? "bg-indigo-600 text-white" : "text-gray-600"
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
            className={`relative flex flex-col justify-between rounded-2xl border ${
              plan.popular ? "border-indigo-600 bg-indigo-50" : "border-gray-200 bg-white"
            } p-8 shadow-sm hover:shadow-lg transition`}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white text-xs rounded-full font-semibold">
                Most Popular
              </div>
            )}

            {/* Plan Info */}
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
              {plan.price !== null && (
                <p className="text-2xl font-semibold text-gray-900">
                  {typeof plan.monthly === "number" && typeof plan.yearly === "number" ? (
                    `$${billing === "monthly" ? plan.monthly : plan.yearly}${billing === "monthly" ? "/mo" : "/yr"}`
                  ) : (
                    plan.price
                  )}
                </p>
              )}
              <ul className="mt-2 space-y-1 text-gray-500 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="before:content-['✓'] before:text-indigo-600 before:mr-2">
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button */}
            <Button
              className={`mt-6 w-full rounded-lg ${
                plan.popular
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "bg-gray-900 hover:bg-gray-800 text-white"
              } text-sm py-3`}
            >
              {plan.action}
            </Button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
