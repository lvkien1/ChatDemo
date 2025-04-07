import { createReducer, on } from '@ngrx/store';
import { User, UserStatus, UserSettings, createDefaultUserSettings } from '../../core/models/user.model';
import { UserActions } from './user.actions';

export interface UserState {
  currentUser: User | null;
  settings: UserSettings | null;
  onlineUsers: UserStatus[];
  theme: 'light' | 'dark';
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  settings: null,
  onlineUsers: [],
  theme: 'light',
  loading: false,
  error: null
};

export const userReducer = createReducer(
  initialState,

  // Load Current User
  on(UserActions.loadCurrentUser, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.loadCurrentUserSuccess, (state, { user }) => ({
    ...state,
    currentUser: user,
    settings: state.settings || createDefaultUserSettings(user.id),
    loading: false,
    error: null
  })),

  on(UserActions.loadCurrentUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update User
  on(UserActions.updateUser, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    currentUser: user,
    loading: false,
    error: null
  })),

  on(UserActions.updateUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update Avatar
  on(UserActions.updateAvatar, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.updateAvatarSuccess, (state, { user }) => ({
    ...state,
    currentUser: user,
    loading: false,
    error: null
  })),

  on(UserActions.updateAvatarFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update Settings
  on(UserActions.updateSettings, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.updateSettingsSuccess, (state, { settings }) => ({
    ...state,
    settings,
    loading: false,
    error: null
  })),

  on(UserActions.updateSettingsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Update Presence
  on(UserActions.updatePresence, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(UserActions.updatePresenceSuccess, (state, { status }) => ({
    ...state,
    onlineUsers: [
      ...state.onlineUsers.filter(u => u.userId !== status.userId),
      status
    ],
    loading: false,
    error: null
  })),

  on(UserActions.updatePresenceFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Presence Changed
  on(UserActions.presenceChanged, (state, { statuses }) => ({
    ...state,
    onlineUsers: statuses
  })),

  // Set Theme
  on(UserActions.setTheme, (state, { theme }) => ({
    ...state,
    theme
  })),

  // Set Online Status
  on(UserActions.setOnlineStatus, (state, { isOnline }) => ({
    ...state,
    currentUser: state.currentUser ? {
      ...state.currentUser,
      isOnline
    } : null
  }))
);
