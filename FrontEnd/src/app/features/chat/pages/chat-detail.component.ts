import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { Chat } from '../../../core/models/chat.model';
import { Message } from '../../../core/models/message.model';
import { ChatActions } from '../../../store/chat';
import { selectSelectedChat, selectCurrentChatMessages, selectTypingUsersForCurrentChat } from '../../../store/chat';
import { MessageBubbleComponent } from '../../../shared/components/message-bubble/message-bubble.component';
import { MessageInputComponent } from '../../../shared/components/message-input/message-input.component';
import { UserAvatarComponent } from '../../../shared/components/user-avatar/user-avatar.component';
import { ImagePreviewDialogComponent } from '../../../shared/components/image-preview-dialog/image-preview-dialog.component';

@Component({
  selector: 'app-chat-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MessageBubbleComponent,
    MessageInputComponent,
    UserAvatarComponent
  ],
  template: `
    <div class="chat-detail-container">
      <!-- Chat Header -->
      <header class="chat-header" *ngIf="selectedChat$ | async as chat">
        <div class="header-info">
          <app-user-avatar
            [name]="chat.participants.join(', ')"
            size="medium"
          ></app-user-avatar>
          <div class="participant-info">
            <h2>{{ chat.participants.join(', ') }}</h2>
            <span class="status" *ngIf="typingUsers$ | async as typingUsers">
              <ng-container *ngIf="typingUsers.length > 0; else online">
                {{ typingUsers.join(', ') }} {{ typingUsers.length === 1 ? 'is' : 'are' }} typing...
              </ng-container>
              <ng-template #online>Online</ng-template>
            </span>
          </div>
        </div>
        <div class="header-actions">
          <button mat-icon-button color="primary">
            <mat-icon>call</mat-icon>
          </button>
          <button mat-icon-button color="primary">
            <mat-icon>videocam</mat-icon>
          </button>
          <button mat-icon-button>
            <mat-icon>more_vert</mat-icon>
          </button>
        </div>
      </header>

      <!-- Messages List -->
      <div class="messages-container" #messagesContainer>
        <div class="messages-list">
          <app-message-bubble
            *ngFor="let message of messages$ | async"
            [message]="message"
            [isSent]="message.senderId === currentUserId"
            [senderName]="message.senderId"
          ></app-message-bubble>
        </div>
      </div>

      <!-- Message Input -->
      <app-message-input
        (send)="onSendMessage($event)"
        (typing)="onTypingStatus($event)"
      ></app-message-input>
    </div>
  `,
  styles: [`
    .chat-detail-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
      background: white;
    }

    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
      background: white;
      height: 72px;
    }

    .header-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .participant-info {
      h2 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 4px;
      }

      .status {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.6);
      }
    }

    .header-actions {
      display: flex;
      gap: 8px;
    }

    .messages-container {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      scroll-behavior: smooth;
    }

    .messages-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  `]
})
export class ChatDetailComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  selectedChat$: Observable<Chat | null>;
  messages$: Observable<Message[]>;
  typingUsers$: Observable<string[]>;
  currentUserId = 'currentUser'; // This should come from auth service
  private destroy$ = new Subject<void>();
  private shouldScrollToBottom = false;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private dialog: MatDialog
  ) {
    this.selectedChat$ = this.store.select(selectSelectedChat).pipe(
      filter((chat): chat is Chat | null => chat !== undefined)
    );
    this.messages$ = this.store.select(selectCurrentChatMessages);
    this.typingUsers$ = this.store.select(selectTypingUsersForCurrentChat);

    // Subscribe to messages to trigger scroll
    this.messages$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.shouldScrollToBottom = true;
    });
  }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const chatId = params['id'];
        if (chatId) {
          this.store.dispatch(ChatActions.selectChat({ chatId }));
          this.store.dispatch(ChatActions.loadMessages({ chatId }));
        }
      });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private scrollToBottom(): void {
    try {
      const container = this.messagesContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  onSendMessage(event: { content: string; files: File[] }): void {
    const chatId = this.route.snapshot.params['id'];
    if (!chatId) return;

    if (event.files.length > 0) {
      event.files.forEach(file => {
        this.store.dispatch(ChatActions.uploadFile({ chatId, file }));
      });
    }

    if (event.content.trim()) {
      this.store.dispatch(ChatActions.sendMessage({
        chatId,
        message: {
          content: event.content,
          senderId: this.currentUserId,
          type: 'text'
        }
      }));
    }
  }

  onTypingStatus(isTyping: boolean): void {
    const chatId = this.route.snapshot.params['id'];
    if (chatId) {
      this.store.dispatch(ChatActions.setTypingStatus({ chatId, isTyping }));
    }
  }
}
