import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap, withLatestFrom } from 'rxjs/operators';
import { UserService } from '../../core/services/user.service';
import { WebsocketService } from '../../core/services/websocket.service';
import { UserActions } from './user.actions';
import { selectCurrentUser } from './user.selectors';
import { UserPresenceStatus } from '../../core/models/user.model';

@Injectable()
export class UserEffects {
  loadCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadCurrentUser),
      mergeMap(() =>
        // For development, use mock data
        this.userService.getMockCurrentUser().pipe(
          map(user => UserActions.loadCurrentUserSuccess({ user })),
          catchError(error => of(UserActions.loadCurrentUserFailure({ error: error.message })))
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      mergeMap(({ id, data }) =>
        this.userService.updateUser(id, data).pipe(
          map(user => UserActions.updateUserSuccess({ user })),
          catchError(error => of(UserActions.updateUserFailure({ error: error.message })))
        )
      )
    )
  );

  updateAvatar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateAvatar),
      mergeMap(({ id, file }) =>
        this.userService.updateAvatar(id, file).pipe(
          map(user => UserActions.updateAvatarSuccess({ user })),
          catchError(error => of(UserActions.updateAvatarFailure({ error: error.message })))
        )
      )
    )
  );

  // Update Settings is currently mocked
  updateSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateSettings),
      withLatestFrom(this.store.select(selectCurrentUser)),
      mergeMap(([{ settings }, user]) => {
        if (!user) return of(UserActions.updateSettingsFailure({ error: 'User not found' }));
        
        // Mock success response
        return of(UserActions.updateSettingsSuccess({
          settings: {
            id: Math.random().toString(36).substr(2, 9),
            userId: user.id,
            theme: settings.theme || 'light',
            emailNotifications: settings.emailNotifications ?? true,
            pushNotifications: settings.pushNotifications ?? true,
            soundEnabled: settings.soundEnabled ?? true
          }
        }));
      })
    )
  );

  updatePresence$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updatePresence),
      mergeMap(({ status }) =>
        of(this.websocketService.updatePresence(status)).pipe(
          map(() => UserActions.updatePresenceSuccess({ status })),
          catchError(error => of(UserActions.updatePresenceFailure({ error: error.message })))
        )
      )
    )
  );

  // Handle theme changes
  setTheme$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.setTheme),
      tap(({ theme }) => {
        document.documentElement.classList.remove('light-theme', 'dark-theme');
        document.documentElement.classList.add(`${theme}-theme`);
        localStorage.setItem('theme', theme);
      })
    ),
    { dispatch: false }
  );

  // Handle online status changes
  setOnlineStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.setOnlineStatus),
      withLatestFrom(this.store.select(selectCurrentUser)),
      mergeMap(([{ isOnline }, user]) => {
        if (!user) return of(UserActions.updatePresenceFailure({ error: 'User not found' }));

        const status = {
          userId: user.id,
          status: isOnline ? 'online' as UserPresenceStatus : 'offline' as UserPresenceStatus,
          lastSeen: new Date()
        };

        return of(UserActions.updatePresence({ status }));
      })
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private userService: UserService,
    private websocketService: WebsocketService
  ) {}
}
