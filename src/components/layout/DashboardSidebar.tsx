import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  PenSquare,
  User,
  Settings,
  LogOut,
  Bookmark,
  Heart,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

interface DashboardSidebarProps {
  onLinkClick?: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  onLinkClick,
  activeTab,
  onTabChange,
}) => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const { info } = useToast();

  const handleLogout = () => {
    logout();
    info('Logged out successfully.');
    if (onLinkClick) onLinkClick();
  };

  const navItems = [
    {
      label: 'Overview',
      icon: <LayoutDashboard className="w-4 h-4" />,
      path: '/dashboard',
      tabKey: 'overview',
    },
    {
      label: 'My Blogs',
      icon: <FileText className="w-4 h-4" />,
      path: '/dashboard?tab=blogs',
      tabKey: 'blogs',
    },
    {
      label: 'Create Blog',
      icon: <PenSquare className="w-4 h-4" />,
      path: '/create-blog',
    },
    {
      label: 'Analytics',
      icon: <TrendingUp className="w-4 h-4" />,
      path: '/dashboard?tab=analytics',
      tabKey: 'analytics',
    },
    {
      label: 'Bookmarks',
      icon: <Bookmark className="w-4 h-4" />,
      path: '/profile?tab=bookmarks',
    },
    {
      label: 'Liked Stories',
      icon: <Heart className="w-4 h-4" />,
      path: '/profile?tab=liked',
    },
    {
      label: 'Profile',
      icon: <User className="w-4 h-4" />,
      path: '/profile',
    },
    {
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      path: '/settings',
    },
  ];

  const isCurrentActive = (item: (typeof navItems)[0]) => {
    if (activeTab && item.tabKey) {
      return activeTab === item.tabKey;
    }
    return location.pathname === item.path;
  };

  return (
    <aside className="w-full lg:w-64 bg-white lg:min-h-[calc(100vh-4rem)] border-r border-slate-200/80 p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        {/* User Mini Profile */}
        {user && (
          <div className="p-3 bg-slate-50/80 border border-slate-100 rounded-2xl flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-white shadow-xs"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">@{user.username}</p>
            </div>
          </div>
        )}

        {/* Navigation List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = isCurrentActive(item);

            if (onTabChange && item.tabKey) {
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    onTabChange(item.tabKey!);
                    if (onLinkClick) onLinkClick();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span className={active ? 'text-indigo-600' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              );
            }

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={onLinkClick}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span className={active ? 'text-indigo-600' : 'text-slate-400'}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Action */}
      <div className="pt-4 mt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          Log out
        </button>
      </div>
    </aside>
  );
};
