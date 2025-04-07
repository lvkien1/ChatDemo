import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../../../core/models/user.model';
import { ChatActions } from '../../../store/chat/chat.actions';
import { UserSelectors } from '../../../store/user';
import { UserActions } from '../../../store/user/user.actions';

@Component({
  selector: 'app-new-chat-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="new-chat-dialog">
      <h2 mat-dialog-title>New Chat</h2>
      
      <form [formGroup]="chatForm" (ngSubmit)="onSubmit()">
        <mat-dialog-content>
          <div class="dialog-content">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Chat Type</mat-label>
              <mat-select formControlName="type">
                <mat-option value="direct">Direct Message</mat-option>
                <mat-option value="group">Group Chat</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width" *ngIf="chatForm.get('type')?.value === 'group'">
              <mat-label>Group Name</mat-label>
              <input matInput formControlName="name" placeholder="Enter group name">
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Participants</mat-label>
              <mat-select formControlName="participants" multiple>
                <mat-option *ngFor="let user of availableUsers$ | async" [value]="user.id">
                  {{ user.name }}
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
          <button mat-button type="button" (click)="onCancel()">Cancel</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!chatForm.valid">
            Create Chat
          </button>
        </mat-dialog-actions>
      </form>
    </div>
  `,
  styles: [`
    .new-chat-dialog {
      padding: 24px;
      min-width: 400px;
    }

    .dialog-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    mat-dialog-actions {
      margin-top: 24px;
      gap: 8px;
    }
  `]
})
export class NewChatDialogComponent implements OnInit {
  chatForm: FormGroup;
  availableUsers$: Observable<User[]>;

  constructor(
    private dialogRef: MatDialogRef<NewChatDialogComponent>,
    private formBuilder: FormBuilder,
    private store: Store
  ) {
    const currentUser$ = this.store.select(UserSelectors.selectCurrentUser);
    const allUsers$ = this.store.select(UserSelectors.selectAllUsers);

    this.availableUsers$ = combineLatest([currentUser$, allUsers$]).pipe(
      map(([currentUser, users]) => users.filter(user => user.id !== currentUser?.id))
    );

    this.chatForm = this.formBuilder.group({
      type: ['direct', Validators.required],
      name: [''],
      participants: [[], [Validators.required, Validators.minLength(1)]]
    });

    // Add validators for group chat name when type is 'group'
    this.chatForm.get('type')?.valueChanges.subscribe(type => {
      const nameControl = this.chatForm.get('name');
      if (type === 'group') {
        nameControl?.setValidators([Validators.required, Validators.minLength(3)]);
      } else {
        nameControl?.clearValidators();
      }
      nameControl?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    // Load users if not already loaded
    this.store.dispatch(UserActions.loadUsers());
  }

  onSubmit(): void {
    if (this.chatForm.valid) {
      const { type, name, participants } = this.chatForm.value;
      
      this.store.dispatch(ChatActions.createChat({ 
        type,
        name: type === 'group' ? name : undefined,
        participants 
      }));

      this.dialogRef.close();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
