import type { User } from '../types';
import { MOCK_USERS, DEMO_USER } from '../data/mockUsers';
import { StorageService, STORAGE_KEYS } from './storageService';

export class AuthService {
  static getStoredUsers(): User[] {
    const users = StorageService.getItem<User[]>(STORAGE_KEYS.USERS, []);
    if (users.length === 0) {
      StorageService.setItem(STORAGE_KEYS.USERS, MOCK_USERS);
      return MOCK_USERS;
    }
    return users;
  }

  static getCurrentUser(): User | null {
    return StorageService.getItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  }

  static login(email: string, _password?: string): { success: boolean; user?: User; error?: string } {
    const users = this.getStoredUsers();
    const cleanEmail = email.trim().toLowerCase();
    
    const matchedUser = users.find(
      (u) => u.email.toLowerCase() === cleanEmail || u.username.toLowerCase() === cleanEmail
    );

    if (!matchedUser) {
      return { success: false, error: 'No account found with this email or username. Please check your credentials or register.' };
    }

    StorageService.setItem(STORAGE_KEYS.CURRENT_USER, matchedUser);
    return { success: true, user: matchedUser };
  }

  static loginAsDemo(): User {
    const users = this.getStoredUsers();
    let demo = users.find((u) => u.id === DEMO_USER.id);
    if (!demo) {
      demo = DEMO_USER;
      users.push(demo);
      StorageService.setItem(STORAGE_KEYS.USERS, users);
    }
    StorageService.setItem(STORAGE_KEYS.CURRENT_USER, demo);
    return demo;
  }

  static register(params: {
    name: string;
    username: string;
    email: string;
    password?: string;
  }): { success: boolean; user?: User; error?: string } {
    const users = this.getStoredUsers();
    const cleanEmail = params.email.trim().toLowerCase();
    const cleanUsername = params.username.trim().toLowerCase();

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    if (users.some((u) => u.username.toLowerCase() === cleanUsername)) {
      return { success: false, error: 'This username is already taken. Please choose another one.' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: params.name.trim(),
      username: cleanUsername,
      email: cleanEmail,
      avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${cleanUsername}&backgroundColor=e2e8f0`,
      bio: 'Storyteller and reader on BlogSpace.',
      role: 'author',
      createdAt: new Date().toISOString(),
      followersCount: 0,
      followingCount: 0,
    };

    const updatedUsers = [newUser, ...users];
    StorageService.setItem(STORAGE_KEYS.USERS, updatedUsers);
    StorageService.setItem(STORAGE_KEYS.CURRENT_USER, newUser);

    return { success: true, user: newUser };
  }

  static logout(): void {
    StorageService.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  static updateProfile(updatedData: Partial<User>): User | null {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return null;

    const updatedUser: User = {
      ...currentUser,
      ...updatedData,
    };

    const users = this.getStoredUsers().map((u) => (u.id === updatedUser.id ? updatedUser : u));
    StorageService.setItem(STORAGE_KEYS.USERS, users);
    StorageService.setItem(STORAGE_KEYS.CURRENT_USER, updatedUser);

    return updatedUser;
  }
}
