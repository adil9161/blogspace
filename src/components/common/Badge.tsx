import React from 'react';
import type { BlogCategory } from '../../types';

interface CategoryBadgeProps {
  category: BlogCategory | string;
  size?: 'sm' | 'md';
  onClick?: () => void;
  className?: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  size = 'sm',
  onClick,
  className = '',
}) => {
  const categoryStyles: Record<string, string> = {
    Technology: 'bg-blue-50 text-blue-700 border-blue-200/80 hover:bg-blue-100',
    AI: 'bg-purple-50 text-purple-700 border-purple-200/80 hover:bg-purple-100',
    Programming: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100',
    Design: 'bg-rose-50 text-rose-700 border-rose-200/80 hover:bg-rose-100',
    Career: 'bg-amber-50 text-amber-800 border-amber-200/80 hover:bg-amber-100',
    Lifestyle: 'bg-teal-50 text-teal-700 border-teal-200/80 hover:bg-teal-100',
  };

  const style = categoryStyles[category] || 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200';
  const sizeStyle = size === 'sm' ? 'text-[11px] px-2.5 py-0.5 font-semibold' : 'text-xs px-3 py-1 font-semibold';

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center rounded-full border transition-all duration-150 ${sizeStyle} ${style} ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      } ${className}`}
    >
      {category}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: 'published' | 'draft'; size?: 'sm' | 'md' }> = ({
  status,
  size = 'sm',
}) => {
  const isPublished = status === 'published';
  const sizeStyle = size === 'sm' ? 'text-[11px] px-2.5 py-0.5' : 'text-xs px-3 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${sizeStyle} ${
        isPublished
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
          : 'bg-amber-50 text-amber-700 border-amber-200/80'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-500' : 'bg-amber-500'}`}
      />
      {isPublished ? 'Published' : 'Draft'}
    </span>
  );
};
