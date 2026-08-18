import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Eye, 
  Image as ImageIcon, 
  X, 
  Send, 
  Save, 
  ArrowLeft 
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useBlogs } from '../hooks/useBlogs';
import { useToast } from '../hooks/useToast';
import { RichTextEditor } from '../components/blog/RichTextEditor';
import { BlogPreviewModal } from '../components/blog/BlogPreviewModal';
import { Button } from '../components/common/Button';
import type { BlogCategory } from '../types';

const PRESET_IMAGES = [
  {
    name: 'Abstract Purple Wave',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Modern Code Editor',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Minimal Workspace',
    url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Creative Design Studio',
    url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Team Collaboration',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'Global Cloud Network',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
  },
];

export const CreateBlogPage: React.FC = () => {
  const { user } = useAuth();
  const { createBlog } = useBlogs();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<BlogCategory>('Technology');
  const [tags, setTags] = useState<string[]>(['Tech']);
  const [tagInput, setTagInput] = useState('');
  const [featuredImage, setFeaturedImage] = useState(PRESET_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [content, setContent] = useState(
    '<h2>Introduction</h2><p>Write an engaging opening that hooks your readers and outlines the key takeaways...</p>'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [formErrors, setFormErrors] = useState<{ title?: string; description?: string }>({});

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

  const handleSave = async (status: 'published' | 'draft') => {
    const errors: typeof formErrors = {};

    if (!title.trim()) {
      errors.title = 'Title is required.';
    }

    if (!description.trim()) {
      errors.description = 'Short description is required for card previews.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      error('Please complete all required fields.');
      return;
    }

    if (!content.trim() || content === '<p></p>') {
      error('Article content cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = createBlog({
        title,
        description,
        content,
        featuredImage: customImageUrl.trim() || featuredImage,
        category,
        tags,
        status,
      });

      if (status === 'published') {
        success('Story published successfully!');
        navigate(`/blog/${created.id}`);
      } else {
        success('Story saved as a draft.');
        navigate('/dashboard?tab=blogs');
      }
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Failed to save story.');
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
              Create New Story
            </h1>
            <p className="text-xs text-slate-500">Draft, format, and share your perspective.</p>
          </div>
        </div>

        {/* Header Action Controls */}
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
            Publish Story
          </Button>
        </div>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Main Editor Area */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Story Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a compelling title..."
              className="w-full text-xl sm:text-2xl font-bold text-slate-950 bg-white border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs placeholder:text-slate-300"
            />
            {formErrors.title && (
              <p className="text-xs text-rose-600 font-medium">{formErrors.title}</p>
            )}
          </div>

          {/* Short Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Short Summary / Excerpt <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A 1-2 sentence preview that appears on social previews and cards..."
              className="w-full text-sm text-slate-800 bg-white border border-slate-200 rounded-2xl p-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs resize-none placeholder:text-slate-400"
            />
            {formErrors.description && (
              <p className="text-xs text-rose-600 font-medium">{formErrors.description}</p>
            )}
          </div>

          {/* Rich Text Editor */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Article Content <span className="text-rose-500">*</span>
            </label>
            <RichTextEditor content={content} onChange={setContent} />
          </div>
        </div>

        {/* Right / Metadata Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Category & Tags Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Category & Topics
            </h3>

            {/* Category Select */}
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

            {/* Tags Manager */}
            <div className="space-y-2">
              <label className="text-xs text-slate-500 font-medium">Tags (up to 8)</label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Add tag and press Enter"
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

          {/* Featured Image Picker Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-indigo-600" />
              Featured Cover Image
            </h3>

            {/* Image Preview */}
            <div className="rounded-xl overflow-hidden h-36 bg-slate-100 relative border border-slate-200">
              <img
                src={customImageUrl || featuredImage}
                alt="Cover Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = PRESET_IMAGES[0].url;
                }}
              />
              <span className="absolute bottom-2 left-2 text-[10px] font-semibold bg-slate-900/70 text-white px-2 py-0.5 rounded-md backdrop-blur-xs">
                Cover Preview
              </span>
            </div>

            {/* Preset Picker */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 font-medium">Choose from curated presets:</label>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_IMAGES.map((p) => {
                  const isSelected = (customImageUrl || featuredImage) === p.url;
                  return (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => {
                        setFeaturedImage(p.url);
                        setCustomImageUrl('');
                      }}
                      className={`h-12 rounded-lg overflow-hidden border-2 transition-all ${
                        isSelected
                          ? 'border-indigo-600 ring-2 ring-indigo-500/20'
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom URL Input */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="text-xs text-slate-500 font-medium">Or paste an Image URL:</label>
              <input
                type="url"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
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
        featuredImage={customImageUrl || featuredImage}
        content={content}
        author={user}
      />
    </div>
  );
};
