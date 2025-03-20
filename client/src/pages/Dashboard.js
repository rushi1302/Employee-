import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllEmployees, getAdminData } from '../services/employeeService';
import { Link } from 'react-router-dom';
import {
    UserIcon,
    BriefcaseIcon,
    BuildingOfficeIcon,
    CalendarIcon,
    CurrencyDollarIcon
} from '@heroicons/react/24/outline';

// Default admin data as fallback
const DEFAULT_ADMIN_DATA = {
    adminUsers: [
        { id: 1, username: 'admin', role: 'admin', name: 'Admin User', email: 'admin@company.com', phone: '555-123-0000' },
        { id: 2, username: 'sarahjohnson', role: 'admin', name: 'Sarah Johnson', email: 'sarah.johnson@company.com', phone: '555-123-0001' }
    ],
    employees: [
        {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
            position: 'Software Developer',
            department: 'Engineering',
            joinDate: '2022-01-15',
            salary: 85000,
            phone: '555-123-4567',
            address: '123 Main St, Anytown, USA'
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            position: 'UX Designer',
            department: 'Design',
            joinDate: '2021-08-10',
            salary: 78000,
            phone: '555-987-6543',
            address: '456 Oak Ave, Somewhere, USA'
        },
        {
            id: 3,
            name: 'Michael Johnson',
            email: 'michael.johnson@example.com',
            position: 'Project Manager',
            department: 'Management',
            joinDate: '2020-03-22',
            salary: 95000,
            phone: '555-456-7890',
            address: '789 Pine St, Elsewhere, USA'
        },
        {
            id: 4,
            name: 'Emily Davis',
            email: 'emily.davis@example.com',
            position: 'Marketing Specialist',
            department: 'Marketing',
            joinDate: '2021-11-05',
            salary: 72000,
            phone: '555-234-5678',
            address: '321 Cedar Rd, Nowhere, USA'
        }
    ],
    departments: [
        { name: 'Engineering', count: 2, avgSalary: 97500 },
        { name: 'Design', count: 1, avgSalary: 78000 },
        { name: 'Management', count: 1, avgSalary: 95000 },
        { name: 'Marketing', count: 1, avgSalary: 72000 },
        { name: 'Human Resources', count: 1, avgSalary: 88000 },
        { name: 'Finance', count: 1, avgSalary: 82000 }
    ],
    totalSalary: 575000,
    totalEmployees: 8,
    totalDepartments: 6
};

const Dashboard = () => {
    const { user, isAdmin } = useAuth();
    const [employeeData, setEmployeeData] = useState(null);
    const [employeeCount, setEmployeeCount] = useState(0);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [usingFallbackData, setUsingFallbackData] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (isAdmin) {
                    // Use the new admin data endpoint
                    const adminData = await getAdminData();

                    setEmployeeCount(adminData.totalEmployees);
                    setDepartments(adminData.departments.map(dept => dept.name));

                    setEmployeeData({
                        employees: adminData.employees,
                        departments: adminData.departments,
                        totalSalary: adminData.totalSalary
                    });

                    setUsingFallbackData(false);
                } else {
                    // For regular employees, we'll just show their profile info
                    // This will be fetched in the profile component
                }
            } catch (err) {
                console.error('Error fetching dashboard data:', err);

                // Fallback to the old method if the new endpoint fails
                try {
                    if (isAdmin) {
                        const employees = await getAllEmployees();
                        setEmployeeCount(employees.length);

                        // Extract unique departments
                        const uniqueDepartments = [...new Set(employees.map(emp => emp.department))];
                        setDepartments(uniqueDepartments);

                        // Calculate department statistics
                        const deptStats = uniqueDepartments.map(dept => {
                            const deptEmployees = employees.filter(emp => emp.department === dept);
                            return {
                                name: dept,
                                count: deptEmployees.length,
                                avgSalary: deptEmployees.reduce((sum, emp) => sum + emp.salary, 0) / deptEmployees.length
                            };
                        });

                        setEmployeeData({
                            employees,
                            departments: deptStats,
                            totalSalary: employees.reduce((sum, emp) => sum + emp.salary, 0)
                        });

                        setUsingFallbackData(false);
                    }
                } catch (fallbackErr) {
                    console.error('Fallback method also failed:', fallbackErr);

                    // Use default data as last resort
                    setEmployeeCount(DEFAULT_ADMIN_DATA.totalEmployees);
                    setDepartments(DEFAULT_ADMIN_DATA.departments.map(dept => dept.name));
                    setEmployeeData({
                        employees: DEFAULT_ADMIN_DATA.employees,
                        departments: DEFAULT_ADMIN_DATA.departments,
                        totalSalary: DEFAULT_ADMIN_DATA.totalSalary
                    });

                    setError('Using default data. Connection to server failed.');
                    setUsingFallbackData(true);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAdmin]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

            {usingFallbackData && (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 text-yellow-700 mb-4">
                    <p className="font-medium">Notice: Using default admin data</p>
                    <p>Unable to connect to the server. Displaying default data for preview purposes.</p>
                </div>
            )}

            {error && !usingFallbackData && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 mb-4">
                    <p>{error}</p>
                </div>
            )}

            {isAdmin ? (
                <div className="space-y-6">
                    {/* Stats cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="card flex items-center">
                            <div className="rounded-full bg-blue-100 p-3 mr-4">
                                <UserIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Employees</p>
                                <p className="text-xl font-semibold">{employeeCount}</p>
                            </div>
                        </div>

                        <div className="card flex items-center">
                            <div className="rounded-full bg-green-100 p-3 mr-4">
                                <BuildingOfficeIcon className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Departments</p>
                                <p className="text-xl font-semibold">{departments.length}</p>
                            </div>
                        </div>

                        <div className="card flex items-center">
                            <div className="rounded-full bg-purple-100 p-3 mr-4">
                                <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Salary</p>
                                <p className="text-xl font-semibold">
                                    ${employeeData?.totalSalary?.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="card flex items-center">
                            <div className="rounded-full bg-yellow-100 p-3 mr-4">
                                <CalendarIcon className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Current Date</p>
                                <p className="text-xl font-semibold">
                                    {new Date().toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Department breakdown */}
                    <div className="card">
                        <h2 className="text-lg font-semibold mb-4">Department Breakdown</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Department
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Employees
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Avg. Salary
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {employeeData?.departments.map((dept) => (
                                        <tr key={dept.name}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{dept.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{dept.count}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">
                                                    ${Math.round(dept.avgSalary).toLocaleString()}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent employees */}
                    <div className="card">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Recent Employees</h2>
                            <Link to="/employees" className="text-primary-600 hover:text-primary-700 text-sm">
                                View all
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Position
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Department
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Join Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {employeeData?.employees.slice(0, 5).map((employee) => (
                                        <tr key={employee.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                                                        <UserIcon className="h-4 w-4 text-primary-600" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            <Link to={`/employees/${employee.id}`} className="hover:text-primary-600">
                                                                {employee.name}
                                                            </Link>
                                                        </div>
                                                        <div className="text-sm text-gray-500">{employee.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{employee.position}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{employee.department}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(employee.joinDate).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="card">
                    <div className="flex items-center justify-center flex-col p-8">
                        <div className="rounded-full bg-primary-100 p-4 mb-4">
                            <UserIcon className="h-10 w-10 text-primary-600" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Welcome, {user?.username}!</h2>
                        <p className="text-gray-600 mb-6">
                            View your profile information and manage your account.
                        </p>
                        <Link to="/profile" className="btn btn-primary">
                            View My Profile
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard; 