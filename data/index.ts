import { links } from "@/config";

export const navItems = [
  { name: "Home", link: "#home" },
  { name: "About", link: "#about" },
  { name: "Experience", link: "#experience" },
  { name: "Skills", link: "#technical-skills" },
  { name: "Projects", link: "#projects" },
  { name: "Testimonials", link: "#testimonials" },
  { name: "Contact", link: "#contact" },
] as const;

export const gridItems = [
  {
    id: 1,
    title: "I specialize in advanced AI solutions with cutting-edge expertise",
    description: "",
    className: "lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[60vh]",
    imgClassName: "w-full h-full",
    titleClassName: "justify-end",
    img: "/b1.svg",
    spareImg: "",
  },
  {
    id: 2,
    title: "I'm very flexible with time zone communications",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "",
    spareImg: "",
  },
  {
    id: 3,
    title: "My tech stack",
    description: "I constantly try to improve",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-center",
    img: "",
    spareImg: "",
  },
  {
    id: 4,
    title: "Tech enthusiast with a passion for development.",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "/grid.svg",
    spareImg: "/b4.svg",
  },

  {
    id: 5,
    title: "Developing advanced AI agents with LLM integration",
    description: "AI Research",
    className: "md:col-span-3 md:row-span-2",
    imgClassName: "absolute right-0 bottom-0 md:w-96 w-60",
    titleClassName: "justify-center md:justify-start lg:justify-center",
    img: "/ai-code.svg",
    spareImg: "/grid.svg",
  },
  {
    id: 6,
    title: "Do you want to start a project together?",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-center md:max-w-full max-w-60 text-center",
    img: "",
    spareImg: "",
  },
] as const;

export const Project = [
  {
    id: 1,
    title: "AEM - AI-Powered Content Management System",
    des: "An AEM-based content management system integrated with AI for automated content tagging, recommendation, and personalization.",
    img: "/Pro.jpg",
    iconLists: ["/re.svg", "/tail.svg", "/ts.svg", "/three.svg", "/fm.svg"],
    link: "https://aem-ai-cms.netlify.app",
    sourceCode: "https://github.com/user/aem-ai-cms",
  },
  {
    id: 2,
    title: "AI-Powered Personalized Content Delivery System",
    des: "An AI-driven system built with AEM that dynamically personalizes content delivery based on user preferences and behavior.",
    img: "/Pro2.jpg",
    iconLists: ["/next.svg", "/tail.svg", "/ts.svg", "/stream.svg", "/c.svg"],
    link: "https://ai-content-delivery.netlify.app",
    sourceCode: "https://github.com/user/ai-content-delivery",
  },
  {
    id: 3,
    title: "AEM + AI Chatbot Integration",
    des: "A fully integrated chatbot system within AEM that leverages AI to provide instant responses, support, and content recommendations.",
    img: "/Pro3.jpg",
    iconLists: ["/re.svg", "/tail.svg", "/ts.svg", "/three.svg", "/c.svg"],
    link: "https://aem-ai-chatbot.netlify.app",
    sourceCode: "https://github.com/user/aem-ai-chatbot",
  },
  {
    id: 4,
    title: "AI Content Moderation System for AEM",
    des: "An AI-powered content moderation tool integrated with AEM to automatically filter inappropriate content and ensure compliance.",
    img: "/Pro4.jpg",
    iconLists: ["/next.svg", "/tail.svg", "/ts.svg", "/three.svg", "/gsap.svg"],
    link: "https://ai-content-moderation.netlify.app",
    sourceCode: "https://github.com/user/ai-content-moderation",
  },
] as const;

export const testimonials = [
  {
    quote: `Collaborating wit Naveen Vanam was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Naveen Vanam's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand,  is the ideal partner.`,
    name: "Michael Johnson",
    title: "Employee of Deolite Technologie",
  },
  {
    quote: `Collaborating with Naveen Vanam was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Naveen Vanam's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Naveen Vanam is the ideal partner.`,
    name: "samuel",
    title: "Employee of Adobe Technologies",
  },
  {
    quote: `Collaborating with Naveen Vanam was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Naveen Vanam's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Naveen Vanam is the ideal partner.`,
    name: "John Smith",
    title: "Employee of Florida Department of Environmental Protection",
  },

] as const;



export const workExperience = [
  {
    id: 1,
    title: "Specialist Leader",
    company: "Deloitte Digital",
    period: "2018 - Present (7+ years)",
    location: "Los Angeles",
    desc: "Leading digital transformation initiatives, implementing AI & ML solutions for Government and Public Sector clients.",
    skills: ["Adobe Experience Manager", "AI/ML Integration", "Digital Transformation"],
    className: "md:col-span-2",
    thumbnail: "https://assets.channelinsider.com/uploads/2022/03/CI.Profile.Deloitte.jpg",
  },
  {
    id: 2,
    title: "Lead AEM Developer",
    company: "Adobe",
    period: "Mar 2017 - Oct 2017 (6 months)",
    location: "New York City",
    desc: "Served as Technical Account Manager and Lead Developer for enterprise AEM implementations.",
    skills: ["AEM", "RESTful Services", "Technical Leadership"],
    className: "md:col-span-2",
    thumbnail: "https://images.credly.com/images/6975ffc1-5e18-4a37-96de-845dcd47e888/blob.png",
  },
  {
    id: 3,
    title: "AEM Developer",
    company: "Florida Department of Environmental Protection",
    period: "2015 - 2017",
    location: "Florida",
    desc: "Implemented AEM solutions and RESTful services for state environmental protection systems.",
    skills: ["AEM", "RESTful Services", "Government Systems"],
    className: "md:col-span-2",
    thumbnail: "https://upload.wikimedia.org/wikipedia/commons/3/30/Florida_Department_of_Environmental_Protection_logo.png",
  },
  {
    id: 4,
    title: "Sr. Adobe LiveCycle Consultant",
    company: "Deloitte",
    period: "2014 - 2015",
    location: "Pennsylvania",
    desc: "Provided expert consulting for Adobe LiveCycle implementations and integrations.",
    skills: ["Adobe LiveCycle", "System Integration", "Consulting"],
    className: "md:col-span-2",
    thumbnail: "https://assets.channelinsider.com/uploads/2022/03/CI.Profile.Deloitte.jpg",
  },
  {
    id: 5,
    title: "Adobe LiveCycle SME",
    company: "Motorola Solutions",
    period: "2015",
    location: "Illinois",
    desc: "Served as Subject Matter Expert for Adobe LiveCycle implementations.",
    skills: ["Adobe LiveCycle", "Enterprise Solutions"],
    className: "md:col-span-2",
    thumbnail: "https://yt3.googleusercontent.com/ytc/AIdro_kQkZ6OvI3nxgfM99VKqlHFlhsW_6UuOANvyi86sa8NB1w=s900-c-k-c0x00ffffff-no-rj",
  },
  {
    id: 6,
    title: "Adobe LiveCycle Consultant",
    company: "Various Organizations",
    period: "2010 - 2014",
    location: "Multiple Locations",
    desc: "Consulted for CIT/Genesys10, CGI, Meritiv Financial, and State Farm Insurance on Adobe LiveCycle implementations.",
    skills: ["Adobe LiveCycle", "Consulting", "Enterprise Systems"],
    className: "md:col-span-2",
    thumbnail: "https://cdn-icons-png.flaticon.com/512/1651/1651105.png",
  },
] as const;

export const socialMedia = [
  {
    name: "GitHub",
    img: "/git.svg",
    link: "https://github.com/naveen-vanam",
  },
  {
    name: "Twitter",
    img: "/twit.svg",
    link: "https://naveen.twitter.com",
  },
  {
    name: "LinkedIn",
    img: "/link.svg",
    link: "https://www.linkedin.com/in/nvanam",
  },
] as const;

export const techStack = {
  stack1: ["React.js", "Gen AI", "ML"],
  stack2: ["DL", "AI Agents", "MongoDB"],
} as const;
