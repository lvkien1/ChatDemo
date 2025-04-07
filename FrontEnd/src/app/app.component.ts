import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { NavigationSidebarComponent } from './shared/components/navigation-sidebar/navigation-sidebar.component';
import { UserActions } from './store/user/user.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavigationSidebarComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit() {
    // Load the current user when the app starts
    this.store.dispatch(UserActions.loadCurrentUser());
  }
}
