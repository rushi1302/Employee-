import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const ChangeUsername = () => {
    const [newUsername, setNewUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset states
        setError('');
        setSuccess('');

        // Validate inputs
        if (!newUsername || !password) {
            setError('All fields are required');
            return;
        }

        if (newUsername === user.username) {
            setError('New username must be different from current username');
            return;
        }

        if (newUsername.length < 3) {
            setError('Username must be at least 3 characters long');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(
                'http://localhost:5000/api/change-username',
                { newUsername, password },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            setSuccess(response.data.message || 'Username changed successfully');

            // Clear form
            setNewUsername('');
            setPassword('');

            // Update local storage with new username
            const updatedUser = { ...user, username: newUsername };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // Show success message for 2 seconds, then logout to refresh user data
            setTimeout(() => {
                logout();
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change username');
            console.error('Change username error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="mr-4 text-gray-500 hover:text-gray-700"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Change Username</h1>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 mb-6">
                    <p>{error}</p>
                </div>
            )}

            {success && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 text-green-700 mb-6">
                    <p>{success}</p>
                    <p className="text-sm mt-1">You will be logged out in a moment to apply the changes.</p>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg p-6 max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                        <UserIcon className="h-8 w-8 text-primary-600" />
                    </div>
                </div>

                <div className="mb-6">
                    <p className="text-gray-700">Current Username: <span className="font-medium">{user?.username}</span></p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="newUsername" className="block text-sm font-medium text-gray-700 mb-1">
                                New Username *
                            </label>
                            <input
                                type="text"
                                id="newUsername"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                className="input"
                                required
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Username must be at least 3 characters long
                            </p>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm with Password *
                            </label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input"
                                required
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Enter your current password to confirm this change
                            </p>
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-sm text-blue-600">
                                {showPassword ? 'Hide Password' : 'Show Password'}
                            </button>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full btn btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Changing Username...' : 'Change Username'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangeUsername; 