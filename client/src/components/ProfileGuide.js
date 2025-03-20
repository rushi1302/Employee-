import React from 'react';
import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ProfileGuide = ({ isAdmin, onClose }) => {
    return (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-blue-700 mb-6 rounded-r-md animate-fade-in">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-medium flex items-center">
                        <InformationCircleIcon className="h-5 w-5 mr-2" />
                        Profile Guide
                    </p>
                    <div className="mt-2 space-y-2 text-sm">
                        <p><strong>What you can see:</strong> Your profile displays your personal and professional information.</p>
                        {isAdmin ? (
                            <>
                                <p><strong>Admin Profile:</strong> As an administrator, you can see statistics about employees and departments you manage.</p>
                                <p><strong>Permissions:</strong> Your admin permissions are listed, showing what actions you can perform in the system.</p>
                                <p><strong>Recent Activity:</strong> A log of your recent administrative actions is displayed for reference.</p>
                            </>
                        ) : (
                            <>
                                <p><strong>Employee Profile:</strong> Your employment details, contact information, and account settings.</p>
                                <p><strong>Editing:</strong> You can edit certain fields of your profile by clicking the "Edit Profile" button.</p>
                            </>
                        )}
                        <p><strong>Security:</strong> You can change your password and username using the links at the bottom of the page.</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="text-blue-700 hover:text-blue-900"
                    aria-label="Close guide"
                >
                    <XMarkIcon className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default ProfileGuide; 