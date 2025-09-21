
import React from 'react';
import { useAuth } from '../context/AppContext';
import { FingerprintIcon, LogoutIcon } from './icons/Icons';
import { UserRole } from '../types';

interface HeaderProps {
    role: UserRole;
}

const Header: React.FC<HeaderProps> = ({ role }) => {
    const { logout } = useAuth();
    return (
        <header className="bg-gray-surface/80 backdrop-blur-lg border-b border-gray-border sticky top-0 z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <FingerprintIcon className="h-8 w-8 text-primary"/>
                        <h1 className="ml-3 text-2xl font-bold text-text-primary">
                            Hostel Security Portal
                        </h1>
                        <span className="ml-4 bg-primary/20 text-primary text-xs font-bold px-2.5 py-0.5 rounded-full">{role}</span>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center px-4 py-2 text-sm font-medium text-text-secondary bg-gray-light rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-colors duration-200"
                    >
                        <LogoutIcon className="h-5 w-5 mr-2" />
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;