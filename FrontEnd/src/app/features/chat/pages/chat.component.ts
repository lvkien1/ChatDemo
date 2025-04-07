import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ChatActions } from '../../../store/chat';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chat-container">
      <h1>Chat Overview</h1>
      <!-- Content will be implemented later -->
    </div>
  `,
  styles: [`
    .chat-container {
      padding: 24px;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }
  `]
})
export class ChatComponent {
  constructor(private store: Store) {
    this.store.dispatch(ChatActions.loadChats());
  }
}
