"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { templates } from "@/lib/constants"

export default function Templates() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Intro */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold mb-4"
        >
          Explore Our Templates
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-gray-600 max-w-2xl mx-auto mb-12"
        >
          Professionally designed, production-ready templates built for speed and scalability.
        </motion.p>

        {/* Scrollable Cards */}
        <div className="flex gap-6 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible">
          {templates.map((tpl, i) => (
            <motion.div
              key={tpl.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="flex-shrink-0 w-[280px] md:w-auto md:flex-shrink md:rounded-xl"
            >
              {/* Browser mockup */}
              <div className="rounded-xl border border-gray-200 shadow-md bg-white overflow-hidden hover:shadow-xl transition">
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 border-b border-gray-200">
                  <span className="w-3 h-3 rounded-full bg-red-400"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                  <span className="w-3 h-3 rounded-full bg-green-400"></span>
                </div>
                <Image
                  src={tpl.image}
                  alt={tpl.name}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 text-left">
                  <h3 className="text-lg font-semibold text-gray-900">{tpl.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{tpl.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12">
          <Link href="/templates">
            <Button size="lg" className="rounded-full">
              Browse All Templates
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
