import type { Blog, FilterState, User } from '../types';
import { MOCK_BLOGS } from '../data/mockBlogs';
import { StorageService, STORAGE_KEYS } from './storageService';
import { calculateReadingTime } from '../utils/readingTime';
import { slugify } from '../utils/slugify';

export class BlogService {
  static getBlogs(): Blog[] {
    const blogs = StorageService.getItem<Blog[]>(STORAGE_KEYS.BLOGS, []);
    if (blogs.length === 0) {
      StorageService.setItem(STORAGE_KEYS.BLOGS, MOCK_BLOGS);
      return MOCK_BLOGS;
    }
    return blogs;
  }

  static getPublishedBlogs(): Blog[] {
    return this.getBlogs().filter((b) => b.status === 'published');
  }

  static getBlogById(id: string): Blog | null {
    const blogs = this.getBlogs();
    return blogs.find((b) => b.id === id || b.slug === id) || null;
  }

  static createBlog(
    params: {
      title: string;
      description: string;
      content: string;
      featuredImage: string;
      category: Blog['category'];
      tags: string[];
      status: 'published' | 'draft';
    },
    currentUser: User
  ): Blog {
    const blogs = this.getBlogs();
    const readingTime = calculateReadingTime(params.content);
    const now = new Date().toISOString();
    const slug = `${slugify(params.title)}-${Date.now().toString().slice(-4)}`;

    const newBlog: Blog = {
      id: `blog-${Date.now()}`,
      title: params.title.trim(),
      slug,
      description: params.description.trim(),
      content: params.content,
      featuredImage: params.featuredImage.trim() || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80',
      category: params.category,
      tags: params.tags.length > 0 ? params.tags : ['Article'],
      authorId: currentUser.id,
      author: {
        id: currentUser.id,
        name: currentUser.name,
        username: currentUser.username,
        avatar: currentUser.avatar,
        bio: currentUser.bio,
      },
      status: params.status,
      views: 0,
      likes: 0,
      readingTime,
      createdAt: now,
      updatedAt: now,
      featured: false,
    };

    const updatedBlogs = [newBlog, ...blogs];
    StorageService.setItem(STORAGE_KEYS.BLOGS, updatedBlogs);
    return newBlog;
  }

  static updateBlog(
    id: string,
    params: Partial<Omit<Blog, 'id' | 'authorId' | 'author' | 'createdAt'>>,
    currentUserId: string
  ): Blog | null {
    const blogs = this.getBlogs();
    const targetIndex = blogs.findIndex((b) => b.id === id);

    if (targetIndex === -1) return null;

    const existingBlog = blogs[targetIndex];
    if (existingBlog.authorId !== currentUserId) {
      throw new Error('Unauthorized: You do not have permission to edit this article.');
    }

    const content = params.content ?? existingBlog.content;
    const readingTime = params.content ? calculateReadingTime(content) : existingBlog.readingTime;

    const updatedBlog: Blog = {
      ...existingBlog,
      ...params,
      readingTime,
      updatedAt: new Date().toISOString(),
    };

    blogs[targetIndex] = updatedBlog;
    StorageService.setItem(STORAGE_KEYS.BLOGS, blogs);
    return updatedBlog;
  }

  static deleteBlog(id: string, currentUserId: string): boolean {
    const blogs = this.getBlogs();
    const targetBlog = blogs.find((b) => b.id === id);

    if (!targetBlog) return false;
    if (targetBlog.authorId !== currentUserId) {
      throw new Error('Unauthorized: You do not have permission to delete this article.');
    }

    const filtered = blogs.filter((b) => b.id !== id);
    StorageService.setItem(STORAGE_KEYS.BLOGS, filtered);
    return true;
  }

  static togglePublish(id: string, currentUserId: string): Blog | null {
    const blog = this.getBlogById(id);
    if (!blog) return null;
    if (blog.authorId !== currentUserId) {
      throw new Error('Unauthorized: You cannot change publication status of another author’s post.');
    }

    const newStatus = blog.status === 'published' ? 'draft' : 'published';
    return this.updateBlog(id, { status: newStatus }, currentUserId);
  }

  static incrementViews(id: string): void {
    const viewedKey = `viewed_${id}`;
    if (sessionStorage.getItem(viewedKey)) return;

    const blogs = this.getBlogs();
    const target = blogs.find((b) => b.id === id);
    if (target) {
      target.views += 1;
      StorageService.setItem(STORAGE_KEYS.BLOGS, blogs);
      sessionStorage.setItem(viewedKey, 'true');
    }
  }

  static getLikedBlogIds(userId: string): string[] {
    const likesMap = StorageService.getItem<Record<string, string[]>>(STORAGE_KEYS.LIKES, {
      'user-1': ['blog-1', 'blog-3', 'blog-4', 'blog-6'],
    });
    return likesMap[userId] || [];
  }

  static isBlogLiked(blogId: string, userId: string): boolean {
    if (!userId) return false;
    const likedIds = this.getLikedBlogIds(userId);
    return likedIds.includes(blogId);
  }

  static toggleLike(blogId: string, userId: string): { isLiked: boolean; newLikesCount: number } {
    const likesMap = StorageService.getItem<Record<string, string[]>>(STORAGE_KEYS.LIKES, {
      'user-1': ['blog-1', 'blog-3', 'blog-4', 'blog-6'],
    });
    const userLikes = likesMap[userId] || [];
    const isLiked = userLikes.includes(blogId);

    const blogs = this.getBlogs();
    const blog = blogs.find((b) => b.id === blogId);
    let newLikesCount = blog ? blog.likes : 0;

    let updatedUserLikes: string[];
    if (isLiked) {
      updatedUserLikes = userLikes.filter((id) => id !== blogId);
      newLikesCount = Math.max(0, newLikesCount - 1);
    } else {
      updatedUserLikes = [...userLikes, blogId];
      newLikesCount += 1;
    }

    likesMap[userId] = updatedUserLikes;
    StorageService.setItem(STORAGE_KEYS.LIKES, likesMap);

    if (blog) {
      blog.likes = newLikesCount;
      StorageService.setItem(STORAGE_KEYS.BLOGS, blogs);
    }

    return {
      isLiked: !isLiked,
      newLikesCount,
    };
  }

  static searchAndFilter(
    blogs: Blog[],
    filters: FilterState
  ): Blog[] {
    let result = [...blogs];

    // Filter by category
    if (filters.category && filters.category !== 'All') {
      result = result.filter((b) => b.category.toLowerCase() === filters.category.toLowerCase());
    }

    // Filter by tags
    if (filters.selectedTags && filters.selectedTags.length > 0) {
      result = result.filter((b) =>
        filters.selectedTags.some((tag) =>
          b.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
        )
      );
    }

    // Filter by search query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.trim().toLowerCase();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.author.name.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase() === tagSearch(q, t))
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'popular':
          return b.views - a.views;
        case 'likes':
          return b.likes - a.likes;
        case 'shortest':
          return a.readingTime - b.readingTime;
        case 'longest':
          return b.readingTime - a.readingTime;
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }

  static getRelatedBlogs(currentBlog: Blog, limit = 3): Blog[] {
    const published = this.getPublishedBlogs().filter((b) => b.id !== currentBlog.id);
    
    const scored = published.map((blog) => {
      let score = 0;
      if (blog.category === currentBlog.category) score += 3;
      const commonTags = blog.tags.filter((t) => currentBlog.tags.includes(t)).length;
      score += commonTags * 2;
      return { blog, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((s) => s.blog);
  }
}

function tagSearch(query: string, tag: string): string {
  return tag.toLowerCase().includes(query) ? tag : '';
}
