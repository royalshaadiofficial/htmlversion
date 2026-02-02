"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Heart, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/vendors", label: "Vendors" },
    { href: "/blog", label: "Blog" },
    { href: "/gallery", label: "Gallery" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <span className="font-vibes text-3xl sm:text-4xl text-royal-gold group-hover:text-royal-gold-light transition-colors">
              Royal Shaadi
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-royal-maroon font-medium transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-royal-gold group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
            
            {user && (
              <Link
                href="/favorites"
                className="text-gray-700 hover:text-royal-maroon transition-colors"
              >
                <Heart className="w-5 h-5" />
              </Link>
            )}

            {user ? (
              <Link
                href="/profile"
                className="flex items-center space-x-2 bg-royal-gold hover:bg-royal-gold-light text-white px-6 py-2.5 rounded-full transition-all duration-300 shadow-md hover:shadow-xl"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="bg-royal-gold hover:bg-royal-gold-light text-white px-6 py-2.5 rounded-full transition-all duration-300 shadow-md hover:shadow-xl"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 hover:text-royal-maroon transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-gray-700 hover:text-royal-maroon hover:bg-royal-ivory rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {user && (
              <Link
                href="/favorites"
                className="block px-4 py-3 text-gray-700 hover:text-royal-maroon hover:bg-royal-ivory rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Favorites
              </Link>
            )}

            {user ? (
              <Link
                href="/profile"
                className="block px-4 py-3 text-center bg-royal-gold text-white rounded-lg mt-2"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
            ) : (
              <Link
                href="/login"
                className="block px-4 py-3 text-center bg-royal-gold text-white rounded-lg mt-2"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}