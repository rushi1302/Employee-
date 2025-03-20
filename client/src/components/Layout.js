import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConfirmationModal from './ConfirmationModal';
import ProfileGuide from './ProfileGuide';
import axios from 'axios';
import {
    UserIcon,
    UsersIcon,
    HomeIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    UserPlusIcon,
    QuestionMarkCircleIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';

const Layout = () => {
    const { user, logout, isAdmin } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showProfileHelp, setShowProfileHelp] = useState(false);
    const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    const handleLogoutClick = () => {
        setShowLogoutConfirmation(true);
    };

    const handleLogoutConfirm = () => {
        // Use the logout function from AuthContext
        logout();
    };

    const navigation = [
        { name: 'Dashboard', path: '/', icon: HomeIcon },
        { name: 'My Profile', path: '/profile', icon: UserIcon },
    ];

    // Admin-only navigation items
    if (isAdmin) {
        navigation.push(
            { name: 'Employees', path: '/employees', icon: UsersIcon },
            { name: 'Add Employee', path: '/employees/add', icon: UserPlusIcon }
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Profile Help Modal */}
            {showProfileHelp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 animate-fade-in">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <InformationCircleIcon className="h-6 w-6 mr-2 text-primary-600" />
                                Profile & Account Help
                            </h3>
                            <button
                                onClick={() => setShowProfileHelp(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        <ProfileGuide isAdmin={isAdmin} onClose={() => setShowProfileHelp(false)} />

                        <div className="mt-6">
                            <button
                                onClick={() => setShowProfileHelp(false)}
                                className="w-full py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Logout Confirmation Modal */}
            <ConfirmationModal
                isOpen={showLogoutConfirmation}
                onClose={() => setShowLogoutConfirmation(false)}
                onConfirm={handleLogoutConfirm}
                title="Confirm Logout"
                message="Are you sure you want to log out? Any unsaved changes will be lost."
            />

            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-gray-800 bg-opacity-50 lg:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-30 w-64 flex flex-col bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 lg:static lg:z-auto`}
            >
                <div className="flex h-16 items-center justify-between px-4 border-b">
                    <h1 className="text-xl font-bold text-primary-600">EMP Manager</h1>
                    <button
                        className="p-1 rounded-md lg:hidden"
                        onClick={closeSidebar}
                    >
                        <XMarkIcon className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto mt-4 px-2">
                    <ul className="space-y-1">
                        {navigation.map((item) => (
                            <li key={item.name}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center px-4 py-2 rounded-md ${location.pathname === item.path
                                        ? 'bg-primary-50 text-primary-600'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    onClick={closeSidebar}
                                >
                                    <item.icon className="h-5 w-5 mr-3" />
                                    {item.name}
                                </Link>
                            </li>
                        ))}

                        <li>
                            <button
                                onClick={() => setShowProfileHelp(true)}
                                className="flex w-full items-center px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                            >
                                <QuestionMarkCircleIcon className="h-5 w-5 mr-3" />
                                Help & Support
                            </button>
                        </li>

                        <li className="mt-6">
                            <button
                                onClick={handleLogoutClick}
                                className="flex w-full items-center px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                            >
                                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                                Logout
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main content */}
            <div className="flex flex-col flex-1 w-0 overflow-hidden">
                {/* Header */}
                <header className="sticky top-0 z-10 bg-white shadow-sm h-16 flex items-center px-4">
                    <button
                        className="p-1 rounded-md lg:hidden"
                        onClick={toggleSidebar}
                    >
                        <Bars3Icon className="h-6 w-6 text-gray-500" />
                    </button>

                    <div className="ml-auto flex items-center">
                        <div className="text-right mr-4">
                            <p className="text-sm font-medium text-gray-700">{user?.username}</p>
                            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                        </div>
                        <Link to="/profile" className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-primary-600" />
                        </Link>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout; 