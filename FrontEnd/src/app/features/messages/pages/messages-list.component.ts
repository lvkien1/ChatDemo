import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

import { selectAllChats } from '../../../store/chat/chat.selectors';

@Component({
  selector: 'app-messages-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule
  ],
  template: `
    <div class="messages-list-container">
      <header class="messages-header">
        <h1>Messages</h1>
        <div class="header-actions">
          <button class="search-button">
            <mat-icon>search</mat-icon>
          </button>
          <button class="filter-button">
            <mat-icon>filter_list</mat-icon>
          </button>
        </div>
      </header>

      <div class="messages-content">
        <!-- Filters -->
        <div class="filters">
          <button class="filter-chip active">All</button>
          <button class="filter-chip">Unread</button>
          <button class="filter-chip">Flagged</button>
        </div>

        <!-- Messages List -->
        <div class="messages-grid">
          <ng-container *ngIf="chats$ | async as chats">
            <div *ngFor="let chat of chats" 
                 class="message-card"
                 [routerLink]="['/chat', chat.id]">
              <div class="message-header">
                <span class="participants">{{ chat.participants.join(', ') }}</span>
                <span class="timestamp">{{ chat.lastMessage?.timestamp | date:'shortTime' }}</span>
              </div>
              <div class="message-preview" *ngIf="chat.lastMessage">
                {{ chat.lastMessage.content }}
              </div>
              <div class="message-footer">
                <div class="message-type" *ngIf="chat.lastMessage?.attachments?.length">
                  <mat-icon>attach_file</mat-icon>
                  <span>{{ chat.lastMessage.attachments.length }} attachments</span>
                </div>
                <div class="unread-badge" *ngIf="chat.unreadCount">
                  {{ chat.unreadCount }}
                </div>
              </div>
            </div>
          </ng-container>
        </div>
      </div>
    </div>
  `
})
export class MessagesListComponent implements OnInit {
  chats$: Observable<any[]>;

  constructor(private store: Store) {
    this.chats$ = this.store.select(selectAllChats);
  }

  ngOnInit(): void {
    // Load initial data if needed
  }
}
