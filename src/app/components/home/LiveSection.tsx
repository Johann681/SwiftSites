"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LiveSection() {
  return (
    <section className="relative py-20 bg-white">
      <div className="max-w-8xl mx-auto px-6">
        {/* Card container */}
        <div className="bg-black rounded-3xl px-10 py-16 grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-white space-y-2"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Easify your <br /> live launch.
            </h2>
            <p className="text-lg text-gray-400 max-w-md">
              Take your project live instantly. Fast, secure, and effortless —
              built for creators who want to move now, not later.
            </p>

            <Link href="/go-live">
            <button className="mt-6 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:scale-105 transition-transform">
              Go Live
            </button></Link>
          </motion.div>

          {/* Right Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden"
          >
            <Image
              src="/golive.png" // replace with your image
              alt="Go Live Preview"
              width={600}
              height={500}
              className="rounded-2xl object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
