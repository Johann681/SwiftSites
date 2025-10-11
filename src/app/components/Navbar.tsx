"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { JSX } from "react/jsx-dev-runtime";

type User = {
  name?: string;
  fullName?: string;
  username?: string;
  email?: string;
  // add more fields you expect from backend if needed (id?: string, token?: string, etc.)
};

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Templates", href: "/gallery" },
  { name: "Packages", href: "/Packages" },
  { name: "Contact", href: "/contact" },
];

function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}

function normalizeParsed(parsed: unknown): User | null {
  // handle various shapes:
  // - string (fallback)
  // - { name, email, ... }
  // - { user: { name, ... }, token }
  // - { data: { name, ... }, token }
  if (!parsed) return null;

  if (typeof parsed === "string") {
    return { name: parsed };
  }

  if (!isObject(parsed)) return null;

  // If parsed has "user" or "data" nested object, use that
  if (isObject(parsed.user)) return normalizeParsed(parsed.user);
  if (isObject(parsed.data)) return normalizeParsed(parsed.data);

  // At this point parsed should be an object with possible name/email fields
  const out: User = {};

  if (typeof parsed.name === "string") out.name = parsed.name;
  if (typeof parsed.fullName === "string") out.fullName = parsed.fullName;
  if (typeof parsed.username === "string") out.username = parsed.username;
  if (typeof parsed.email === "string") out.email = parsed.email;

  // If we found no usable fields but the object has keys, stringify a fallback
  if (!out.name && !out.email && Object.keys(parsed).length > 0) {
    // try to find any string-valued prop to use as a fallback name/email
    for (const k of Object.keys(parsed)) {
      const v = (parsed as Record<string, unknown>)[k];
      if (typeof v === "string") {
        out.name = out.name || v;
        break;
      }
    }
  }

  return out.name || out.email ? out : null;
}

export default function Navbar(): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // auth state from localStorage.userInfo (AuthForm saves this)
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Read and normalize user from localStorage (robust to different shapes)
  useEffect(() => {
    const raw =
      typeof window !== "undefined" ? localStorage.getItem("userInfo") : null;
    if (!raw) {
      setUser(null);
      return;
    }
    try {
      const parsed: unknown = JSON.parse(raw);
      const guess = normalizeParsed(parsed);
      setUser(guess);
    } catch {
      // not JSON? treat as null
      setUser(null);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function onDocClick(e: MouseEvent | TouchEvent) {
      if (!menuRef.current) return;
      const target = (e.target as Node) || null;
      if (!menuRef.current.contains(target)) setMenuOpen(false);
    }

    if (menuOpen) {
      document.addEventListener("mousedown", onDocClick);
      document.addEventListener("touchstart", onDocClick);
    }

    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("touchstart", onDocClick);
    };
  }, [menuOpen]);

  // keep navbar reactive if other tabs update auth
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === "userInfo") {
        try {
          const parsed: unknown = e.newValue ? JSON.parse(e.newValue) : null;
          const guess = normalizeParsed(parsed);
          setUser(guess);
        } catch {
          setUser(null);
        }
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userToken");
    setUser(null);
    setMenuOpen(false);
    router.push("/");
  };

  // robust first-letter extraction
  const firstLetter = (u: User | string | null): string => {
    if (!u) return "";
    if (typeof u === "string") {
      return (u.trim().charAt(0) || "").toUpperCase();
    }
    const n = u.name || u.fullName || u.username || (u.email ?? "");
    return (String(n).trim().charAt(0) || "").toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/60 backdrop-blur-md border-b">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Logo" width={38} height={46} priority />
          <span className="font-semibold text-lg text-indigo-700">SwiftSites</span>
        </Link>

        {/* Desktop pill nav */}
        <nav className="hidden md:flex flex-1 justify-center mt-1">
          <div className="flex items-center gap-2 bg-indigo-50 rounded-full px-3 py-1.5 shadow-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 text-sm rounded-full transition-colors",
                  pathname === link.href
                    ? "bg-white shadow text-indigo-700 font-medium"
                    : "text-indigo-600 hover:text-indigo-800"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* Right-side actions */}
        <div className="flex items-center gap-3">
          <Link href="/Dashboard">
            <Button
              asChild
              className="rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:opacity-95 px-4 py-1.5 shadow-lg"
            >
              <motion.span
                initial={{ y: -4, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring" as const, stiffness: 300, damping: 18 }}
                className="text-sm font-medium text-white"
              >
                AI Assistant
              </motion.span>
            </Button>
          </Link>

          {/* Auth area: show Login (single action). If user exists show subtle initial badge that opens dropdown */}
          {!user ? (
            <motion.button
              onClick={() => router.push("/userlogin")}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring" as const, stiffness: 300, damping: 22 }}
              className="rounded-full px-4 py-1.5 bg-indigo-600 text-white text-sm font-medium shadow-md focus:outline-none"
              aria-label="Login"
            >
              Login
            </motion.button>
          ) : (
            // logged-in: show initial badge which toggles a dropdown menu
            <div className="relative" ref={menuRef}>
              <motion.button
                onClick={() => setMenuOpen((s) => !s)}
                title="Account menu"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring" as const, stiffness: 320, damping: 24 }}
                className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-medium shadow-md focus:outline-none"
                aria-expanded={menuOpen}
                aria-haspopup="true"
              >
                {firstLetter(user) || "U"}
              </motion.button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 6, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ type: "spring" as const, stiffness: 300, damping: 24 }}
                    className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border z-50 overflow-hidden"
                  >
                    <div className="flex flex-col py-1">
                      {/* Only logout as requested — keep minimal */}
                      <button
                        onClick={handleLogout}
                        className="text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-indigo-700"
            onClick={() => setMobileOpen((s) => !s)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu (animated slide) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "circOut" }}
            className="md:hidden bg-white/95 backdrop-blur-sm shadow-lg border-t"
          >
            <div className="flex flex-col gap-3 px-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-3 py-2 text-sm rounded-md transition-colors",
                    pathname === link.href
                      ? "bg-indigo-50 text-indigo-700 font-medium"
                      : "text-indigo-600 hover:text-indigo-800"
                  )}
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-2 border-t mt-2">
                {!user ? (
                  <motion.button
                    onClick={() => {
                      setMobileOpen(false);
                      router.push("/userlogin");
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full rounded-full px-4 py-2 bg-indigo-600 text-white text-sm font-medium shadow"
                  >
                    Login
                  </motion.button>
                ) : (
                  <motion.div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 px-2">
                      <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-medium">
                        {firstLetter(user)}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{user?.name || user?.email}</div>
                        <div className="text-xs text-gray-500">Member</div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        handleLogout();
                      }}
                      className="px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-50 rounded-md"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
