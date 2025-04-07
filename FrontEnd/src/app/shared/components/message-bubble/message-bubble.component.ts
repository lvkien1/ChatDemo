import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message, MessageAttachment, getFileIcon } from '../../../core/models/message.model';

@Component({
  selector: 'app-message-bubble',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="message-bubble" [class.own-message]="isOwnMessage">
      <div class="message-content">
        <p>{{ message.content }}</p>
        
        <div class="attachments" *ngIf="message.attachments?.length">
          <div *ngFor="let attachment of message.attachments" class="attachment">
            <ng-container [ngSwitch]="attachment.type.split('/')[0]">
              
              <!-- Image -->
              <div *ngSwitchCase="'image'" class="image-preview"
                   (click)="onImageClick(attachment)">
                <img [src]="attachment.url" [alt]="attachment.name">
              </div>
              
              <!-- File -->
              <div *ngSwitchDefault class="file-preview"
                   (click)="onFileClick(attachment)">
                <span class="material-icons">{{ getFileIcon(attachment.mimeType) }}</span>
                <span class="file-name">{{ attachment.name }}</span>
                <span class="file-size">{{ formatFileSize(attachment.size) }}</span>
              </div>
              
            </ng-container>
          </div>
        </div>
        
        <div class="message-meta">
          <span class="timestamp">{{ message.timestamp | date:'shortTime' }}</span>
          <span class="material-icons status-icon">{{ getMessageStatusIcon() }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .message-bubble {
      display: flex;
      margin-bottom: 1rem;
      
      &.own-message {
        justify-content: flex-end;
        
        .message-content {
          background-color: #0084ff;
          color: white;
        }
      }
    }

    .message-content {
      max-width: 70%;
      padding: 0.5rem 1rem;
      background-color: #f0f0f0;
      border-radius: 1rem;
      
      p {
        margin: 0;
        white-space: pre-wrap;
        word-break: break-word;
      }
    }

    .attachments {
      margin-top: 0.5rem;
    }

    .attachment {
      margin-top: 0.5rem;
      cursor: pointer;
      
      &:hover {
        opacity: 0.8;
      }
    }

    .image-preview {
      img {
        max-width: 200px;
        max-height: 200px;
        border-radius: 0.5rem;
      }
    }

    .file-preview {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
      background: rgba(0, 0, 0, 0.05);
      border-radius: 0.5rem;
      
      .material-icons {
        font-size: 24px;
      }

      .file-name {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .file-size {
        font-size: 0.8rem;
        color: rgba(0, 0, 0, 0.6);
      }
    }

    .message-meta {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      margin-top: 0.25rem;
      font-size: 0.75rem;
      color: rgba(0, 0, 0, 0.6);
      justify-content: flex-end;

      .status-icon {
        font-size: 14px;
      }
    }
  `]
})
export class MessageBubbleComponent {
  @Input() message!: Message;
  @Input() isOwnMessage: boolean = false;
  
  @Output() fileClick = new EventEmitter<MessageAttachment>();
  @Output() imageClick = new EventEmitter<MessageAttachment>();

  getFileIcon(mimeType: string): string {
    return getFileIcon(mimeType);
  }

  getMessageStatusIcon(): string {
    return 'check'; // Simplified for now
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  onFileClick(attachment: MessageAttachment): void {
    this.fileClick.emit(attachment);
  }

  onImageClick(attachment: MessageAttachment): void {
    this.imageClick.emit(attachment);
  }
}
