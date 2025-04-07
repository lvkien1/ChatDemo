export interface Message {
    id: string;
    content: string;
    senderId: string;
    receiverId?: string;
    chatId: string;
    timestamp: Date;
    status: MessageStatus;
    type: MessageType;
    attachments?: FileAttachment[];
    labels?: string[];
}

export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed';
export type MessageType = 'text' | 'file' | 'system';

export interface FileAttachment {
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
    preview?: string;
}
