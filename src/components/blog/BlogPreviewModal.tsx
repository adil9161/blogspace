import React from 'react';
import { Modal } from '../common/Modal';
import { CategoryBadge } from '../common/Badge';
import { Avatar } from '../common/Avatar';
import { sanitizeHtml } from '../../utils/sanitizeHtml';
import { calculateReadingTime } from '../../utils/readingTime';
import { Clock, Calendar } from 'lucide-react';
import type { User } from '../../types';

interface BlogPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  category: string;
  tags: string[];
  featuredImage: string;
  content: string;
  author: User | null;
}

export const BlogPreviewModal: React.FC<BlogPreviewModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  category,
  tags,
  featuredImage,
  content,
  author,
}) => {
  const readingTime = calculateReadingTime(content);
  const sanitized = sanitizeHtml(content);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Live Article Preview"
      maxWidth="2xl"
    >
      <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
        {/* Category & Stats */}
        <div className="flex flex-wrap items-center gap-3">
          <CategoryBadge category={category} />
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {readingTime} min read
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Today (Draft)
          </span>
        </div>

        {/* Title & Description */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight mb-3">
            {title || 'Untitled Article'}
          </h1>
          {description && (
            <p className="text-base text-slate-600 leading-relaxed italic">
              {description}
            </p>
          )}
        </div>

        {/* Author Card */}
        {author && (
          <div className="flex items-center gap-3 py-3 border-y border-slate-100">
            <Avatar src={author.avatar} name={author.name} size="md" />
            <div>
              <p className="text-sm font-bold text-slate-900">{author.name}</p>
              <p className="text-xs text-slate-500">@{author.username}</p>
            </div>
          </div>
        )}

        {/* Featured Image */}
        {featuredImage && (
          <div className="rounded-2xl overflow-hidden max-h-[380px] bg-slate-100">
            <img
              src={featuredImage}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Article Body */}
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: sanitized }}
        />

        {/* Tags */}
        {tags.length > 0 && (
          <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};
