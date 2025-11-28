import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, signup as apiSignup, logout as apiLogout, getMe } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = async () => {
        try {
            const res = await getMe();
            setUser(res.data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const res = await apiLogin({ email, password });
        setUser(res.data);
        return res.data;
    };

    const signup = async (userData) => {
        const res = await apiSignup(userData);
        setUser(res.data);
        return res.data;
    };

    const logout = async () => {
        await apiLogout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
