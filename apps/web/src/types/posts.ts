export interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  slug: string;
  date: string;
};

export interface PostsProps {
  projects: readonly Post[];
};

export interface PostDetails extends Post {
  content: string;
  externalLink?: string;
  tags: string[];
}

