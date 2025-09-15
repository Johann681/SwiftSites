"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Templates", href: "/gallery" },
  { name: "Pricing", href: "/pricing" },
  { name: "Contact", href: "/contact" },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={32} height={42} priority />
          <span className="font-semibold text-lg">SwiftSites</span>
        </Link>

        {/* Desktop pill nav */}
        <nav className="hidden md:flex flex-1 justify-center mt-2">
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5 shadow-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 text-sm rounded-full transition-colors",
                  pathname === link.href
                    ? "bg-white shadow text-blue-600 font-medium"
                    : "text-gray-600 hover:text-blue-600"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* Right-side button (desktop only) */}
        <div className="hidden md:block">
          <Button className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90">
            Dashboard
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-700"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white/90 backdrop-blur-md shadow-lg border-t"
          >
            <div className="flex flex-col gap-4 px-6 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-2 py-2 text-sm rounded-md transition-colors",
                    pathname === link.href
                      ? "bg-gray-100 text-blue-600 font-medium"
                      : "text-gray-600 hover:text-blue-600"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <Button className="w-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90">
                Dashboard
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
