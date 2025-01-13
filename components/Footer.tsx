import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/anime"
                  className="hover:text-primary transition-colors"
                >
                  Anime
                </Link>
              </li>
              <li>
                <Link
                  href="/movies"
                  className="hover:text-primary transition-colors"
                >
                  Movies
                </Link>
              </li>
              <li>
                <Link
                  href="/genres"
                  className="hover:text-primary transition-colors"
                >
                  Genres
                </Link>
              </li>
              <li>
                <Link
                  href="/schedule"
                  className="hover:text-primary transition-colors"
                >
                  Schedule
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/forum"
                  className="hover:text-primary transition-colors"
                >
                  Forum
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/discord"
                  className="hover:text-primary transition-colors"
                >
                  Discord
                </Link>
              </li>
              <li>
                <Link
                  href="/social"
                  className="hover:text-primary transition-colors"
                >
                  Social Media
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/copyright"
                  className="hover:text-primary transition-colors"
                >
                  Copyright
                </Link>
              </li>
              <li>
                <Link
                  href="/dmca"
                  className="hover:text-primary transition-colors"
                >
                  DMCA
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="hover:text-primary transition-colors"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Omega. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
