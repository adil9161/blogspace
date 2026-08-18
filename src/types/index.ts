export type BlogCategory = 
  | 'Technology'
  | 'AI'
  | 'Programming'
  | 'Design'
  | 'Career'
  | 'Lifestyle';

export interface Author {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  role?: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string; // HTML / Rich Text
  featuredImage: string;
  category: BlogCategory;
  tags: string[];
  authorId: string;
  author: Author;
  status: 'published' | 'draft';
  views: number;
  likes: number;
  readingTime: number; // in minutes
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio?: string;
  role?: 'author' | 'reader' | 'admin';
  createdAt: string;
  followersCount?: number;
  followingCount?: number;
}

export interface Comment {
  id: string;
  blogId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  likesCount?: number;
  parentId?: string | null;
}

export interface Bookmark {
  id: string;
  userId: string;
  blogId: string;
  createdAt: string;
}

export interface Like {
  id: string;
  userId: string;
  blogId: string;
  createdAt: string;
}

export type SortOption = 
  | 'newest'
  | 'popular'
  | 'likes'
  | 'shortest'
  | 'longest';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

export interface FilterState {
  searchQuery: string;
  category: string; // 'All' or specific category
  selectedTags: string[];
  sortBy: SortOption;
}
