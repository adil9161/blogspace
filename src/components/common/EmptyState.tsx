import React from 'react';
import { BookOpen } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 shadow-xs">
        {icon || <BookOpen className="w-7 h-7" />}
      </div>
      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
