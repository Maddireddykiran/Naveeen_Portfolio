"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useAnimation } from "framer-motion";
import { FaRegLightbulb, FaRobot, FaLink, FaBuilding, FaCode, FaServer, FaDatabase, FaChartLine } from "react-icons/fa6";

interface ExpertiseItem {
  icon: string;
  title: string;
  description: string;
}

interface AboutData {
  mainText: string;
  profileImage: string;
  jobTitle: string;
  closingText: string;
  expertiseItems: ExpertiseItem[];
}

// Icon mapping for dynamic rendering
const iconComponents: Record<string, React.ReactNode> = {
  FaRegLightbulb: <FaRegLightbulb className="h-6 w-6 text-purple-400" />,
  FaRobot: <FaRobot className="h-6 w-6 text-blue-400" />,
  FaLink: <FaLink className="h-6 w-6 text-indigo-400" />,
  FaBuilding: <FaBuilding className="h-6 w-6 text-cyan-400" />,
  FaCode: <FaCode className="h-6 w-6 text-green-400" />,
  FaServer: <FaServer className="h-6 w-6 text-yellow-400" />,
  FaDatabase: <FaDatabase className="h-6 w-6 text-red-400" />,
  FaChartLine: <FaChartLine className="h-6 w-6 text-orange-400" />
};

export const About = () => {
  const controls = useAnimation();
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const [aboutData, setAboutData] = useState<AboutData>({
    mainText: "As a Senior Manager at Deloitte Digital, I specialize in transforming legacy systems into cutting-edge digital platforms, leveraging AI, ML, and automation to streamline operations and enhance user experiences. With a passion for innovation, I lead multidisciplinary teams that deliver scalable, high-impact solutions for Government and Public Sector clients across the nation.",
    profileImage: "/Profile.jpg",
    jobTitle: "Senior Manager at Deloitte Digital",
    closingText: "I thrive at the intersection of technology, strategy, and execution, ensuring that digital transformation efforts drive measurable impact and long-term success.",
    expertiseItems: [
      {
        icon: "FaRegLightbulb",
        title: "Digital Transformation",
        description: "From modernizing paper-based workflows to implementing enterprise-wide digital strategies."
      },
      {
        icon: "FaRobot",
        title: "AI & ML-Driven Solutions",
        description: "Integrating AI-powered automation, predictive analytics, and intelligent decision-making."
      },
      {
        icon: "FaLink",
        title: "Seamless System Integrations",
        description: "Designing and overseeing complex technology integrations, ensuring interoperability."
      },
      {
        icon: "FaBuilding",
        title: "Public Sector Leadership",
        description: "Providing strategic guidance to help organizations navigate large-scale digital initiatives."
      }
    ]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAboutData() {
      try {
        const response = await fetch('/api/content/about');
        if (response.ok) {
          const data = await response.json();
          if (Object.keys(data).length > 0) {
            setAboutData(data);
          }
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAboutData();
  }, []);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <section id="about" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute -right-32 top-0 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl"></div>
      <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl"></div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
          <h2 className="heading mb-12">
            About <span className="text-purple">Me</span>
          </h2>
        </div>
        
        <motion.div
          ref={containerRef}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="mt-10 lg:mx-0 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          {/* Left Content */}
          <motion.div variants={itemVariants} className="flex flex-col gap-8">
            <motion.p 
              variants={itemVariants}
              className="text-base md:text-lg text-white/80 leading-relaxed"
            >
              {aboutData.mainText}
            </motion.p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {aboutData.expertiseItems.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-900/60 to-gray-800/60 p-5 backdrop-blur-sm border border-white/5 shadow-lg hover:shadow-purple-500/5 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-black/30 p-2 flex items-center justify-center">
                      {iconComponents[item.icon] || <FaRegLightbulb className="h-6 w-6 text-purple-400" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white mb-2">{item.title}</h3>
                      <p className="text-xs text-white/70 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.p 
              variants={itemVariants}
              className="text-base md:text-lg text-white/80 leading-relaxed mt-4"
            >
              {aboutData.closingText}
            </motion.p>
          </motion.div>

          {/* Right Content - 3D Image Display */}
          <motion.div
            variants={itemVariants}
            className="relative h-[450px] md:h-[500px] flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur-2xl opacity-30"></div>
            
            <div className="relative z-10 w-full h-full p-4">
              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl transform perspective-3d hover:rotate-y-10 transition-transform duration-700">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-blue-500/10"></div>
                <Image
                  src={aboutData.profileImage}
                  alt="Professional Portrait"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-2xl"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
                  <span className="px-4 py-2 rounded-full bg-purple-500/30 text-sm font-medium text-purple-200 backdrop-blur-sm">{aboutData.jobTitle}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}; 