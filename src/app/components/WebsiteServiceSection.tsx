"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { services as ALL_SERVICES, Service } from "@/lib/constants";

/**
 * WebsiteServicesBento (v4 — Pro)
 * - Light-only, premium polish: glassmorphism + gradient glow + floating orbs
 * - Measured slider with glow pulse + smooth spring motion
 * - Staggered reveal, hover lift, subtle rotate, and gradient CTAs
 * - Accessibility preserved (keyboard support, aria attributes)
 */
export default function WebsiteServicesBento() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const catScroller = useRef<HTMLDivElement | null>(null);

  // slider state: left & width are pixels relative to scroller
  const [slider, setSlider] = useState({ left: 0, width: 0, visible: false });

  // derive categories from constants
  const categories = useMemo(() => {
    const set = new Set<string>();
    ALL_SERVICES.forEach((s) => set.add(s.category ?? "uncategorized"));
    return ["all", ...Array.from(set)];
  }, []);

  // filtered services by category
  const services = useMemo(() => {
    return ALL_SERVICES.filter(
      (s) => selectedCategory === "all" || (s.category ?? "") === selectedCategory
    );
  }, [selectedCategory]);

  // pick big tile
  const bigService: Service | null = services.length
    ? services.find((s) => s.popular) ?? services[0]
    : null;
  const otherServices = services.filter((s) => s.id !== bigService?.id);

  // helper: center a button element inside the scroller
  const centerButton = (btn: HTMLElement | null) => {
    const scroller = catScroller.current;
    if (!scroller || !btn) return;
    const scrollerRect = scroller.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const offset =
      btnRect.left -
      scrollerRect.left -
      (scrollerRect.width / 2 - btnRect.width / 2);
    scroller.scrollBy({ left: offset, behavior: "smooth" });
  };

  // measure & update slider to match active button
  const updateSliderForCat = (cat = selectedCategory) => {
    const scroller = catScroller.current;
    if (!scroller) {
      setSlider((s) => ({ ...s, visible: false }));
      return;
    }
    const btn = scroller.querySelector<HTMLButtonElement>(`[data-cat="${cat}"]`);
    if (!btn) {
      setSlider((s) => ({ ...s, visible: false }));
      return;
    }
    const scrollerRect = scroller.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setSlider({
      left: Math.round(btnRect.left - scrollerRect.left + scroller.scrollLeft),
      width: Math.round(btnRect.width),
      visible: true,
    });
  };

  // handle select category (called from clicks)
  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    const scroller = catScroller.current;
    if (!scroller) return;
    const btn = scroller.querySelector<HTMLButtonElement>(`[data-cat="${cat}"]`);
    centerButton(btn);
    if (btn) btn.focus({ preventScroll: true });
    // update slider after layout changes
    window.requestAnimationFrame(() => updateSliderForCat(cat));
  };

  // center the currently selected tab on mount and measure slider
  useEffect(() => {
    updateSliderForCat();
    const ro = new ResizeObserver(() => updateSliderForCat());
    if (catScroller.current) ro.observe(catScroller.current);
    const onResize = () => updateSliderForCat();
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, categories]);

  // keyboard navigation for the tab list (left / right)
  const onKeyDownTabs = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const idx = categories.indexOf(selectedCategory);
    if (idx === -1) return;
    const next = e.key === "ArrowRight" ? Math.min(categories.length - 1, idx + 1) : Math.max(0, idx - 1);
    const cat = categories[next];
    handleSelectCategory(cat);
  };

  // tile motion variants
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  };
  const item = {
    hidden: { opacity: 0, y: 18, rotate: -0.5 },
    show: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.5, ease: "easeOut" } },
    hover: { y: -8, scale: 1.012, rotate: 0.5, boxShadow: "0 18px 40px rgba(15,23,42,0.12)" },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-28 px-6">
      {/* Floating orbs (subtle, light-only) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-24 w-[520px] h-[520px] rounded-full bg-indigo-100 opacity-30 blur-3xl"
        animate={{ y: [0, 24, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-32 -bottom-28 w-[420px] h-[420px] rounded-full bg-pink-100 opacity-28 blur-3xl"
        animate={{ y: [0, -28, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* subtle grid glow layer */}
      <div className="absolute inset-0 mix-blend-soft-light opacity-30" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-8 px-4">
          <p className="text-sm uppercase tracking-widest text-indigo-600 font-medium mb-3">Flexible Website Packages</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">Sites I Build — WordPress & WooCommerce</h2>
          <p className="mt-3 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">Explore curated services with conversion-first design and reliable eCommerce integrations — pick a category to filter.</p>
        </motion.div>

        {/* Type-style segmented nav (measured slider + glow pulse) */}
        <div className="flex items-center justify-center mb-8 px-4">
          <div className="relative w-full max-w-3xl">
            <div className="relative inline-block w-full">
              {/* measured slider */}
              <motion.div
                layout
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: slider.visible ? 1 : 0, left: slider.left, width: slider.width }}
                transition={{ type: "spring", stiffness: 320, damping: 36 }}
                style={{ height: 44, top: 6, position: "absolute", borderRadius: 9999 }}
                className="z-0"
              >
                <div className="absolute inset-0 rounded-full bg-indigo-600" />
                {/* subtle glow */}
                <motion.div
                  aria-hidden
                  animate={{ opacity: [0.12, 0.22, 0.12] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  className="absolute inset-0 rounded-full blur-[8px] bg-indigo-600/40"
                />
              </motion.div>

              <div
                ref={catScroller}
                role="tablist"
                aria-label="Service categories"
                onKeyDown={onKeyDownTabs}
                className="relative z-10 flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    data-cat={cat}
                    onClick={() => handleSelectCategory(cat)}
                    className={`relative z-20 px-4 md:px-6 py-2 rounded-full text-sm md:text-base font-medium transition-colors duration-200 w-auto whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                      selectedCategory === cat ? "text-white" : "text-gray-600"
                    }`}
                    role="tab"
                    aria-selected={selectedCategory === cat}
                    aria-controls={`services-${cat}`}
                  >
                    {cat === "all" ? "All" : capitalize(cat)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid */}
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.12 }} className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 px-4 pb-8">
          {/* Big tile */}
          <AnimatePresence>
            {bigService ? (
              <motion.article
                key={bigService.id}
                variants={item}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5 }}
                className="col-span-1 md:col-span-2 md:row-span-2 relative flex flex-col justify-between rounded-3xl border border-white/40 p-8 shadow-lg bg-white/70 backdrop-blur-xl overflow-hidden"
                whileHover="hover"
              >
                {/* faint background illustration */}
                <motion.div aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 0.06 }} className="absolute inset-0 bg-[url('/patterns/dots.svg')] bg-right-bottom bg-no-repeat" />

                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl md:text-2xl font-semibold text-gray-900">{bigService.name}</h3>
                    {bigService.popular && (
                      <span className="px-3 py-1 bg-indigo-600 text-white text-xs rounded-full font-semibold">Most Popular</span>
                    )}
                  </div>

                  {bigService.blurb && (
                    <p className="mt-3 text-sm md:text-base text-gray-700 max-w-prose">{bigService.blurb}</p>
                  )}

                  <ul className="mt-4 space-y-2 text-gray-600 text-sm leading-relaxed">
                    {bigService.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 before:content-['✓'] before:text-indigo-600">{f}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex gap-3 w-full">
                  <Button
                    onClick={() => router.push(bigService.actionHref || "/contact")}
                    className="w-full rounded-full py-3 font-medium bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md hover:from-indigo-700 hover:to-indigo-600"
                    aria-label={`${bigService.action} — ${bigService.name}`}
                  >
                    {bigService.action ?? "Learn more"}
                  </Button>
                </div>
              </motion.article>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="col-span-1 md:col-span-2 md:row-span-2 flex items-center justify-center rounded-3xl border p-8 bg-white/60 backdrop-blur-xl">
                <p className="text-gray-500">No services in this category yet.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Other tiles */}
          {otherServices.map((s, idx) => (
            <motion.article
              key={s.id}
              variants={item}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.45, delay: idx * 0.04 }}
              className={`relative flex flex-col justify-between rounded-3xl border border-white/40 p-5 shadow-md transition bg-white/70 backdrop-blur-xl ${
                s.popular ? "ring-1 ring-indigo-100" : ""
              }`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget === e.target) {
                  router.push(s.actionHref || "/contact");
                }
              }}
              whileHover="hover"
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-md font-semibold text-gray-900">{s.name}</h4>
                  {s.popular && (
                    <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs rounded-full font-semibold">Popular</span>
                  )}
                </div>

                {s.blurb && <p className="mt-2 text-xs md:text-sm text-gray-700">{s.blurb}</p>}

                <ul className="mt-3 space-y-1 text-gray-600 text-sm leading-relaxed">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 before:content-['✓'] before:text-indigo-600">{f}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-3">
                <Button
                  onClick={() => router.push(s.actionHref || "/contact")}
                  className={`mt-2 w-full rounded-full font-medium py-2 ${
                    s.popular ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white" : "bg-gray-900 hover:bg-gray-800 text-white"
                  }`}
                  aria-label={`${s.action ?? "Learn more"} — ${s.name}`}
                >
                  {s.action ?? "Learn more"}
                </Button>
              </div>
            </motion.article>
          ))}

          {/* Floating CTA card (small) */}
          <motion.article initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="col-span-1 md:col-span-1 row-span-1 rounded-3xl border border-white/30 p-5 bg-white/60 backdrop-blur-xl shadow-md flex flex-col justify-between">
            <div>
              <h4 className="text-md font-semibold text-gray-900">Need something custom?</h4>
              <p className="mt-2 text-sm text-gray-600">If your project needs special integrations or custom work, let’s chat — we build tailored solutions.</p>
            </div>
            <div className="mt-4">
              <Button onClick={() => router.push("/contact")} className="w-full rounded-full py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white">Contact us</Button>
            </div>
          </motion.article>
        </motion.div>
      </div>
    </section>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
