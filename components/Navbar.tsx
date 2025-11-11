"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const session = useSession();

  // Close menu when pressing escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  return (
    <nav className="px-6 py-4 font-inter relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full flex items-center justify-center">
            <img
              src="/Conversy-logo-white.png"
              className="rounded-full"
              alt="Conversy Logo"
            />
          </div>
          <span className="text-white font-medium text-xl">Conversy</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="text-white/90 hover:text-white transition-colors duration-200 font-medium hover:underline"
          >
            Home
          </Link>
          <Link
            href="/#features"
            className="text-white/90 hover:text-white transition-colors duration-200 font-medium hover:underline"
          >
            Features
          </Link>
          <Link
            href="/#contact"
            className="text-white/90 hover:text-white transition-colors duration-200 font-medium hover:underline"
          >
            Contact
          </Link>
          <Link
            href="/#faqs"
            className="text-white/90 hover:text-white transition-colors duration-200 font-medium hover:underline"
          >
            FAQs
          </Link>
        </div>

        {/* Desktop CTA Buttons */}
        {session && session.status === "authenticated" && (
            <Link href="/dashboard">
              <Button
                className="bg-white rounded-full text-black hover:bg-gray-100"
              >
                Dashboard
              </Button>
            </Link>
        )}
        {session && session.status === "unauthenticated" && (
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-white hover:bg-transparent hover:text-white hover:underline"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-white text-black hover:bg-gray-100 rounded-full">
                  Sign Up
                </Button>
              </Link>
            </div>
          )
        }
        {/* Mobile Menu Button - Dynamic styling for all backgrounds */}
        <button
          className="md:hidden p-2 rounded-full focus:outline-none transition-all duration-200 hover:scale-110 ring-2 ring-gray-800 dark:ring-white bg-white dark:bg-gray-800 shadow-sm hover:shadow"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          style={{
            boxShadow: "0 0 0 1px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          {isMenuOpen ? (
            <X size={24} className="text-gray-800 dark:text-white" />
          ) : (
            <Menu size={24} className="text-gray-800 dark:text-white" />
          )}
        </button>
      </div>

      {/* Full Screen Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-md z-50 transform transition-opacity duration-300 ease-in-out ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full p-6 overflow-y-auto">
          <div className="flex justify-end mb-12">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Centered Content Container */}
          <div className="flex flex-col items-center justify-center h-[70vh]">
            {/* Mobile Navigation Links */}
            <div className="flex flex-col items-center space-y-8 mb-12 text-center">
              <Link
                href="/"
                className="text-white text-2xl font-medium hover:text-white/80 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/#features"
                className="text-white text-2xl font-medium hover:text-white/80 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/#contact"
                className="text-white text-2xl font-medium hover:text-white/80 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/#faqs"
                className="text-white text-2xl font-medium hover:text-white/80 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQs
              </Link>
            </div>

            {/* Mobile CTA Buttons */}
            <div className="flex flex-col space-y-4 w-full max-w-xs">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/10 w-full justify-center text-lg py-6"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  className="bg-white text-black hover:bg-gray-100 w-full justify-center rounded-full text-lg py-6"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
