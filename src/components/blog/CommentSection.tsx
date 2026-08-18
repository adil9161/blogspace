import React, { useState, useRef } from 'react';
import { MessageSquare, Trash2, Reply, Send } from 'lucide-react';
import { useBlogs } from '../../hooks/useBlogs';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { formatTimeAgo } from '../../utils/formatDate';

interface CommentSectionProps {
  blogId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ blogId }) => {
  const { getBlogComments, addComment, deleteComment } = useBlogs();
  const { user, isAuthenticated } = useAuth();
  const { success, error, info } = useToast();

  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{ id: string; name: string } | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const comments = getBlogComments(blogId);

  const handleReplyClick = (commentId: string, authorName: string) => {
    setReplyingTo({ id: commentId, name: authorName });
    setContent(`@${authorName} `);
    textareaRef.current?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      info('Please log in to leave a comment.');
      return;
    }

    const trimmed = content.trim();
    if (trimmed.length < 2) {
      error('Comment is too short. Please write at least 2 characters.');
      return;
    }

    if (trimmed.length > 500) {
      error('Comment cannot exceed 500 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      addComment(blogId, trimmed, replyingTo?.id || null);
      setContent('');
      setReplyingTo(null);
      success('Comment posted successfully!');
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Failed to post comment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (commentId: string) => {
    if (window.confirm('Are you sure you want to delete your comment?')) {
      try {
        deleteComment(commentId);
        success('Comment deleted.');
      } catch (err: unknown) {
        error(err instanceof Error ? err.message : 'Failed to delete comment.');
      }
    }
  };

  return (
    <section className="mt-12 pt-8 border-t border-slate-200" id="comments">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
          <MessageSquare className="w-5 h-5 text-indigo-600" />
          Responses ({comments.length})
        </h3>
      </div>

      {/* Post Form */}
      {isAuthenticated && user ? (
        <form onSubmit={handleSubmit} className="mb-8 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3 mb-3">
            <Avatar src={user.avatar} name={user.name} size="sm" />
            <div>
              <p className="text-xs font-bold text-slate-900">{user.name}</p>
              <p className="text-[11px] text-slate-500">@{user.username}</p>
            </div>
            {replyingTo && (
              <span className="ml-auto text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full flex items-center gap-1 font-medium">
                Replying to @{replyingTo.name}
                <button
                  type="button"
                  onClick={() => setReplyingTo(null)}
                  className="ml-1 text-indigo-400 hover:text-indigo-700"
                >
                  ✕
                </button>
              </span>
            )}
          </div>

          <div className="relative">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What are your thoughts on this article?"
              rows={3}
              maxLength={500}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-between mt-3 pt-2">
            <span
              className={`text-xs ${
                content.length > 450 ? 'text-rose-500 font-bold' : 'text-slate-400'
              }`}
            >
              {content.length}/500 characters
            </span>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              disabled={content.trim().length < 2 || isSubmitting}
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              Respond
            </Button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
          <p className="text-sm text-slate-600 mb-3">
            Join the conversation. Share your thoughts or ask the author a question.
          </p>
          <a href="/login" className="inline-block">
            <Button variant="outline" size="sm">
              Log in to leave a response
            </Button>
          </a>
        </div>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-sm font-semibold text-slate-700">No responses yet</p>
          <p className="text-xs text-slate-400 mt-1">Be the first to share your perspective on this story!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => {
            const isAuthorOfComment = user?.id === c.userId;

            return (
              <div
                key={c.id}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs transition-all hover:border-slate-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar src={c.userAvatar} name={c.userName} size="sm" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{c.userName}</p>
                      <p className="text-[11px] text-slate-400">{formatTimeAgo(c.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {isAuthenticated && (
                      <button
                        type="button"
                        onClick={() => handleReplyClick(c.id, c.userName)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
                        title="Reply"
                      >
                        <Reply className="w-4 h-4" />
                      </button>
                    )}

                    {isAuthorOfComment && (
                      <button
                        type="button"
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete your comment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed break-words pl-1">
                  {c.content}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
