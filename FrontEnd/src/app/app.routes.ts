import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'chat',
    pathMatch: 'full'
  },
  {
    path: 'chat',
    loadChildren: () => 
      import('./features/chat/chat.routes')
        .then(m => m.CHAT_ROUTES)
  },
  {
    path: 'messages',
    loadChildren: () => 
      import('./features/messages/messages.routes')
        .then(m => m.MESSAGES_ROUTES)
  },
  {
    path: 'files',
    loadChildren: () => 
      import('./features/files/files.routes')
        .then(m => m.FILES_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'chat'
  }
];
