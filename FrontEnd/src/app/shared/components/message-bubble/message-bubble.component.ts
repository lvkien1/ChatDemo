import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message, MessageAttachment, getFileIcon } from '../../../core/models/message.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectCurrentTheme } from '../../../store/user/user.selectors';

@Component({
  selector: 'app-message-bubble',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="message-bubble" [class.own-message]="isOwnMessage">
      <div class="message-content">
        <p>{{ message.content }}</p>

        <div class="attachments" *ngIf="message.attachments?.length">
          <div
            *ngFor="let attachment of message.attachments"
            class="attachment"
          >
            <ng-container [ngSwitch]="attachment.type.split('/')[0]">
              <!-- Image -->
              <div
                *ngSwitchCase="'image'"
                class="image-preview"
                (click)="onImageClick(attachment)"
              >
                <img [src]="attachment.url" [alt]="attachment.name" />
              </div>

              <!-- File -->
              <div
                *ngSwitchDefault
                class="file-preview"
                [class.doc-file]="
                  attachment.mimeType.includes('document') ||
                  attachment.mimeType.includes('text')
                "
                [class.pdf-file]="attachment.mimeType.includes('pdf')"
                [class.archive-file]="
                  attachment.mimeType.includes('zip') ||
                  attachment.mimeType.includes('rar')
                "
                [class.audio-file]="attachment.mimeType.includes('audio')"
                [class.video-file]="attachment.mimeType.includes('video')"
                [class.image-file]="attachment.mimeType.includes('image')"
                (click)="onFileClick(attachment)"
              >
                <div class="file-icon">
                  <span class="material-icons">{{
                    getFileIcon(attachment.mimeType)
                  }}</span>
                </div>
                <span class="file-name">{{ attachment.name }}</span>
                <span class="file-size">{{
                  formatFileSize(attachment.size)
                }}</span>
                <span class="download-indicator material-icons">download</span>
              </div>
            </ng-container>
          </div>
        </div>

        <div class="message-meta">
          <span class="timestamp">{{
            message.timestamp | date : 'shortTime'
          }}</span>
          <span class="material-icons status-icon">{{
            getMessageStatusIcon()
          }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .message-bubble {
        display: flex;
        margin-bottom: 1rem;

        &.own-message {
          justify-content: flex-end;

          .message-content {
            background-color: #615ef0;
            color: white;
          }
        }
      }

      .message-content {
        max-width: 70%;
        padding: 0.5rem 1rem;
        background-color: var(--card-bg);
        color: var(--text-primary);
        border-radius: 1rem;
        transition: background-color 0.3s ease, color 0.3s ease;

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
        transition: transform 0.2s ease;

        &:hover {
          opacity: 1;
          transform: translateY(-2px);
        }
      }

      .image-preview {
        position: relative;
        overflow: hidden;
        border-radius: 8px;
        transition: all 0.3s ease;

        img {
          max-width: 200px;
          max-height: 200px;
          border-radius: 8px;
          transition: transform 0.3s ease;

          [data-theme='dark'] & {
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
        }

        &:hover img {
          transform: scale(1.05);
        }
      }

      .file-preview {
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem;
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        overflow: hidden;
        transition: all 0.2s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

        // Colored stripe based on file type
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          opacity: 0.7;
        }

        &.doc-file::before {
          background-color: #3498db;
        }
        &.pdf-file::before {
          background-color: #e74c3c;
        }
        &.archive-file::before {
          background-color: #f1c40f;
        }
        &.audio-file::before {
          background-color: #2ecc71;
        }
        &.video-file::before {
          background-color: #e67e22;
        }
        &.image-file::before {
          background-color: #9b59b6;
        }

        &:hover {
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
          border-color: rgba(97, 94, 240, 0.3);

          .download-indicator {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .file-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(97, 94, 240, 0.1);
          color: #615ef0;
          transition: background-color 0.3s ease, color 0.3s ease;

          [data-theme='dark'] & {
            background: rgba(97, 94, 240, 0.2);
            color: #a5a3ff;
          }

          .material-icons {
            font-size: 20px;
          }
        }

        .file-name {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .file-size {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-right: 8px;
          transition: color 0.3s ease;
        }

        .download-indicator {
          color: #615ef0;
          font-size: 18px;
          opacity: 0.7;
          transform: translateX(4px);
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
      }

      .message-meta {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        margin-top: 0.25rem;
        font-size: 0.75rem;
        color: var(--text-secondary);
        justify-content: flex-end;
        transition: color 0.3s ease;

        .status-icon {
          font-size: 14px;
        }
      }
    `,
  ],
})
export class MessageBubbleComponent implements OnInit {
  @Input() message!: Message;
  @Input() isOwnMessage: boolean = false;

  @Output() fileClick = new EventEmitter<MessageAttachment>();
  @Output() imageClick = new EventEmitter<MessageAttachment>();

  currentTheme$: Observable<'light' | 'dark'>;

  constructor(private store: Store) {
    this.currentTheme$ = this.store.select(selectCurrentTheme);
  }

  ngOnInit(): void {
    // Initialization logic if needed
  }

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
