import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Blog } from '../../types';
import { CategoryBadge, StatusBadge } from '../common/Badge';
import { formatDate } from '../../utils/formatDate';
import { Eye, Edit3, Trash2, Globe, FileText, Search, ExternalLink } from 'lucide-react';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { EmptyState } from '../common/EmptyState';

interface MyBlogsTableProps {
  blogs: Blog[];
  onDelete: (id: string) => void;
  onTogglePublish: (id: string) => void;
}

export const MyBlogsTable: React.FC<MyBlogsTableProps> = ({
  blogs,
  onDelete,
  onTogglePublish,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);

  const filteredBlogs = blogs.filter((blog) => {
    const matchesStatus =
      filterStatus === 'all' || blog.status === filterStatus;
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const confirmDelete = () => {
    if (blogToDelete) {
      onDelete(blogToDelete.id);
      setBlogToDelete(null);
    }
  };

  const publishedCount = blogs.filter((b) => b.status === 'published').length;
  const draftCount = blogs.filter((b) => b.status === 'draft').length;

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterStatus === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({blogs.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('published')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterStatus === 'published'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Published ({publishedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('draft')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterStatus === 'draft'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Drafts ({draftCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your stories..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {filteredBlogs.length === 0 ? (
        <EmptyState
          title={
            blogs.length === 0
              ? "You haven't written any stories yet"
              : 'No matching stories found'
          }
          description={
            blogs.length === 0
              ? 'Share your first story with the world today. Your insights matter.'
              : 'Try clearing your search query or changing the status filter.'
          }
          actionText={blogs.length === 0 ? '+ Write Your First Story' : undefined}
          onAction={
            blogs.length === 0
              ? () => (window.location.href = '/create-blog')
              : undefined
          }
        />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Story</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Views</th>
                  <th className="py-3.5 px-4 text-right">Likes</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={blog.featuredImage}
                          alt={blog.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 bg-slate-100 shadow-xs"
                        />
                        <div className="min-w-0 max-w-md">
                          <Link
                            to={`/blog/${blog.id}`}
                            className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 flex items-center gap-1.5"
                          >
                            {blog.title}
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                          </Link>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {blog.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <CategoryBadge category={blog.category} />
                    </td>

                    <td className="py-4 px-4">
                      <StatusBadge status={blog.status} />
                    </td>

                    <td className="py-4 px-4 text-right font-mono text-xs font-semibold text-slate-700">
                      {blog.views.toLocaleString()}
                    </td>

                    <td className="py-4 px-4 text-right font-mono text-xs font-semibold text-slate-700">
                      {blog.likes.toLocaleString()}
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-500 whitespace-nowrap">
                      {formatDate(blog.createdAt)}
                    </td>

                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link to={`/blog/${blog.id}`}>
                          <button
                            type="button"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="View Story"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>

                        <Link to={`/edit-blog/${blog.id}`}>
                          <button
                            type="button"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Edit Story"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </Link>

                        <button
                          type="button"
                          onClick={() => onTogglePublish(blog.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title={blog.status === 'published' ? 'Switch to Draft' : 'Publish Story'}
                        >
                          {blog.status === 'published' ? (
                            <FileText className="w-4 h-4" />
                          ) : (
                            <Globe className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setBlogToDelete(blog)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Story"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile / Tablet Stacked Cards */}
          <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-100"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CategoryBadge category={blog.category} size="sm" />
                      <StatusBadge status={blog.status} size="sm" />
                    </div>
                    <Link
                      to={`/blog/${blog.id}`}
                      className="text-sm font-bold text-slate-900 line-clamp-2 hover:text-indigo-600"
                    >
                      {blog.title}
                    </Link>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-3 font-mono">
                    <span>👁 {blog.views}</span>
                    <span>❤️ {blog.likes}</span>
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Link to={`/edit-blog/${blog.id}`}>
                      <button
                        type="button"
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </Link>

                    <button
                      type="button"
                      onClick={() => onTogglePublish(blog.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                      title={blog.status === 'published' ? 'Switch to Draft' : 'Publish'}
                    >
                      <Globe className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setBlogToDelete(blog)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmModal
        isOpen={!!blogToDelete}
        onClose={() => setBlogToDelete(null)}
        onConfirm={confirmDelete}
        blogTitle={blogToDelete?.title}
      />
    </div>
  );
};
