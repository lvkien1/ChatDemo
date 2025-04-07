import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Message, MessageAttachment, FileMessage, isFileMessage, getFileIcon } from '../../../core/models/message.model';
import * as ChatSelectors from '../../../store/chat/chat.selectors';

interface FileEntry {
  chatId: string;
  messageId: string;
  file: MessageAttachment;
  timestamp: Date;
  senderId: string;
}

@Component({
  selector: 'app-files-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="files-container">
      <h2>Files</h2>
      
      <div class="files-list">
        <div *ngFor="let entry of files$ | async" class="file-item" (click)="openFile(entry)">
          <span class="material-icons">{{ getFileIcon(entry.file.mimeType) }}</span>
          <div class="file-info">
            <div class="file-name">{{ entry.file.name }}</div>
            <div class="file-meta">
              {{ entry.file.size | number }} bytes · 
              {{ entry.timestamp | date:'medium' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .files-container {
      padding: 1rem;
      
      h2 {
        margin-bottom: 1rem;
      }
    }

    .files-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .file-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      background: white;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background: rgba(0, 0, 0, 0.05);
      }

      .material-icons {
        font-size: 24px;
        color: #666;
      }
    }

    .file-info {
      flex: 1;
      min-width: 0;

      .file-name {
        font-weight: 500;
        margin-bottom: 0.25rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .file-meta {
        font-size: 0.875rem;
        color: rgba(0, 0, 0, 0.6);
      }
    }
  `]
})
export class FilesListComponent implements OnInit {
  files$: Observable<FileEntry[]>;

  constructor(private store: Store) {
    // Get all messages and filter file messages
    this.files$ = this.store.select(ChatSelectors.selectAllFileMessages).pipe(
      map((messages: Message[]) => 
        messages.flatMap(message => {
          if (!message.attachments) return [];
          return message.attachments.map(attachment => ({
            chatId: message.chatId,
            messageId: message.id,
            file: attachment,
            timestamp: message.timestamp,
            senderId: message.senderId
          }));
        }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      )
    );
  }

  ngOnInit(): void {
    // No initialization needed as messages are loaded by chat feature
  }

  getFileIcon(mimeType: string): string {
    return getFileIcon(mimeType);
  }

  openFile(entry: FileEntry): void {
    window.open(entry.file.url, '_blank');
  }
}
