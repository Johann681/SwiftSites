"use client";



import React, { useMemo, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { services as ALL_SERVICES, Service } from "@/lib/constants";

export default function WebsiteServicesBento() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const catScroller = useRef<HTMLDivElement | null>(null);

  const [slider, setSlider] = useState({ left: 0, width: 0, visible: false });

  // get categories from services
  const categories = useMemo(() => {
    const set = new Set<string>();
    ALL_SERVICES.forEach((s) => set.add(s.category ?? "uncategorized"));
    return ["all", ...Array.from(set)];
  }, []);

  // filter services
  const services = useMemo(() => {
    return ALL_SERVICES.filter(
      (s) =>
        selectedCategory === "all" || (s.category ?? "") === selectedCategory
    );
  }, [selectedCategory]);

  const bigService: Service | null =
    services.find((s) => s.popular) ?? services[0] ?? null;
  const otherServices = services.filter((s) => s.id !== bigService?.id);

  const updateSlider = (cat = selectedCategory) => {
    const scroller = catScroller.current;
    if (!scroller) return setSlider((s) => ({ ...s, visible: false }));

    const btn = scroller.querySelector<HTMLButtonElement>(
      `[data-cat="${cat}"]`
    );
    if (!btn) return setSlider((s) => ({ ...s, visible: false }));

    const rect = scroller.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    setSlider({
      left: btnRect.left - rect.left + scroller.scrollLeft,
      width: btnRect.width,
      visible: true,
    });
  };

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    const btn = catScroller.current?.querySelector<HTMLButtonElement>(
      `[data-cat="${cat}"]`
    );
    if (btn) {
      btn.scrollIntoView({ behavior: "smooth", inline: "center" });
      btn.focus({ preventScroll: true });
    }
    requestAnimationFrame(() => updateSlider(cat));
  };

  useEffect(() => {
    updateSlider();
    const onResize = () => updateSlider();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [selectedCategory]);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 18, rotate: -0.5 },
    show: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: { duration: 0.45, ease: ["easeOut"] }, // ✅ array form fixes TypeScript
    },
    hover: {
      y: -6,
      scale: 1.01,
      boxShadow: "0 12px 28px rgba(15,23,42,0.1)",
    },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-24 md:py-32 px-4 sm:px-6">
      {/* floating background orbs */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-24 w-[420px] h-[420px] rounded-full bg-indigo-100 opacity-30 blur-3xl"
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-32 -bottom-24 w-[380px] h-[380px] rounded-full bg-pink-100 opacity-30 blur-3xl"
        animate={{ y: [0, -25, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-sm uppercase tracking-widest text-indigo-600 font-medium mb-2">
            Flexible Website Packages
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
            Sites I Build — WordPress & WooCommerce
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Explore curated services with conversion-first design and eCommerce
            reliability. Pick a category to filter.
          </p>
        </motion.div>

        {/* category tabs */}
        <div className="flex justify-center mb-10">
          <div className="relative w-full max-w-3xl">
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{
                opacity: slider.visible ? 1 : 0,
                left: slider.left,
                width: slider.width,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-[6px] h-[40px] bg-indigo-600 rounded-full z-0"
            >
              <motion.div
                aria-hidden
                animate={{ opacity: [0.12, 0.25, 0.12] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                className="absolute inset-0 rounded-full blur-md bg-indigo-600/40"
              />
            </motion.div>

            <div
              ref={catScroller}
              className="relative z-10 flex gap-2 overflow-x-auto no-scrollbar px-1 py-1"
              role="tablist"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  data-cat={cat}
                  onClick={() => handleSelectCategory(cat)}
                  className={`relative px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                    selectedCategory === cat
                      ? "text-white"
                      : "text-gray-700 hover:text-indigo-600"
                  }`}
                  role="tab"
                  aria-selected={selectedCategory === cat}
                >
                  {cat === "all" ? "All" : capitalize(cat)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* bento grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:grid-rows-2 gap-5 md:gap-6"
        >
          {/* big tile */}
          <AnimatePresence>
            {bigService ? (
              <motion.article
                key={bigService.id}
                variants={item}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                className="col-span-1 sm:col-span-2 md:row-span-2 flex flex-col justify-between p-6 md:p-8 rounded-3xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-lg"
                whileHover="hover"
              >
                <motion.div
                  aria-hidden
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.06 }}
                  className="absolute inset-0 bg-[url('/patterns/dots.svg')] bg-right-bottom bg-no-repeat"
                />
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
                      {bigService.name}
                    </h3>
                    {bigService.popular && (
                      <span className="px-3 py-1 bg-indigo-600 text-white text-xs rounded-full font-semibold">
                        Most Popular
                      </span>
                    )}
                  </div>
                  <p className="text-sm md:text-base text-gray-700 mb-4">
                    {bigService.blurb}
                  </p>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {bigService.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <span className="text-indigo-600">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  onClick={() =>
                    router.push(bigService.actionHref || "/contact")
                  }
                  className="mt-6 rounded-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-medium shadow-md hover:from-indigo-700"
                >
                  {bigService.action ?? "Learn more"}
                </Button>
              </motion.article>
            ) : (
              <div className="col-span-1 sm:col-span-2 md:row-span-2 flex items-center justify-center rounded-3xl border p-8 bg-white/60 backdrop-blur-xl">
                <p className="text-gray-500 text-center">
                  No services in this category yet.
                </p>
              </div>
            )}
          </AnimatePresence>

          {/* smaller tiles */}
          {otherServices.map((s, idx) => (
            <motion.article
              key={s.id}
              variants={item}
              initial="hidden"
              animate="show"
              transition={{ delay: idx * 0.04 }}
              whileHover="hover"
              tabIndex={0}
              className="flex flex-col justify-between rounded-3xl border border-white/40 bg-white/70 backdrop-blur-xl p-5 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
              onKeyDown={(e) => {
                if (e.key === "Enter") router.push(s.actionHref || "/contact");
              }}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-md font-semibold text-gray-900">
                    {s.name}
                  </h4>
                  {s.popular && (
                    <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                {s.blurb && (
                  <p className="mt-2 text-sm text-gray-700">{s.blurb}</p>
                )}
                <ul className="mt-3 space-y-1 text-sm text-gray-600">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-indigo-600">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                onClick={() => router.push(s.actionHref || "/contact")}
                className={`mt-4 rounded-full py-2 font-medium ${
                  s.popular
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white"
                    : "bg-gray-900 hover:bg-gray-800 text-white"
                }`}
              >
                {s.action ?? "Learn more"}
              </Button>
            </motion.article>
          ))}

          {/* CTA card */}
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-white/30 bg-white/60 backdrop-blur-xl shadow-md p-5 flex flex-col justify-between"
          >
            <div>
              <h4 className="text-md font-semibold text-gray-900">
                Need something custom?
              </h4>
              <p className="mt-2 text-sm text-gray-600">
                Got a unique idea or integration in mind? Let’s create something
                special together.
              </p>
            </div>
            <Button
              onClick={() => router.push("/contact")}
              className="mt-4 w-full rounded-full py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white"
            >
              Contact us
            </Button>
          </motion.article>
        </motion.div>
      </div>
    </section>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
