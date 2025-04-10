import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { Chat, getChatName, getChatAvatar } from '../../../core/models/chat.model';
import { UserSelectors } from '../../../store/user';
import * as ChatSelectors from '../../../store/chat/chat.selectors';
import { ChatActions } from '../../../store/chat/chat.actions';
import { ChatUtil } from '../../../utils/ChatUtil';
import { selectCurrentTheme } from '../../../store/user/user.selectors';

interface ChatViewModel {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: {
    content: string;
    timestamp: Date;
  };
  unreadCount: number;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="chat-container">
      <aside class="chat-list">
        <div class="chat-list-header">
          <h2>Chats</h2>
          <button class="new-chat-btn" (click)="onNewChat()">
            <span class="material-icons">add</span>
          </button>
        </div>

        <div class="chat-items">
          <a
            *ngFor="let chat of chatViewModels$ | async"
            [routerLink]="['./', chat.id]"
            routerLinkActive="active"
            class="chat-item"
          >
            <img
              [src]="chat.avatar"
              [alt]="chat.name"
              *ngIf="chat.avatar; else initialAvatar"
              class="chat-avatar"
            />
            <ng-template #initialAvatar>
              <div class="initial-avatar" [style.fontSize.px]="40 * 0.4">
                {{ ChatUtil.getInitials(chat.name) }}
              </div>
            </ng-template>
            <div class="chat-info">
              <div class="chat-name">{{ chat.name }}</div>
              <div class="chat-preview" *ngIf="chat.lastMessage">
                {{ chat.lastMessage.content }}
              </div>
            </div>
            <div class="chat-meta">
              <span class="time" *ngIf="chat.lastMessage">
                {{ chat.lastMessage.timestamp | date : 'shortTime' }}
              </span>
              <span class="unread-count" *ngIf="chat.unreadCount">
                {{ chat.unreadCount }}
              </span>
            </div>
          </a>
        </div>
      </aside>

      <main class="chat-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .chat-container {
        display: flex;
        height: 100vh;
        background-color: var(--bg-primary);
        color: var(--text-primary);
      }

      .chat-list {
        width: 320px;
        border-right: 1px solid var(--border-color);
        display: flex;
        flex-direction: column;
        background-color: var(--bg-primary);
      }

      .chat-list-header {
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid var(--border-color);

        h2 {
          margin: 0;
          font-size: 1.25rem;
          color: var(--text-primary);
        }
      }

      .new-chat-btn {
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 50%;
        background: transparent;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #0084ff;
        transition: background-color 0.2s;

        &:hover {
          background: rgba(0, 132, 255, 0.1);
        }
      }

      .initial-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #615ef0;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .chat-items {
        flex: 1;
        overflow-y: auto;
      }

      .chat-item {
        display: flex;
        align-items: center;
        padding: 0.75rem 1rem;
        text-decoration: none;
        color: var(--text-primary);
        gap: 0.75rem;
        transition: background-color 0.2s;

        &:hover {
          background: var(--hover-bg);
        }

        &.active {
          background: rgba(97, 94, 240, 0.08);
        }
      }

      .chat-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        object-fit: cover;
      }

      .chat-info {
        flex: 1;
        min-width: 0;

        .chat-name {
          font-weight: 500;
          margin-bottom: 0.25rem;
          color: var(--text-primary);
        }

        .chat-preview {
          font-size: 0.875rem;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .chat-meta {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.25rem;

        .time {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .unread-count {
          background: #615ef0;
          color: white;
          font-size: 0.75rem;
          padding: 0.125rem 0.375rem;
          border-radius: 1rem;
          min-width: 1.5rem;
          text-align: center;
        }
      }

      .chat-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        background-color: var(--bg-secondary);
      }
    `,
  ],
})
export class ChatComponent implements OnInit {
  chatViewModels$: Observable<ChatViewModel[]>;
  currentTheme$: Observable<'light' | 'dark'>;
  ChatUtil = ChatUtil;

  constructor(private store: Store) {
    const chats$ = this.store.select(ChatSelectors.selectAllChats);
    const currentUserId$ = this.store
      .select(UserSelectors.selectCurrentUser)
      .pipe(map((user) => user?.id ?? ''));
    this.currentTheme$ = this.store.select(selectCurrentTheme);

    this.chatViewModels$ = combineLatest([chats$, currentUserId$]).pipe(
      map(([chats, userId]) =>
        chats.map((chat) => ({
          id: chat.id,
          name: getChatName(chat, userId),
          avatar: getChatAvatar(chat, userId),
          lastMessage: chat.lastMessage
            ? {
                content: chat.lastMessage.content,
                timestamp: chat.lastMessage.timestamp,
              }
            : undefined,
          unreadCount: chat.unreadCount,
        }))
      )
    );
  }

  ngOnInit(): void {
    this.store.dispatch(ChatActions.loadChats());
  }

  onNewChat(): void {
    // TODO: Implement new chat dialog
    console.log('New chat clicked');
  }
}
