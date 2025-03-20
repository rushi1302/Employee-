import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getEmployeeById } from '../services/employeeService';
import ProfileGuide from '../components/ProfileGuide';
import {
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    BuildingOfficeIcon,
    BriefcaseIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    MapPinIcon,
    PencilSquareIcon,
    UsersIcon,
    ChartBarIcon,
    InformationCircleIcon,
    QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

const EmployeeProfile = () => {
    const { id } = useParams();
    const { user, getProfile, isAdmin } = useAuth();
    const navigate = useNavigate();

    const [employee, setEmployee] = useState(null);
    const [adminProfile, setAdminProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [usingFallbackData, setUsingFallbackData] = useState(false);
    const [showGuide, setShowGuide] = useState(false);

    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                setLoading(true);
                setUsingFallbackData(false);

                // If viewing own profile or no ID is provided
                if (!id || id === 'me') {
                    const profileData = await getProfile();

                    if (profileData) {
                        if (user.role === 'admin') {
                            // Always use adminProfile for admin users
                            if (profileData.adminProfile) {
                                setAdminProfile(profileData.adminProfile);
                                // Check if this is fallback data (added by our AuthContext)
                                if (profileData._usingFallback) {
                                    setUsingFallbackData(true);
                                }
                            } else {
                                // This should not happen with our fallback, but just in case
                                setError('Admin profile data not available. Please contact support.');
                            }
                        } else if (profileData.employee) {
                            // Handle employee profile
                            setEmployee(profileData.employee);
                        } else {
                            setError('Could not retrieve your profile information');
                        }
                    } else {
                        setError('Could not retrieve your profile information');
                    }
                } else {
                    // Viewing another employee's profile
                    const employeeData = await getEmployeeById(id);
                    setEmployee(employeeData);
                }
            } catch (err) {
                console.error('Error fetching employee data:', err);

                // Special handling for admin users to ensure they always see their profile
                if (user?.role === 'admin' && (!id || id === 'me')) {
                    // Create a default admin profile as last resort
                    setAdminProfile({
                        id: user.id,
                        name: user.name || 'Admin User',
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
                    });
                    setUsingFallbackData(true);
                } else if (err.response && err.response.status === 403) {
                    setError('You do not have permission to view this profile');
                } else {
                    setError('Failed to load employee profile');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeeData();
    }, [id, getProfile, user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">Loading profile...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 mb-4">
                <p>{error}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-2 text-sm text-red-700 hover:text-red-800"
                >
                    Go back
                </button>
            </div>
        );
    }

    // If admin profile is available, render admin profile
    if (adminProfile) {
        return (
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Administrator Profile</h1>
                    <button
                        onClick={() => setShowGuide(!showGuide)}
                        className="flex items-center text-primary-600 hover:text-primary-700"
                    >
                        <QuestionMarkCircleIcon className="h-5 w-5 mr-1" />
                        <span>Help</span>
                    </button>
                </div>

                {showGuide && <ProfileGuide isAdmin={isAdmin} onClose={() => setShowGuide(false)} />}

                {usingFallbackData && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 text-yellow-700 mb-6">
                        <p className="font-medium">Notice: Using default admin data</p>
                        <p>Unable to retrieve your actual profile data from the server. Displaying default data for preview purposes.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Admin Profile card */}
                    <div className="card flex flex-col items-center p-8">
                        <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                            <UserIcon className="h-12 w-12 text-primary-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">{adminProfile.name}</h2>
                        <p className="text-gray-600 mb-4">{adminProfile.position}</p>

                        <div className="w-full mt-4 space-y-3">
                            <div className="flex items-center text-gray-700">
                                <EnvelopeIcon className="h-5 w-5 mr-3 text-gray-400" />
                                <span>{adminProfile.email}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <PhoneIcon className="h-5 w-5 mr-3 text-gray-400" />
                                <span>{adminProfile.phone}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <BuildingOfficeIcon className="h-5 w-5 mr-3 text-gray-400" />
                                <span>{adminProfile.department}</span>
                            </div>
                        </div>
                    </div>

                    {/* Admin details */}
                    <div className="lg:col-span-2">
                        <div className="card mb-6">
                            <h3 className="text-lg font-semibold mb-4">Administration Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="flex items-start mb-4">
                                        <BriefcaseIcon className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Position</p>
                                            <p className="font-medium text-gray-900">{adminProfile.position}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start mb-4">
                                        <BuildingOfficeIcon className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Department</p>
                                            <p className="font-medium text-gray-900">{adminProfile.department}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <CalendarIcon className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Join Date</p>
                                            <p className="font-medium text-gray-900">
                                                {new Date(adminProfile.joinDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-start mb-4">
                                        <UsersIcon className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Managed Employees</p>
                                            <p className="font-medium text-gray-900">{adminProfile.managedEmployees}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start mb-4">
                                        <ChartBarIcon className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Managed Departments</p>
                                            <p className="font-medium text-gray-900">{adminProfile.managedDepartments}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start mb-4">
                                        <CurrencyDollarIcon className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Total Budget</p>
                                            <p className="font-medium text-gray-900">
                                                ${adminProfile.totalBudget.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Admin Permissions */}
                        <div className="card mb-6">
                            <h3 className="text-lg font-semibold mb-4">Admin Permissions</h3>
                            <ul className="space-y-2">
                                {adminProfile.permissions && adminProfile.permissions.map((permission, index) => (
                                    <li key={index} className="flex items-center">
                                        <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                                        <span className="text-gray-700">{permission}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Recent Activity */}
                        <div className="card mb-6">
                            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                            <div className="space-y-4">
                                {adminProfile.recentActivity && adminProfile.recentActivity.map((activity, index) => (
                                    <div key={index} className="flex items-start">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                            <span className="text-blue-600 text-xs font-bold">{index + 1}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{activity.action}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(activity.date).toLocaleDateString()} at {new Date(activity.date).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Account Information */}
                        <div className="card">
                            <h3 className="text-lg font-semibold mb-4">Account Information</h3>

                            <div className="mb-4">
                                <p className="text-sm text-gray-500">Username</p>
                                <p className="font-medium text-gray-900">{user.username}</p>
                            </div>

                            <div className="mt-6 space-y-2">
                                <div>
                                    <Link
                                        to="/change-username"
                                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                                    >
                                        Change Username
                                    </Link>
                                </div>
                                <div>
                                    <Link
                                        to="/change-password"
                                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                                    >
                                        Change Password
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 text-yellow-700 mb-4">
                <p>Employee not found</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-2 text-sm text-yellow-700 hover:text-yellow-800"
                >
                    Go back
                </button>
            </div>
        );
    }

    const isOwnProfile = !id || id === 'me' || (user.employeeId && user.employeeId.toString() === id);
    const canEdit = isAdmin || isOwnProfile;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Employee Profile</h1>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setShowGuide(!showGuide)}
                        className="flex items-center text-primary-600 hover:text-primary-700"
                    >
                        <QuestionMarkCircleIcon className="h-5 w-5 mr-1" />
                        <span>Help</span>
                    </button>
                    {canEdit && (
                        <Link
                            to={`/employees/${employee.id}/edit`}
                            className="btn btn-primary flex items-center"
                        >
                            <PencilSquareIcon className="h-5 w-5 mr-2" />
                            Edit Profile
                        </Link>
                    )}
                </div>
            </div>

            {showGuide && <ProfileGuide isAdmin={isAdmin} onClose={() => setShowGuide(false)} />}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile card */}
                <div className="card flex flex-col items-center p-8">
                    <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                        <UserIcon className="h-12 w-12 text-primary-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">{employee.name}</h2>
                    <p className="text-gray-600 mb-4">{employee.position}</p>

                    <div className="w-full mt-4 space-y-3">
                        <div className="flex items-center text-gray-700">
                            <EnvelopeIcon className="h-5 w-5 mr-3 text-gray-400" />
                            <span>{employee.email}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <PhoneIcon className="h-5 w-5 mr-3 text-gray-400" />
                            <span>{employee.phone}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <MapPinIcon className="h-5 w-5 mr-3 text-gray-400" />
                            <span>{employee.address}</span>
                        </div>
                    </div>
                </div>

                {/* Employment details */}
                <div className="lg:col-span-2">
                    <div className="card mb-6">
                        <h3 className="text-lg font-semibold mb-4">Employment Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div className="flex items-start mb-4">
                                    <BriefcaseIcon className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Position</p>
                                        <p className="font-medium text-gray-900">{employee.position}</p>
                                    </div>
                                </div>

                                <div className="flex items-start mb-4">
                                    <BuildingOfficeIcon className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Department</p>
                                        <p className="font-medium text-gray-900">{employee.department}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <CalendarIcon className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Join Date</p>
                                        <p className="font-medium text-gray-900">
                                            {new Date(employee.joinDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                {isAdmin && (
                                    <div className="flex items-start mb-4">
                                        <CurrencyDollarIcon className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Salary</p>
                                            <p className="font-medium text-gray-900">
                                                ${employee.salary.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start mb-4">
                                    <UserIcon className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Employee ID</p>
                                        <p className="font-medium text-gray-900">{employee.id}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional information can be added here */}
                    <div className="card">
                        <h3 className="text-lg font-semibold mb-4">Account Information</h3>

                        <div className="mb-4">
                            <p className="text-sm text-gray-500">Username</p>
                            <p className="font-medium text-gray-900">
                                {isOwnProfile ? user.username : 'Not available'}
                            </p>
                        </div>

                        {isOwnProfile && (
                            <div className="mt-6 space-y-2">
                                <div>
                                    <Link
                                        to="/change-username"
                                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                                    >
                                        Change Username
                                    </Link>
                                </div>
                                <div>
                                    <Link
                                        to="/change-password"
                                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                                    >
                                        Change Password
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeProfile; 