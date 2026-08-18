import React from 'react';
import { BLOG_CATEGORIES } from '../../data/mockBlogs';
import { Sparkles, Cpu, Bot, Code, Palette, Briefcase, Coffee } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  counts?: Record<string, number>;
  className?: string;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  counts,
  className = '',
}) => {
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'All':
        return <Sparkles className="w-3.5 h-3.5" />;
      case 'Technology':
        return <Cpu className="w-3.5 h-3.5" />;
      case 'AI':
        return <Bot className="w-3.5 h-3.5" />;
      case 'Programming':
        return <Code className="w-3.5 h-3.5" />;
      case 'Design':
        return <Palette className="w-3.5 h-3.5" />;
      case 'Career':
        return <Briefcase className="w-3.5 h-3.5" />;
      case 'Lifestyle':
        return <Coffee className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none ${className}`}>
      {BLOG_CATEGORIES.map((cat) => {
        const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
        const count = counts ? counts[cat] : undefined;

        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory(cat)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 shrink-0 ${
              isSelected
                ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-500/20 scale-[1.02]'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-slate-200/80'
            }`}
          >
            <span className={isSelected ? 'text-indigo-200' : 'text-slate-400'}>
              {getCategoryIcon(cat)}
            </span>
            <span>{cat}</span>
            {count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
