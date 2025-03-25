"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function Home() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isDarkMode] = useState(true);
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    setHasAnimated(true);
  }, []);

  return (
    <div className={`min-h-screen font-inter  ${isDarkMode ? "dark" : ""}`}>
      <div className="dark:bg-[#050A14] bg-gray-50 min-h-screen relative overflow-hidden transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Grid background */}
          <div className="absolute inset-0 z-0">
            <div className="grid-background w-full h-full opacity-20"></div>
          </div>

          {/* Spotlight effect */}
          <motion.div
            initial={!hasAnimated ? { opacity: 0, y: -20 } : false}
            animate={!hasAnimated ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.6 }}
            className="absolute top-[250px] inset-x-0 mx-auto w-[600px] h-[600px] rounded-full bg-gradient-to-b from-blue-400/10 to-transparent blur-3xl z-0"
          />

          <motion.div
            initial={!hasAnimated ? { opacity: 0 } : false}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="absolute top-[100px] left-1/2 -translate-x-24 rotate-[20deg]  w-[200px] h-[700px] opacity-50 pointer-events-none rounded-full blur-[15px] bg-[conic-gradient(from_0deg_at_50%_-5%,_transparent_45%,_rgba(124,145,182,0.3)_49%,_rgba(124,145,182,0.5)_50%,_rgba(124,145,182,0.3)_51%,_transparent_55%)] [transform-origin:50%_0] animate-[spotlight_opacity_calc(var(--duration,5s)*1.2)_linear_infinite_var(--delay,0s)_alternate,spotlight_scale_calc(var(--duration,5s)*1.7)_infinite_var(--delay,0s)_both]"
          />
          <motion.div
            initial={!hasAnimated ? { opacity: 0 } : false}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="absolute top-[100px] left-1/2 -translate-x-24 w-[200px] h-[700px] opacity-50 pointer-events-none rounded-full blur-[15px] bg-[conic-gradient(from_0deg_at_50%_-5%,_transparent_45%,_rgba(124,145,182,0.3)_49%,_rgba(124,145,182,0.5)_50%,_rgba(124,145,182,0.3)_51%,_transparent_55%)] [transform-origin:50%_0] animate-[spotlight_opacity_calc(var(--duration,5s)*1.2)_linear_infinite_var(--delay,0s)_alternate,spotlight_scale_calc(var(--duration,5s)*1.7)_infinite_var(--delay,0s)_both]"
          />
          <motion.div
            initial={!hasAnimated ? { opacity: 0 } : false}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="absolute top-[100px] left-1/2 -translate-x-24 -rotate-[20deg] w-[200px] h-[700px] opacity-50 pointer-events-none rounded-full blur-[15px] bg-[conic-gradient(from_0deg_at_50%_-5%,_transparent_45%,_rgba(124,145,182,0.3)_49%,_rgba(124,145,182,0.5)_50%,_rgba(124,145,182,0.3)_51%,_transparent_55%)] [transform-origin:50%_0] animate-[spotlight_opacity_calc(var(--duration,5s)*1.2)_linear_infinite_var(--delay,0s)_alternate,spotlight_scale_calc(var(--duration,5s)*1.7)_infinite_var(--delay,0s)_both]"
          />

          {/* Header */}
          <header className="relative z-10 flex justify-between items-center p-6 md:p-10">
            <motion.div
              initial={!hasAnimated ? { opacity: 0, y: -20 } : false}
              animate={!hasAnimated ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.6 }}
            >
              <Link
                href="/"
                className="bg-gradient-to-t from-[#fafdff] to-[#edf6ff] bg-clip-text text-transparent flex items-center gap-2"
              >
                <img
                  src="/Conversy-logo-white.png"
                  className="rounded-full h-11"
                  alt=""
                />
                Conversy
              </Link>
            </motion.div>

            <motion.div
              initial={!hasAnimated ? { opacity: 0, y: -20 } : false}
              animate={!hasAnimated ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-4"
            >
              {session.status !== "authenticated" ? (
                <>
                  <Button
                    onClick={() => router.push("/register")}
                    variant={"ghost"}
                    className="text-white"
                  >
                    Sign up
                  </Button>
                  <Button onClick={() => router.push("/login")}>Login</Button>
                </>
              ) : (
                <Button onClick={() => router.push("/dashboard")}>
                  Dashboard
                </Button>
              )}
            </motion.div>
          </header>

          {/* Main content */}
          <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 text-center">
            <motion.div
              initial={!hasAnimated ? { opacity: 0, y: 20 } : false}
              animate={!hasAnimated ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-t from-[#d8ecf8] to-[#98c0ef] text-transparent bg-clip-text mb-4"
            >
              Introducing
            </motion.div>

            <motion.h1
              initial={!hasAnimated ? { opacity: 0, y: 30 } : false}
              animate={!hasAnimated ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-6xl md:text-8xl font-semibold bg-clip-text font-inter text-transparent bg-gradient-to-b from-[#9ec4f8] to-[#b1caed] mb-6"
            >
              Conversy
            </motion.h1>

            <motion.p
              initial={!hasAnimated ? { opacity: 0, y: 30 } : false}
              animate={!hasAnimated ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-gray-400 text-xl md:text-2xl max-w-2xl bg-gradient-to-t from-[#d8ecf8] to-[#98c0ef] text-transparent bg-clip-text"
            >
              The best chatbot for your buisness
              <br />
              powered by Gemini.
            </motion.p>

            <motion.div
              initial={!hasAnimated ? { opacity: 0, y: 30 } : false}
              animate={!hasAnimated ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-10 p-10"
            >
              <Button
                onClick={() => router.push("/register")}
                className="hover:bg-slate-200"
              >
                Get started for free
              </Button>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
