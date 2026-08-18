import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  PenSquare, 
  Menu, 
  X, 
  LayoutDashboard, 
  User as UserIcon, 
  Settings, 
  LogOut, 
  Compass, 
  Info, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { info } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Track scroll for subtle border shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    info('You have been logged out.');
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200/80'
          : 'bg-white/80 backdrop-blur-md border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 group focus:outline-none">
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 font-heading">
                Blog<span className="text-indigo-600">Space</span>
              </span>
            </div>
          </Link>

          {/* Center Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') && location.pathname === '/'
                  ? 'text-indigo-600 bg-indigo-50/60 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/explore"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/explore')
                  ? 'text-indigo-600 bg-indigo-50/60 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-4 h-4" />
              Explore
            </Link>
            <Link
              to="/about"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/about')
                  ? 'text-indigo-600 bg-indigo-50/60 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Info className="w-4 h-4" />
              About
            </Link>
          </nav>
        </div>

        {/* Right: Actions & User Dropdown */}
        <div className="hidden sm:flex items-center gap-3">
          <Link to="/create-blog">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<PenSquare className="w-4 h-4 text-indigo-600" />}
              className="hover:border-indigo-200"
            >
              Write
            </Button>
          </Link>

          {isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-2 rounded-full hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                aria-expanded={userDropdownOpen}
              >
                <Avatar src={user.avatar} name={user.name} size="sm" showBorder />
                <span className="text-xs font-semibold text-slate-700 max-w-[100px] truncate hidden md:inline-block">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-100 py-2 z-50 animate-fade-in divide-y divide-slate-100">
                  <div className="px-4 py-3">
                    <p className="text-xs font-medium text-slate-500">Signed in as</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">@{user.username}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      Dashboard
                    </Link>
                    <Link
                      to="/create-blog"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <PenSquare className="w-4 h-4 text-slate-400" />
                      Create Story
                    </Link>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      My Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      Settings
                    </Link>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          <Link to="/create-blog">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<PenSquare className="w-4 h-4 text-indigo-600" />}
              className="px-2.5 py-1.5"
            >
              Write
            </Button>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-x-0 top-16 bg-white border-b border-slate-200 shadow-xl px-4 pt-3 pb-6 space-y-4 animate-fade-in max-h-[calc(100vh-4rem)] overflow-y-auto z-40">
          <nav className="flex flex-col gap-1">
            <Link
              to="/"
              className={`px-3 py-2.5 rounded-xl text-sm font-semibold ${
                isActive('/') && location.pathname === '/'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/explore"
              className={`px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 ${
                isActive('/explore')
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-4 h-4" />
              Explore
            </Link>
            <Link
              to="/about"
              className={`px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 ${
                isActive('/about')
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Info className="w-4 h-4" />
              About
            </Link>
          </nav>

          <div className="border-t border-slate-100 pt-3">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl mb-2">
                  <Avatar src={user.avatar} name={user.name} size="sm" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">@{user.username}</p>
                  </div>
                </div>

                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-400" />
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  My Profile
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  Settings
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/login" className="w-full">
                  <Button variant="outline" size="md" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link to="/register" className="w-full">
                  <Button variant="primary" size="md" className="w-full">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
