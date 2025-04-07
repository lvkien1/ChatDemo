import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Message } from '../models/message.model';
import { UserStatus, UserPresence } from '../models/user.model';

type WebSocketEvent = {
  type: string;
  payload: any;
};

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket | null = null;
  private isConnected$ = new BehaviorSubject<boolean>(false);
  private messages$ = new Subject<Message>();
  private presenceUpdates$ = new Subject<UserPresence>();
  private typingUpdates$ = new Subject<{ chatId: string; userId: string; isTyping: boolean }>();
  private readReceipts$ = new Subject<{ chatId: string; userId: string; lastRead: Date }>();

  connect(userId: string): void {
    // Mock implementation
    this.isConnected$.next(true);
    console.log('WebSocket connected for user:', userId);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.isConnected$.next(false);
  }

  sendMessage(message: Message): void {
    // Mock implementation
    console.log('Sending message:', message);
    this.messages$.next(message);
  }

  updateStatus(status: 'online' | 'away' | 'offline'): Observable<UserStatus> {
    // Mock implementation
    const response: UserStatus = {
      userId: 'current-user',
      status,
      lastSeen: new Date()
    };
    return new Observable(subscriber => {
      setTimeout(() => {
        subscriber.next(response);
        subscriber.complete();
      }, 100);
    });
  }

  updateTypingStatus(chatId: string, isTyping: boolean): void {
    // Mock implementation
    this.typingUpdates$.next({
      chatId,
      userId: 'current-user',
      isTyping
    });
  }

  markMessagesRead(chatId: string, messageIds: string[]): void {
    // Mock implementation
    this.readReceipts$.next({
      chatId,
      userId: 'current-user',
      lastRead: new Date()
    });
  }

  // Getters for observables
  getMessages(): Observable<Message> {
    return this.messages$.asObservable();
  }

  getPresenceUpdates(): Observable<UserPresence> {
    return this.presenceUpdates$.asObservable();
  }

  getTypingUpdates(): Observable<{ chatId: string; userId: string; isTyping: boolean }> {
    return this.typingUpdates$.asObservable();
  }

  getReadReceipts(): Observable<{ chatId: string; userId: string; lastRead: Date }> {
    return this.readReceipts$.asObservable();
  }

  getConnectionStatus(): Observable<boolean> {
    return this.isConnected$.asObservable();
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const data: WebSocketEvent = JSON.parse(event.data);
      
      switch (data.type) {
        case 'MESSAGE':
          this.messages$.next(data.payload);
          break;
        case 'PRESENCE':
          this.presenceUpdates$.next(data.payload);
          break;
        case 'TYPING':
          this.typingUpdates$.next(data.payload);
          break;
        case 'READ_RECEIPT':
          this.readReceipts$.next(data.payload);
          break;
        default:
          console.warn('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  }
}
