import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  PenSquare, 
  Compass, 
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import { useBlogs } from '../hooks/useBlogs';
import { useAuth } from '../hooks/useAuth';
import { BlogGrid } from '../components/blog/BlogGrid';
import { SearchBar } from '../components/blog/SearchBar';
import { CategoryFilter } from '../components/blog/CategoryFilter';
import { Button } from '../components/common/Button';
import type { SortOption } from '../types';
import { BlogService } from '../services/blogService';

export const HomePage: React.FC = () => {
  const { publishedBlogs, isLoading } = useBlogs();
  const { isAuthenticated } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Featured blogs (marked as featured, or top 3 by views)
  const featuredBlogs = useMemo(() => {
    const featured = publishedBlogs.filter((b) => b.featured);
    if (featured.length >= 3) return featured.slice(0, 3);
    return [...publishedBlogs]
      .sort((a, b) => b.views - a.views)
      .slice(0, 3);
  }, [publishedBlogs]);

  // Filtered latest blogs
  const filteredBlogs = useMemo(() => {
    return BlogService.searchAndFilter(publishedBlogs, {
      searchQuery,
      category: selectedCategory,
      selectedTags: [],
      sortBy,
    });
  }, [publishedBlogs, searchQuery, selectedCategory, sortBy]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: publishedBlogs.length };
    publishedBlogs.forEach((b) => {
      counts[b.category] = (counts[b.category] || 0) + 1;
    });
    return counts;
  }, [publishedBlogs]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('newest');
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 lg:pt-16 lg:pb-20 border-b border-slate-200/60 bg-linear-to-b from-indigo-50/50 via-white to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>The Modern Platform for Thought Leaders</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.1] font-heading">
                Share Your Ideas <br />
                <span className="bg-linear-to-r from-indigo-600 via-violet-600 to-indigo-800 bg-clip-text text-transparent">
                  With The World
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Write, publish, and discover stories that inspire, educate, and connect people. Deep-dive into software engineering, artificial intelligence, product design, and career wisdom.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link to={isAuthenticated ? '/create-blog' : '/register'} className="w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="lg"
                    leftIcon={<PenSquare className="w-4 h-4" />}
                    className="w-full sm:w-auto font-semibold shadow-md shadow-indigo-500/20"
                  >
                    Start Writing Free
                  </Button>
                </Link>

                <Link to="/explore" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    leftIcon={<Compass className="w-4 h-4 text-slate-500" />}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="w-full sm:w-auto"
                  >
                    Explore Stories
                  </Button>
                </Link>
              </div>

              {/* Trust Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 max-w-md mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <p className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">10K+</p>
                  <p className="text-xs text-slate-500 font-medium">Active Readers</p>
                </div>
                <div className="text-center lg:text-left border-x border-slate-200 px-2">
                  <p className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">2K+</p>
                  <p className="text-xs text-slate-500 font-medium">Published Stories</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">500+</p>
                  <p className="text-xs text-slate-500 font-medium">Verified Authors</p>
                </div>
              </div>
            </div>

            {/* Right Hero Graphic / Featured Preview */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative glow */}
                <div className="absolute -inset-1.5 bg-linear-to-r from-indigo-500 to-purple-500 rounded-3xl blur-lg opacity-25" />

                <div className="relative bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">
                      Featured Pick
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Editor's Choice</span>
                  </div>

                  <div className="rounded-2xl overflow-hidden h-48 bg-slate-100 relative">
                    <img
                      src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"
                      alt="AI Agents Architecture"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-snug hover:text-indigo-600 transition-colors">
                      The Architecture of Autonomous AI Agents in Production
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      How modern orchestrators coordinate memory, deterministic tool calling, and recovery loops for reliable execution.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <img
                        src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80"
                        alt="Dr. Sarah Chen"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">Dr. Sarah Chen</p>
                        <p className="text-[10px] text-slate-400">Principal AI Researcher</p>
                      </div>
                    </div>

                    <Link to="/blog/blog-1">
                      <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        Read
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blogs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4" />
              <span>Trending Reads</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-heading">
              Featured Articles
            </h2>
          </div>
          <Link
            to="/explore"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
          >
            <span>View all stories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <BlogGrid blogs={featuredBlogs} isLoading={isLoading} columns={3} />
      </section>

      {/* Latest Blogs & Discovery Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50/70 rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-heading">
                Explore Latest Stories
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Filter by topic, search keywords, or sort to find your next great read.
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular (Views)</option>
                <option value="likes">Most Liked</option>
                <option value="shortest">Quick Reads (&lt; 5 min)</option>
                <option value="longest">Deep Dives</option>
              </select>
            </div>
          </div>

          {/* Search & Category Filter Controls */}
          <div className="space-y-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by title, topic, author, or keywords..."
            />

            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              counts={categoryCounts}
            />
          </div>

          {/* Blog Grid */}
          <BlogGrid
            blogs={filteredBlogs}
            isLoading={isLoading}
            columns={3}
            onClearFilters={clearFilters}
          />
        </div>
      </section>

      {/* Writer CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-xl">
          {/* Background pattern */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-72 h-72 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative max-w-2xl space-y-5">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800">
              <Sparkles className="w-3.5 h-3.5" />
              Join 500+ Writers
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading leading-tight">
              Have an insight or engineering story to share?
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Publish your articles on BlogSpace and reach thousands of curious developers, founders, and designers across the world.
            </p>

            <div className="pt-3">
              <Link to={isAuthenticated ? '/create-blog' : '/register'}>
                <Button
                  variant="primary"
                  size="lg"
                  leftIcon={<PenSquare className="w-4 h-4" />}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 font-semibold"
                >
                  Start Your Story Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
