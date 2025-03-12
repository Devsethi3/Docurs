"use client";

import Features from "@/components/Features";
import HeroSection from "@/components/HeroSection";

const HomePage = () => {
  return (
    <div className="bg-background text-foreground min-h-screen font-sans">
      <HeroSection />
      <Features />
    </div>
  );
};

export default HomePage;
