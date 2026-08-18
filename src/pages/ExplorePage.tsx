import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  LayoutGrid, 
  List, 
  SlidersHorizontal, 
  Tag, 
  RotateCcw,
  Compass
} from 'lucide-react';
import { useBlogs } from '../hooks/useBlogs';
import { BlogGrid } from '../components/blog/BlogGrid';
import { SearchBar } from '../components/blog/SearchBar';
import { BLOG_CATEGORIES, POPULAR_TAGS } from '../data/mockBlogs';
import type { SortOption } from '../types';
import { BlogService } from '../services/blogService';
import { Button } from '../components/common/Button';

export const ExplorePage: React.FC = () => {
  const { publishedBlogs, isLoading } = useBlogs();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get('category') || 'All';
  const initialTag = searchParams.get('tag') || '';
  const initialQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTag ? [initialTag] : []);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync state with URL params
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const tag = searchParams.get('tag');
    if (tag) setSelectedTags([tag]);
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedTags([]);
    setSortBy('newest');
    setSearchParams({});
  };

  const filteredBlogs = useMemo(() => {
    return BlogService.searchAndFilter(publishedBlogs, {
      searchQuery,
      category: selectedCategory,
      selectedTags,
      sortBy,
    });
  }, [publishedBlogs, searchQuery, selectedCategory, selectedTags, sortBy]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: publishedBlogs.length };
    publishedBlogs.forEach((b) => {
      counts[b.category] = (counts[b.category] || 0) + 1;
    });
    return counts;
  }, [publishedBlogs]);

  const isFiltered =
    selectedCategory !== 'All' ||
    selectedTags.length > 0 ||
    searchQuery.trim() !== '' ||
    sortBy !== 'newest';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>Discover Knowledge</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            Explore Stories & Insights
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse through {publishedBlogs.length} carefully written articles across engineering, AI, design, and career.
          </p>
        </div>

        {/* View Layout Controls & Mobile Filter Toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden flex items-center gap-1.5"
            leftIcon={<SlidersHorizontal className="w-4 h-4" />}
          >
            Filters {isFiltered && '•'}
          </Button>

          <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setLayout('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                layout === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setLayout('list')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                layout === 'list'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar Filters - Desktop */}
        <aside
          className={`lg:col-span-3 space-y-6 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs ${
            showMobileFilters ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
              Filter Content
            </h3>
            {isFiltered && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Categories
            </label>
            <div className="flex flex-col gap-1">
              {BLOG_CATEGORIES.map((cat) => {
                const active = selectedCategory.toLowerCase() === cat.toLowerCase();
                const count = categoryCounts[cat] || 0;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left ${
                      active
                        ? 'bg-indigo-50 text-indigo-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        active ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Popular Tags */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              Popular Topics
            </label>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 font-semibold shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Results Section */}
        <main className="lg:col-span-9 space-y-6">
          {/* Search & Sort Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search across title, author, body, or tags..."
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full sm:w-auto bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="likes">Most Liked</option>
                <option value="shortest">Shortest Read</option>
                <option value="longest">Longest Read</option>
              </select>
            </div>
          </div>

          {/* Active Filter Pills Indicator */}
          {isFiltered && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="font-semibold text-slate-700">Active filters:</span>

              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                  Category: <strong>{selectedCategory}</strong>
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className="ml-1 text-slate-400 hover:text-slate-700"
                  >
                    ✕
                  </button>
                </span>
              )}

              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-lg"
                >
                  #{tag}
                  <button
                    onClick={() => toggleTag(tag)}
                    className="ml-1 text-slate-400 hover:text-slate-700"
                  >
                    ✕
                  </button>
                </span>
              ))}

              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                  Query: <strong>"{searchQuery}"</strong>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="ml-1 text-slate-400 hover:text-slate-700"
                  >
                    ✕
                  </button>
                </span>
              )}

              <button
                onClick={clearAllFilters}
                className="text-xs text-indigo-600 hover:underline font-semibold ml-auto"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>
              Showing <strong className="text-slate-900">{filteredBlogs.length}</strong> stories
            </span>
          </div>

          {/* Blog Grid */}
          <BlogGrid
            blogs={filteredBlogs}
            isLoading={isLoading}
            layout={layout}
            columns={3}
            onClearFilters={clearAllFilters}
          />
        </main>
      </div>
    </div>
  );
};
