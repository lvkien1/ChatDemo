import { Routes } from '@angular/router';
import { ChatDetailComponent } from './pages/chat-detail.component';
import { ChatComponent } from './pages/chat.component';

export const routes: Routes = [
  {
    path: '',
    component: ChatComponent,
    children: [
      {
        path: ':id',
        component: ChatDetailComponent
      }
    ]
  }
];
