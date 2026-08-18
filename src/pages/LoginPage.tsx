import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Mail, Lock, LogIn, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { isValidEmail } from '../utils/validation';
import { Modal } from '../components/common/Modal';

export const LoginPage: React.FC = () => {
  const { login, loginAsDemo } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = 'Email address or username is required.';
    } else if (email.includes('@') && !isValidEmail(email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        success('Welcome back to BlogSpace!');
        navigate(from, { replace: true });
      } else {
        error(res.error || 'Invalid credentials.');
      }
    } catch {
      error('An unexpected error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsDemo();
    success('Logged in as Demo Author (Alex Morgan)!');
    navigate(from, { replace: true });
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !isValidEmail(forgotEmail)) {
      error('Please enter a valid email address.');
      return;
    }
    setForgotSent(true);
    success('Password reset instructions sent to your email.');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50/50">
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Brand & Visual */}
        <div className="lg:col-span-5 bg-linear-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold font-heading">
                Blog<span className="text-indigo-400">Space</span>
              </span>
            </Link>

            <div className="space-y-3 pt-6">
              <h2 className="text-2xl font-bold font-heading leading-snug">
                Welcome back to your writing sanctuary.
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect with passionate readers, manage your drafts, and publish stories that resonate.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs text-indigo-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full markdown and rich text studio</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-indigo-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Real-time reading analytics & likes</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-indigo-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Personalized creator dashboard</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
              Log in to your account
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Enter your credentials or use the 1-click demo account.
            </p>
          </div>

          {/* 1-Click Demo Login Box */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-indigo-900">Want to test instantly?</p>
              <p className="text-[11px] text-indigo-700">Preloads Alex Morgan with articles and analytics.</p>
            </div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleDemoLogin}
              className="bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap shadow-xs"
            >
              1-Click Demo Login
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email or Username"
              type="text"
              placeholder="alex@blogspace.io or alexmorgan"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={formErrors.email}
              leadingIcon={<Mail className="w-4 h-4" />}
              required
            />

            <div className="space-y-1">
              <Input
                label="Password"
                isPassword
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={formErrors.password}
                leadingIcon={<Lock className="w-4 h-4" />}
                required
              />
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-indigo-600 hover:underline font-semibold"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full font-bold shadow-md shadow-indigo-500/20"
              leftIcon={<LogIn className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          {/* Social Sign-In Simulation */}
          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase">
              Or continue with
            </span>
            <div className="border-t border-slate-200 w-full" />
          </div>

          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => {
              handleDemoLogin();
              success('Signed in with Google (Demo Simulation)!');
            }}
            className="w-full text-slate-700"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </Button>

          <p className="text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 font-bold hover:underline">
              Create an account free
            </Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => {
          setShowForgotModal(false);
          setForgotSent(false);
        }}
        title="Reset Your Password"
        maxWidth="sm"
      >
        {forgotSent ? (
          <div className="text-center space-y-4 py-2">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Check your inbox</h4>
              <p className="text-xs text-slate-500 mt-1">
                We sent a password reset link to <strong>{forgotEmail}</strong>.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowForgotModal(false);
                setForgotSent(false);
              }}
              className="w-full"
            >
              Back to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4 py-2">
            <p className="text-xs text-slate-500 leading-relaxed">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
            <Input
              label="Email Address"
              type="email"
              placeholder="alex@blogspace.io"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
            />
            <Button type="submit" variant="primary" size="md" className="w-full">
              Send Reset Link
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
};
