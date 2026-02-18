import api from '@/config/axios';
import type { Message, Conversation } from '../types';

export const chatService = {
    sendMessage: async (message: string): Promise<Message> => {
        const response = await api.post('/api/chat/post/', { message });
        return response.data;
    },
    getHistory: async (): Promise<Conversation> => {
        const response = await api.get('/api/chat/history/');
        return response.data;
    },
};
