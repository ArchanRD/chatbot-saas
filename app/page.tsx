"use client";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import Script from "next/script";
import Link from "next/link";
import ProductivityCard from "@/components/home/ProductivityCard";
import Working from "@/components/home/Working";
import Features from "@/components/home/Features";

// Add TypeScript declarations for Vanta
declare global {
  interface Window {
    VANTA: {
      FOG: (opts: {
        el: string | HTMLElement;
        mouseControls: boolean;
        touchControls: boolean;
        gyroControls: boolean;
        minHeight: number;
        minWidth: number;
        highlightColor: number;
        midtoneColor: number;
        lowlightColor: number;
        baseColor: number;
      }) => {
        destroy?: () => void;
      };
    };
  }
}

export default function Home() {
  useEffect(() => {
    // if (typeof window != "undefined") {
    //   const loader = document.getElementById("globalLoader");
    //   if (loader) {
    //     loader.remove();
    //   }
    // }
    // Store the effect instance
    let vantaEffect: { destroy?: () => void } | null = null;

    // Initialize Vanta effect after scripts are loaded
    const initVantaEffect = () => {
      if (typeof window !== "undefined" && window.VANTA && window.VANTA.FOG) {
        vantaEffect = window.VANTA.FOG({
          el: "#vanta-bg",
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          highlightColor: 0x59ff,
          midtoneColor: 0x2f4acd,
          lowlightColor: 0x0,
          baseColor: 0xe1e1e1,
        });
      }
    };

    // Call the initialization function
    initVantaEffect();

    // Cleanup function when component unmounts
    return () => {
      if (vantaEffect && vantaEffect.destroy) {
        vantaEffect.destroy();
      }
    };
  }, []);

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.fog.min.js"
        strategy="beforeInteractive"
        onLoad={() => {
          if (
            typeof window !== "undefined" &&
            window.VANTA &&
            window.VANTA.FOG
          ) {
            window.VANTA.FOG({
              el: "#vanta-bg",
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200.0,
              minWidth: 200.0,
              highlightColor: 0x59ff,
              midtoneColor: 0x2f4acd,
              lowlightColor: 0x0,
              baseColor: 0xe1e1e1,
            });
          }
        }}
      />
      <section className="font-inter">
        <div
          id="vanta-bg"
          className="relative sm:min-h-[calc(100vh-3rem)] overflow-hidden animate-fade-in opacity-0"
        >
          <Navbar />
          <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-16rem)] sm:min-h-[calc(100vh-8rem)] px-6">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-medium text-white mb-6 leading-tight animate-fade-in-up">
                AI-Powered Customer Support that never sleeps
              </h1>

              <p className="sm:text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up">
                Implement intelligent customer support in seconds with one line
                of code
              </p>

              <div className="animate-fade-in-up">
                <Link href="/login">
                  <Button
                    size="lg"
                    variant={"default"}
                    className="bg-white text-black hover:text-black hover:bg-gray-100 transition-all duration-100 ease-in-out rounded-full"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ProductivityCard />
      <Working />
      <Features />
    </>
  );
}
