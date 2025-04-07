import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Message, FileAttachment } from '../../../core/models/message.model';
import { selectAllMessages } from '../../../store/chat';

interface FileAttachmentWithChat extends FileAttachment {
  chatId: string;
}

@Component({
  selector: 'app-files-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <div class="files-container">
      <header class="files-header">
        <h1>Files</h1>
      </header>

      <div class="files-grid">
        <ng-container *ngFor="let file of files$ | async">
          <mat-card class="file-card">
            <mat-card-content>
              <div class="file-icon">
                <mat-icon>{{ getFileIcon(file.type) }}</mat-icon>
              </div>
              <div class="file-info">
                <h3 class="file-name">{{ file.name }}</h3>
                <span class="file-size">{{ formatFileSize(file.size) }}</span>
              </div>
            </mat-card-content>
            <mat-card-actions>
              <a mat-button [href]="file.url" target="_blank" download>
                <mat-icon>download</mat-icon>
                Download
              </a>
              <a mat-button [routerLink]="['/chat', file.chatId]">
                <mat-icon>chat</mat-icon>
                View in Chat
              </a>
            </mat-card-actions>
          </mat-card>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .files-container {
      padding: 24px;
      height: 100%;
      box-sizing: border-box;
      background: #FFFFFF;
    }

    .files-header {
      margin-bottom: 24px;

      h1 {
        font-size: 20px;
        font-weight: 600;
      }
    }

    .files-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 24px;
    }

    .file-card {
      border-radius: 12px;
      border: 1px solid rgba(0, 0, 0, 0.08);
    }

    .file-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 48px;
      height: 48px;
      border-radius: 8px;
      background: #F1F1F1;
      margin-bottom: 16px;

      mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
        color: #615EF0;
      }
    }

    .file-info {
      .file-name {
        margin: 0;
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 4px;
      }

      .file-size {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.6);
      }
    }

    mat-card-actions {
      padding: 16px;
      display: flex;
      gap: 8px;
    }
  `]
})
export class FilesListComponent {
  files$: Observable<FileAttachmentWithChat[]>;

  constructor(private store: Store) {
    this.files$ = this.store.select(selectAllMessages).pipe(
      map(messages => {
        return messages
          .filter(msg => msg.attachments && msg.attachments.length > 0)
          .flatMap(msg => msg.attachments!.map(attachment => ({
            ...attachment,
            chatId: msg.chatId
          })));
      })
    );
  }

  getFileIcon(type: string): string {
    if (type.includes('image')) return 'image';
    if (type.includes('pdf')) return 'picture_as_pdf';
    if (type.includes('word') || type.includes('document')) return 'description';
    if (type.includes('spreadsheet') || type.includes('excel')) return 'table_chart';
    return 'insert_drive_file';
  }

  formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
  }
}
