import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const RoleRoute = ({ children, allowedRoles }) => {
    const { user, role, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user) return <Navigate to="/login" />;

    if (allowedRoles && !allowedRoles.includes(role)) {
        // Redirect based on actual role
        if (role === 'admin') return <Navigate to="/admin" />;
        if (role === 'employee') return <Navigate to="/employee" />;
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export default RoleRoute;
