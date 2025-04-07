import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { Store } from '@ngrx/store';

import { NavigationSidebarComponent } from './shared/components/navigation-sidebar/navigation-sidebar.component';
import { MessagesListComponent } from './features/messages/pages/messages-list.component';
import { WebsocketService } from './core/services/websocket.service';
import { ChatActions } from './store/chat';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    NavigationSidebarComponent,
    MessagesListComponent
  ],
  template: `
    <mat-sidenav-container class="app-container">
      <!-- Navigation Sidebar -->
      <mat-sidenav
        #navigationSidenav
        mode="side"
        opened
        class="navigation-sidenav"
        [fixedInViewport]="true"
      >
        <app-navigation-sidebar></app-navigation-sidebar>
      </mat-sidenav>

      <!-- Messages List Sidebar -->
      <mat-sidenav
        #messagesSidenav
        position="start"
        mode="side"
        opened
        class="messages-sidenav"
        [fixedInViewport]="true"
        [fixedTopGap]="0"
        [style.marginLeft.px]="navigationSidenav.opened ? 80 : 0"
      >
        <app-messages-list></app-messages-list>
      </mat-sidenav>

      <!-- Main Content -->
      <mat-sidenav-content 
        [style.marginLeft.px]="messagesSidenav.opened ? (navigationSidenav.opened ? 429 : 349) : (navigationSidenav.opened ? 80 : 0)"
      >
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .app-container {
      width: 100%;
      height: 100vh;
      background: #F3F3F3;
    }

    .navigation-sidenav {
      width: 80px;
      border: none;
    }

    .messages-sidenav {
      width: 349px;
      border: none;
    }

    mat-sidenav-content {
      transition: margin 0.2s ease;
    }
  `]
})
export class AppComponent {
  @ViewChild('navigationSidenav') navigationSidenav!: MatSidenav;
  @ViewChild('messagesSidenav') messagesSidenav!: MatSidenav;

  constructor(
    private store: Store,
    private websocketService: WebsocketService
  ) {
    this.initializeApp();
  }

  private initializeApp(): void {
    // Load initial data
    this.store.dispatch(ChatActions.loadChats());
    
    // Connect to WebSocket
    this.websocketService.connect();

    // Setup WebSocket event listeners
    this.websocketService.onMessage().subscribe(message => {
      this.store.dispatch(ChatActions.messageReceived({ message }));
    });

    this.websocketService.onTyping().subscribe(({ userId, chatId }) => {
      this.store.dispatch(ChatActions.userTyping({ userId, chatId }));
    });

    this.websocketService.onPresenceChange().subscribe(status => {
      // Handle presence changes - will be implemented later
    });
  }
}
