export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  homeImageUrl: string;
  link: string;
  slug: string;
};

export interface ProjectsProps {
  projects: readonly Project[];
};

export interface ProjectDetail extends Project {
  content: string;
  externalLink?: string;
  technologies: string[];
  date: string;
}

