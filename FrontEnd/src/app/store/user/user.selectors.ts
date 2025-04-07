import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.reducer';
import { UserStatus } from '../../core/models/user.model';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectCurrentUser = createSelector(
  selectUserState,
  state => state.currentUser
);

export const selectUserSettings = createSelector(
  selectUserState,
  state => state.settings
);

export const selectTheme = createSelector(
  selectUserState,
  state => state.theme
);

export const selectOnlineUsers = createSelector(
  selectUserState,
  state => state.onlineUsers
);

export const selectIsUserOnline = (userId: string) => createSelector(
  selectOnlineUsers,
  users => users.some(u => u.userId === userId && u.status === 'online')
);

export const selectUserStatus = (userId: string) => createSelector(
  selectOnlineUsers,
  users => users.find(u => u.userId === userId)
);

export const selectLastSeen = (userId: string) => createSelector(
  selectUserStatus(userId),
  status => status?.lastSeen
);

export const selectUserLoading = createSelector(
  selectUserState,
  state => state.loading
);

export const selectUserError = createSelector(
  selectUserState,
  state => state.error
);

// Helper selectors for combined data
export const selectUserProfile = createSelector(
  selectCurrentUser,
  selectUserSettings,
  selectOnlineUsers,
  (user, settings, onlineUsers) => {
    if (!user) return null;
    
    const status = onlineUsers.find(u => u.userId === user.id);
    return {
      ...user,
      settings: settings || null,
      status: status?.status,
      lastSeen: status?.lastSeen
    };
  }
);

export const selectOnlineUserCount = createSelector(
  selectOnlineUsers,
  users => users.filter(u => u.status === 'online').length
);

export const selectTypingUsers = (chatId: string) => createSelector(
  selectUserState,
  state => state.onlineUsers
    .filter(user => user.status === 'online')
    .map(user => ({
      userId: user.userId,
      isTyping: false // This should come from the chat state
    }))
);
