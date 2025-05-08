"use client";

import { useEffect, useRef, useState } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExperienceTimeline } from "@/components/ui/experience-timeline";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SkillCategory {
  title: string;
  skills: string[];
}

interface TechStack {
  categories: SkillCategory[];
  additionalSkills: string[];
}

export const Experience = () => {
  const [techStack, setTechStack] = useState<TechStack | null>(null);
  const [loading, setLoading] = useState(true);

  const sectionRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const skillsCategoriesRef = useRef<HTMLDivElement>(null);
  const additionalSkillsRef = useRef<HTMLDivElement>(null);
  
  // Fetch tech stack data
  useEffect(() => {
    const fetchTechStack = async () => {
      try {
        const response = await fetch('/api/content/techstack');
        if (response.ok) {
          const data = await response.json();
          setTechStack(data);
        } else {
          console.error('Failed to fetch tech stack');
        }
      } catch (error) {
        console.error('Error fetching tech stack:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTechStack();
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Animate section title
    gsap.fromTo(
      ".section-title",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    );

    // GSAP timeline for skills section title reveal
    const skillsTitleTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: skillsRef.current,
        start: "top 70%",
      },
    });

    skillsTitleTimeline
      .fromTo(
        ".skills-title",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "back.out(1.4)" }
      )
      .fromTo(
        ".skills-subtitle",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.3"
      );

    // Create reveal animation for skills categories
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { 
          opacity: 0, 
          x: index % 2 === 0 ? -50 : 50,
          scale: 0.9 
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.7,
          delay: index * 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: skillsCategoriesRef.current,
            start: "top 75%",
          },
        }
      );
    });

    // Staggered reveal for skills within each category
    const categorySkills = document.querySelectorAll('.category-skill');
    gsap.fromTo(
      categorySkills,
      { opacity: 0, y: 15 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: {
          trigger: skillsCategoriesRef.current,
          start: "top 60%",
        },
      }
    );

    // Split animation for additional skills
    const additionalSkills = document.querySelectorAll('.additional-skill');
    additionalSkills.forEach((skill, index) => {
      const direction = index % 4 < 2 ? -1 : 1;
      const fromTop = index % 2 === 0;
      
      gsap.fromTo(
        skill,
        { 
          opacity: 0, 
          x: 30 * direction,
          y: fromTop ? -20 : 20,
        },
        { 
          opacity: 1, 
          x: 0,
          y: 0,
          duration: 0.5,
          delay: index * 0.03,
          ease: "power2.out",
          scrollTrigger: {
            trigger: additionalSkillsRef.current,
            start: "top 75%",
          },
        }
      );
    });

    return () => {
      // Clean up ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [techStack]);

  const getCardClassName = (index: number) => {
    const cardStyles = [
      "category-card opacity-0 bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-6 rounded-2xl backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group relative overflow-hidden",
      "category-card opacity-0 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 p-6 rounded-2xl backdrop-blur-sm border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 group relative overflow-hidden",
      "category-card opacity-0 bg-gradient-to-br from-pink-900/30 to-purple-900/30 p-6 rounded-2xl backdrop-blur-sm border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 group relative overflow-hidden"
    ];
    
    return cardStyles[index % cardStyles.length];
  };

  const getCardGradientClassName = (index: number) => {
    const gradients = [
      "absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500",
      "absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500",
      "absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500"
    ];
    
    return gradients[index % gradients.length];
  };

  const getTitleClassName = (index: number) => {
    const titles = [
      "text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors relative z-10",
      "text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors relative z-10",
      "text-2xl font-bold text-white mb-4 group-hover:text-pink-400 transition-colors relative z-10"
    ];
    
    return titles[index % titles.length];
  };

  const getSkillDotClassName = (index: number) => {
    const dots = [
      "h-2 w-2 rounded-full bg-purple-500",
      "h-2 w-2 rounded-full bg-blue-500",
      "h-2 w-2 rounded-full bg-pink-500"
    ];
    
    return dots[index % dots.length];
  };

  const getSkillTextClassName = (index: number) => {
    const texts = [
      "text-purple-200",
      "text-blue-200",
      "text-pink-200"
    ];
    
    return texts[index % texts.length];
  };

  return (
    <section id="experience" className="py-24 sm:py-32 px-4 sm:px-8 lg:px-12 max-w-[90rem] mx-auto" ref={sectionRef}>
      <div className="section-title mb-16">
        <h1 className="heading">
          Professional <span className="text-purple">Experience</span>
        </h1>
        <p className="mx-auto mt-4 max-w-4xl text-center text-xl md:text-2xl text-white/70">
          Transforming legacy systems into cutting-edge digital platforms with AI, ML, and automation
        </p>
      </div>

      {/* Career Timeline */}
      <ExperienceTimeline />

      {/* Skills & Certifications */}
      <div className="mt-24" ref={skillsRef}>
        <div id="technical-skills" className="expertise-intro mb-12 text-center">
          <h2 className="skills-title text-4xl font-bold md:text-5xl bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 bg-clip-text">Technical Skills</h2>
          <p className="skills-subtitle mx-auto mt-4 max-w-3xl text-center text-lg text-white/70 opacity-0">
            Specialized expertise in enterprise platforms, AI integration, and development technologies
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-white/70">Loading skill data...</p>
          </div>
        ) : techStack ? (
          <div className="mx-auto max-w-6xl">
            {/* Skills Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12" ref={skillsCategoriesRef}>
              {techStack.categories.map((category, index) => (
                <div key={index} className={getCardClassName(index)}>
                  <div className={getCardGradientClassName(index)}></div>
                  <h3 className={getTitleClassName(index)}>{category.title}</h3>
                  <div className="space-y-2 relative z-10">
                    {category.skills.map((skill, idx) => (
                      <div 
                        key={idx} 
                        className="category-skill opacity-0 flex items-center space-x-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors transform hover:-translate-y-1 duration-300"
                      >
                        <div className={getSkillDotClassName(index)}></div>
                        <span className={getSkillTextClassName(index)}>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Additional Skills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3" ref={additionalSkillsRef}>
              {techStack.additionalSkills.map((skill, index) => (
                <div
                  key={index}
                  className="additional-skill opacity-0 rounded-xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/30 px-4 py-3 text-base font-medium text-gray-200 transition-all duration-300 hover:border-purple-500/50 hover:from-purple-900/20 hover:to-blue-900/20 hover:scale-105 hover:text-white flex items-center justify-center text-center"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-white/70">No skill data available</p>
          </div>
        )}
      </div>
    </section>
  );
};
