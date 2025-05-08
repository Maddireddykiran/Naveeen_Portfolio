"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

interface Testimonial {
  quote: string;
  name: string;
  title: string;
}

export const Clients = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const response = await fetch('/api/content/testimonials');
        if (response.ok) {
          const data = await response.json();
          setTestimonials(data);
        } else {
          console.error("Failed to load testimonials");
        }
      } catch (error) {
        console.error("Error loading testimonials:", error);
        // Fall back to empty array
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  // Company logos array
  const companyLogos = [
    {
      id: 1,
      img: "/deo.svg",
    },
    {
      id: 2,
      img: "/adobe-2.svg",
    },
    {
      id: 3,
      img: "/moto.svg",
    },
    {
      id: 4,
      img: "/CGI_logo.svg",
    },
    {
      id: 5,
      img: "/flo.svg",
    },
    { 
      id: 6,
      img: "/gen.svg",
    },
  ];

  return (
    <section id="testimonials" className="py-20">
      <h1 className="heading">
        Kind words from <span className="text-purple">satisfied clients</span>
      </h1>

      <div className="flex flex-col items-center max-lg:mt-10">
        {loading ? (
          <div className="flex h-[30rem] w-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-purple-600"></div>
          </div>
        ) : testimonials.length > 0 ? (
        <div className="relative flex h-[50vh] flex-col items-center justify-center overflow-hidden rounded-md antialiased md:h-[30rem]">
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
          />
        </div>
        ) : (
          <div className="flex h-[20rem] w-full items-center justify-center rounded-md bg-gray-100">
            <p className="text-gray-500">No testimonials available</p>
          </div>
        )}
        
        <div className="flex flex-wrap items-center justify-center gap-4 max-lg:mt-10 md:gap-16">
          {companyLogos.map(({ id, img }) => (
    <div key={id} className="flex max-w-100 gap-4 md:max-w-60">
      <Image
        height={100}
        width={120}
        src={img}
        alt="company logo"
        className="w-25 md:w-20"
      />
    </div>
  ))}
</div>
      </div>
    </section>
  );
};
