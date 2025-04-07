import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, mergeMap, catchError, withLatestFrom, filter } from 'rxjs/operators';
import { ChatService } from '../../core/services/chat.service';
import { WebsocketService } from '../../core/services/websocket.service';
import { ChatActions } from './chat.actions';
import { selectSelectedChatId } from './chat.selectors';

@Injectable()
export class ChatEffects {
  loadChats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.loadChats),
      mergeMap(() =>
        this.chatService.getChats().pipe(
          map(chats => ChatActions.loadChatsSuccess({ chats })),
          catchError(error => of(ChatActions.loadChatsFailure({ error: error.message })))
        )
      )
    )
  );

  loadMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.loadMessages),
      mergeMap(({ chatId }) =>
        this.chatService.getMessages(chatId).pipe(
          map(messages => ChatActions.loadMessagesSuccess({ messages })),
          catchError(error => of(ChatActions.loadMessagesFailure({ error: error.message })))
        )
      )
    )
  );

  sendMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.sendMessage),
      mergeMap(({ chatId, message }) =>
        this.chatService.sendMessage(chatId, message).pipe(
          map(response => ChatActions.sendMessageSuccess({ message: response })),
          catchError(error => of(ChatActions.sendMessageFailure({ error: error.message })))
        )
      )
    )
  );

  uploadFile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.uploadFile),
      mergeMap(({ chatId, file }) =>
        this.chatService.uploadFile(chatId, file).pipe(
          map(message => ChatActions.uploadFileSuccess({ message })),
          catchError(error => of(ChatActions.uploadFileFailure({ error: error.message })))
        )
      )
    )
  );

  markAsRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.markChatAsRead),
      mergeMap(({ chatId }) =>
        this.chatService.markAsRead(chatId).pipe(
          map(() => ChatActions.markChatAsReadSuccess({ chatId })),
          catchError(error => of(ChatActions.markChatAsReadFailure({ error: error.message })))
        )
      )
    )
  );

  // WebSocket Effects
  typingStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.setTypingStatus),
      withLatestFrom(this.store.select(selectSelectedChatId)),
      filter(([_, chatId]) => !!chatId),
      mergeMap(([{ isTyping }, chatId]) =>
        of(this.websocketService.sendTyping(chatId || '', isTyping))
      )
    ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private chatService: ChatService,
    private websocketService: WebsocketService
  ) {}
}
