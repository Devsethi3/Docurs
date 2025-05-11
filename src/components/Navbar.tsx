"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed w-full z-50 py-4 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <motion.div
          className="flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-primary font-bold text-2xl">AI.Saas</span>
        </motion.div>

        <div className="hidden md:flex space-x-8">
          {["Home", "Features", "Pricing", "Testimonials", "Contact"].map(
            (item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-foreground hover:text-primary transition-colors"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                {item}
              </motion.a>
            )
          )}
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-foreground focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {isMobileMenuOpen && (
          <motion.div
            className="absolute top-full left-0 right-0 bg-background shadow-lg py-4 px-4 md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <div className="flex flex-col space-y-4">
              {["Home", "Features", "Pricing", "Testimonials", "Contact"].map(
                (item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                )
              )}
            </div>
          </motion.div>
        )}

        <motion.div
          className="hidden md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {user ? (
            <>
              <UserButton
              appearance={{
                elements: {
                  // userButtonAvatarBox: "w-14 h-14",
                  userButtonPopoverFooter: "hidden",
                },
              }}
              afterSignOutUrl="/"
              />
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button className="rounded-full">Sign In</Button>
              </Link>
            </>
          )}
          {/* <button className="bg-primary hover:bg-pr">
            
          </button> */}
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
