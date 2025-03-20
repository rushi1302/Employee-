import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

// Default admin profile data as fallback
const DEFAULT_ADMIN_PROFILE = {
    id: 1,
    name: 'Admin User',
    email: 'admin@company.com',
    phone: '555-123-0000',
    position: 'Administrator',
    department: 'Management',
    joinDate: '2019-01-01',
    managedEmployees: 8,
    managedDepartments: 6,
    totalBudget: 575000,
    recentActivity: [
        { action: 'Added new employee', date: new Date().toISOString() },
        { action: 'Updated department budget', date: new Date(Date.now() - 86400000).toISOString() },
        { action: 'System maintenance', date: new Date(Date.now() - 172800000).toISOString() }
    ],
    permissions: [
        'View all employees',
        'Edit employee information',
        'Manage departments',
        'Approve time off',
        'Adjust salaries'
    ]
};

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);
    }, []);

    // Login function
    const login = async (username, password) => {
        try {
            const response = await axios.post(`${API_URL}/login`, { username, password });
            const { token, user } = response.data;

            // Save to localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // Set axios default header
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setUser(user);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    // Logout function (without confirmation - confirmation is now handled by the custom modal)
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        navigate('/login');
    };

    // Get user profile with fallback for admin
    const getProfile = async () => {
        try {
            const response = await axios.get(`${API_URL}/profile`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            // If user is admin but no adminProfile is returned, add the default one
            if (user?.role === 'admin' && !response.data.adminProfile) {
                console.log('Admin profile data not found, using default data');
                return {
                    ...response.data,
                    adminProfile: {
                        ...DEFAULT_ADMIN_PROFILE,
                        id: user.id,
                        name: response.data.user?.name || DEFAULT_ADMIN_PROFILE.name
                    },
                    _usingFallback: true
                };
            }

            return response.data;
        } catch (error) {
            console.error('Error fetching profile:', error);

            // If user is admin, return default admin profile
            if (user?.role === 'admin') {
                console.log('Error fetching admin profile, using default data');
                return {
                    user: {
                        id: user.id,
                        username: user.username,
                        role: user.role,
                        name: user.name || 'Admin User'
                    },
                    adminProfile: {
                        ...DEFAULT_ADMIN_PROFILE,
                        id: user.id,
                        name: user.name || DEFAULT_ADMIN_PROFILE.name
                    },
                    _usingFallback: true
                };
            }

            if (error.response?.status === 401) {
                logout();
            }
            return null;
        }
    };

    // Change password
    const changePassword = async (currentPassword, newPassword) => {
        try {
            const response = await axios.post(
                `${API_URL}/change-password`,
                { currentPassword, newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            return { success: true, message: response.data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to change password'
            };
        }
    };

    const value = {
        user,
        loading,
        login,
        logout,
        getProfile,
        changePassword,
        isAdmin: user?.role === 'admin'
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 