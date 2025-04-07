import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Chat } from '../../core/models/chat.model';
import { Message } from '../../core/models/message.model';

export const ChatActions = createActionGroup({
  source: 'Chat',
  events: {
    // Load Chats
    'Load Chats': emptyProps(),
    'Load Chats Success': props<{ chats: Chat[] }>(),
    'Load Chats Failure': props<{ error: string }>(),

    // Select Chat
    'Select Chat': props<{ chatId: string }>(),

    // Load Messages
    'Load Messages': props<{ chatId: string }>(),
    'Load Messages Success': props<{ messages: Message[] }>(),
    'Load Messages Failure': props<{ error: string }>(),

    // Send Message
    'Send Message': props<{ chatId: string; message: Partial<Message> }>(),
    'Send Message Success': props<{ message: Message }>(),
    'Send Message Failure': props<{ error: string }>(),

    // Message Received
    'Message Received': props<{ message: Message }>(),

    // Upload File
    'Upload File': props<{ chatId: string; file: File }>(),
    'Upload File Success': props<{ message: Message }>(),
    'Upload File Failure': props<{ error: string }>(),

    // Typing Status
    'Set Typing Status': props<{ chatId: string; isTyping: boolean }>(),
    'User Typing': props<{ userId: string; chatId: string }>(),

    // Mark as Read
    'Mark Chat As Read': props<{ chatId: string }>(),
    'Mark Chat As Read Success': props<{ chatId: string }>(),
    'Mark Chat As Read Failure': props<{ error: string }>()
  }
});
