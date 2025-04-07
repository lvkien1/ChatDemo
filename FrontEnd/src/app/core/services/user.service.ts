import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { User, UserStatus } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private onlineUsers = new BehaviorSubject<UserStatus[]>([]);

  constructor(
    private http: HttpClient,
    private websocketService: WebsocketService
  ) {
    // Subscribe to presence changes from WebSocket
    this.websocketService.onPresenceChange().subscribe(statuses => {
      this.onlineUsers.next(statuses);
    });
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  updateUser(id: string, data: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, data);
  }

  updateAvatar(id: string, file: File): Observable<User> {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.post<User>(`${this.apiUrl}/${id}/avatar`, formData);
  }

  // For development, return mock data
  getMockCurrentUser(): Observable<User> {
    const mockUser: User = {
      id: 'currentUser',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: undefined,
      isOnline: true
    };
    this.currentUserSubject.next(mockUser);
    return this.currentUserSubject.asObservable() as Observable<User>;
  }

  updatePresence(status: UserStatus): void {
    this.websocketService.updatePresence(status);
  }

  getOnlineUsers(): Observable<UserStatus[]> {
    return this.onlineUsers.asObservable();
  }

  isUserOnline(userId: string): Observable<boolean> {
    return this.onlineUsers.pipe(
      map(statuses => statuses.some(s => s.userId === userId && s.status === 'online'))
    );
  }

  // For development purposes
  simulateUserOnline(userId: string): void {
    const status: UserStatus = {
      userId,
      status: 'online',
      lastSeen: new Date()
    };
    const currentStatuses = this.onlineUsers.value;
    const updatedStatuses = currentStatuses
      .filter(s => s.userId !== userId)
      .concat(status);
    this.onlineUsers.next(updatedStatuses);
  }

  simulateUserOffline(userId: string): void {
    const status: UserStatus = {
      userId,
      status: 'offline',
      lastSeen: new Date()
    };
    const currentStatuses = this.onlineUsers.value;
    const updatedStatuses = currentStatuses
      .filter(s => s.userId !== userId)
      .concat(status);
    this.onlineUsers.next(updatedStatuses);
  }
}
