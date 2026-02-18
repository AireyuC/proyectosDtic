import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Or a proper Spinner component
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && allowedRoles.length > 0) {
        console.log('Checking permissions. User groups:', user.groups, 'Allowed:', allowedRoles);
        const hasPermission = user.groups?.some(group => allowedRoles.includes(group)) || user.groups?.includes('Admin');
        if (!hasPermission) {
            console.warn('Access denied. User missing required role.');
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return <Outlet />;
};
