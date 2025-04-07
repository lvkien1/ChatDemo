import { Routes } from '@angular/router';

export const CHAT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./pages/chat.component')
        .then(m => m.ChatComponent)
  },
  {
    path: ':id',
    loadComponent: () => 
      import('./pages/chat-detail.component')
        .then(m => m.ChatDetailComponent)
  }
];
