"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="max-w-5xl mx-auto text-center py-24 px-6">
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold tracking-tight sm:text-6xl"
      >
        From Idea To Code To Live
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mt-6 text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto"
      >
        SwiftSites helps businesses launch websites quickly with production-ready templates.
        Built with modern tools, optimized for speed, and tailored for your needs.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-8 flex items-center justify-center gap-4"
      >
        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          Go Live Now
        </Button>
        <Button size="lg" variant="outline">
          Learn More
        </Button>
      </motion.div>

      {/* VSCode-like editor mock */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        className="mt-16 mx-auto max-w-3xl rounded-xl overflow-hidden shadow-2xl border bg-[#1e1e2e] text-left"
      >
        {/* Top bar */}
        <div className="flex items-center gap-2 px-4 py-2 bg-[#161622] border-b border-gray-800">
          <span className="h-3 w-3 rounded-full bg-red-500"></span>
          <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
          <span className="h-3 w-3 rounded-full bg-green-500"></span>
        </div>

        {/* Code content */}
        <div className="p-6 font-mono text-sm text-gray-100 space-y-2">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <span className="text-green-400">$</span> npx swiftsites launch my-business
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <span className="text-blue-400">✔</span> Deploying template <span className="text-purple-400">ecommerce</span>...
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.6 }}
          >
            <span className="text-blue-400">✔</span> Connected to database
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0, duration: 0.6 }}
          >
            <span className="text-blue-400">✔</span> Your site is live 🎉
          </motion.p>
        </div>
      </motion.div>
    </section>
  )
}
