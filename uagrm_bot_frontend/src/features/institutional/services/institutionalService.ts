import api from '@/config/axios';
import type { Document } from '../types';

export const institutionalService = {
    getDocuments: async (): Promise<Document[]> => {
        const response = await api.get('/api/institutional/documents/');
        return response.data;
    },
    uploadDocument: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/api/institutional/upload/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};
