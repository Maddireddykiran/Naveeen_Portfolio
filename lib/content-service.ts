import fs from 'fs';
import path from 'path';

const contentFilePath = path.join(process.cwd(), 'data', 'content.json');

interface Hero {
  professionTitle: string;
  heading: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  image: string;
}

interface Testimonial {
  quote: string;
  name: string;
  title: string;
}

interface ExpertiseItem {
  icon: string;
  title: string;
  description: string;
}

interface About {
  mainText: string;
  profileImage: string;
  jobTitle: string;
  closingText: string;
  expertiseItems: ExpertiseItem[];
}

interface Project {
  id: number;
  title: string;
  des: string;
  img: string;
  iconLists: string[];
  link: string;
  sourceCode: string;
}

interface ContentData {
  hero: Hero;
  about: About;
  testimonials: Testimonial[];
  projects: Project[];
  experience: any[];
  socialMedia: any[];
  techStack: {
    stack1: any[];
    stack2: any[];
  };
  gridItems: any[];
}

// Read the full content data
export async function getContentData(): Promise<ContentData> {
  try {
    const data = await fs.promises.readFile(contentFilePath, 'utf8');
    return JSON.parse(data) as ContentData;
  } catch (error) {
    console.error('Error reading content data:', error);
    throw new Error('Failed to read content data');
  }
}

// Update the content file with new data
export async function updateContentData(newData: ContentData): Promise<void> {
  try {
    await fs.promises.writeFile(
      contentFilePath,
      JSON.stringify(newData, null, 2),
      'utf8'
    );
  } catch (error) {
    console.error('Error updating content data:', error);
    throw new Error('Failed to update content data');
  }
}

// Get hero section
export async function getHero(): Promise<Hero> {
  const data = await getContentData();
  return data.hero;
}

// Update hero section
export async function updateHero(hero: Hero): Promise<void> {
  const data = await getContentData();
  data.hero = hero;
  await updateContentData(data);
}

// Get about section
export async function getAbout(): Promise<About> {
  const data = await getContentData();
  return data.about || {
    mainText: '',
    profileImage: '',
    jobTitle: '',
    closingText: '',
    expertiseItems: []
  };
}

// Update about section
export async function updateAbout(about: About): Promise<void> {
  const data = await getContentData();
  data.about = about;
  await updateContentData(data);
}

// Get all testimonials
export async function getTestimonials(): Promise<Testimonial[]> {
  const data = await getContentData();
  return data.testimonials;
}

// Update testimonials
export async function updateTestimonials(testimonials: Testimonial[]): Promise<void> {
  const data = await getContentData();
  data.testimonials = testimonials;
  await updateContentData(data);
}

// Get all projects
export async function getProjects(): Promise<Project[]> {
  const data = await getContentData();
  return data.projects;
}

// Update projects
export async function updateProjects(projects: Project[]): Promise<void> {
  const data = await getContentData();
  data.projects = projects;
  await updateContentData(data);
} 