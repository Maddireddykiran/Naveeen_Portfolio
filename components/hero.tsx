"use client";

import Link from "next/link";
import { FaLocationArrow } from "react-icons/fa6";
import { Spotlight } from "@/components/ui/spotlight";
import { MagicButton } from "@/components/ui/magic-button";
import { AIMLScene } from "@/components/ui/ai-ml-scene";
import { useEffect, useState } from "react";

interface HeroData {
  professionTitle: string;
  heading: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  image: string;
}

export const Hero = () => {
  const [heroData, setHeroData] = useState<HeroData>({
    professionTitle: "AI & AUTOMATION EXPERT | SENIOR MANAGER AT DELOITTE DIGITAL",
    heading: "Crafting Intelligent Digital Experiences with AI",
    description: "Hi, I'm Naveen, a Senior Manager and AI expert specializing in digital transformation using AI, ML, and Adobe Experience Manager (AEM). I build intelligent, scalable platforms that modernize legacy systems and enhance user experiences.",
    ctaText: "Contact Me",
    ctaLink: "#contact",
    image: "/profile.svg"
  });

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await fetch('/api/content/hero');
        if (response.ok) {
          const data = await response.json();
          setHeroData(data);
        }
      } catch (error) {
        console.error('Error fetching hero data:', error);
      }
    };

    fetchHeroData();
  }, []);

  return (
    <div className="pb-20 pt-36 relative">
      {/* Spotlights */}
      <div>
        <Spotlight
          className="-left-10 -top-40 h-screen md:-left-32 md:-top-20"
          fill="white"
        />
        <Spotlight
          className="left-full top-10 h-[80vh] w-[50vw]"
          fill="purple"
        />
        <Spotlight
          className="left-80 top-28 h-[80vh] w-[50vw]"
          fill="blue"
        />
      </div>

      {/* Background Grid Overlay */}
      <div className="absolute left-0 top-0 flex h-screen w-full items-center justify-center bg-white bg-grid-black/[0.2] dark:bg-black-100 dark:bg-grid-white/[0.03]">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black-100" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 my-10 flex flex-col justify-center lg:flex-row lg:items-center lg:gap-8">
        {/* Text Content */}
        <div className="flex max-w-[89vw] flex-col items-center justify-center md:max-w-2xl lg:max-w-[40vw] lg:items-start">
          <h2 className="text-center lg:text-left text-sm uppercase tracking-widest text-blue-100 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text font-semibold">
            {heroData.professionTitle}
          </h2>

          <h1 className="text-center lg:text-left my-4 text-[40px] md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {heroData.heading}
          </h1>

          <p className="mb-6 text-center lg:text-left text-sm sm:text-base tracking-normal leading-relaxed text-gray-300">
            {heroData.description}
          </p>

          {/* Buttons */}
          <div className="flex gap-4">
            <Link href="#about">
              <div className="transition-transform duration-300 ease-in-out hover:bg-blue-600 hover:text-white hover:scale-105 rounded-md">
                <MagicButton
                  title="View my work"
                  icon={<FaLocationArrow />}
                  position="right"
                  asChild
                />
              </div>
            </Link>

            <Link href={heroData.ctaLink}>
              <div className="transition-transform duration-300 ease-in-out hover:bg-green-600 hover:text-white hover:scale-105 rounded-md">
                <MagicButton
                  title={heroData.ctaText}
                  variant="outline"
                  asChild
                />
              </div>
            </Link>
          </div>
        </div>

        {/* AI/ML Scene */}
        <div className="mt-10 w-full lg:mt-0 lg:w-1/2">
          <div className="relative">
            <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 opacity-75 blur-xl" />
            <div className="relative overflow-hidden rounded-lg">
              <AIMLScene />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
