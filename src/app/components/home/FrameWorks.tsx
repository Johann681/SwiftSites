"use client";
import { motion } from "framer-motion"
import { frameworks } from "@/lib/constants";

export default function FrameWorks() {
    return (
        <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold mb-6"
          >
            Frameworks & Tools We Use
          </motion.h2>
  
          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-gray-600 max-w-2xl mx-auto mb-12"
          >
            Our stack is built with modern technologies to deliver fast, maintainable,
            and scalable websites.
          </motion.p>
  
          {/* Frameworks Grid */}
          <motion.div
            className="flex gap-6 overflow-x-auto md:grid md:grid-cols-6 md:gap-10 pb-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {frameworks.map((fw, i) => (
              <motion.div
                key={fw.name}
                className="flex flex-col items-center flex-shrink-0 md:flex-shrink md:flex-col"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
              >
                <fw.Icon className="w-14 h-14 mb-2 text-blue-600" />
                <span className="text-sm font-medium">{fw.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
  )
}
