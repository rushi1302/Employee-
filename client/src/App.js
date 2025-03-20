import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeProfile from './pages/EmployeeProfile';
import EmployeeList from './pages/EmployeeList';
import AddEmployee from './pages/AddEmployee';
import EditEmployee from './pages/EditEmployee';
import ChangePassword from './pages/ChangePassword';
import ChangeUsername from './pages/ChangeUsername';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route index element={<Dashboard />} />
                    <Route path="profile" element={<EmployeeProfile />} />
                    <Route path="employees" element={<AdminRoute><EmployeeList /></AdminRoute>} />
                    <Route path="employees/add" element={<AdminRoute><AddEmployee /></AdminRoute>} />
                    <Route path="employees/:id" element={<EmployeeProfile />} />
                    <Route path="employees/:id/edit" element={<EditEmployee />} />
                    <Route path="change-password" element={<ChangePassword />} />
                    <Route path="change-username" element={<ChangeUsername />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AuthProvider>
    );
}

// Protected route component
function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

// Admin route component
function AdminRoute({ children }) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default App; 