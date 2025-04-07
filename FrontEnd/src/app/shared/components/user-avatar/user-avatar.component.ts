import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="avatar-container" 
         [style.width.px]="size"
         [style.height.px]="size"
         [class.online]="user?.isOnline">
      <ng-container *ngIf="user">
        <img *ngIf="user.avatar; else initialAvatar"
             [src]="user.avatar"
             [alt]="user.name"
             class="avatar-image">
        <ng-template #initialAvatar>
          <div class="initial-avatar" [style.fontSize.px]="size * 0.4">
            {{ getInitials(user.name) }}
          </div>
        </ng-template>
      </ng-container>
      <div *ngIf="!user" class="default-avatar">
        <mat-icon [style.fontSize.px]="size * 0.6">account_circle</mat-icon>
      </div>
      <div *ngIf="showStatus" class="status-indicator"></div>
    </div>
  `,
  styles: [`
    .avatar-container {
      position: relative;
      border-radius: 50%;
      overflow: hidden;
      background-color: #E0E0E0;
      display: flex;
      align-items: center;
      justify-content: center;

      &.online .status-indicator {
        background-color: #4CAF50;
      }
    }

    .avatar-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .initial-avatar {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #615EF0;
      color: white;
      font-weight: 500;
      text-transform: uppercase;
    }

    .default-avatar {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(0, 0, 0, 0.4);
    }

    .status-indicator {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 25%;
      height: 25%;
      min-width: 8px;
      min-height: 8px;
      max-width: 12px;
      max-height: 12px;
      border-radius: 50%;
      background-color: #9E9E9E;
      border: 2px solid white;
    }
  `]
})
export class UserAvatarComponent {
  @Input() user: User | null = null;
  @Input() size = 40;
  @Input() showStatus = true;

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .slice(0, 2);
  }
}
