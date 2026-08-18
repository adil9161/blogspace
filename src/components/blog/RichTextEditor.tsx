import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  FileCode,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
} from 'lucide-react';
import { getWordCount, getCharacterCount, calculateReadingTime } from '../../utils/readingTime';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = 'Tell your story... Write insights, code examples, blockquotes, and deep thoughts.',
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-indigo-600 underline font-medium hover:text-indigo-800',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl max-w-full my-4 shadow-sm border border-slate-100',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter link URL:', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt(
      'Enter Image URL:',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80'
    );
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return (
      <div className="h-64 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400">
        Loading editor...
      </div>
    );
  }

  const words = getWordCount(editor.getHTML());
  const chars = getCharacterCount(editor.getHTML());
  const readTime = calculateReadingTime(editor.getHTML());

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs flex flex-col focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
      {/* Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50/80 border-b border-slate-200/80 sticky top-16 z-10 backdrop-blur-xs">
        {/* Headings */}
        <div className="flex items-center gap-0.5 border-r border-slate-200 pr-1.5 mr-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/60 transition-colors ${
              editor.isActive('heading', { level: 1 }) ? 'bg-indigo-100 text-indigo-700 font-bold' : ''
            }`}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/60 transition-colors ${
              editor.isActive('heading', { level: 2 }) ? 'bg-indigo-100 text-indigo-700 font-bold' : ''
            }`}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/60 transition-colors ${
              editor.isActive('heading', { level: 3 }) ? 'bg-indigo-100 text-indigo-700 font-bold' : ''
            }`}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>
        </div>

        {/* Basic Formats */}
        <div className="flex items-center gap-0.5 border-r border-slate-200 pr-1.5 mr-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/60 transition-colors ${
              editor.isActive('bold') ? 'bg-indigo-100 text-indigo-700 font-bold' : ''
            }`}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/60 transition-colors ${
              editor.isActive('italic') ? 'bg-indigo-100 text-indigo-700 font-bold' : ''
            }`}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/60 transition-colors ${
              editor.isActive('underline') ? 'bg-indigo-100 text-indigo-700 font-bold' : ''
            }`}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/60 transition-colors ${
              editor.isActive('strike') ? 'bg-indigo-100 text-indigo-700 font-bold' : ''
            }`}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
        </div>

        {/* Lists & Quotes */}
        <div className="flex items-center gap-0.5 border-r border-slate-200 pr-1.5 mr-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/60 transition-colors ${
              editor.isActive('bulletList') ? 'bg-indigo-100 text-indigo-700 font-bold' : ''
            }`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/60 transition-colors ${
              editor.isActive('orderedList') ? 'bg-indigo-100 text-indigo-700 font-bold' : ''
            }`}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/60 transition-colors ${
              editor.isActive('blockquote') ? 'bg-indigo-100 text-indigo-700 font-bold' : ''
            }`}
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>
        </div>

        {/* Code & Media */}
        <div className="flex items-center gap-0.5 border-r border-slate-200 pr-1.5 mr-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/60 transition-colors ${
              editor.isActive('code') ? 'bg-indigo-100 text-indigo-700 font-bold' : ''
            }`}
            title="Inline Code"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/60 transition-colors ${
              editor.isActive('codeBlock') ? 'bg-indigo-100 text-indigo-700 font-bold' : ''
            }`}
            title="Code Block"
          >
            <FileCode className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={setLink}
            className={`p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/60 transition-colors ${
              editor.isActive('link') ? 'bg-indigo-100 text-indigo-700 font-bold' : ''
            }`}
            title="Add / Edit Link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={addImage}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/60 transition-colors"
            title="Embed Image"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 ml-auto">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200/60 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200/60 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Redo (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="p-6 min-h-[320px] max-h-[550px] overflow-y-auto cursor-text article-content" onClick={() => editor.chain().focus().run()}>
        <EditorContent editor={editor} />
      </div>

      {/* Stats Counter Footer */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-4">
          <span>Words: <strong className="text-slate-800">{words}</strong></span>
          <span>Characters: <strong className="text-slate-800">{chars}</strong></span>
        </div>
        <div>
          <span>Est. Reading time: <strong className="text-indigo-600">{readTime} min</strong></span>
        </div>
      </div>
    </div>
  );
};
