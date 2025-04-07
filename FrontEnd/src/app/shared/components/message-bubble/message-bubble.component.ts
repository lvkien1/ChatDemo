import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Message, MessageStatus, FileAttachment } from '../../../core/models/message.model';
import { UserAvatarComponent } from '../user-avatar/user-avatar.component';
import { ImagePreviewDialogComponent } from '../image-preview-dialog/image-preview-dialog.component';

@Component({
  selector: 'app-message-bubble',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    UserAvatarComponent
  ],
  template: `
    <div class="message-container" [class.sent]="isSent">
      <app-user-avatar
        *ngIf="!isSent"
        [name]="senderName"
        [imageUrl]="senderAvatar"
        size="small"
        class="message-avatar">
      </app-user-avatar>

      <div class="message-content" [class.sent]="isSent">
        <div class="message-header" *ngIf="!isSent">
          <span class="sender-name">{{ senderName }}</span>
          <span class="message-time">{{ message.timestamp | date:'shortTime' }}</span>
        </div>

        <div class="message-body">
          <p *ngIf="message.content">{{ message.content }}</p>

          <ng-container *ngIf="message.attachments?.length">
            <div class="attachments">
              <div *ngFor="let file of message.attachments" class="file-attachment">
                <ng-container [ngSwitch]="getFileType(file)">
                  <!-- Image Preview -->
                  <img *ngSwitchCase="'image'" 
                       [src]="file.preview || file.url" 
                       [alt]="file.name"
                       class="image-preview"
                       (click)="openImagePreview(file)">
                  
                  <!-- File Card -->
                  <div *ngSwitchDefault class="file-card" (click)="onFileClick(file)">
                    <mat-icon>{{ getFileIcon(file.type) }}</mat-icon>
                    <div class="file-info">
                      <span class="file-name">{{ file.name }}</span>
                      <span class="file-size">{{ formatFileSize(file.size) }}</span>
                    </div>
                  </div>
                </ng-container>
              </div>
            </div>
          </ng-container>
        </div>

        <div class="message-status" *ngIf="isSent">
          <span class="message-time">{{ message.timestamp | date:'shortTime' }}</span>
          <mat-icon class="status-icon" [class.read]="message.status === 'read'">
            {{ getStatusIcon(message.status) }}
          </mat-icon>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .message-container {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;

      &.sent {
        flex-direction: row-reverse;
      }
    }

    .message-avatar {
      margin-top: 4px;
    }

    .message-content {
      max-width: 70%;
      background: #F1F1F1;
      border-radius: 12px;
      padding: 12px;
      position: relative;

      &.sent {
        background: #615EF0;
        color: white;
      }
    }

    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .sender-name {
      font-weight: 500;
      font-size: 14px;
    }

    .message-time {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.6);
      .sent & {
        color: rgba(255, 255, 255, 0.8);
      }
    }

    .message-body {
      p {
        margin: 0;
        white-space: pre-wrap;
      }
    }

    .attachments {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 8px;
    }

    .image-preview {
      max-width: 300px;
      max-height: 200px;
      border-radius: 8px;
      cursor: pointer;
      transition: opacity 0.2s ease;

      &:hover {
        opacity: 0.9;
      }
    }

    .file-card {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(255, 255, 255, 0.1);
      padding: 8px 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
    }

    .file-info {
      display: flex;
      flex-direction: column;
    }

    .file-name {
      font-size: 14px;
      font-weight: 500;
    }

    .file-size {
      font-size: 12px;
      opacity: 0.8;
    }

    .message-status {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 4px;
      margin-top: 4px;
    }

    .status-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      opacity: 0.8;

      &.read {
        color: #4CAF50;
        opacity: 1;
      }
    }
  `]
})
export class MessageBubbleComponent {
  @Input() message!: Message;
  @Input() isSent = false;
  @Input() senderName = '';
  @Input() senderAvatar?: string;

  constructor(private dialog: MatDialog) {}

  getStatusIcon(status: MessageStatus): string {
    switch (status) {
      case 'sent': return 'check';
      case 'delivered': return 'done_all';
      case 'read': return 'done_all';
      default: return 'schedule';
    }
  }

  getFileType(file: FileAttachment): 'image' | 'file' {
    return file.type.startsWith('image/') ? 'image' : 'file';
  }

  getFileIcon(type: string): string {
    if (type.includes('pdf')) return 'picture_as_pdf';
    if (type.includes('word') || type.includes('document')) return 'description';
    if (type.includes('spreadsheet') || type.includes('excel')) return 'table_chart';
    return 'insert_drive_file';
  }

  formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
  }

  onFileClick(file: FileAttachment): void {
    window.open(file.url, '_blank');
  }

  openImagePreview(file: FileAttachment): void {
    this.dialog.open(ImagePreviewDialogComponent, {
      data: {
        imageUrl: file.url,
        title: file.name
      },
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'image-preview-dialog'
    });
  }
}
