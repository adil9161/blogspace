import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Eye, 
  Image as ImageIcon, 
  X, 
  Send, 
  Save, 
  ArrowLeft, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useBlogs } from '../hooks/useBlogs';
import { useToast } from '../hooks/useToast';
import { RichTextEditor } from '../components/blog/RichTextEditor';
import { BlogPreviewModal } from '../components/blog/BlogPreviewModal';
import { Button } from '../components/common/Button';
import type { BlogCategory } from '../types';

export const EditBlogPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { getBlogById, updateBlog } = useBlogs();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const blog = id ? getBlogById(id) : null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<BlogCategory>('Technology');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('draft');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [formErrors, setFormErrors] = useState<{ title?: string; description?: string }>({});

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setDescription(blog.description);
      setCategory(blog.category);
      setTags(blog.tags || []);
      setFeaturedImage(blog.featuredImage);
      setContent(blog.content);
      setStatus(blog.status);
    }
  }, [blog]);

  if (!blog) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Story Not Found</h2>
        <p className="text-xs text-slate-500">The story you are trying to edit does not exist or has been removed.</p>
        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  // Check authorization
  if (user && blog.authorId !== user.id) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Access Denied</h2>
        <p className="text-xs text-slate-500">You do not have permission to edit another author's story.</p>
        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const cleanTag = tagInput.trim().replace(/^#/, '');
    if (cleanTag && !tags.includes(cleanTag) && tags.length < 8) {
      setTags([...tags, cleanTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSave = async (targetStatus?: 'published' | 'draft') => {
    const finalStatus = targetStatus || status;
    const errors: typeof formErrors = {};

    if (!title.trim()) errors.title = 'Title is required.';
    if (!description.trim()) errors.description = 'Short description is required.';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      error('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = updateBlog(blog.id, {
        title,
        description,
        content,
        featuredImage,
        category,
        tags,
        status: finalStatus,
      });

      if (updated) {
        success(finalStatus === 'published' ? 'Story updated and published!' : 'Draft saved successfully.');
        navigate(`/blog/${updated.id}`);
      }
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Failed to update story.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
              Edit Story
            </h1>
            <p className="text-xs text-slate-500">Update your content, tags, and publication state.</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowPreviewModal(true)}
            leftIcon={<Eye className="w-4 h-4 text-slate-500" />}
          >
            Live Preview
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => handleSave('draft')}
            disabled={isSubmitting}
            leftIcon={<Save className="w-4 h-4 text-amber-600" />}
          >
            Save Draft
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => handleSave('published')}
            isLoading={isSubmitting}
            leftIcon={<Send className="w-4 h-4" />}
            className="font-bold shadow-md shadow-indigo-500/20"
          >
            Update & Publish
          </Button>
        </div>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Main Editor */}
        <div className="lg:col-span-8 space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Story Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xl sm:text-2xl font-bold text-slate-950 bg-white border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
            />
            {formErrors.title && (
              <p className="text-xs text-rose-600 font-medium">{formErrors.title}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Short Summary / Excerpt <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-2xl p-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs resize-none"
            />
            {formErrors.description && (
              <p className="text-xs text-rose-600 font-medium">{formErrors.description}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Article Content <span className="text-rose-500">*</span>
            </label>
            {content && <RichTextEditor content={content} onChange={setContent} />}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Category & Tags Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Category & Topics
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BlogCategory)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Technology">Technology</option>
                <option value="AI">Artificial Intelligence</option>
                <option value="Programming">Programming</option>
                <option value="Design">Product Design</option>
                <option value="Career">Career & Leadership</option>
                <option value="Lifestyle">Lifestyle & Productivity</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-500 font-medium">Tags</label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Add tag"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Button type="button" variant="secondary" size="sm" onClick={handleAddTag}>
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg font-medium"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-indigo-400 hover:text-indigo-700 ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Image Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-indigo-600" />
              Featured Cover Image
            </h3>

            <div className="rounded-xl overflow-hidden h-36 bg-slate-100 relative border border-slate-200">
              <img src={featuredImage} alt="Cover" className="w-full h-full object-cover" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 font-medium">Image URL:</label>
              <input
                type="url"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview Modal */}
      <BlogPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title={title}
        description={description}
        category={category}
        tags={tags}
        featuredImage={featuredImage}
        content={content}
        author={user}
      />
    </div>
  );
};
