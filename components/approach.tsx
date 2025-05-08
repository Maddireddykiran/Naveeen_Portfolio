"use client";

import { useState, useEffect, ReactNode } from "react";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";
import { MagicButton } from "@/components/ui/magic-button";

interface ApproachPhase {
  title: string;
  phase: string;
  description: string;
}

export const Approach = () => {
  const [phases, setPhases] = useState<ApproachPhase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApproach() {
      try {
        const response = await fetch('/api/content/approach');
        if (response.ok) {
          const data = await response.json();
          setPhases(data);
        } else {
          console.error("Failed to load approach data");
        }
      } catch (error) {
        console.error("Error loading approach data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchApproach();
  }, []);

  // Canvas colors for each phase
  const phaseCanvasProps = [
    {
      animationSpeed: 5.1,
      containerClassName: "bg-emerald-900",
      colors: undefined,
      dotSize: undefined
    },
    {
      animationSpeed: 3,
      containerClassName: "bg-black",
      colors: [
        [236, 72, 153],
        [232, 121, 249],
      ],
      dotSize: 2
    },
    {
      animationSpeed: 3,
      containerClassName: "bg-sky-600",
      colors: [[125, 211, 252]],
      dotSize: undefined
    }
  ];

  return (
    <section className="w-full py-20">
      <h1 className="heading">
        My <span className="text-purple">AEM & AI Leadership Approach</span>
      </h1>

      {loading ? (
        <div className="my-20 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-purple-600"></div>
        </div>
      ) : (
      <div className="my-20 flex flex-col items-center justify-center gap-4 lg:flex-row">
          {phases.map((phase, index) => (
        <Card
              key={index}
              title={phase.title}
              icon={<MagicButton title={phase.phase} asChild />}
              description={phase.description}
        >
          <CanvasRevealEffect
                animationSpeed={phaseCanvasProps[index % phaseCanvasProps.length].animationSpeed}
                containerClassName={phaseCanvasProps[index % phaseCanvasProps.length].containerClassName}
                colors={phaseCanvasProps[index % phaseCanvasProps.length].colors}
                dotSize={phaseCanvasProps[index % phaseCanvasProps.length].dotSize}
          />
        </Card>
          ))}
      </div>
      )}
    </section>
  );
};

type CardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  children?: ReactNode;
};

const Card = ({ title, description, icon, children }: CardProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group/canvas-card relative mx-auto flex w-full max-w-sm items-center justify-center rounded-3xl border border-black/[0.2] p-4 dark:border-white/[0.2] lg:h-[35rem]"
    >
      <Icon className="absolute -left-3 -top-3 h-6 w-6 text-black dark:text-white" />
      <Icon className="absolute -bottom-3 -left-3 h-6 w-6 text-black dark:text-white" />
      <Icon className="absolute -right-3 -top-3 h-6 w-6 text-black dark:text-white" />
      <Icon className="absolute -bottom-3 -right-3 h-6 w-6 text-black dark:text-white" />

      <div 
        className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${
          hovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {children}
      </div>

      <div className="relative z-20">
        <div className="absolute left-[50%] top-[50%] mx-auto flex w-full -translate-x-[50%] -translate-y-[50%] items-center justify-center text-center transition duration-200 group-hover/canvas-card:-translate-y-4 group-hover/canvas-card:opacity-0">
          {icon}
        </div>

        <h2 className="relative z-10 mt-4 text-3xl font-bold text-black opacity-0 transition duration-200 group-hover/canvas-card:-translate-y-2 group-hover/canvas-card:text-white group-hover/canvas-card:opacity-100 dark:text-white">
          {title}
        </h2>

        <p
          className="relative z-10 mt-4 text-sm font-bold text-black opacity-0 transition duration-200 group-hover/canvas-card:-translate-y-2 group-hover/canvas-card:text-white group-hover/canvas-card:opacity-100 dark:text-white"
          style={{
            color: "#e4ecff",
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

type IconProps = {
  className?: string;
  [key: string]: any;
};

const Icon = ({ className, ...props }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};