import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { UserSettingsDialogComponent } from '../user-settings-dialog/user-settings-dialog.component';
import { User } from '../../../core/models/user.model';

interface NavItem {
  icon: string;
  label: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-navigation-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    UserAvatarComponent
  ],
  template: `
    <div class="nav-container">
      <!-- Logo -->
      <div class="logo">
        <mat-icon>chat</mat-icon>
      </div>

      <!-- Navigation Items -->
      <nav class="nav-items">
        <ng-container *ngFor="let item of navigationItems">
          <a
            [routerLink]="item.route"
            routerLinkActive="active"
            class="nav-item"
            [matTooltip]="item.label"
            matTooltipPosition="right"
          >
            <mat-icon>{{ item.icon }}</mat-icon>
            <span class="badge" *ngIf="item.badge">{{ item.badge }}</span>
          </a>
        </ng-container>
      </nav>

      <!-- User Profile -->
      <div class="user-profile">
        <app-user-avatar
          [name]="currentUser.name"
          [imageUrl]="currentUser.avatar"
          [isOnline]="true"
          size="medium"
          matTooltip="Profile settings"
          matTooltipPosition="right"
          (click)="openSettings()"
        ></app-user-avatar>
      </div>
    </div>
  `,
  styles: [`
    .nav-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      padding: 16px 0;
      background: white;
      border-right: 1px solid rgba(0, 0, 0, 0.08);
    }

    .logo {
      padding: 12px;
      margin-bottom: 24px;

      mat-icon {
        color: #615EF0;
        width: 32px;
        height: 32px;
        font-size: 32px;
      }
    }

    .nav-items {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
    }

    .nav-item {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 12px;
      color: rgba(0, 0, 0, 0.6);
      transition: all 0.2s ease;
      text-decoration: none;

      &:hover {
        background: rgba(97, 94, 240, 0.08);
        color: #615EF0;
      }

      &.active {
        background: #615EF0;
        color: white;
      }

      mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
    }

    .badge {
      position: absolute;
      top: 4px;
      right: 4px;
      min-width: 18px;
      height: 18px;
      padding: 0 6px;
      border-radius: 9px;
      background: #FF3B30;
      color: white;
      font-size: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-profile {
      margin-top: auto;
      cursor: pointer;
      border-radius: 50%;
      transition: transform 0.2s ease;

      &:hover {
        transform: scale(1.05);
      }
    }
  `]
})
export class NavigationSidebarComponent {
  navigationItems: NavItem[] = [
    { icon: 'chat', label: 'Chat', route: '/chat' },
    { icon: 'inbox', label: 'Messages', route: '/messages', badge: 3 },
    { icon: 'folder', label: 'Files', route: '/files' }
  ];

  // Temporary user data - should come from a service/store
  currentUser: User = {
    id: 'current-user',
    name: 'John Doe',
    email: 'john@example.com',
    isOnline: true
  };

  constructor(
    private dialog: MatDialog,
    private store: Store
  ) {}

  openSettings(): void {
    const dialogRef = this.dialog.open(UserSettingsDialogComponent, {
      data: { user: this.currentUser },
      width: '400px',
      panelClass: 'settings-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Here you would typically dispatch an action to update the user profile
        console.log('Update user profile:', result);
      }
    });
  }
}
