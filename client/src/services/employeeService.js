import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthHeader = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
});

// Get all employees (admin only)
export const getAllEmployees = async () => {
    try {
        const response = await axios.get(`${API_URL}/employees`, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Error fetching employees:', error);
        throw error;
    }
};

// Get employee by ID
export const getEmployeeById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/employees/${id}`, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error(`Error fetching employee with ID ${id}:`, error);
        throw error;
    }
};

// Create new employee (admin only)
export const createEmployee = async (employeeData) => {
    try {
        const response = await axios.post(`${API_URL}/employees`, employeeData, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Error creating employee:', error);
        throw error;
    }
};

// Update employee
export const updateEmployee = async (id, employeeData) => {
    try {
        const response = await axios.put(`${API_URL}/employees/${id}`, employeeData, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error(`Error updating employee with ID ${id}:`, error);
        throw error;
    }
};

// Delete employee (admin only)
export const deleteEmployee = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/employees/${id}`, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error(`Error deleting employee with ID ${id}:`, error);
        throw error;
    }
};

// Get admin dashboard data (admin only)
export const getAdminData = async () => {
    try {
        const response = await axios.get(`${API_URL}/admin/data`, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error('Error fetching admin data:', error);

        // Create a more detailed error object
        const errorDetails = {
            message: error.response?.data?.message || 'Failed to fetch admin data',
            status: error.response?.status,
            errorCode: error.response?.data?.error || 'UNKNOWN_ERROR'
        };

        throw errorDetails;
    }
}; 