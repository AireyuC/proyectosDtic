export interface Message {
    id: string; // or number, depending on backend
    content: string;
    sender: 'user' | 'bot';
    timestamp: string;
}

export interface Conversation {
    id: string;
    messages: Message[];
}
