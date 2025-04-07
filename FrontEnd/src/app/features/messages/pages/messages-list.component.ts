import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatListModule } from '@angular/material/list';
import { Message } from '../../../core/models/message.model';
import { Chat } from '../../../core/models/chat.model';
import { selectAllChats } from '../../../store/chat';

@Component({
  selector: 'app-messages-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule
  ],
  template: `
    <div class="messages-list-container">
      <header class="messages-header">
        <h1>Messages</h1>
      </header>

      <mat-nav-list class="messages-list">
        <ng-container *ngFor="let chat of chats$ | async">
          <a mat-list-item 
             [routerLink]="['/chat', chat.id]"
             class="chat-item">
            <div class="chat-item-content">
              <div class="chat-item-header">
                <span class="participants">{{ chat.participants.join(', ') }}</span>
                <span class="time" *ngIf="chat.lastMessage">
                  {{ chat.lastMessage.timestamp | date:'shortTime' }}
                </span>
              </div>
              <div class="chat-item-message" *ngIf="chat.lastMessage">
                {{ chat.lastMessage.content }}
              </div>
              <div class="unread-badge" *ngIf="chat.unreadCount">
                {{ chat.unreadCount }}
              </div>
            </div>
          </a>
        </ng-container>
      </mat-nav-list>
    </div>
  `,
  styles: [`
    .messages-list-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      background: #FFFFFF;
    }

    .messages-header {
      padding: 24px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);

      h1 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
      }
    }

    .messages-list {
      flex: 1;
      overflow-y: auto;
      padding: 0;
    }

    .chat-item {
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
      height: auto !important;
      padding: 16px 24px;
    }

    .chat-item-content {
      width: 100%;
    }

    .chat-item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .participants {
      font-weight: 600;
      color: rgba(0, 0, 0, 0.87);
    }

    .time {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.6);
    }

    .chat-item-message {
      color: rgba(0, 0, 0, 0.6);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .unread-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 20px;
      height: 20px;
      padding: 0 6px;
      border-radius: 10px;
      background-color: #615EF0;
      color: white;
      font-size: 12px;
      font-weight: 600;
      margin-top: 8px;
    }
  `]
})
export class MessagesListComponent {
  chats$: Observable<Chat[]>;

  constructor(private store: Store) {
    this.chats$ = this.store.select(selectAllChats);
  }
}
