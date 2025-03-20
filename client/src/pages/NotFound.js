import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/outline';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center">
                <h1 className="text-9xl font-bold text-primary-600">404</h1>
                <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Page Not Found</h2>
                <p className="mt-2 text-lg text-gray-600">
                    The page you are looking for doesn't exist or has been moved.
                </p>
                <div className="mt-6">
                    <Link to="/" className="btn btn-primary inline-flex items-center">
                        <HomeIcon className="h-5 w-5 mr-2" />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound; 