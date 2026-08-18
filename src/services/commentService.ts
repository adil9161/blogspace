import type { Comment, User } from '../types';
import { MOCK_COMMENTS } from '../data/mockComments';
import { StorageService, STORAGE_KEYS } from './storageService';

export class CommentService {
  static getComments(): Comment[] {
    const comments = StorageService.getItem<Comment[]>(STORAGE_KEYS.COMMENTS, []);
    if (comments.length === 0) {
      StorageService.setItem(STORAGE_KEYS.COMMENTS, MOCK_COMMENTS);
      return MOCK_COMMENTS;
    }
    return comments;
  }

  static getCommentsByBlogId(blogId: string): Comment[] {
    const comments = this.getComments();
    return comments
      .filter((c) => c.blogId === blogId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static addComment(blogId: string, content: string, user: User, parentId?: string | null): Comment {
    const comments = this.getComments();
    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      blogId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      likesCount: 0,
      parentId: parentId || null,
    };

    const updatedComments = [newComment, ...comments];
    StorageService.setItem(STORAGE_KEYS.COMMENTS, updatedComments);
    return newComment;
  }

  static deleteComment(commentId: string, userId: string): boolean {
    const comments = this.getComments();
    const comment = comments.find((c) => c.id === commentId);

    if (!comment) return false;
    if (comment.userId !== userId) {
      throw new Error('Unauthorized: You can only delete your own comments.');
    }

    const updated = comments.filter((c) => c.id !== commentId && c.parentId !== commentId);
    StorageService.setItem(STORAGE_KEYS.COMMENTS, updated);
    return true;
  }
}
