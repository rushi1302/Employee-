import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmployeeById, updateEmployee } from '../services/employeeService';
import { useAuth } from '../context/AuthContext';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

const EditEmployee = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAdmin } = useAuth();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        position: '',
        department: '',
        joinDate: '',
        salary: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                setLoading(true);
                const employeeData = await getEmployeeById(id);

                // Format date for input field
                const formattedDate = employeeData.joinDate
                    ? new Date(employeeData.joinDate).toISOString().split('T')[0]
                    : '';

                setFormData({
                    ...employeeData,
                    joinDate: formattedDate
                });
            } catch (err) {
                console.error('Error fetching employee data:', err);
                if (err.response && err.response.status === 403) {
                    setError('You do not have permission to edit this profile');
                } else {
                    setError('Failed to load employee data');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeeData();
    }, [id]);

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
        if (!formData.name || !formData.email) {
            setError('Please fill in all required fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }

        // Salary validation (admin only)
        if (isAdmin && (isNaN(formData.salary) || Number(formData.salary) <= 0)) {
            setError('Please enter a valid salary amount');
            return;
        }

        try {
            setSaving(true);
            setError('');

            // Prepare data for update
            let updateData;

            // If admin, convert salary to number and use all fields
            if (isAdmin) {
                updateData = {
                    ...formData,
                    salary: Number(formData.salary)
                };
            } else {
                // For non-admin users, only allow updating certain fields
                const { phone, address, email } = formData;
                updateData = { phone, address, email };
            }

            await updateEmployee(id, updateData);

            setSuccess('Employee information updated successfully');

            // Redirect after a short delay
            setTimeout(() => {
                navigate(`/employees/${id}`);
            }, 1500);

        } catch (err) {
            console.error('Error updating employee:', err);
            setError('Failed to update employee information. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    // Check if user has permission to edit
    const isOwnProfile = user.employeeId && user.employeeId.toString() === id;
    const canEdit = isAdmin || isOwnProfile;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">Loading employee data...</div>
            </div>
        );
    }

    if (error && !canEdit) {
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

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Employee</h1>

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
                                    disabled={!isAdmin}
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
                                    disabled={!isAdmin}
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
                                    disabled={!isAdmin}
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
                                    disabled={!isAdmin}
                                />
                            </div>

                            {isAdmin && (
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
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end">
                        <button
                            type="button"
                            onClick={() => navigate(`/employees/${id}`)}
                            className="btn btn-secondary mr-4"
                            disabled={saving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary flex items-center"
                            disabled={saving}
                        >
                            {saving ? (
                                'Saving...'
                            ) : (
                                <>
                                    <PencilSquareIcon className="h-5 w-5 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEmployee; 