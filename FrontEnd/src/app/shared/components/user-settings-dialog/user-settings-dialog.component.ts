import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { UserActions } from '../../../store/user/user.actions';
import * as UserSelectors from '../../../store/user/user.selectors';
import { UserSettings, User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-settings-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="settings-dialog">
      <h2>User Settings</h2>
      
      <form [formGroup]="settingsForm" (ngSubmit)="onSubmit()">
        <div class="settings-section">
          <h3>Notifications</h3>
          <div class="setting-item">
            <label>
              <input type="checkbox" formControlName="enableNotifications">
              Enable Desktop Notifications
            </label>
          </div>
          
          <div class="setting-item">
            <label>
              <input type="checkbox" formControlName="soundEnabled">
              Enable Sound
            </label>
          </div>
        </div>

        <div class="settings-section">
          <h3>Theme</h3>
          <div class="setting-item">
            <select formControlName="theme">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>

        <div class="settings-section">
          <h3>Privacy</h3>
          <div class="setting-item">
            <label>
              <input type="checkbox" formControlName="showReadReceipts">
              Show Read Receipts
            </label>
          </div>
          
          <div class="setting-item">
            <label>
              <input type="checkbox" formControlName="showOnlineStatus">
              Show Online Status
            </label>
          </div>
        </div>

        <div class="actions">
          <button type="button" mat-button (click)="onCancel()">Cancel</button>
          <button type="submit" mat-raised-button color="primary">Save</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .settings-dialog {
      padding: 24px;
      max-width: 400px;
    }

    h2 {
      margin: 0 0 24px;
      font-size: 24px;
    }

    .settings-section {
      margin-bottom: 24px;

      h3 {
        margin: 0 0 16px;
        font-size: 18px;
      }
    }

    .setting-item {
      margin-bottom: 12px;

      label {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      select {
        width: 100%;
        padding: 8px;
        border-radius: 4px;
        border: 1px solid rgba(0, 0, 0, 0.12);
      }
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserSettingsDialogComponent {
  settingsForm: FormGroup;
  currentUser$: Observable<User | null>;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private dialogRef: MatDialogRef<UserSettingsDialogComponent>
  ) {
    this.currentUser$ = this.store.select(UserSelectors.selectCurrentUser);
    this.settingsForm = this.formBuilder.group({
      enableNotifications: [false],
      soundEnabled: [true],
      theme: ['light'],
      showReadReceipts: [true],
      showOnlineStatus: [true]
    });

    // Load current settings
    this.store.select(UserSelectors.selectUserSettings)
      .pipe(take(1))
      .subscribe(settings => { 
        if (settings) {
          this.settingsForm.patchValue(settings);
        }
      });
  }

  onSubmit(): void {
    if (this.settingsForm.valid) {
      this.currentUser$.pipe(take(1)).subscribe(user => {
        if (user) {
          // Update theme if changed
          const newTheme = this.settingsForm.get('theme')?.value;
          const settings: UserSettings = {
            ...this.settingsForm.value,
            userId: user.id,
            lastUpdated: new Date()
          };
          
          this.store.dispatch(UserActions.updateSettings({ 
            userId: user.id,
            settings 
          }));

          if (newTheme) {
            this.store.dispatch(UserActions.setTheme({ theme: newTheme }));
          }

          this.dialogRef.close();
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
