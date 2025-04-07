import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { environment } from '../../../environments/environment';
import { Message } from '../models/message.model';
import { UserStatus } from '../models/user.model';

export interface WebSocketMessage {
  type: 'message' | 'typing' | 'presence';
  payload: any;
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket$?: WebSocketSubject<WebSocketMessage>;
  private messageSubject = new Subject<Message>();
  private typingSubject = new Subject<{ userId: string; chatId: string }>();
  private presenceSubject = new BehaviorSubject<UserStatus[]>([]);
  private reconnectionAttempts = 0;
  private maxReconnectionAttempts = 5;

  constructor() {}

  connect(): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket<WebSocketMessage>({
        url: `${environment.apiUrl.replace('http', 'ws')}/ws`,
        openObserver: {
          next: () => {
            console.log('WebSocket connection established');
            this.reconnectionAttempts = 0;
          }
        },
        closeObserver: {
          next: () => {
            console.log('WebSocket connection closed');
            this.attemptReconnection();
          }
        }
      });

      this.socket$.subscribe({
        next: (message) => this.handleMessage(message),
        error: (error) => {
          console.error('WebSocket error:', error);
          this.attemptReconnection();
        }
      });
    }
  }

  private attemptReconnection(): void {
    if (this.reconnectionAttempts < this.maxReconnectionAttempts) {
      this.reconnectionAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectionAttempts}/${this.maxReconnectionAttempts})`);
      setTimeout(() => this.connect(), 1000 * Math.pow(2, this.reconnectionAttempts));
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  private handleMessage(message: WebSocketMessage): void {
    switch (message.type) {
      case 'message':
        this.messageSubject.next(message.payload);
        break;
      case 'typing':
        this.typingSubject.next(message.payload);
        break;
      case 'presence':
        this.presenceSubject.next(message.payload);
        break;
      default:
        console.warn('Unknown message type:', message);
    }
  }

  sendMessage(message: Message): void {
    this.socket$?.next({
      type: 'message',
      payload: message
    });
  }

  sendTyping(chatId: string, isTyping: boolean): void {
    this.socket$?.next({
      type: 'typing',
      payload: { chatId, isTyping }
    });
  }

  updatePresence(status: UserStatus): void {
    this.socket$?.next({
      type: 'presence',
      payload: status
    });
  }

  onMessage(): Observable<Message> {
    return this.messageSubject.asObservable();
  }

  onTyping(): Observable<{ userId: string; chatId: string }> {
    return this.typingSubject.asObservable();
  }

  onPresenceChange(): Observable<UserStatus[]> {
    return this.presenceSubject.asObservable();
  }

  disconnect(): void {
    this.socket$?.complete();
  }

  // For development purposes, simulate receiving messages
  simulateIncomingMessage(message: Message): void {
    this.messageSubject.next(message);
  }

  simulateTyping(userId: string, chatId: string): void {
    this.typingSubject.next({ userId, chatId });
  }

  simulatePresenceChange(status: UserStatus): void {
    const currentStatuses = this.presenceSubject.value;
    const updatedStatuses = currentStatuses
      .filter(s => s.userId !== status.userId)
      .concat(status);
    this.presenceSubject.next(updatedStatuses);
  }
}
