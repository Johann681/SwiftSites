"use client"

import { motion } from "framer-motion"
import { Shield, Rocket, Palette, Cloud } from "lucide-react"

const features = [
  {
    title: "Launch Fast",
    description: "Get production-ready sites live in record time.",
    icon: Rocket,
    size: "col-span-2 row-span-1",
  },
  {
    title: "Bank-Level Security",
    description: "Your data stays safe with enterprise encryption.",
    icon: Shield,
    size: "col-span-1 row-span-1",
  },
  {
    title: "Design Freedom",
    description: "Templates that feel custom — tailored to you.",
    icon: Palette,
    size: "col-span-1 row-span-1",
  },
  {
    title: "Cloud Scale",
    description: "Scale instantly, no DevOps stress required.",
    icon: Cloud,
    size: "col-span-2 row-span-1",
  },
]

export default function Features() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      {/* Intro */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center max-w-xl mx-auto"
      >
        <h2 className="text-xl font-medium tracking-tight text-gray-900">
          Why choose SwiftSites?
        </h2>
        <p className="mt-3 text-sm text-gray-600 leading-relaxed">
          We blend speed, security, and beautiful design into one platform.
          Here’s what makes us different.
        </p>
      </motion.div>

      {/* Bento Grid */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-6 auto-rows-[160px]">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true }}
            className={`relative rounded-2xl border border-gray-200 bg-gradient-to-br from-white/80 to-gray-50/60 backdrop-blur-md p-6 shadow-sm hover:shadow-lg transition ${feature.size}`}
          >
            <feature.icon className="absolute top-4 right-4 h-6 w-6 text-blue-500/40" />
            <h3 className="text-base font-semibold text-gray-900">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
