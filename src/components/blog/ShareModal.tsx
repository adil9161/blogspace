import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Link as LinkIcon, Check } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { Button } from '../common/Button';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title,
  url = window.location.href,
}) => {
  const [copied, setCopied] = useState(false);
  const { success } = useToast();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `Check out "${title}" on @BlogSpace`
    )}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  const shareToLinkedin = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`;
    window.open(linkedinUrl, '_blank', 'noopener,noreferrer');
  };

  const shareToFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share This Story" maxWidth="sm">
      <div className="space-y-6">
        <p className="text-xs text-slate-500 leading-relaxed">
          Share this insightful story with your network, team, or followers.
        </p>

        {/* Social Buttons Grid */}
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={shareToTwitter}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-slate-700 hover:text-slate-900 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </div>
            <span className="text-xs font-semibold">X (Twitter)</span>
          </button>

          <button
            type="button"
            onClick={shareToLinkedin}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-slate-700 hover:text-slate-900 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </div>
            <span className="text-xs font-semibold">LinkedIn</span>
          </button>

          <button
            type="button"
            onClick={shareToFacebook}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-slate-700 hover:text-slate-900 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <span className="text-xs font-semibold">Facebook</span>
          </button>
        </div>

        {/* Copy Link Field */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Direct Link
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                readOnly
                value={url}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 font-mono focus:outline-none select-all"
              />
            </div>
            <Button
              variant={copied ? 'secondary' : 'primary'}
              size="sm"
              onClick={handleCopyLink}
              leftIcon={copied ? <Check className="w-4 h-4 text-emerald-600" /> : <LinkIcon className="w-4 h-4" />}
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
