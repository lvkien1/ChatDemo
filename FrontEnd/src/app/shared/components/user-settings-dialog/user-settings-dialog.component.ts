import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../../core/models/user.model';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';

@Component({
  selector: 'app-user-settings-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    UserAvatarComponent
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h2>Profile Settings</h2>
        <button mat-icon-button mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="dialog-content" mat-dialog-content>
        <div class="avatar-section">
          <app-user-avatar
            [name]="userData.name || ''"
            [imageUrl]="userData.avatar"
            size="large"
          ></app-user-avatar>
          <button mat-stroked-button color="primary" (click)="uploadAvatar()">
            <mat-icon>upload</mat-icon>
            Change Avatar
          </button>
          <input
            #fileInput
            type="file"
            accept="image/*"
            class="hidden"
            (change)="onAvatarSelected($event)"
          >
        </div>

        <div class="form-section">
          <mat-form-field appearance="outline">
            <mat-label>Display Name</mat-label>
            <input matInput [(ngModel)]="userData.name" name="name" required>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput [(ngModel)]="userData.email" name="email" type="email" required>
          </mat-form-field>
        </div>
      </div>

      <div class="dialog-actions" mat-dialog-actions>
        <button mat-button mat-dialog-close>Cancel</button>
        <button 
          mat-flat-button 
          color="primary" 
          (click)="saveChanges()"
          [disabled]="!isFormValid()"
        >
          Save Changes
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      min-width: 400px;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);

      h2 {
        margin: 0;
        font-size: 18px;
        font-weight: 500;
      }
    }

    .dialog-content {
      padding: 24px;
    }

    .avatar-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .form-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .hidden {
      display: none;
    }

    .dialog-actions {
      padding: 8px 24px;
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      border-top: 1px solid rgba(0, 0, 0, 0.08);
    }

    mat-form-field {
      width: 100%;
    }
  `]
})
export class UserSettingsDialogComponent {
  userData: Partial<User>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
    private dialogRef: MatDialogRef<UserSettingsDialogComponent>
  ) {
    this.userData = { ...data.user };
  }

  uploadAvatar(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      // Here you would typically upload the file and get back a URL
      // For now, we'll create a temporary URL
      this.userData.avatar = URL.createObjectURL(file);
    }
  }

  isFormValid(): boolean {
    return !!(this.userData.name?.trim() && this.userData.email?.trim());
  }

  saveChanges(): void {
    if (this.isFormValid()) {
      this.dialogRef.close(this.userData);
    }
  }
}
