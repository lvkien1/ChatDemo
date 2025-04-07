import { Component, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  template: `
    <div class="message-input-container">
      <input
        #fileInput
        type="file"
        multiple
        (change)="onFileSelected($event)"
        class="hidden"
      >

      <div class="attachments-preview" *ngIf="selectedFiles.length">
        <div *ngFor="let file of selectedFiles; let i = index" class="attachment-item">
          <mat-icon>{{ getFileIcon(file.type) }}</mat-icon>
          <span class="file-name">{{ file.name }}</span>
          <button mat-icon-button (click)="removeFile(i)" matTooltip="Remove">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>

      <div class="input-row">
        <button
          mat-icon-button
          color="primary"
          (click)="fileInput.click()"
          matTooltip="Attach files"
        >
          <mat-icon>attach_file</mat-icon>
        </button>

        <textarea
          #messageInput
          class="message-textarea"
          placeholder="Type a message..."
          [(ngModel)]="message"
          name="message"
          (keydown)="onKeyPress($event)"
          (input)="adjustTextarea(messageInput)"
          rows="1"
        ></textarea>

        <button
          mat-icon-button
          color="primary"
          (click)="sendMessage()"
          [disabled]="!canSend"
          matTooltip="Send message"
        >
          <mat-icon>send</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .message-input-container {
      padding: 16px;
      border-top: 1px solid rgba(0, 0, 0, 0.08);
      background: white;
    }

    .hidden {
      display: none;
    }

    .input-row {
      display: flex;
      align-items: flex-end;
      gap: 8px;
    }

    .message-textarea {
      flex: 1;
      border: none;
      border-radius: 24px;
      background: #F1F1F1;
      padding: 12px 16px;
      resize: none;
      font-family: inherit;
      font-size: 14px;
      line-height: 1.5;
      max-height: 120px;
      overflow-y: auto;

      &:focus {
        outline: none;
      }

      &::placeholder {
        color: rgba(0, 0, 0, 0.4);
      }
    }

    .attachments-preview {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 12px;
    }

    .attachment-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 8px;
      background: #F1F1F1;
      border-radius: 16px;
      font-size: 12px;

      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      .file-name {
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      button {
        width: 24px;
        height: 24px;
        line-height: 24px;

        mat-icon {
          font-size: 14px;
          width: 14px;
          height: 14px;
        }
      }
    }
  `]
})
export class MessageInputComponent {
  @Output() send = new EventEmitter<{ content: string; files: File[] }>();
  @Output() typing = new EventEmitter<boolean>();

  @ViewChild('messageInput') messageInput!: ElementRef<HTMLTextAreaElement>;

  message = '';
  selectedFiles: File[] = [];
  private typingTimeout: any;

  get canSend(): boolean {
    return this.message.trim().length > 0 || this.selectedFiles.length > 0;
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  adjustTextarea(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    
    // Emit typing status
    this.emitTypingStatus();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = [...this.selectedFiles, ...Array.from(input.files)];
    }
  }

  removeFile(index: number): void {
    this.selectedFiles = this.selectedFiles.filter((_, i) => i !== index);
  }

  sendMessage(): void {
    if (!this.canSend) return;

    this.send.emit({
      content: this.message.trim(),
      files: this.selectedFiles
    });

    this.message = '';
    this.selectedFiles = [];
    if (this.messageInput?.nativeElement) {
      this.messageInput.nativeElement.style.height = 'auto';
    }
    this.typing.emit(false);
  }

  getFileIcon(type: string): string {
    if (type.includes('image')) return 'image';
    if (type.includes('pdf')) return 'picture_as_pdf';
    if (type.includes('word') || type.includes('document')) return 'description';
    if (type.includes('spreadsheet') || type.includes('excel')) return 'table_chart';
    return 'insert_drive_file';
  }

  private emitTypingStatus(): void {
    this.typing.emit(true);
    
    clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => {
      this.typing.emit(false);
    }, 1000);
  }
}
