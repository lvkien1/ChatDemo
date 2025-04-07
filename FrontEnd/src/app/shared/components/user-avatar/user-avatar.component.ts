import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [CommonModule, MatTooltipModule],
  template: `
    <div 
      class="avatar"
      [class.online]="isOnline"
      [class.size-small]="size === 'small'"
      [class.size-medium]="size === 'medium'"
      [class.size-large]="size === 'large'"
      [matTooltip]="name"
      [style.background-color]="getBackgroundColor(name)"
    >
      <ng-container *ngIf="imageUrl; else initials">
        <img [src]="imageUrl" [alt]="name" class="avatar-image">
      </ng-container>
      <ng-template #initials>
        {{ getInitials(name) }}
      </ng-template>
    </div>
  `,
  styles: [`
    .avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      color: white;
      font-weight: 500;
      position: relative;
      overflow: hidden;
    }

    .size-small {
      width: 32px;
      height: 32px;
      font-size: 12px;
    }

    .size-medium {
      width: 40px;
      height: 40px;
      font-size: 14px;
    }

    .size-large {
      width: 48px;
      height: 48px;
      font-size: 16px;
    }

    .avatar-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .online::after {
      content: '';
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 8px;
      height: 8px;
      background-color: #4CAF50;
      border-radius: 50%;
      border: 2px solid white;
    }
  `]
})
export class UserAvatarComponent {
  @Input() name = '';
  @Input() imageUrl?: string;
  @Input() isOnline = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  private colors = [
    '#F44336', '#E91E63', '#9C27B0', '#673AB7', 
    '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
    '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
    '#FFC107', '#FF9800', '#FF5722'
  ];

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getBackgroundColor(name: string): string {
    const charCode = name
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return this.colors[charCode % this.colors.length];
  }
}
