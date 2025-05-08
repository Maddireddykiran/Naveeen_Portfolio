"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { cn } from "@/lib/utils";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Experience {
  id: number;
  title: string;
  company: string;
  period: string;
  location: string;
  desc: string;
  skills: string[];
  thumbnail: string;
}

export const ExperienceTimeline = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const timelineRef = useRef<HTMLDivElement>(null);
  const experienceRefs = useRef<HTMLDivElement[]>([]);
  const setExperienceRef = (el: HTMLDivElement | null, index: number) => {
    if (el) {
      experienceRefs.current[index] = el;
    }
  };

  // Fetch experiences from API
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        console.log('Fetching experiences...');
        const response = await fetch('/api/content/experience');
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Experience data received:', data);
          setExperiences(data);
        } else {
          console.error('Failed to fetch experiences, status:', response.status);
          const errorText = await response.text();
          console.error('Error response:', errorText);
        }
      } catch (error) {
        console.error('Error fetching experiences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  useEffect(() => {
    if (!timelineRef.current || experiences.length === 0) return;

    // Create timeline animation
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: timelineRef.current,
        start: "top center",
        end: "bottom center",
        scrub: 0.5,
      },
    });

    // Animate the vertical line
    timeline.to(".timeline-line", {
      height: "100%",
      duration: 1,
      ease: "power1.inOut",
    });

    // Animate each experience card
    experienceRefs.current.forEach((card, index) => {
      if (!card) return;
      
      gsap.fromTo(
        card,
        { 
          opacity: 0, 
          x: index % 2 === 0 ? -50 : 50,
          y: 20,
        },
        { 
          opacity: 1, 
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            end: "bottom 70%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => {
      // Clean up ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [experiences]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-white/70">Loading experience data...</p>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-[95rem] px-4 sm:px-8 lg:px-12 py-8 sm:py-12" ref={timelineRef}>
      {/* Vertical timeline line */}
      <div className="timeline-line absolute left-1/2 top-0 h-0 w-1 -translate-x-1/2 bg-gradient-to-b from-purple-600 to-blue-600 md:left-1/2" />

      {/* Experience cards */}
      <div className="relative z-10">
        {experiences.map((experience, index) => (
          <div
            key={experience.id}
            ref={(el) => setExperienceRef(el, index)}
            className={cn(
              "mb-12 flex flex-col md:mb-16 md:w-[60%]",
              index % 2 === 0 ? "md:ml-auto md:pl-12" : "md:mr-auto md:pr-12"
            )}
          >
            <div className="relative rounded-xl bg-white/5 p-4 shadow-xl backdrop-blur-sm transition-all duration-300 hover:bg-white/10 dark:bg-black-100/40 dark:hover:bg-black-100/60">
              {/* Timeline dot - removed */}
              {/* <div className="absolute -left-3 top-8 hidden h-6 w-6 rounded-full border-4 border-white bg-purple-600 md:block md:left-auto md:right-0 md:translate-x-1/2">
                <div className="absolute inset-0 animate-ping rounded-full bg-purple-600 opacity-75" />
              </div> */}

              {/* Company logo */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="overflow-hidden rounded-lg">
                    <Image
                      src={experience.thumbnail}
                      alt={experience.company}
                      width={60}
                      height={60}
                      className="h-14 w-14 object-contain bg-white/10 p-1.5 rounded-md"
                      unoptimized
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{experience.title}</h3>
                    <p className="text-base font-medium text-purple-400">{experience.company}</p>
                    <p className="text-xs text-white/50">ID: {experience.id}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-white/70">{experience.period}</span>
                  <span className="text-sm font-medium text-white/50">{experience.location}</span>
                </div>
              </div>

              {/* Description */}
              <p className="mb-4 text-base text-white/80">{experience.desc}</p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {experience.skills.map((skill, idx) => (
                  <span 
                    key={idx} 
                    className="rounded-full bg-purple-600/20 px-3 py-1 text-xs font-medium text-purple-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceTimeline;
