import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEmployee } from '../services/employeeService';
import { UserPlusIcon } from '@heroicons/react/24/outline';

const AddEmployee = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        position: '',
        department: '',
        joinDate: new Date().toISOString().split('T')[0],
        salary: '',
        phone: '',
        address: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name || !formData.email || !formData.position || !formData.department) {
            setError('Please fill in all required fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }

        // Salary validation
        if (isNaN(formData.salary) || Number(formData.salary) <= 0) {
            setError('Please enter a valid salary amount');
            return;
        }

        try {
            setLoading(true);
            setError('');

            // Convert salary to number
            const employeeData = {
                ...formData,
                salary: Number(formData.salary)
            };

            const result = await createEmployee(employeeData);

            setSuccess(`Employee ${result.employee.name} created successfully with username: ${result.user.username}`);

            // Reset form
            setFormData({
                name: '',
                email: '',
                position: '',
                department: '',
                joinDate: new Date().toISOString().split('T')[0],
                salary: '',
                phone: '',
                address: ''
            });

            // Redirect after a short delay
            setTimeout(() => {
                navigate('/employees');
            }, 2000);

        } catch (err) {
            console.error('Error creating employee:', err);
            setError('Failed to create employee. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Employee</h1>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 mb-4">
                    <p>{error}</p>
                </div>
            )}

            {success && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 text-green-700 mb-4">
                    <p>{success}</p>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg p-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Information */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>

                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="input"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                    Address
                                </label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="3"
                                    className="input"
                                ></textarea>
                            </div>
                        </div>

                        {/* Employment Information */}
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Employment Information</h2>

                            <div className="mb-4">
                                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                                    Position *
                                </label>
                                <input
                                    type="text"
                                    id="position"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                                    Department *
                                </label>
                                <input
                                    type="text"
                                    id="department"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700 mb-1">
                                    Join Date *
                                </label>
                                <input
                                    type="date"
                                    id="joinDate"
                                    name="joinDate"
                                    value={formData.joinDate}
                                    onChange={handleChange}
                                    className="input"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                                    Salary (USD) *
                                </label>
                                <input
                                    type="number"
                                    id="salary"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleChange}
                                    className="input"
                                    min="0"
                                    step="1000"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end">
                        <button
                            type="button"
                            onClick={() => navigate('/employees')}
                            className="btn btn-secondary mr-4"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary flex items-center"
                            disabled={loading}
                        >
                            {loading ? (
                                'Creating...'
                            ) : (
                                <>
                                    <UserPlusIcon className="h-5 w-5 mr-2" />
                                    Create Employee
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEmployee; 