"use client";

import { motion, Variants } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function WebsiteServiceSection() {
  const [hovered, setHovered] = useState<number | null>(null);

  // ✅ Correctly typed Framer Motion variants
  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 30,
      rotate: 0,
    },
    show: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    hover: {
      y: -8,
      scale: 1.05,
      rotate: 1,
      boxShadow: "0px 10px 20px rgba(0,0,0,0.15)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const services = [
    { title: "Web Design", description: "Beautiful, responsive web design." },
    { title: "Development", description: "High-performance web apps." },
    { title: "Branding", description: "Strong visual identity for your business." },
  ];

  return (
    <section className="py-20 bg-gray-50 text-gray-800">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-12">Our Website Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="p-8 rounded-2xl bg-white shadow-md hover:shadow-xl cursor-pointer transition-all"
              variants={cardVariants}
              initial="hidden"
              animate="show"
              whileHover="hover"
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-6">{service.description}</p>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Learn More
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
