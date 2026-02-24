import axios from '@/config/axios';

export interface MockFaculty {
    id: number;
    code: string;
    name: string;
}

export interface MockCareer {
    id: number;
    code: string;
    name: string;
    faculty: number;
}

export interface MockStudent {
    id: number;
    registration_number: string;
    full_name: string;
    phone_number: string;
    career: number;
}

export const massiveMessagingApi = {
    getFaculties: async (): Promise<MockFaculty[]> => {
        const response = await axios.get('/api/massive-messaging/faculties/');
        return response.data;
    },

    getCareers: async (facultyId?: number): Promise<MockCareer[]> => {
        const params = facultyId ? { faculty: facultyId } : {};
        const response = await axios.get('/api/massive-messaging/careers/', { params });
        return response.data;
    },

    getStudents: async (careerId?: number): Promise<MockStudent[]> => {
        const params = careerId ? { career: careerId } : {};
        const response = await axios.get('/api/massive-messaging/students/', { params });
        return response.data;
    },

    sendMassiveMessage: async (payload: { target_type: string, target_ids?: number[], message: string }) => {
        const response = await axios.post('/api/massive-messaging/send/', payload);
        return response.data;
    }
};
