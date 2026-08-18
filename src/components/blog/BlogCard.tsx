import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Heart, Bookmark } from 'lucide-react';
import type { Blog } from '../../types';
import { CategoryBadge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { formatDate } from '../../utils/formatDate';
import { useBlogs } from '../../hooks/useBlogs';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

interface BlogCardProps {
  blog: Blog;
  layout?: 'grid' | 'list';
  featured?: boolean;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog, layout = 'grid', featured = false }) => {
  const { likeBlog, isLiked, bookmarkBlog, isBookmarked } = useBlogs();
  const { isAuthenticated } = useAuth();
  const { success, info } = useToast();

  const liked = isLiked(blog.id);
  const saved = isBookmarked(blog.id);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      info('Please log in to like this story.');
      return;
    }
    const res = likeBlog(blog.id);
    if (res.isLiked) {
      success('Added to your liked stories!');
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      info('Please log in to save this story.');
      return;
    }
    const isSaved = bookmarkBlog(blog.id);
    if (isSaved) {
      success('Saved to your bookmarks!');
    } else {
      info('Removed from bookmarks.');
    }
  };

  if (layout === 'list') {
    return (
      <article className="group bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col sm:flex-row gap-5 p-4 sm:p-5">
        {/* Thumbnail */}
        <Link
          to={`/blog/${blog.id}`}
          className="sm:w-56 h-48 sm:h-auto shrink-0 rounded-xl overflow-hidden bg-slate-100 relative block"
        >
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 sm:hidden">
            <CategoryBadge category={blog.category} />
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="hidden sm:flex items-center gap-2 mb-2.5">
              <CategoryBadge category={blog.category} />
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {blog.readingTime} min read
              </span>
            </div>

            <Link to={`/blog/${blog.id}`} className="block group-hover:text-indigo-600 transition-colors">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 line-clamp-2 mb-2 leading-snug">
                {blog.title}
              </h3>
            </Link>

            <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
              {blog.description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2.5">
              <Avatar src={blog.author.avatar} name={blog.author.name} size="sm" />
              <div>
                <p className="text-xs font-semibold text-slate-900">{blog.author.name}</p>
                <p className="text-[11px] text-slate-400">{formatDate(blog.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleLike}
                className={`flex items-center gap-1 text-xs font-medium transition-colors p-1.5 rounded-lg hover:bg-slate-50 ${
                  liked ? 'text-rose-600' : 'text-slate-500 hover:text-rose-600'
                }`}
                title="Like story"
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                <span>{blog.likes}</span>
              </button>

              <button
                type="button"
                onClick={handleBookmark}
                className={`p-1.5 rounded-lg hover:bg-slate-50 transition-colors ${
                  saved ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'
                }`}
                title={saved ? 'Remove Bookmark' : 'Bookmark story'}
              >
                <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`group bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-250 flex flex-col overflow-hidden ${
        featured ? 'ring-1 ring-indigo-500/20' : ''
      }`}
    >
      {/* Cover Image Container */}
      <Link to={`/blog/${blog.id}`} className="relative block h-52 overflow-hidden bg-slate-100">
        <img
          src={blog.featuredImage}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <CategoryBadge category={blog.category} />
        </div>
        <div className="absolute bottom-3 right-3 bg-slate-900/70 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
          <Clock className="w-3 h-3" />
          {blog.readingTime} min
        </div>
      </Link>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/blog/${blog.id}`} className="block group-hover:text-indigo-600 transition-colors">
            <h3 className="text-lg font-bold text-slate-900 line-clamp-2 mb-2 leading-snug tracking-tight">
              {blog.title}
            </h3>
          </Link>
          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {blog.description}
          </p>
        </div>

        {/* Card Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar src={blog.author.avatar} name={blog.author.name} size="sm" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">{blog.author.name}</p>
              <p className="text-[11px] text-slate-400">{formatDate(blog.createdAt)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLike}
              className={`flex items-center gap-1 text-xs font-medium transition-colors p-1.5 rounded-lg hover:bg-slate-50 ${
                liked ? 'text-rose-600' : 'text-slate-400 hover:text-rose-600'
              }`}
              title="Like story"
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              <span>{blog.likes}</span>
            </button>

            <button
              type="button"
              onClick={handleBookmark}
              className={`p-1.5 rounded-lg hover:bg-slate-50 transition-colors ${
                saved ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'
              }`}
              title={saved ? 'Remove Bookmark' : 'Bookmark story'}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
