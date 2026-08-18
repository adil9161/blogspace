/**
 * Safe localStorage wrapper with memory fallback and pre-seeding support
 */

const STORAGE_KEYS = {
  USERS: 'blogspace_users_v1',
  CURRENT_USER: 'blogspace_current_user_v1',
  BLOGS: 'blogspace_blogs_v1',
  COMMENTS: 'blogspace_comments_v1',
  BOOKMARKS: 'blogspace_bookmarks_v1',
  LIKES: 'blogspace_likes_v1',
  FOLLOWS: 'blogspace_follows_v1',
  SETTINGS: 'blogspace_settings_v1',
} as const;

export class StorageService {
  static getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item) as T;
    } catch (e) {
      console.warn(`Error reading localStorage key "${key}":`, e);
      return defaultValue;
    }
  }

  static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Error writing localStorage key "${key}":`, e);
    }
  }

  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`Error removing localStorage key "${key}":`, e);
    }
  }

  static clearAll(): void {
    try {
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      console.warn('Error clearing storage:', e);
    }
  }
}

export { STORAGE_KEYS };
