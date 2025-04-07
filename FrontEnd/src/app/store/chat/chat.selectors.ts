import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChatState } from './chat.reducer';

export const selectChatState = createFeatureSelector<ChatState>('chat');

export const selectAllChats = createSelector(
  selectChatState,
  state => state.chats
);

export const selectSelectedChatId = createSelector(
  selectChatState,
  state => state.selectedChatId
);

export const selectSelectedChat = createSelector(
  selectChatState,
  state => state.selectedChatId ? state.chats.find(chat => chat.id === state.selectedChatId) : null
);

export const selectCurrentChatMessages = createSelector(
  selectChatState,
  state => state.selectedChatId ? 
    state.messages.filter(msg => msg.chatId === state.selectedChatId) : []
);

export const selectUnreadCount = createSelector(
  selectChatState,
  state => state.chats.reduce((total, chat) => total + (chat.unreadCount || 0), 0)
);

export const selectTypingUsers = createSelector(
  selectChatState,
  state => state.typingUsers
);

export const selectTypingUsersForCurrentChat = createSelector(
  selectTypingUsers,
  selectSelectedChatId,
  (typingUsers, chatId) => chatId ? 
    Object.entries(typingUsers)
      .filter(([_, data]) => data.chatId === chatId && data.isTyping)
      .map(([userId]) => userId) : 
    []
);

export const selectIsChatLoading = createSelector(
  selectChatState,
  state => state.loading
);

export const selectChatError = createSelector(
  selectChatState,
  state => state.error
);
