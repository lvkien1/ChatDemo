import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { User, UserStatus, UserSettings } from '../../core/models/user.model';

export const UserActions = createActionGroup({
  source: 'User',
  events: {
    // Load Current User
    'Load Current User': emptyProps(),
    'Load Current User Success': props<{ user: User }>(),
    'Load Current User Failure': props<{ error: string }>(),

    // Update User
    'Update User': props<{ id: string; data: Partial<User> }>(),
    'Update User Success': props<{ user: User }>(),
    'Update User Failure': props<{ error: string }>(),

    // Update Avatar
    'Update Avatar': props<{ id: string; file: File }>(),
    'Update Avatar Success': props<{ user: User }>(),
    'Update Avatar Failure': props<{ error: string }>(),

    // Update Settings
    'Update Settings': props<{ settings: Partial<UserSettings> }>(),
    'Update Settings Success': props<{ settings: UserSettings }>(),
    'Update Settings Failure': props<{ error: string }>(),

    // Update Presence
    'Update Presence': props<{ status: UserStatus }>(),
    'Update Presence Success': props<{ status: UserStatus }>(),
    'Update Presence Failure': props<{ error: string }>(),

    // Presence Changed
    'Presence Changed': props<{ statuses: UserStatus[] }>(),

    // Set Theme
    'Set Theme': props<{ theme: 'light' | 'dark' }>(),

    // Set Online Status
    'Set Online Status': props<{ isOnline: boolean }>()
  }
});
