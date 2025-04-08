import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../core/models/user.model';
import { ChatUtil } from '../../../utils/ChatUtil';
@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div
      class="avatar-container"
      [style.width.px]="size"
      [style.height.px]="size"
      [class.online]="user?.isOnline"
    >
      <ng-container *ngIf="user">
        <img
          *ngIf="user.avatar; else initialAvatar"
          [src]="user.avatar"
          [alt]="user.name"
          class="avatar-image"
        />
        <ng-template #initialAvatar>
          <div class="initial-avatar" [style.fontSize.px]="size * 0.4">
            {{ ChatUtil.getInitials(user.name) }}
          </div>
        </ng-template>
      </ng-container>
      <div *ngIf="!user" class="default-avatar">
        <mat-icon [style.fontSize.px]="size * 0.6">account_circle</mat-icon>
      </div>
      <div *ngIf="showStatus" class="status-indicator"></div>
    </div>
  `,
  styles: [
    `
      .avatar-container {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;

        &.online .status-indicator {
          background-color: #4caf50;
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
        background-color: #615ef0;
        color: white;
        font-weight: 500;
        text-transform: uppercase;
        border-radius: 50%;
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
        bottom: 5%;
        right: 5%;
        width: 25%;
        height: 25%;
        min-width: 8px;
        min-height: 8px;
        max-width: 12px;
        max-height: 12px;
        border-radius: 50%;
        background-color: #9e9e9e;
        border: 2px solid white;
      }
    `,
  ],
})
export class UserAvatarComponent {
  @Input() user: User | null = null;
  @Input() size = 50;
  @Input() showStatus = true;

  ChatUtil = ChatUtil;
}
