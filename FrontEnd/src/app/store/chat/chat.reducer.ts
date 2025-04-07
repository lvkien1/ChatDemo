import { createReducer, on } from '@ngrx/store';
import { Chat } from '../../core/models/chat.model';
import { Message } from '../../core/models/message.model';
import { ChatActions } from './chat.actions';

interface TypingStatus {
  chatId: string;
  isTyping: boolean;
  timestamp: number;
}

export interface ChatState {
  chats: Chat[];
  messages: Message[];
  selectedChatId: string | null;
  typingUsers: { [userId: string]: TypingStatus };
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  chats: [],
  messages: [],
  selectedChatId: null,
  typingUsers: {},
  loading: false,
  error: null
};

export const chatReducer = createReducer(
  initialState,

  // Load Chats
  on(ChatActions.loadChats, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ChatActions.loadChatsSuccess, (state, { chats }) => ({
    ...state,
    chats,
    loading: false,
    error: null
  })),

  on(ChatActions.loadChatsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Select Chat
  on(ChatActions.selectChat, (state, { chatId }) => ({
    ...state,
    selectedChatId: chatId
  })),

  // Load Messages
  on(ChatActions.loadMessages, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ChatActions.loadMessagesSuccess, (state, { messages }) => ({
    ...state,
    messages: [
      ...state.messages.filter(msg => msg.chatId !== state.selectedChatId),
      ...messages
    ],
    loading: false,
    error: null
  })),

  on(ChatActions.loadMessagesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Send Message
  on(ChatActions.sendMessage, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ChatActions.sendMessageSuccess, (state, { message }) => ({
    ...state,
    messages: [...state.messages, message],
    loading: false,
    error: null
  })),

  on(ChatActions.sendMessageFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Message Received
  on(ChatActions.messageReceived, (state, { message }) => ({
    ...state,
    messages: [...state.messages, message]
  })),

  // Upload File
  on(ChatActions.uploadFile, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ChatActions.uploadFileSuccess, (state, { message }) => ({
    ...state,
    messages: [...state.messages, message],
    loading: false,
    error: null
  })),

  on(ChatActions.uploadFileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Typing Status
  on(ChatActions.setTypingStatus, (state, { chatId, isTyping }) => ({
    ...state,
    typingUsers: {
      ...state.typingUsers,
      'currentUser': { chatId, isTyping, timestamp: Date.now() }
    }
  })),

  on(ChatActions.userTyping, (state, { userId, chatId }) => ({
    ...state,
    typingUsers: {
      ...state.typingUsers,
      [userId]: { chatId, isTyping: true, timestamp: Date.now() }
    }
  })),

  // Mark as Read
  on(ChatActions.markChatAsRead, state => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ChatActions.markChatAsReadSuccess, (state, { chatId }) => ({
    ...state,
    chats: state.chats.map(chat =>
      chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
    ),
    loading: false,
    error: null
  })),

  on(ChatActions.markChatAsReadFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
