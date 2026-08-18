import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  Edit3, 
  FileText, 
  Bookmark, 
  Heart, 
  PenTool, 
  Settings as SettingsIcon
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useBlogs } from '../hooks/useBlogs';
import { useToast } from '../hooks/useToast';
import { BlogGrid } from '../components/blog/BlogGrid';
import { Button } from '../components/common/Button';
import { Avatar } from '../components/common/Avatar';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { formatDate } from '../utils/formatDate';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { getUserBlogs, getBookmarkedBlogs, getLikedBlogs } = useBlogs();
  const { success, error } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'published';

  // Edit profile state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || '');

  const userBlogs = useMemo(() => getUserBlogs(user?.id), [getUserBlogs, user?.id]);
  const publishedBlogs = userBlogs.filter((b) => b.status === 'published');
  const draftBlogs = userBlogs.filter((b) => b.status === 'draft');
  const bookmarkedBlogs = useMemo(() => getBookmarkedBlogs(), [getBookmarkedBlogs]);
  const likedBlogs = useMemo(() => getLikedBlogs(), [getLikedBlogs]);

  const totalViews = userBlogs.reduce((acc, curr) => acc + curr.views, 0);
  const totalLikes = userBlogs.reduce((acc, curr) => acc + curr.likes, 0);

  const handleOpenEdit = () => {
    if (user) {
      setEditName(user.name);
      setEditBio(user.bio || '');
      setEditAvatar(user.avatar);
      setIsEditModalOpen(true);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      error('Full Name is required.');
      return;
    }

    updateProfile({
      name: editName.trim(),
      bio: editBio.trim(),
      avatar: editAvatar.trim() || user?.avatar,
    });

    success('Profile updated successfully!');
    setIsEditModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Profile Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Subtle background accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-linear-to-bl from-indigo-50/70 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Avatar
              src={user?.avatar}
              name={user?.name || 'User'}
              size="xl"
              showBorder
              className="ring-4 ring-slate-100 shadow-md"
            />

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                  {user?.name}
                </h1>
                <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-100 uppercase">
                  {user?.role || 'Author'}
                </span>
              </div>

              <p className="text-xs font-medium text-slate-500">@{user?.username}</p>

              {user?.bio && (
                <p className="text-sm text-slate-600 max-w-xl leading-relaxed pt-1">
                  {user.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined {user?.createdAt ? formatDate(user.createdAt) : 'Recently'}
                </span>
                <span>•</span>
                <span>
                  <strong className="text-slate-700 font-bold">{user?.followersCount || 140}</strong> Followers
                </span>
                <span>•</span>
                <span>
                  <strong className="text-slate-700 font-bold">{user?.followingCount || 45}</strong> Following
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenEdit}
              leftIcon={<Edit3 className="w-3.5 h-3.5" />}
              className="flex-1 sm:flex-initial"
            >
              Edit Profile
            </Button>
            <Link to="/settings" className="flex-1 sm:flex-initial">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<SettingsIcon className="w-3.5 h-3.5 text-slate-400" />}
                className="w-full"
              >
                Settings
              </Button>
            </Link>
          </div>
        </div>

        {/* Mini Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
          <div className="p-3.5 bg-slate-50/75 rounded-2xl">
            <p className="text-[11px] font-bold text-slate-500 uppercase">Stories Published</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">{publishedBlogs.length}</p>
          </div>
          <div className="p-3.5 bg-slate-50/75 rounded-2xl">
            <p className="text-[11px] font-bold text-slate-500 uppercase">Total Views</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">{totalViews.toLocaleString()}</p>
          </div>
          <div className="p-3.5 bg-slate-50/75 rounded-2xl">
            <p className="text-[11px] font-bold text-slate-500 uppercase">Total Likes Received</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">{totalLikes.toLocaleString()}</p>
          </div>
          <div className="p-3.5 bg-slate-50/75 rounded-2xl">
            <p className="text-[11px] font-bold text-slate-500 uppercase">Bookmarked Stories</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">{bookmarkedBlogs.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setSearchParams({ tab: 'published' })}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'published'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Published Stories ({publishedBlogs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSearchParams({ tab: 'drafts' })}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'drafts'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>Drafts ({draftBlogs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSearchParams({ tab: 'bookmarks' })}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'bookmarks'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Reading List ({bookmarkedBlogs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSearchParams({ tab: 'liked' })}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'liked'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Liked Stories ({likedBlogs.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'published' && (
          <BlogGrid
            blogs={publishedBlogs}
            columns={3}
            emptyTitle="No published stories yet"
            emptyDescription="Write and publish your first article to share your expertise."
          />
        )}

        {activeTab === 'drafts' && (
          <BlogGrid
            blogs={draftBlogs}
            columns={3}
            emptyTitle="No drafts saved"
            emptyDescription="Start drafting a new story in the studio."
          />
        )}

        {activeTab === 'bookmarks' && (
          <BlogGrid
            blogs={bookmarkedBlogs}
            columns={3}
            emptyTitle="Your reading list is empty"
            emptyDescription="Bookmark insightful articles you discover across BlogSpace to read later."
          />
        )}

        {activeTab === 'liked' && (
          <BlogGrid
            blogs={likedBlogs}
            columns={3}
            emptyTitle="No liked stories yet"
            emptyDescription="Show appreciation for authors by clicking the heart button on articles."
          />
        )}
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile Information"
        maxWidth="md"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <Input
            label="Full Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
              Bio / Tagline
            </label>
            <textarea
              rows={3}
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              placeholder="Tell other readers about your background and interests..."
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <Input
            label="Avatar Image URL"
            value={editAvatar}
            onChange={(e) => setEditAvatar(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            helperText="Paste a URL from Unsplash or DiceBear"
          />

          <div className="flex items-center gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" className="flex-1 font-bold">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
