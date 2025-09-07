"use client"

import { motion } from "framer-motion"
import { features } from "@/lib/constants"

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
        <h2 className="text-xl font-semibold tracking-tight text-gray-900">
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
            className={`relative rounded-2xl border border-white/10 
              bg-gradient-to-br from-white/10 to-white/5 
              backdrop-blur-xl p-6 shadow-md hover:shadow-blue-500/30 
              hover:scale-[1.02] transition-all duration-300 ${feature.size}`}
          >
            <feature.icon className="absolute top-4 right-4 h-6 w-6 text-blue-500/50" />
            <h3 className="text-base font-semibold text-gray-900">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}