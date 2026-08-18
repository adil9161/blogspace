import React from 'react';
import type { Blog } from '../../types';
import { BlogCard } from './BlogCard';
import { BlogCardSkeleton } from '../common/LoadingSkeleton';
import { EmptyState } from '../common/EmptyState';

interface BlogGridProps {
  blogs: Blog[];
  isLoading?: boolean;
  layout?: 'grid' | 'list';
  columns?: 2 | 3 | 4;
  emptyTitle?: string;
  emptyDescription?: string;
  onClearFilters?: () => void;
}

export const BlogGrid: React.FC<BlogGridProps> = ({
  blogs,
  isLoading = false,
  layout = 'grid',
  columns = 3,
  emptyTitle = 'No stories found',
  emptyDescription = 'Try adjusting your search terms or category filters to find what you are looking for.',
  onClearFilters,
}) => {
  if (isLoading) {
    return (
      <div
        className={`grid gap-6 ${
          layout === 'list'
            ? 'grid-cols-1'
            : columns === 2
            ? 'grid-cols-1 md:grid-cols-2'
            : columns === 4
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionText={onClearFilters ? 'Reset Filters' : undefined}
        onAction={onClearFilters}
        className="my-8"
      />
    );
  }

  if (layout === 'list') {
    return (
      <div className="flex flex-col gap-4">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} layout="list" />
        ))}
      </div>
    );
  }

  const colClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid gap-6 ${colClasses[columns]}`}>
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} layout="grid" />
      ))}
    </div>
  );
};
