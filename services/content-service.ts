import fs from 'fs';
import path from 'path';

// Path to content.json
const contentFilePath = path.join(process.cwd(), 'data', 'content.json');

// Interfaces for different content types
export interface Project {
  id: number;
  title: string;
  des: string;
  img: string;
  iconLists: string[];
  link: string;
  sourceCode: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  title: string;
}

export interface GridItem {
  id: string;
  title: string;
  description: string;
  className: string;
  img: string;
}

export interface Hero {
  professionTitle: string;
  heading: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  image: string;
}

export interface Experience {
  id: number;
  title: string;
  company: string;
  period: string;
  location: string;
  desc: string;
  skills: string[];
  thumbnail: string;
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface TechStack {
  categories: SkillCategory[];
  additionalSkills: string[];
}

export interface SocialMedia {
  name: string;
  img: string;
  link: string;
}

export interface ApproachPhase {
  title: string;
  phase: string;
  description: string;
}

export interface FooterCta {
  heading: string;
  subtext: string;
  buttonText: string;
  buttonLink: string;
}

export interface FooterCopyright {
  name: string;
  link: string;
}

export interface Footer {
  cta: FooterCta;
  copyright: FooterCopyright;
}

// Interface for content.json structure
export interface ContentData {
  projects: Project[];
  experience: Experience[];
  testimonials: Testimonial[];
  socialMedia: SocialMedia[];
  techStack: TechStack;
  approach: ApproachPhase[];
  footer: Footer;
  gridItems: GridItem[];
  hero: Hero;
}

// Read content file
const readContentFile = (): ContentData => {
  try {
    const contentFile = fs.readFileSync(contentFilePath, 'utf8');
    return JSON.parse(contentFile);
  } catch (error) {
    console.error('Error reading content file:', error);
    throw error;
  }
};

// Write content file
const writeContentFile = (data: ContentData): void => {
  try {
    fs.writeFileSync(contentFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing to content file:', error);
    throw error;
  }
};

// Get all projects
export const getProjects = (): Project[] => {
  const content = readContentFile();
  return content.projects;
};

// Update a project
export const updateProject = (id: number, updatedProject: Project): void => {
  const content = readContentFile();
  const projectIndex = content.projects.findIndex(project => project.id === id);
  
  if (projectIndex !== -1) {
    content.projects[projectIndex] = updatedProject;
    writeContentFile(content);
  } else {
    throw new Error(`Project with ID ${id} not found`);
  }
};

// Get all testimonials
export const getTestimonials = (): Testimonial[] => {
  const content = readContentFile();
  return content.testimonials;
};

// Update a testimonial
export const updateTestimonial = (index: number, updatedTestimonial: Testimonial): void => {
  const content = readContentFile();
  
  if (index >= 0 && index < content.testimonials.length) {
    content.testimonials[index] = updatedTestimonial;
    writeContentFile(content);
  } else {
    throw new Error(`Testimonial at index ${index} not found`);
  }
};

// Get hero section
export const getHero = (): Hero => {
  const content = readContentFile();
  return content.hero;
};

// Update hero section
export const updateHero = (updatedHero: Hero): void => {
  const content = readContentFile();
  content.hero = updatedHero;
  writeContentFile(content);
};

// Get all experiences
export const getExperiences = (): Experience[] => {
  const content = readContentFile();
  return content.experience;
};

// Add a new experience
export const addExperience = (newExperience: Experience): void => {
  const content = readContentFile();
  
  // Generate a new ID if not provided
  if (!newExperience.id) {
    const maxId = content.experience.reduce(
      (max, exp) => (exp.id > max ? exp.id : max),
      0
    );
    newExperience.id = maxId + 1;
  }
  
  content.experience.push(newExperience);
  writeContentFile(content);
};

// Update an experience
export const updateExperience = (id: number, updatedExperience: Experience): void => {
  const content = readContentFile();
  const experienceIndex = content.experience.findIndex(exp => exp.id === id);
  
  if (experienceIndex !== -1) {
    content.experience[experienceIndex] = updatedExperience;
    writeContentFile(content);
  } else {
    throw new Error(`Experience with ID ${id} not found`);
  }
};

// Get tech stack
export const getTechStack = (): TechStack => {
  const content = readContentFile();
  return content.techStack;
};

// Update tech stack
export const updateTechStack = (updatedTechStack: TechStack): void => {
  const content = readContentFile();
  content.techStack = updatedTechStack;
  writeContentFile(content);
};

// Get social media
export const getSocialMedia = (): SocialMedia[] => {
  const content = readContentFile();
  return content.socialMedia;
};

// Update social media
export const updateSocialMedia = (updatedSocialMedia: SocialMedia[]): void => {
  const content = readContentFile();
  content.socialMedia = updatedSocialMedia;
    writeContentFile(content);
};

// Get approach phases
export const getApproach = (): ApproachPhase[] => {
  const content = readContentFile();
  return content.approach;
};

// Update approach phase
export const updateApproach = (index: number, updatedPhase: ApproachPhase): void => {
  const content = readContentFile();
  
  if (index >= 0 && index < content.approach.length) {
    content.approach[index] = updatedPhase;
    writeContentFile(content);
  } else {
    throw new Error(`Approach phase at index ${index} not found`);
  }
};

// Get footer
export const getFooter = (): Footer => {
  const content = readContentFile();
  
  // Handle legacy format with sourceCodeLink if present
  if ('sourceCodeLink' in content.footer.copyright) {
    const { sourceCodeLink, ...rest } = content.footer.copyright as any;
    return {
      ...content.footer,
      copyright: rest
    };
  }
  
  return content.footer;
};

// Update footer
export const updateFooter = (updatedFooter: Footer): void => {
  const content = readContentFile();
  content.footer = updatedFooter;
  writeContentFile(content);
}; 