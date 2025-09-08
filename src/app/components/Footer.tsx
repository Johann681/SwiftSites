"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    // footer wrapper — rounded top to create that curved top edge
    <footer className="bg-black text-white  -mt-6 z-10">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* LEFT: Logo + socials */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                {/* replace with your logo.png in public/ */}
                <Image src="/logo.png" alt="SwiftSites" width={28} height={28} />
              </div>
              <span className="text-lg font-semibold tracking-tight">SwiftSites</span>
            </div>

            <div className="flex gap-3">
              {/* circular white icons with dark icon inside — matches screenshot */}
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:scale-105 transition"
                aria-label="X"
              >
                <X className="w-4 h-4 text-black" />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:scale-105 transition"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-black" />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:scale-105 transition"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-black" />
              </a>
            </div>
          </div>

          {/* CENTER: Links (vertical stack like screenshot) */}
          <nav className="flex flex-col items-start md:items-center justify-center gap-4">
            <Link href="/pricing" className="text-gray-200 hover:text-white transition">
              Pricing
            </Link>
            <Link href="/blog" className="text-gray-200 hover:text-white transition">
              Blog
            </Link>
            <Link href="/contact" className="text-gray-200 hover:text-white transition">
              Contact
            </Link>
          </nav>

          {/* RIGHT: small credit / copyright */}
          <div className="flex md:justify-end items-end">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} SwiftSites. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

 