import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Chat } from '../models/chat.model';
import { Message } from '../models/message.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = `${environment.apiUrl}/chats`;

  constructor(private http: HttpClient) {}

  getChats(): Observable<Chat[]> {
    // For development, use mock data
    return this.getMockChats();
    // return this.http.get<Chat[]>(this.apiUrl);
  }

  getMessages(chatId: string): Observable<Message[]> {
    // For development, use mock data
    return this.getMockMessages(chatId);
    // return this.http.get<Message[]>(`${this.apiUrl}/${chatId}/messages`);
  }

  sendMessage(chatId: string, message: Partial<Message>): Observable<Message> {
    // For development, return a mock response
    const mockResponse: Message = {
      ...message as Message,
      id: Math.random().toString(36).substr(2, 9),
      chatId,
      timestamp: new Date(),
      status: 'sent'
    };
    return of(mockResponse);
    // return this.http.post<Message>(`${this.apiUrl}/${chatId}/messages`, message);
  }

  uploadFile(chatId: string, file: File): Observable<Message> {
    const formData = new FormData();
    formData.append('file', file);
    
    // For development, return a mock file message
    const mockFileMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      chatId,
      senderId: 'currentUser',
      type: 'file',
      content: '',
      timestamp: new Date(),
      status: 'sent',
      attachments: [{
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file)
      }]
    };
    return of(mockFileMessage);
    // return this.http.post<Message>(`${this.apiUrl}/${chatId}/attachments`, formData);
  }

  markAsRead(chatId: string): Observable<void> {
    // For development, return empty response
    return of(void 0);
    // return this.http.post<void>(`${this.apiUrl}/${chatId}/read`, {});
  }

  // Mock data methods
  private getMockChats(): Observable<Chat[]> {
    const now = new Date();
    const mockChats: Chat[] = [
      {
        id: '1',
        participants: ['John Doe', 'Jane Smith'],
        lastMessage: {
          id: '1',
          chatId: '1',
          content: 'Hello there!',
          senderId: 'Jane Smith',
          type: 'text',
          timestamp: new Date(Date.now() - 3600000),
          status: 'read'
        },
        unreadCount: 2,
        createdAt: new Date(now.getTime() - 86400000), // 1 day ago
        updatedAt: new Date(now.getTime() - 3600000) // 1 hour ago
      },
      {
        id: '2',
        participants: ['John Doe', 'Alice Johnson'],
        lastMessage: {
          id: '2',
          chatId: '2',
          content: 'Did you see the latest update?',
          senderId: 'Alice Johnson',
          type: 'text',
          timestamp: new Date(Date.now() - 1800000),
          status: 'delivered'
        },
        unreadCount: 0,
        createdAt: new Date(now.getTime() - 172800000), // 2 days ago
        updatedAt: new Date(now.getTime() - 1800000) // 30 minutes ago
      }
    ];

    return of(mockChats);
  }

  private getMockMessages(chatId: string): Observable<Message[]> {
    const mockMessages: Message[] = [
      {
        id: '1',
        chatId,
        content: 'Hello there!',
        senderId: 'Jane Smith',
        type: 'text',
        timestamp: new Date(Date.now() - 3600000),
        status: 'read'
      },
      {
        id: '2',
        chatId,
        content: 'Hi! How are you?',
        senderId: 'currentUser',
        type: 'text',
        timestamp: new Date(Date.now() - 3500000),
        status: 'read'
      },
      {
        id: '3',
        chatId,
        content: 'I\'m doing great, thanks!',
        senderId: 'Jane Smith',
        type: 'text',
        timestamp: new Date(Date.now() - 3400000),
        status: 'delivered'
      }
    ];

    return of(mockMessages);
  }
}
