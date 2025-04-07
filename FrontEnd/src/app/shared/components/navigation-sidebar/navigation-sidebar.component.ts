import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { User } from '../../../core/models/user.model';
import { selectCurrentUser } from '../../../store/user/user.selectors';

@Component({
  selector: 'app-navigation-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    UserAvatarComponent
  ],
  template: `
    <aside class="nav-sidebar">
      <!-- User Profile -->
      <div class="user-profile">
        <app-user-avatar 
          [user]="currentUser$ | async"
          [size]="40"
          [showStatus]="true"
          (click)="openSettings()"
        ></app-user-avatar>
      </div>

      <!-- Navigation Links -->
      <nav class="nav-links">
        <a routerLink="/chat" 
           routerLinkActive="active" 
           [routerLinkActiveOptions]="{exact: true}"
           class="nav-item">
          <mat-icon>chat</mat-icon>
          <span class="nav-label">Chats</span>
        </a>
        
        <a routerLink="/messages" 
           routerLinkActive="active"
           class="nav-item">
          <mat-icon>message</mat-icon>
          <span class="nav-label">Messages</span>
        </a>

        <a routerLink="/files" 
           routerLinkActive="active"
           class="nav-item">
          <mat-icon>folder</mat-icon>
          <span class="nav-label">Files</span>
        </a>
      </nav>

      <!-- Settings -->
      <div class="nav-footer">
        <button class="nav-item" (click)="openSettings()">
          <mat-icon>settings</mat-icon>
          <span class="nav-label">Settings</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .nav-sidebar {
      height: 100%;
      width: 72px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px 0;
      background: white;
      border-right: 1px solid rgba(0, 0, 0, 0.08);
      transition: width 0.3s ease;

      &:hover {
        width: 200px;

        .nav-label {
          opacity: 1;
          visibility: visible;
        }
      }
    }

    .user-profile {
      margin-bottom: 24px;
      cursor: pointer;
    }

    .nav-links {
      flex: 1;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 0 12px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      color: rgba(0, 0, 0, 0.7);
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s ease;
      width: 100%;
      border: none;
      background: none;
      font: inherit;

      &:hover {
        background: rgba(0, 0, 0, 0.04);
      }

      &.active {
        color: #615EF0;
        background: rgba(97, 94, 240, 0.08);

        mat-icon {
          color: #615EF0;
        }
      }

      mat-icon {
        color: rgba(0, 0, 0, 0.7);
      }
    }

    .nav-label {
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .nav-footer {
      width: 100%;
      padding: 0 12px;
    }
  `]
})
export class NavigationSidebarComponent implements OnInit {
  currentUser$: Observable<User | null>;

  constructor(private store: Store) {
    this.currentUser$ = this.store.select(selectCurrentUser);
  }

  ngOnInit(): void {}

  openSettings(): void {
    // TODO: Implement settings dialog
  }
}
