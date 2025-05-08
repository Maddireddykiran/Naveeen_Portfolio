"use client";

import Image from "next/image";
import Link from "next/link";
import { FaLocationArrow } from "react-icons/fa6";
import { useEffect, useState } from "react";

import { PinContainer } from "./ui/3d-pin";

// Map of icon paths to tech names
const techStackMap: Record<string, string> = {
  "/re.svg": "React",
  "/next.svg": "Next.js",
  "/tail.svg": "Tailwind",
  "/ts.svg": "TypeScript",
  "/three.svg": "Three.js",
  "/fm.svg": "Framer",
  "/c.svg": "C++",
  "/stream.svg": "Stream API",
  "/gsap.svg": "GSAP",
  "/aem.svg": "AEM",
  "/ai.svg": "AI/ML",
  "/restfulapi.svg": "RESTful API",
  "/genai.svg": "GenAI"
};

// Utility function to get tech name from icon path
const getTechName = (iconPath: string): string => {
  if (techStackMap[iconPath]) {
    return techStackMap[iconPath];
  }
  // Try to extract name from path for custom icons
  return iconPath.replace("/", "").replace(".svg", "");
};

// Maximum number of tech stacks to display before showing "+more"
const MAX_TECH_DISPLAY = 3;

interface Project {
  id: number;
  title: string;
  des: string;
  img: string;
  iconLists: string[];
  link: string;
  sourceCode: string;
}

export const RecentProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the projects from the API
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/content/projects');
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        } else {
          console.error('Failed to fetch projects');
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section id="projects" className="py-20">
        <h1 className="heading">
          A small selection of{" "}
          <span className="text-purple">recent projects</span>
        </h1>
        <div className="mt-10 flex justify-center">
          <p>Loading projects...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-10 md:py-20">
      <h1 className="heading">
        A small selection of{" "}
        <span className="text-purple">recent projects</span>
      </h1>

      <div className="mt-6 md:mt-10 flex flex-wrap items-center justify-center gap-x-8 md:gap-x-24 gap-y-6 md:gap-y-8 p-4">
        {projects.map(
          ({ id, des, iconLists, img, link, sourceCode, title }) => (
            <div
              key={id}
              className="flex h-[28rem] w-[90vw] items-center justify-center sm:h-[32rem] md:h-[41rem] sm:w-[570px] lg:min-h-[32.5rem]"
            >
              <PinContainer title="Visit" href={link}>
                <div className="relative mb-6 md:mb-10 flex h-[25vh] w-[85vw] items-center justify-center overflow-hidden sm:h-[30vh] md:h-[40vh] sm:w-[570px]">
                  <div className="relative h-full w-full overflow-hidden bg-[#13162d] rounded-xl lg:rounded-3xl transform transition-transform duration-300 hover:scale-105 shadow-[0_0_20px_5px_rgba(255,255,255,0.3)] filter brightness-110">
                    <Image
                      height={330}
                      width={552}
                      src="/bg.png"
                      alt="bg-img"
                      className="filter brightness-50" // Apply a darker effect to the background image
                    />
                  </div>

                  <Image
                    height={300}
                    width={464}
                    src={img}
                    alt={title}
                    className="absolute bottom-0 z-10 w-full h-full object-cover filter brightness-50" // Apply a blackish filter effect to the project image
                  />
                </div>

                <h1 className="line-clamp-1 text-sm md:text-base font-bold md:text-xl lg:text-2xl">
                  {title}
                </h1>

                <p className="line-clamp-2 text-xs md:text-sm font-light lg:text-xl lg:font-normal">
                  {des}
                </p>

                <div className="mb-2 md:mb-3 mt-5 md:mt-7 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-0">
                    {iconLists.slice(0, MAX_TECH_DISPLAY).map((icon, i) => (
                      <div
                        key={icon}
                        className="rounded-md border border-white/[0.2] bg-black/50 px-2 py-1"
                      >
                        <span className="text-xs text-white">
                          {getTechName(icon)}
                        </span>
                      </div>
                    ))}
                    {iconLists.length > MAX_TECH_DISPLAY && (
                      <div className="rounded-md border border-white/[0.2] bg-purple/50 px-2 py-1">
                        <span className="text-xs text-white">
                          +{iconLists.length - MAX_TECH_DISPLAY} more
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-center">
                    <Link
                      href={sourceCode}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex text-xs md:text-sm text-purple lg:text-xl"
                    >
                      Source Code
                    </Link>

                    <FaLocationArrow className="ms-3" color="#cbacf9" />
                  </div>
                </div>
              </PinContainer>
            </div>
          )
        )}
      </div>
    </section>
  );
};
