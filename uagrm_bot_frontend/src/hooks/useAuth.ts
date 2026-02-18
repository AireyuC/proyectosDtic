import { useState, useEffect } from 'react';
import type { User } from '../features/auth/types';
import { authService } from '../features/auth/services/authService';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const userData = await authService.getUser();
            setUser(userData);
        } catch (error) {
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (credentials: any) => {
        const data = await authService.login(credentials);
        setUser(data.user);
        return data;
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    return {
        user,
        loading,
        login,
        logout,
        isAdmin: user?.groups?.includes('Admin'),
        isVerifier: user?.groups?.includes('Verifier'),
        isUploader: user?.groups?.includes('Uploader'),
    };
};
