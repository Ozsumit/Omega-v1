"use client";

import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { Search } from "./search";
import { ThemeToggle } from "./theme-toggle";

// Define navigation links
const navLinks = [
  { href: "https://cmoon.sumit.info.np", label: "Home" },
  { href: "https://cmoon.sumit.info.np/movie", label: "Movies" },
  { href: "https://cmoon.sumit.info.np/series", label: "TV" },
  { href: "/", label: "Anime(β)" },
];

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Home Link */}
        <Link href="/" className="flex items-center space-x-2">
          {/* <PlayCircle className="h-6 w-6" /> */}
          <span className="font-bold text-xl">ω </span>
          <span className="font-bold text-lg">Omega </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:underline">
              {link.label}
            </Link>
          ))}

          {/* Search Component */}
          <Search />

          {/* Theme Toggle Component */}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
