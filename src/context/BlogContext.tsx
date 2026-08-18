import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Blog, Comment } from '../types';
import { BlogService } from '../services/blogService';
import { CommentService } from '../services/commentService';
import { BookmarkService } from '../services/bookmarkService';
import { useAuth } from './AuthContext';

interface BlogContextType {
  blogs: Blog[];
  publishedBlogs: Blog[];
  isLoading: boolean;
  getBlogById: (id: string) => Blog | null;
  getBlogBySlug: (slug: string) => Blog | null;
  createBlog: (data: {
    title: string;
    description: string;
    content: string;
    featuredImage: string;
    category: Blog['category'];
    tags: string[];
    status: 'published' | 'draft';
  }) => Blog;
  updateBlog: (
    id: string,
    data: Partial<Omit<Blog, 'id' | 'authorId' | 'author' | 'createdAt'>>
  ) => Blog | null;
  deleteBlog: (id: string) => boolean;
  togglePublish: (id: string) => Blog | null;
  incrementViews: (id: string) => void;
  likeBlog: (id: string) => { isLiked: boolean; newLikesCount: number };
  isLiked: (id: string) => boolean;
  bookmarkBlog: (id: string) => boolean;
  isBookmarked: (id: string) => boolean;
  getBookmarkedBlogs: () => Blog[];
  getLikedBlogs: () => Blog[];
  getUserBlogs: (userId?: string) => Blog[];
  getBlogComments: (blogId: string) => Comment[];
  addComment: (blogId: string, content: string, parentId?: string | null) => Comment;
  deleteComment: (commentId: string) => boolean;
  getRelatedBlogs: (blog: Blog, limit?: number) => Blog[];
  refreshBlogs: () => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [bookmarkIds, setBookmarkIds] = useState<string[]>([]);
  const [likedBlogIds, setLikedBlogIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = useCallback(() => {
    const loadedBlogs = BlogService.getBlogs();
    setBlogs(loadedBlogs);

    const loadedComments = CommentService.getComments();
    setComments(loadedComments);

    if (user) {
      setBookmarkIds(BookmarkService.getUserBookmarks(user.id));
      setLikedBlogIds(BlogService.getLikedBlogIds(user.id));
    } else {
      setBookmarkIds([]);
      setLikedBlogIds([]);
    }
  }, [user]);

  useEffect(() => {
    loadData();
    setIsLoading(false);
  }, [loadData]);

  const publishedBlogs = blogs.filter((b) => b.status === 'published');

  const getBlogById = useCallback(
    (id: string): Blog | null => {
      return blogs.find((b) => b.id === id || b.slug === id) || null;
    },
    [blogs]
  );

  const getBlogBySlug = useCallback(
    (slug: string): Blog | null => {
      return blogs.find((b) => b.slug === slug || b.id === slug) || null;
    },
    [blogs]
  );

  const createBlog = useCallback(
    (data: {
      title: string;
      description: string;
      content: string;
      featuredImage: string;
      category: Blog['category'];
      tags: string[];
      status: 'published' | 'draft';
    }): Blog => {
      if (!user) throw new Error('You must be logged in to create a story.');
      const newBlog = BlogService.createBlog(data, user);
      setBlogs((prev) => [newBlog, ...prev]);
      return newBlog;
    },
    [user]
  );

  const updateBlog = useCallback(
    (
      id: string,
      data: Partial<Omit<Blog, 'id' | 'authorId' | 'author' | 'createdAt'>>
    ): Blog | null => {
      if (!user) throw new Error('You must be logged in to edit a story.');
      const updated = BlogService.updateBlog(id, data, user.id);
      if (updated) {
        setBlogs((prev) => prev.map((b) => (b.id === id ? updated : b)));
      }
      return updated;
    },
    [user]
  );

  const deleteBlog = useCallback(
    (id: string): boolean => {
      if (!user) throw new Error('You must be logged in to delete a story.');
      const success = BlogService.deleteBlog(id, user.id);
      if (success) {
        setBlogs((prev) => prev.filter((b) => b.id !== id));
      }
      return success;
    },
    [user]
  );

  const togglePublish = useCallback(
    (id: string): Blog | null => {
      if (!user) throw new Error('You must be logged in to update publication status.');
      const updated = BlogService.togglePublish(id, user.id);
      if (updated) {
        setBlogs((prev) => prev.map((b) => (b.id === id ? updated : b)));
      }
      return updated;
    },
    [user]
  );

  const incrementViews = useCallback((id: string) => {
    BlogService.incrementViews(id);
    setBlogs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, views: b.views + 1 } : b))
    );
  }, []);

  const likeBlog = useCallback(
    (id: string) => {
      if (!user) {
        throw new Error('Please login to like this article.');
      }
      const result = BlogService.toggleLike(id, user.id);
      setLikedBlogIds((prev) =>
        result.isLiked ? [...prev, id] : prev.filter((item) => item !== id)
      );
      setBlogs((prev) =>
        prev.map((b) => (b.id === id ? { ...b, likes: result.newLikesCount } : b))
      );
      return result;
    },
    [user]
  );

  const isLiked = useCallback(
    (id: string): boolean => {
      return likedBlogIds.includes(id);
    },
    [likedBlogIds]
  );

  const bookmarkBlog = useCallback(
    (id: string): boolean => {
      if (!user) {
        throw new Error('Please login to save articles to your bookmarks.');
      }
      const isSaved = BookmarkService.toggleBookmark(id, user.id);
      setBookmarkIds((prev) =>
        isSaved ? [...prev, id] : prev.filter((item) => item !== id)
      );
      return isSaved;
    },
    [user]
  );

  const isBookmarked = useCallback(
    (id: string): boolean => {
      return bookmarkIds.includes(id);
    },
    [bookmarkIds]
  );

  const getBookmarkedBlogs = useCallback((): Blog[] => {
    return blogs.filter((b) => bookmarkIds.includes(b.id));
  }, [blogs, bookmarkIds]);

  const getLikedBlogs = useCallback((): Blog[] => {
    return blogs.filter((b) => likedBlogIds.includes(b.id));
  }, [blogs, likedBlogIds]);

  const getUserBlogs = useCallback(
    (targetUserId?: string): Blog[] => {
      const uId = targetUserId || user?.id;
      if (!uId) return [];
      return blogs.filter((b) => b.authorId === uId);
    },
    [blogs, user]
  );

  const getBlogComments = useCallback(
    (blogId: string): Comment[] => {
      return comments
        .filter((c) => c.blogId === blogId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    [comments]
  );

  const addComment = useCallback(
    (blogId: string, content: string, parentId?: string | null): Comment => {
      if (!user) throw new Error('Please login to leave a comment.');
      const newComm = CommentService.addComment(blogId, content, user, parentId);
      setComments((prev) => [newComm, ...prev]);
      return newComm;
    },
    [user]
  );

  const deleteComment = useCallback(
    (commentId: string): boolean => {
      if (!user) throw new Error('Unauthorized');
      const success = CommentService.deleteComment(commentId, user.id);
      if (success) {
        setComments((prev) => prev.filter((c) => c.id !== commentId && c.parentId !== commentId));
      }
      return success;
    },
    [user]
  );

  const getRelatedBlogs = useCallback(
    (blog: Blog, limit = 3): Blog[] => {
      return BlogService.getRelatedBlogs(blog, limit);
    },
    []
  );

  return (
    <BlogContext.Provider
      value={{
        blogs,
        publishedBlogs,
        isLoading,
        getBlogById,
        getBlogBySlug,
        createBlog,
        updateBlog,
        deleteBlog,
        togglePublish,
        incrementViews,
        likeBlog,
        isLiked,
        bookmarkBlog,
        isBookmarked,
        getBookmarkedBlogs,
        getLikedBlogs,
        getUserBlogs,
        getBlogComments,
        addComment,
        deleteComment,
        getRelatedBlogs,
        refreshBlogs: loadData,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export function useBlogs(): BlogContextType {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlogs must be used within a BlogProvider');
  }
  return context;
}
