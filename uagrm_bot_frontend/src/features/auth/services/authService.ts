import api from '@/config/axios';
import type { AuthResponse, User } from '../types';

export const authService = {
    login: async (credentials: any): Promise<AuthResponse> => {
        const response = await api.post('/api/auth/login/', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },
    logout: async () => {
        try {
            await api.post('/api/auth/logout/');
        } finally {
            localStorage.removeItem('token');
        }
    },
    getUser: async (): Promise<User> => {
        const response = await api.get('/api/auth/user/');
        return response.data;
    },
};
