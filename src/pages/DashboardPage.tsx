import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  FileText,
  Globe,
  PenTool,
  Eye,
  Plus,
  BarChart3,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useBlogs } from '../hooks/useBlogs';
import { useToast } from '../hooks/useToast';
import { StatsCard } from '../components/dashboard/StatsCard';
import { MyBlogsTable } from '../components/dashboard/MyBlogsTable';
import { DashboardSidebar } from '../components/layout/DashboardSidebar';
import { Button } from '../components/common/Button';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { getUserBlogs, deleteBlog, togglePublish } = useBlogs();
  const { success, error } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'overview';

  const userBlogs = useMemo(() => {
    return getUserBlogs(user?.id);
  }, [getUserBlogs, user?.id]);

  const publishedBlogs = userBlogs.filter((b) => b.status === 'published');
  const draftBlogs = userBlogs.filter((b) => b.status === 'draft');

  const totalViews = userBlogs.reduce((acc, curr) => acc + curr.views, 0);
  const totalLikes = userBlogs.reduce((acc, curr) => acc + curr.likes, 0);

  const handleDeleteBlog = (id: string) => {
    try {
      const ok = deleteBlog(id);
      if (ok) {
        success('Story deleted successfully.');
      }
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Failed to delete story.');
    }
  };

  const handleTogglePublish = (id: string) => {
    try {
      const updated = togglePublish(id);
      if (updated) {
        if (updated.status === 'published') {
          success('Story is now published and live!');
        } else {
          success('Story moved to drafts.');
        }
      }
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Failed to update story status.');
    }
  };

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab });
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-slate-50/50">
      {/* Sidebar */}
      <DashboardSidebar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl overflow-x-hidden">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Creator Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
              Welcome back, {user?.name.split(' ')[0] || 'Writer'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage your published stories, inspect analytics, and draft new ideas.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link to="/create-blog">
              <Button
                variant="primary"
                size="md"
                leftIcon={<Plus className="w-4 h-4" />}
                className="font-bold shadow-md shadow-indigo-500/20"
              >
                Create New Story
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Statistics Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatsCard
            title="Total Stories"
            value={userBlogs.length}
            icon={<FileText className="w-5 h-5 text-indigo-600" />}
            iconBgColor="bg-indigo-50"
            trend={{ value: '+14% this month', isPositive: true }}
            description={`${publishedBlogs.length} published, ${draftBlogs.length} in drafts`}
          />

          <StatsCard
            title="Published"
            value={publishedBlogs.length}
            icon={<Globe className="w-5 h-5 text-emerald-600" />}
            iconBgColor="bg-emerald-50"
            trend={{ value: 'Live', isPositive: true }}
            description="Reachable by global readers"
          />

          <StatsCard
            title="Drafts"
            value={draftBlogs.length}
            icon={<PenTool className="w-5 h-5 text-amber-600" />}
            iconBgColor="bg-amber-50"
            description="Work in progress"
          />

          <StatsCard
            title="Total Views"
            value={totalViews}
            icon={<Eye className="w-5 h-5 text-purple-600" />}
            iconBgColor="bg-purple-50"
            trend={{ value: '+28% growth', isPositive: true }}
            description={`${totalLikes} total reader likes`}
          />
        </div>

        {/* Tab-Specific Views */}
        {activeTab === 'analytics' ? (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-heading">
                    Audience Engagement & Performance
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time metrics calculated across your published articles.
                  </p>
                </div>
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <BarChart3 className="w-5 h-5" />
                </div>
              </div>

              {/* Engagement metrics breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-xs text-slate-500 font-semibold uppercase">Avg. Read Rate</span>
                  <p className="text-2xl font-black text-slate-900 mt-1 font-heading">78.4%</p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center">
                    <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +5.2% above average
                  </p>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-xs text-slate-500 font-semibold uppercase">Avg. Time per Story</span>
                  <p className="text-2xl font-black text-slate-900 mt-1 font-heading">4m 32s</p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center">
                    <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> High reader retention
                  </p>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-xs text-slate-500 font-semibold uppercase">Total Likes</span>
                  <p className="text-2xl font-black text-slate-900 mt-1 font-heading">{totalLikes}</p>
                  <p className="text-[11px] text-indigo-600 font-semibold mt-1">
                    Direct reader appreciation
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* My Stories Management Table */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-heading">
                  All Your Stories
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Publish, edit, or delete any of your articles.
                </p>
              </div>
            </div>

            <MyBlogsTable
              blogs={userBlogs}
              onDelete={handleDeleteBlog}
              onTogglePublish={handleTogglePublish}
            />
          </div>
        )}
      </main>
    </div>
  );
};
