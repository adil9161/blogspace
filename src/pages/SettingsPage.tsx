import React, { useState } from 'react';
import { 
  Bell, 
  Lock, 
  Save,
  User as UserIcon
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const SettingsPage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { success, error } = useToast();

  const [activeSection, setActiveSection] = useState<'account' | 'notifications' | 'privacy' | 'security'>('account');

  // Account Form
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [username, setUsername] = useState(user?.username || '');

  // Notifications
  const [emailDigest, setEmailDigest] = useState(true);
  const [commentAlerts, setCommentAlerts] = useState(true);
  const [followerAlerts, setFollowerAlerts] = useState(true);

  // Security Simulation
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      error('Name cannot be empty.');
      return;
    }

    updateProfile({
      name: name.trim(),
      email: email.trim(),
      username: username.trim().toLowerCase(),
    });
    success('Account settings updated successfully.');
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    success('Notification preferences saved.');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      error('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      error('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      error('New passwords do not match.');
      return;
    }

    setIsUpdatingPassword(true);
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      success('Password changed successfully.');
    }, 400);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
          Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your personal profile, email notifications, and security settings.
        </p>
      </div>

      {/* Grid: Nav Sidebar + Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Navigation */}
        <div className="md:col-span-4 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
          <button
            type="button"
            onClick={() => setActiveSection('account')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors text-left ${
              activeSection === 'account'
                ? 'bg-indigo-50 text-indigo-700 font-bold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Profile & Account</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('notifications')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors text-left ${
              activeSection === 'notifications'
                ? 'bg-indigo-50 text-indigo-700 font-bold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('security')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors text-left ${
              activeSection === 'security'
                ? 'bg-indigo-50 text-indigo-700 font-bold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Password & Security</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          {/* Account Section */}
          {activeSection === 'account' && (
            <form onSubmit={handleSaveAccount} className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  Personal Information
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your public display name and account email.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <Input
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  leftIcon={<Save className="w-4 h-4" />}
                  className="font-bold"
                >
                  Save Profile
                </Button>
              </div>
            </form>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <form onSubmit={handleSaveNotifications} className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  Notification Preferences
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose which alerts and updates you receive.
                </p>
              </div>

              <div className="space-y-4 divide-y divide-slate-100">
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Weekly Editorial Digest</p>
                    <p className="text-[11px] text-slate-500">Receive curated top stories every Sunday morning.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailDigest}
                    onChange={(e) => setEmailDigest(e.target.checked)}
                    className="w-4 h-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Comment Responses</p>
                    <p className="text-[11px] text-slate-500">Get notified when someone responds to your stories.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={commentAlerts}
                    onChange={(e) => setCommentAlerts(e.target.checked)}
                    className="w-4 h-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div>
                    <p className="text-xs font-bold text-slate-900">New Follower Alerts</p>
                    <p className="text-[11px] text-slate-500">Alerts when other readers follow your author profile.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={followerAlerts}
                    onChange={(e) => setFollowerAlerts(e.target.checked)}
                    className="w-4 h-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button type="submit" variant="primary" size="md" className="font-bold">
                  Save Preferences
                </Button>
              </div>
            </form>
          )}

          {/* Security Section */}
          {activeSection === 'security' && (
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  Password & Security
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your credentials to protect your account.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Current Password"
                  isPassword
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />

                <Input
                  label="New Password"
                  isPassword
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />

                <Input
                  label="Confirm New Password"
                  isPassword
                  placeholder="Re-enter new password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isUpdatingPassword}
                  className="font-bold"
                >
                  Update Password
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
