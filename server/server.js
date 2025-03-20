const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const morgan = require('morgan');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your-secret-key'; // In production, use environment variables

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Data directory
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const EMPLOYEES_FILE = path.join(DATA_DIR, 'employees.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize data files if they don't exist
if (!fs.existsSync(USERS_FILE)) {
    // Create admin users with password hashes
    const defaultUsers = [
        {
            id: 1,
            username: 'admin',
            password: bcrypt.hashSync('admin123', 10),
            role: 'admin',
            name: 'Admin User',
            email: 'admin@company.com',
            phone: '555-123-0000',
            joinDate: '2019-01-01'
        },
        {
            id: 2,
            username: 'sarahjohnson',
            password: bcrypt.hashSync('admin456', 10),
            role: 'admin',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@company.com',
            phone: '555-123-0001',
            joinDate: '2020-03-15'
        }
    ];
    fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
}

if (!fs.existsSync(EMPLOYEES_FILE)) {
    // Create sample employee data
    const sampleEmployees = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
            position: 'Software Developer',
            department: 'Engineering',
            joinDate: '2022-01-15',
            salary: 85000,
            phone: '555-123-4567',
            address: '123 Main St, Anytown, USA',
            userId: 3
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
            address: '456 Oak Ave, Somewhere, USA',
            userId: 4
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
            address: '789 Pine St, Elsewhere, USA',
            userId: 5
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
            address: '321 Cedar Rd, Nowhere, USA',
            userId: 6
        },
        {
            id: 5,
            name: 'Robert Wilson',
            email: 'robert.wilson@example.com',
            position: 'Senior Developer',
            department: 'Engineering',
            joinDate: '2019-07-18',
            salary: 110000,
            phone: '555-876-5432',
            address: '654 Birch Ln, Anyplace, USA',
            userId: 7
        },
        {
            id: 6,
            name: 'Lisa Brown',
            email: 'lisa.brown@example.com',
            position: 'HR Manager',
            department: 'Human Resources',
            joinDate: '2020-09-30',
            salary: 88000,
            phone: '555-345-6789',
            address: '987 Maple Dr, Somewhere, USA',
            userId: 8
        },
        {
            id: 7,
            name: 'David Miller',
            email: 'david.miller@example.com',
            position: 'Financial Analyst',
            department: 'Finance',
            joinDate: '2022-02-14',
            salary: 82000,
            phone: '555-567-8901',
            address: '135 Walnut St, Elsewhere, USA',
            userId: 9
        },
        {
            id: 8,
            name: 'Jennifer Taylor',
            email: 'jennifer.taylor@example.com',
            position: 'Content Writer',
            department: 'Marketing',
            joinDate: '2021-06-22',
            salary: 65000,
            phone: '555-678-9012',
            address: '246 Elm Ave, Nowhere, USA',
            userId: 10
        }
    ];
    fs.writeFileSync(EMPLOYEES_FILE, JSON.stringify(sampleEmployees, null, 2));

    // Create employee users
    if (fs.existsSync(USERS_FILE)) {
        const users = JSON.parse(fs.readFileSync(USERS_FILE));
        const employeeUsers = [
            {
                id: 3,
                username: 'johndoe',
                password: bcrypt.hashSync('password123', 10),
                role: 'employee',
                employeeId: 1
            },
            {
                id: 4,
                username: 'janesmith',
                password: bcrypt.hashSync('password123', 10),
                role: 'employee',
                employeeId: 2
            },
            {
                id: 5,
                username: 'michaelj',
                password: bcrypt.hashSync('password123', 10),
                role: 'employee',
                employeeId: 3
            },
            {
                id: 6,
                username: 'emilyd',
                password: bcrypt.hashSync('password123', 10),
                role: 'employee',
                employeeId: 4
            },
            {
                id: 7,
                username: 'robertw',
                password: bcrypt.hashSync('password123', 10),
                role: 'employee',
                employeeId: 5
            },
            {
                id: 8,
                username: 'lisab',
                password: bcrypt.hashSync('password123', 10),
                role: 'employee',
                employeeId: 6
            },
            {
                id: 9,
                username: 'davidm',
                password: bcrypt.hashSync('password123', 10),
                role: 'employee',
                employeeId: 7
            },
            {
                id: 10,
                username: 'jennifert',
                password: bcrypt.hashSync('password123', 10),
                role: 'employee',
                employeeId: 8
            }
        ];
        fs.writeFileSync(USERS_FILE, JSON.stringify([...users, ...employeeUsers], null, 2));
    }
}

// Helper functions
const readDataFile = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        return [];
    }
};

const writeDataFile = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing to file ${filePath}:`, error);
        return false;
    }
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Role-based authorization middleware
const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
        }
        next();
    };
};

// Routes

// Login route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const users = readDataFile(USERS_FILE);
    const user = users.find(u => u.username === username);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Create JWT token
    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role, employeeId: user.employeeId },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.json({
        token,
        user: {
            id: user.id,
            username: user.username,
            role: user.role,
            employeeId: user.employeeId
        }
    });
});

// Get all employees (admin only)
app.get('/api/employees', authenticateToken, authorizeRole(['admin']), (req, res) => {
    const employees = readDataFile(EMPLOYEES_FILE);
    res.json(employees);
});

// Get employee by ID
app.get('/api/employees/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const employees = readDataFile(EMPLOYEES_FILE);
    const employee = employees.find(e => e.id === parseInt(id));

    if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if user is admin or the employee themselves
    if (req.user.role !== 'admin' && req.user.employeeId !== employee.id) {
        return res.status(403).json({ message: 'Access denied' });
    }

    res.json(employee);
});

// Create new employee (admin only)
app.post('/api/employees', authenticateToken, authorizeRole(['admin']), (req, res) => {
    const employees = readDataFile(EMPLOYEES_FILE);
    const users = readDataFile(USERS_FILE);

    // Generate new IDs
    const newEmployeeId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
    const newUserId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

    // Create employee record
    const newEmployee = {
        id: newEmployeeId,
        ...req.body,
        userId: newUserId
    };

    // Create user account for employee
    const username = req.body.email.split('@')[0];
    const defaultPassword = 'password123'; // In production, generate random password and send email

    const newUser = {
        id: newUserId,
        username,
        password: bcrypt.hashSync(defaultPassword, 10),
        role: 'employee',
        employeeId: newEmployeeId
    };

    // Save data
    employees.push(newEmployee);
    users.push(newUser);

    if (writeDataFile(EMPLOYEES_FILE, employees) && writeDataFile(USERS_FILE, users)) {
        res.status(201).json({
            employee: newEmployee,
            user: {
                id: newUser.id,
                username: newUser.username,
                role: newUser.role,
                defaultPassword
            }
        });
    } else {
        res.status(500).json({ message: 'Error saving data' });
    }
});

// Update employee
app.put('/api/employees/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const employees = readDataFile(EMPLOYEES_FILE);
    const employeeIndex = employees.findIndex(e => e.id === parseInt(id));

    if (employeeIndex === -1) {
        return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if user is admin or the employee themselves
    if (req.user.role !== 'admin' && req.user.employeeId !== parseInt(id)) {
        return res.status(403).json({ message: 'Access denied' });
    }

    // If not admin, restrict fields that can be updated
    if (req.user.role !== 'admin') {
        const allowedFields = ['phone', 'address', 'email'];
        const updatedEmployee = { ...employees[employeeIndex] };

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updatedEmployee[field] = req.body[field];
            }
        }

        employees[employeeIndex] = updatedEmployee;
    } else {
        // Admin can update all fields
        employees[employeeIndex] = { ...employees[employeeIndex], ...req.body, id: parseInt(id) };
    }

    if (writeDataFile(EMPLOYEES_FILE, employees)) {
        res.json(employees[employeeIndex]);
    } else {
        res.status(500).json({ message: 'Error saving data' });
    }
});

// Delete employee (admin only)
app.delete('/api/employees/:id', authenticateToken, authorizeRole(['admin']), (req, res) => {
    const { id } = req.params;
    const employees = readDataFile(EMPLOYEES_FILE);
    const users = readDataFile(USERS_FILE);

    const employeeIndex = employees.findIndex(e => e.id === parseInt(id));

    if (employeeIndex === -1) {
        return res.status(404).json({ message: 'Employee not found' });
    }

    const employee = employees[employeeIndex];

    // Remove employee
    employees.splice(employeeIndex, 1);

    // Remove associated user account
    const userIndex = users.findIndex(u => u.employeeId === parseInt(id));
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
    }

    if (writeDataFile(EMPLOYEES_FILE, employees) && writeDataFile(USERS_FILE, users)) {
        res.json({ message: 'Employee deleted successfully' });
    } else {
        res.status(500).json({ message: 'Error saving data' });
    }
});

// Change password
app.post('/api/change-password', authenticateToken, (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Current password and new password are required' });
    }

    const users = readDataFile(USERS_FILE);
    const userIndex = users.findIndex(u => u.id === req.user.id);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (!bcrypt.compareSync(currentPassword, users[userIndex].password)) {
        return res.status(401).json({ message: 'Current password is incorrect' });
    }

    users[userIndex].password = bcrypt.hashSync(newPassword, 10);

    if (writeDataFile(USERS_FILE, users)) {
        res.json({ message: 'Password changed successfully' });
    } else {
        res.status(500).json({ message: 'Error saving data' });
    }
});

// Change username
app.post('/api/change-username', authenticateToken, (req, res) => {
    const { newUsername, password } = req.body;

    if (!newUsername || !password) {
        return res.status(400).json({ message: 'New username and password are required' });
    }

    const users = readDataFile(USERS_FILE);
    const userIndex = users.findIndex(u => u.id === req.user.id);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Check if username already exists
    const usernameExists = users.some(u => u.username === newUsername && u.id !== req.user.id);
    if (usernameExists) {
        return res.status(400).json({ message: 'Username already taken' });
    }

    // Verify password
    if (!bcrypt.compareSync(password, users[userIndex].password)) {
        return res.status(401).json({ message: 'Password is incorrect' });
    }

    // Update username
    users[userIndex].username = newUsername;

    if (writeDataFile(USERS_FILE, users)) {
        // If user is an employee, update the employee record as well
        if (users[userIndex].role === 'employee' && users[userIndex].employeeId) {
            const employees = readDataFile(EMPLOYEES_FILE);
            const employeeIndex = employees.findIndex(e => e.id === users[userIndex].employeeId);

            if (employeeIndex !== -1) {
                employees[employeeIndex].username = newUsername;
                writeDataFile(EMPLOYEES_FILE, employees);
            }
        }

        res.json({
            message: 'Username changed successfully',
            user: {
                id: users[userIndex].id,
                username: newUsername,
                role: users[userIndex].role
            }
        });
    } else {
        res.status(500).json({ message: 'Error saving data' });
    }
});

// Get current user profile
app.get('/api/profile', authenticateToken, (req, res) => {
    const users = readDataFile(USERS_FILE);
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // If admin, get admin details
    if (user.role === 'admin') {
        const employees = readDataFile(EMPLOYEES_FILE);
        const adminUsers = users.filter(u => u.role === 'admin');

        // Get the admin user's full details
        const adminDetails = adminUsers.find(a => a.id === user.id);

        // Calculate some basic stats for the admin dashboard
        const totalEmployees = employees.length;
        const departments = [...new Set(employees.map(emp => emp.department))];
        const totalDepartments = departments.length;
        const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);

        return res.json({
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                name: adminDetails?.name || 'Admin User'
            },
            adminProfile: {
                id: user.id,
                name: adminDetails?.name || 'Admin User',
                email: adminDetails?.email || 'admin@example.com',
                phone: adminDetails?.phone || '555-ADMIN',
                position: 'Administrator',
                department: 'Management',
                joinDate: adminDetails?.joinDate || '2020-01-01',
                managedEmployees: totalEmployees,
                managedDepartments: totalDepartments,
                totalBudget: totalSalary,
                // Add more admin-specific data
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
            }
        });
    }

    // If employee, get employee details
    if (user.role === 'employee' && user.employeeId) {
        const employees = readDataFile(EMPLOYEES_FILE);
        const employee = employees.find(e => e.id === user.employeeId);

        if (employee) {
            return res.json({
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                },
                employee
            });
        }
    }

    res.json({
        user: {
            id: user.id,
            username: user.username,
            role: user.role
        }
    });
});

// Get admin data (admin only)
app.get('/api/admin/data', authenticateToken, authorizeRole(['admin']), (req, res) => {
    try {
        const employees = readDataFile(EMPLOYEES_FILE);
        const users = readDataFile(USERS_FILE);

        // Check if data is available
        if (!employees || employees.length === 0) {
            return res.status(404).json({
                message: 'No employee data available',
                error: 'DATA_NOT_FOUND'
            });
        }

        // Get admin users
        const adminUsers = users.filter(u => u.role === 'admin');

        if (!adminUsers || adminUsers.length === 0) {
            return res.status(404).json({
                message: 'No admin users found',
                error: 'ADMIN_NOT_FOUND'
            });
        }

        // Calculate department statistics
        const departments = [...new Set(employees.map(emp => emp.department))];
        const departmentStats = departments.map(dept => {
            const deptEmployees = employees.filter(emp => emp.department === dept);
            return {
                name: dept,
                count: deptEmployees.length,
                avgSalary: deptEmployees.reduce((sum, emp) => sum + emp.salary, 0) / deptEmployees.length
            };
        });

        res.json({
            adminUsers,
            employees,
            departments: departmentStats,
            totalSalary: employees.reduce((sum, emp) => sum + emp.salary, 0),
            totalEmployees: employees.length,
            totalDepartments: departments.length
        });
    } catch (error) {
        console.error('Error retrieving admin data:', error);
        res.status(500).json({
            message: 'Error retrieving admin data',
            error: error.message || 'UNKNOWN_ERROR'
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 