"use client";

import { useState, useEffect } from "react";

export function useScrollAnimation() {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    // Add event listener
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Call handler right away to get initial scroll position
    handleScroll();
    
    // Remove event listener on cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  // Calculate normalized scroll value (0 to 1)
  const getScrollProgress = () => {
    const docHeight = document.body.scrollHeight - window.innerHeight;
    return docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;
  };
  
  // Calculate scroll direction
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  useEffect(() => {
    const updateScrollDirection = () => {
      if (scrollY > lastScrollY) {
        setScrollDirection("down");
      } else if (scrollY < lastScrollY) {
        setScrollDirection("up");
      }
      setLastScrollY(scrollY);
    };
    
    updateScrollDirection();
  }, [scrollY, lastScrollY]);
  
  return {
    scrollY,
    scrollProgress: getScrollProgress(),
    scrollDirection,
  };
}

export default useScrollAnimation;
