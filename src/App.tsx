import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { BlogProvider } from './context/BlogContext';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';

import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateBlogPage } from './pages/CreateBlogPage';
import { EditBlogPage } from './pages/EditBlogPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Scroll to top helper on route navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <ToastProvider>
        <AuthProvider>
          <BlogProvider>
            <div className="min-h-screen flex flex-col bg-[#fafbfc] text-slate-900 font-sans selection:bg-indigo-500/20 selection:text-indigo-900">
              <Navbar />
              
              <div className="flex-1">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/explore" element={<ExplorePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/blog/:id" element={<BlogDetailPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Protected Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/create-blog"
                    element={
                      <ProtectedRoute>
                        <CreateBlogPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/edit-blog/:id"
                    element={
                      <ProtectedRoute>
                        <EditBlogPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <SettingsPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback 404 */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </div>

              <Footer />
            </div>
          </BlogProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
};

export default App;
