# Employee Management System

A modern employee management application with a minimalist UI design, built with React, Tailwind CSS, and Node.js.

## Features

- **Multiple User Roles**: Admin and Employee access levels
- **Employee Profiles**: View and manage employee information
- **Admin Dashboard**: Overview of employee data and department statistics
- **Responsive Design**: Works on desktop and mobile devices
- **Secure Authentication**: JWT-based authentication system
- **Interactive Guides**: Contextual help for profile sections and application features

## Tech Stack

### Frontend

- React.js
- React Router for navigation
- Tailwind CSS for styling
- Heroicons for icons
- Axios for API requests

### Backend

- Node.js
- Express.js
- JWT for authentication
- File system for data storage (JSON files)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository

```
git clone <repository-url>
cd employee-management-app
```

2. Install dependencies for both client and server

```
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Start the development servers

```
# Start the backend server (from the server directory)
npm run dev

# Start the frontend development server (from the client directory)
npm start
```

4. Access the application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Default Login Credentials

### Admin Users

- Username: admin, Password: admin123
- Username: sarahjohnson, Password: admin456

### Employee Users

- Username: johndoe, Password: password123
- Username: janesmith, Password: password123
- Username: michaelj, Password: password123
- Username: emilyd, Password: password123
- Username: robertw, Password: password123
- Username: lisab, Password: password123
- Username: davidm, Password: password123
- Username: jennifert, Password: password123

## Sample Data

The application comes with sample data including:

### Departments

- Engineering
- Design
- Management
- Marketing
- Human Resources
- Finance

### Positions

- Software Developer
- UX Designer
- Project Manager
- Marketing Specialist
- Senior Developer
- HR Manager
- Financial Analyst
- Content Writer

## Project Structure

```
employee-management-app/
├── client/                 # React frontend
│   ├── public/             # Static files
│   └── src/                # Source files
│       ├── components/     # Reusable components
│       ├── context/        # React context (auth)
│       ├── pages/          # Page components
│       └── services/       # API services
└── server/                 # Node.js backend
    ├── data/               # JSON data storage
    └── server.js           # Main server file
```

## License

This project is licensed under the MIT License.

## User Experience Features

### Profile Guide

The application includes an interactive guide system that helps users understand different sections of their profile:

- **Contextual Help**: Different guides for admin and regular employees
- **Accessible Help**: Available from both the profile page and the main navigation
- **Visual Indicators**: Clear icons and animations for better user experience

### Responsive Layout

- Full-height sidebar navigation
- Sticky header for better navigation
- Mobile-friendly design with collapsible sidebar
# Employee-
