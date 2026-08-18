import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Send, CheckCircle2, Globe } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { success } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubscribed(true);
    success('Thank you for subscribing to the BlogSpace newsletter!');
    setEmail('');
  };

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-heading">
                Blog<span className="text-indigo-400">Space</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Where thinkers, builders, and storytellers connect. Discover deep technical essays, product design insights, and career playbooks from industry practitioners.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-indigo-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-indigo-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-indigo-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a
                href="https://blogspace.io"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-indigo-600 hover:text-white flex items-center justify-center text-slate-400 transition-colors"
                aria-label="Web"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/explore" className="hover:text-white transition-colors">
                  All Stories
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Technology" className="hover:text-white transition-colors">
                  Technology
                </Link>
              </li>
              <li>
                <Link to="/explore?category=AI" className="hover:text-white transition-colors">
                  Artificial Intelligence
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Programming" className="hover:text-white transition-colors">
                  Programming
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Design" className="hover:text-white transition-colors">
                  Product Design
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/create-blog" className="hover:text-white transition-colors">
                  Write a Story
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About BlogSpace
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Creator Studio
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Join Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Weekly Digest</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Curated top stories delivered directly to your inbox every Sunday. No spam.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-800">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>You are subscribed!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-colors"
                    aria-label="Subscribe"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} BlogSpace Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/about" className="hover:text-slate-400 transition-colors">
              Terms of Service
            </Link>
            <Link to="/about" className="hover:text-slate-400 transition-colors">
              Community Guidelines
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
