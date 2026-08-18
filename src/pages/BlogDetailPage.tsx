import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Eye, 
  Heart, 
  Bookmark, 
  Share2, 
  MessageSquare, 
  ArrowLeft, 
  UserPlus,
  Check,
  Edit3
} from 'lucide-react';
import { useBlogs } from '../hooks/useBlogs';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { CategoryBadge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { CommentSection } from '../components/blog/CommentSection';
import { ShareModal } from '../components/blog/ShareModal';
import { BlogCard } from '../components/blog/BlogCard';
import { formatDate } from '../utils/formatDate';
import { sanitizeHtml } from '../utils/sanitizeHtml';

export const BlogDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getBlogById, incrementViews, likeBlog, isLiked, bookmarkBlog, isBookmarked, getRelatedBlogs } = useBlogs();
  const { user, isAuthenticated } = useAuth();
  const { success, info } = useToast();
  const navigate = useNavigate();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const blog = id ? getBlogById(id) : null;

  useEffect(() => {
    if (blog) {
      incrementViews(blog.id);
      window.scrollTo(0, 0);
    }
  }, [id, blog?.id, incrementViews]);

  if (!blog) {
    return (
      <div className="max-w-xl mx-auto my-24 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 font-heading">Story Not Found</h2>
        <p className="text-sm text-slate-500">The article you are looking for might have been moved or removed.</p>
        <Link to="/explore">
          <Button variant="primary" size="md">
            Explore Other Stories
          </Button>
        </Link>
      </div>
    );
  }

  const liked = isLiked(blog.id);
  const saved = isBookmarked(blog.id);
  const relatedBlogs = getRelatedBlogs(blog, 3);
  const isAuthor = user?.id === blog.authorId;

  const handleLike = () => {
    if (!isAuthenticated) {
      info('Please log in to like this story.');
      return;
    }
    const res = likeBlog(blog.id);
    if (res.isLiked) {
      success('Liked! Added to your profile.');
    }
  };

  const handleBookmark = () => {
    if (!isAuthenticated) {
      info('Please log in to bookmark this story.');
      return;
    }
    const isSaved = bookmarkBlog(blog.id);
    if (isSaved) {
      success('Saved to your reading list.');
    } else {
      info('Removed from reading list.');
    }
  };

  const handleFollowToggle = () => {
    if (!isAuthenticated) {
      info('Please log in to follow authors.');
      return;
    }
    setIsFollowing(!isFollowing);
    if (!isFollowing) {
      success(`You are now following ${blog.author.name}!`);
    } else {
      info(`Unfollowed ${blog.author.name}.`);
    }
  };

  const scrollToComments = () => {
    const el = document.getElementById('comments');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <article className="pb-24">
      {/* Top Breadcrumb / Nav Action */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors py-1.5 px-2.5 rounded-lg hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {isAuthor && (
          <Link to={`/edit-blog/${blog.id}`}>
            <Button variant="outline" size="sm" leftIcon={<Edit3 className="w-3.5 h-3.5" />}>
              Edit Story
            </Button>
          </Link>
        )}
      </div>

      {/* Main Article Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Metadata */}
        <header className="space-y-5">
          <div className="flex items-center gap-2">
            <CategoryBadge category={blog.category} size="md" />
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {blog.readingTime} min read
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-[1.18] font-heading">
            {blog.title}
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
            {blog.description}
          </p>

          {/* Author Card & Publish Date */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-5 border-y border-slate-200/80">
            <div className="flex items-center gap-3.5">
              <Avatar src={blog.author.avatar} name={blog.author.name} size="md" showBorder />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{blog.author.name}</span>
                  {!isAuthor && (
                    <button
                      type="button"
                      onClick={handleFollowToggle}
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border transition-all ${
                        isFollowing
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span>@{blog.author.username}</span>
                  <span>•</span>
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4 text-slate-400" />
                {blog.views.toLocaleString()} views
              </span>
            </div>
          </div>
        </header>

        {/* Featured Cover Image */}
        <div className="rounded-3xl overflow-hidden bg-slate-100 max-h-[500px] shadow-sm border border-slate-200/80">
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Sanitized Article Body Content */}
        <main
          className="article-content max-w-3xl mx-auto py-4"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(blog.content) }}
        />

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="max-w-3xl mx-auto pt-6 border-t border-slate-100 flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <Link
                key={tag}
                to={`/explore?tag=${encodeURIComponent(tag)}`}
                className="text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 px-3 py-1 rounded-full font-medium transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Author Bio Footer Section */}
        <div className="max-w-3xl mx-auto p-6 sm:p-8 bg-slate-50/80 rounded-3xl border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <Avatar src={blog.author.avatar} name={blog.author.name} size="lg" />
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Written by {blog.author.name}
              </h3>
              {!isAuthor && (
                <Button
                  variant={isFollowing ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={handleFollowToggle}
                  leftIcon={isFollowing ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <UserPlus className="w-3.5 h-3.5" />}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              )}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {blog.author.bio || 'Author and thought contributor on BlogSpace.'}
            </p>
          </div>
        </div>

        {/* Interactive Comments Section */}
        <div className="max-w-3xl mx-auto">
          <CommentSection blogId={blog.id} />
        </div>
      </div>

      {/* Floating / Sticky Reader Action Bar */}
      <div className="fixed bottom-6 inset-x-0 z-30 flex justify-center pointer-events-none px-4">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl rounded-full px-5 py-2.5 flex items-center gap-4 sm:gap-6 animate-fade-in">
          {/* Like */}
          <button
            type="button"
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-xs font-semibold transition-all hover:scale-105 active:scale-95 ${
              liked ? 'text-rose-600' : 'text-slate-600 hover:text-rose-600'
            }`}
            title="Like this story"
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            <span>{blog.likes}</span>
          </button>

          <div className="w-px h-4 bg-slate-200" />

          {/* Bookmark */}
          <button
            type="button"
            onClick={handleBookmark}
            className={`flex items-center gap-1.5 text-xs font-semibold transition-all hover:scale-105 active:scale-95 ${
              saved ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'
            }`}
            title="Bookmark story"
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
          </button>

          <div className="w-px h-4 bg-slate-200" />

          {/* Comments Shortcut */}
          <button
            type="button"
            onClick={scrollToComments}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
            title="Jump to responses"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Responses</span>
          </button>

          <div className="w-px h-4 bg-slate-200" />

          {/* Share */}
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
            title="Share story"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={blog.title}
        url={window.location.href}
      />

      {/* Related Stories Recommendations */}
      {relatedBlogs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-12 border-t border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Recommended For You
              </span>
              <h2 className="text-2xl font-bold text-slate-900 font-heading">
                More in {blog.category}
              </h2>
            </div>
            <Link
              to={`/explore?category=${blog.category}`}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedBlogs.map((rBlog) => (
              <BlogCard key={rBlog.id} blog={rBlog} layout="grid" />
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
