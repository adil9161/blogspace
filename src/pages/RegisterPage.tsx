import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, User, UserCheck, CheckCircle2, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { isValidEmail, isValidUsername, analyzePassword } from '../utils/validation';

export const RegisterPage: React.FC = () => {
  const { register, loginAsDemo } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formErrors, setFormErrors] = useState<{
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agreeTerms?: string;
  }>({});

  const passwordAnalysis = useMemo(() => analyzePassword(password), [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: typeof formErrors = {};

    if (!name.trim()) {
      errors.name = 'Full name is required.';
    }

    if (!username.trim()) {
      errors.username = 'Username is required.';
    } else if (!isValidUsername(username)) {
      errors.username = 'Username must be 3-20 characters (letters, numbers, underscores).';
    }

    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!isValidEmail(email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (!agreeTerms) {
      errors.agreeTerms = 'You must agree to the Terms of Service.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsLoading(true);

    try {
      const res = await register({
        name,
        username,
        email,
        password,
      });

      if (res.success) {
        success('Account created successfully! Welcome to BlogSpace.');
        navigate('/dashboard', { replace: true });
      } else {
        error(res.error || 'Failed to create account.');
      }
    } catch {
      error('An unexpected error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsDemo();
    success('Logged in as Demo Author (Alex Morgan)!');
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50/50">
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Editorial Banner */}
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

            <div className="space-y-3 pt-4">
              <h2 className="text-2xl font-bold font-heading leading-snug">
                Join a thriving community of writers & engineers.
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Build your portfolio, grow your audience, and share real-world software architecture insights with thousands of peers.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs text-indigo-200">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Free forever for independent creators</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-indigo-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full control over your content and drafts</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-indigo-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Modern reading & authoring tools</span>
            </div>
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center space-y-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
              Create your account
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Start publishing your stories on BlogSpace today.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Full Name"
                placeholder="e.g. Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={formErrors.name}
                leadingIcon={<User className="w-4 h-4" />}
                required
              />

              <Input
                label="Username"
                placeholder="e.g. alexmorgan"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                error={formErrors.username}
                leadingIcon={<UserCheck className="w-4 h-4" />}
                required
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={formErrors.email}
              leadingIcon={<Mail className="w-4 h-4" />}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <Input
                  label="Password"
                  isPassword
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={formErrors.password}
                  leadingIcon={<Lock className="w-4 h-4" />}
                  required
                />
              </div>

              <Input
                label="Confirm Password"
                isPassword
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={formErrors.confirmPassword}
                leadingIcon={<Lock className="w-4 h-4" />}
                required
              />
            </div>

            {/* Password Strength Meter */}
            {password.length > 0 && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 animate-fade-in">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">Strength:</span>
                  <span
                    className={`font-bold capitalize ${
                      passwordAnalysis.strength === 'strong'
                        ? 'text-emerald-600'
                        : passwordAnalysis.strength === 'medium'
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }`}
                  >
                    {passwordAnalysis.strength}
                  </span>
                </div>

                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex gap-1">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      passwordAnalysis.score >= 1
                        ? passwordAnalysis.score >= 3
                          ? 'bg-emerald-500 w-full'
                          : 'bg-amber-500 w-2/3'
                        : 'bg-rose-500 w-1/3'
                    }`}
                  />
                </div>
                <p className="text-[10px] text-slate-500">{passwordAnalysis.feedback}</p>
              </div>
            )}

            {/* Terms Checkbox */}
            <div className="space-y-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>
                  I agree to the{' '}
                  <Link to="/about" className="text-indigo-600 underline font-medium">
                    Terms of Service
                  </Link>{' '}
                  and Privacy Policy.
                </span>
              </label>
              {formErrors.agreeTerms && (
                <p className="text-xs text-rose-600 font-medium">{formErrors.agreeTerms}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full font-bold shadow-md shadow-indigo-500/20"
            >
              Create Account
            </Button>
          </form>

          <div className="text-center space-y-2 pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 font-bold hover:underline">
                Sign in
              </Link>
            </p>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="text-xs text-indigo-600 font-semibold hover:underline block mx-auto"
            >
              Or explore immediately as Demo User →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
