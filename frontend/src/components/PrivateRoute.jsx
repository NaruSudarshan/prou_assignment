import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ roles }) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">Loading...</div>;

    if (!user) return <Navigate to="/login" />;

    if (roles && !roles.includes(user.role)) {
        // If user role is not authorized, redirect to tasks (for employees) or home
        return <Navigate to={user.role === 'Employee' ? '/tasks' : '/'} />;
    }

    return <Outlet />;
};

export default PrivateRoute;
