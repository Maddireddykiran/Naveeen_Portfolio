"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaLocationArrow } from "react-icons/fa6";

import { MagicButton } from "@/components/ui/magic-button";
import { links } from "@/config";

interface SocialMedia {
  name: string;
  img: string;
  link: string;
}

interface FooterData {
  cta: {
    heading: string;
    subtext: string;
    buttonText: string;
    buttonLink: string;
  };
  copyright: {
    name: string;
    link: string;
  };
}

export const Footer = () => {
  const [footerData, setFooterData] = useState<FooterData>({
    cta: {
      heading: "Ready to take your digital presence to the next level?",
      subtext: "Reach out to me today and let's discuss how I can help your achieve your goals.",
      buttonText: "Let's get in touch",
      buttonLink: `mailto:${links.ownerEmail}`
    },
    copyright: {
      name: "Naveen Vanam",
      link: "#"
    }
  });
  const [socialMediaLinks, setSocialMediaLinks] = useState<SocialMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch footer data
        const footerResponse = await fetch('/api/content/footer');
        if (footerResponse.ok) {
          const data = await footerResponse.json();
          setFooterData(data);
        } else {
          console.error("Failed to load footer data");
        }
        
        // Fetch social media data
        const socialResponse = await fetch('/api/content/social');
        if (socialResponse.ok) {
          const socialData = await socialResponse.json();
          setSocialMediaLinks(socialData);
        } else {
          console.error("Failed to load social media data");
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <footer id="contact" className="mb-[100px] w-full pb-10 md:mb-auto">
      <div className="absolute -bottom-72 left-0 min-h-96 w-full">
        <Image
          src="/footer-grid.svg"
          alt="grid"
          className="h-full w-full opacity-50"
          width={1260}
          height={863}
        />
      </div>

      <div className="flex flex-col items-center">
        <h1 className="heading lg:max-w-[45vw]">
          {footerData.cta.heading.split(" your ").map((part, i, arr) => (
            i === 0 ? (
              <span key={i}>
                {part} <span className="text-purple">your</span>
                {i === arr.length - 1 ? "" : " "}
              </span>
            ) : (
              <span key={i}>{part}</span>
            )
          ))}
        </h1>

        <p className="my-5 text-center text-white-200 md:mt-10">
          {footerData.cta.subtext}
        </p>

        <Link
          href={footerData.cta.buttonLink}
          target="_blank"
          rel="noreferrer noopener"
          className="md:mt-10"
        >
          <MagicButton
            title={footerData.cta.buttonText}
            icon={<FaLocationArrow />}
            position="right"
            asChild
          />
        </Link>
      </div>

      <div className="relative z-[999] mt-16 flex flex-col items-center justify-between md:flex-row">
        <p className="text-sm font-light md:text-base md:font-normal">
          Copyright &copy; {new Date().getFullYear()}{" "}
          <Link
            href={footerData.copyright.link}
            target="_blank"
            rel="noreferrer noopener"
            className="text-purple"
          >
            {footerData.copyright.name}
          </Link>
        </p>

        <div className="flex items-center gap-6 md:gap-3">
          {socialMediaLinks.map((profile) => (
            <Link
              key={profile.name}
              href={profile.link}
              target="_blank"
              rel="noreferrer noopener"
              className="saturate-180 flex size-10 items-center justify-center rounded-lg border border-black-300 bg-black-200 bg-opacity-75 backdrop-blur-lg backdrop-filter"
              title={profile.name}
            >
              <Image
                src={profile.img}
                alt={`profile-${profile.name}`}
                width={20}
                height={20}
              />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};
