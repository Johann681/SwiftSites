"use client"

import { motion } from "framer-motion"
import { frameworks } from "@/lib/constants"

export default function FrameWorks() {
  return (
    <section className="py-28 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
        
        {/* Left Column - Title */}
        <div className="space-y-12">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900"
          >
            Frameworks & Tools <br /> in one place.
          </motion.h2>

          {/* Auto Moving Logos */}
          <div className="relative w-full overflow-hidden">
            <motion.div
              className="flex gap-10"
              initial={{ x: 0 }}
              animate={{ x: ["0%", "-100%"] }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            >
              {[...frameworks, ...frameworks].map((fw, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center flex-shrink-0 bg-white shadow-md rounded-2xl p-6 w-28 h-28"
                >
                  <fw.Icon className="w-10 h-10 text-blue-600 mb-3" />
                  <span className="text-sm font-medium text-gray-700">{fw.name}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Right Column - Subtext */}
        <motion.p
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-lg text-gray-600 leading-relaxed"
        >
          Our stack is built with modern technologies to deliver fast, maintainable, 
          and scalable websites. All the best frameworks, brought together in one place.
        </motion.p>
      </div>
    </section>
  )
}
