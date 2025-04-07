import { Component, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="message-input">
      <input type="file" #fileInput hidden (change)="handleFileInput($event)" />

      <button type="button" class="attach-button" (click)="fileInput.click()">
        <span class="material-icons">attach_file</span>
      </button>

      <textarea
        #messageInput
        [(ngModel)]="message"
        (ngModelChange)="onInputChange()"
        (keydown)="onKeyPress($event)"
        placeholder="Type a message..."
        rows="1"
      ></textarea>

      <button
        type="button"
        class="send-button"
        [disabled]="!message.trim()"
        (click)="sendMessage()"
      >
        <span class="material-icons">send</span>
      </button>
    </div>
  `,
  styles: [
    `
      .message-input {
        display: flex;
        align-items: flex-end;
        gap: 0.5rem;
        padding: 1rem;
        background: white;
        border-top: 1px solid rgba(0, 0, 0, 0.12);
      }

      textarea {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid rgba(0, 0, 0, 0.12);
        border-radius: 1rem;
        resize: none;
        max-height: 150px;
        font-family: inherit;
        font-size: inherit;
        line-height: 1.5;

        &:focus {
          outline: none;
          border-color: #0084ff;
        }
      }

      button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 50%;
        background: transparent;
        cursor: pointer;
        color: #0084ff;
        transition: background-color 0.2s;

        &:hover {
          background: rgba(0, 132, 255, 0.1);
        }

        &:disabled {
          color: rgba(0, 0, 0, 0.3);
          cursor: default;

          &:hover {
            background: transparent;
          }
        }

        .material-icons {
          font-size: 24px;
        }
      }
    `,
  ],
})
export class MessageInputComponent {
  @Output() messageSent = new EventEmitter<string>();
  @Output() fileSelected = new EventEmitter<File>();
  @Output() typing = new EventEmitter<boolean>();

  @ViewChild('messageInput') messageInput!: ElementRef<HTMLTextAreaElement>;

  message: string = '';
  private typingTimeout: NodeJS.Timeout | null = null;

  onInputChange(): void {
    // Auto-resize textarea
    const textarea = this.messageInput.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';

    // Handle typing indication
    this.typing.emit(true);
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    this.typingTimeout = setTimeout(() => {
      this.typing.emit(false);
      this.typingTimeout = null;
    }, 1000);
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage(): void {
    const content = this.message.trim();
    if (content) {
      this.messageSent.emit(content);
      this.message = '';
      this.messageInput.nativeElement.style.height = 'auto';
      this.typing.emit(false);
    }
  }

  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fileSelected.emit(file);
      input.value = ''; // Reset input
    }
  }

  ngOnDestroy(): void {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
  }
}
