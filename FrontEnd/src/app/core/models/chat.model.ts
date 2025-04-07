import { Message } from './message.model';

export interface Chat {
    id: string;
    participants: string[];
    lastMessage?: Message;
    unreadCount: number;
    labels?: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ChatLabel {
    id: string;
    name: string;
    color: string;
}
