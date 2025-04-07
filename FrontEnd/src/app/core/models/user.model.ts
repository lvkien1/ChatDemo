export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isOnline?: boolean;
}

export type UserPresenceStatus = 'online' | 'offline' | 'away' | 'busy';

export interface UserStatus {
  userId: string;
  status: UserPresenceStatus;
  lastSeen: Date;
}

export interface UserSettings {
  id: string;
  userId: string;
  theme: 'light' | 'dark';
  emailNotifications: boolean;
  pushNotifications: boolean;
  soundEnabled: boolean;
}

export interface UserProfile extends User {
  settings: UserSettings;
  lastSeen?: Date;
  status?: UserPresenceStatus;
}

export interface UserTypingStatus {
  userId: string;
  chatId: string;
  isTyping: boolean;
  timestamp: Date;
}

// Helper function to create a new UserStatus object
export function createUserStatus(
  userId: string,
  status: UserPresenceStatus = 'online',
  lastSeen: Date = new Date()
): UserStatus {
  return {
    userId,
    status,
    lastSeen
  };
}

// Helper function to create default user settings
export function createDefaultUserSettings(userId: string): UserSettings {
  return {
    id: Math.random().toString(36).substr(2, 9),
    userId,
    theme: 'light',
    emailNotifications: true,
    pushNotifications: true,
    soundEnabled: true
  };
}

// Helper function to format last seen time
export function formatLastSeen(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  if (seconds > 30) {
    return `${seconds} seconds ago`;
  }
  return 'just now';
}
