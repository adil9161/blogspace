import { StorageService, STORAGE_KEYS } from './storageService';

export class BookmarkService {
  static getUserBookmarks(userId: string): string[] {
    if (!userId) return [];
    const bookmarksMap = StorageService.getItem<Record<string, string[]>>(STORAGE_KEYS.BOOKMARKS, {
      'user-1': ['blog-1', 'blog-2', 'blog-4'],
    });
    return bookmarksMap[userId] || [];
  }

  static isBookmarked(blogId: string, userId: string): boolean {
    if (!userId) return false;
    const bookmarks = this.getUserBookmarks(userId);
    return bookmarks.includes(blogId);
  }

  static toggleBookmark(blogId: string, userId: string): boolean {
    if (!userId) return false;
    const bookmarksMap = StorageService.getItem<Record<string, string[]>>(STORAGE_KEYS.BOOKMARKS, {
      'user-1': ['blog-1', 'blog-2', 'blog-4'],
    });
    const currentBookmarks = bookmarksMap[userId] || [];
    const isSaved = currentBookmarks.includes(blogId);

    let updatedBookmarks: string[];
    if (isSaved) {
      updatedBookmarks = currentBookmarks.filter((id) => id !== blogId);
    } else {
      updatedBookmarks = [...currentBookmarks, blogId];
    }

    bookmarksMap[userId] = updatedBookmarks;
    StorageService.setItem(STORAGE_KEYS.BOOKMARKS, bookmarksMap);
    return !isSaved;
  }
}
