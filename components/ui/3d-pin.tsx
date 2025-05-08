"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";

import { cn } from "@/lib/utils";

export const PinContainer = ({
  children,
  title,
  href,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  title?: string;
  href?: string;
  className?: string;
  containerClassName?: string;
}) => {
  const [transform, setTransform] = useState(
    "translate(-50%,-50%) rotateX(0deg)"
  );
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on a mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typical md breakpoint
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const onMouseEnter = () => {
    if (isMobile) {
      // Simple scale animation for mobile
      setTransform("translate(-50%,-50%) rotateX(0deg) scale(0.97)");
    } else {
      // 3D rotation for desktop
    setTransform("translate(-50%,-50%) rotateX(40deg) scale(0.8)");
    }
  };
  
  const onMouseLeave = () => {
    setTransform("translate(-50%,-50%) rotateX(0deg) scale(1)");
  };

  return (
    <div
      className={cn(
        "group/pin relative z-50 cursor-pointer",
        containerClassName
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        style={{
          perspective: "1000px",
          transform: isMobile 
            ? "rotateX(0deg) translateZ(0deg)" 
            : "rotateX(70deg) translateZ(0deg)",
        }}
        className="absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2"
      >
        <div
          style={{
            transform: transform,
          }}
          className="absolute left-1/2 top-1/2 flex items-start justify-start overflow-hidden rounded-2xl border border-white/[0.1] p-4 shadow-[0_8px_16px_rgb(0_0_0/0.4)] transition duration-700 group-hover/pin:border-white/[0.2]"
        >
          <div className={cn("relative z-50", className)}>{children}</div>
        </div>
      </div>
      {!isMobile && <PinPerspective title={title} href={href} />}
      {isMobile && (
        <div className="z-[60] flex h-80 w-full items-center justify-center opacity-0 transition duration-500 group-hover/pin:opacity-100">
          <Link
            href={href || ""}
            target="_blank"
            className="relative z-10 mt-64 flex items-center space-x-2 rounded-full bg-zinc-950 px-4 py-1.5 ring-1 ring-white/10"
          >
            <span className="relative z-20 inline-block py-0.5 text-xs font-bold text-white">
              {title}
            </span>
            <span
              aria-hidden
              className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover/btn:opacity-40"
            />
          </Link>
        </div>
      )}
    </div>
  );
};

export const PinPerspective = ({
  title,
  href,
}: {
  title?: string;
  href?: string;
}) => {
  return (
    <div className="z-[60] flex h-80 w-full items-center justify-center opacity-0 transition duration-500 group-hover/pin:opacity-100">
      <div className="inset-0 -mt-7 h-full w-full flex-none">
        <div className="absolute inset-x-0 top-0 flex justify-center">
          <Link
            href={href || ""}
            target="_blank"
            className="relative z-10 flex items-center space-x-2 rounded-full bg-zinc-950 px-4 py-0.5 ring-1 ring-white/10"
          >
            <span className="relative z-20 inline-block py-0.5 text-xs font-bold text-white">
              {title}
            </span>

            <span
              aria-hidden
              className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover/btn:opacity-40"
            />
          </Link>
        </div>

        <div
          style={{
            perspective: "1000px",
            transform: "rotateX(70deg) translateZ(0)",
          }}
          className="absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2"
        >
          <>
            <div
              className="absolute left-1/2 top-1/2 h-[11.25rem] w-[11.25rem] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-sky-500/[0.08] shadow-[0_8px_16px_rgb(0_0_0/0.4)] animate-pulse-slow"
              aria-hidden
            />
            <div
              className="absolute left-1/2 top-1/2 h-[11.25rem] w-[11.25rem] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-sky-500/[0.08] shadow-[0_8px_16px_rgb(0_0_0/0.4)] animate-pulse-slow animation-delay-2000"
              aria-hidden
            />
            <div
              className="absolute left-1/2 top-1/2 h-[11.25rem] w-[11.25rem] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-sky-500/[0.08] shadow-[0_8px_16px_rgb(0_0_0/0.4)] animate-pulse-slow animation-delay-4000"
              aria-hidden
            />
          </>
        </div>

        <>
          <div
            aria-hidden
            className="absolute bottom-1/2 right-1/2 h-20 w-px translate-y-[14px] bg-gradient-to-b from-transparent to-cyan-500 blur-[2px] group-hover/pin:h-40"
          />
          <div
            aria-hidden
            className="absolute bottom-1/2 right-1/2 h-20 w-px translate-y-[14px] bg-gradient-to-b from-transparent to-cyan-500 group-hover/pin:h-40"
          />
          <div
            aria-hidden
            className="absolute bottom-1/2 right-1/2 z-40 h-[4px] w-[4px] translate-x-[1.5px] translate-y-[14px] rounded-full bg-cyan-600 blur-[3px]"
          />
          <div
            aria-hidden
            className="absolute bottom-1/2 right-1/2 z-40 h-[2px] w-[2px] translate-x-[0.5px] translate-y-[14px] rounded-full bg-cyan-300"
          />
        </>
      </div>
    </div>
  );
};

