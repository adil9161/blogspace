import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Home, Search } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/explore?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-xs">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Error 404
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
            Story Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
            The page or story you are looking for may have been moved, deleted, or never existed.
          </p>
        </div>

        {/* Quick Search */}
        <form onSubmit={handleSearch} className="relative max-w-xs mx-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stories..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pl-9 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </form>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link to="/">
            <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
              Back Home
            </Button>
          </Link>
          <Link to="/explore">
            <Button variant="outline" size="md" leftIcon={<Compass className="w-4 h-4" />}>
              Explore Stories
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
