import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const storedAdmin = localStorage.getItem('adminInfo');
        if (storedAdmin) {
            setAdmin(JSON.parse(storedAdmin));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password }, config);
            setAdmin(data);
            localStorage.setItem('adminInfo', JSON.stringify(data));
            setError('');
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
            return false;
        }
    };

    const register = async (name, email, password) => {
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.post('http://localhost:5000/api/auth/register', { name, email, password }, config);
            setAdmin(data);
            localStorage.setItem('adminInfo', JSON.stringify(data));
            setError('');
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
            return false;
        }
    };

    // Google OAuth — simulated for demo (no real backend needed)
    const googleLogin = async () => {
        try {
            // In production this would redirect to /api/auth/google
            // For demo we mock a successful Google user
            const mockGoogleUser = {
                _id: 'google_demo_user',
                name: 'Google User',
                email: 'demo@gmail.com',
                token: 'mock_google_token_' + Date.now(),
            };
            setAdmin(mockGoogleUser);
            localStorage.setItem('adminInfo', JSON.stringify(mockGoogleUser));
            setError('');
            return true;
        } catch (err) {
            setError('Google login failed. Please try again.');
            return false;
        }
    };

    const logout = () => {
        setAdmin(null);
        localStorage.removeItem('adminInfo');
    };

    return (
        <AuthContext.Provider value={{ admin, login, register, googleLogin, logout, loading, error, setError }}>
            {children}
        </AuthContext.Provider>
    );
};
