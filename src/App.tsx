
import React from 'react';
import { AppProvider, useAuth } from './context/AppContext';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import GuardDashboard from './components/GuardDashboard';
import { UserRole } from './types';

const AppContent: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return <Login />;
    }

    return (
        <div className="min-h-screen bg-gray-bg font-sans text-text-primary">
            {user.role === UserRole.ADMIN && <AdminDashboard />}
            {user.role === UserRole.GUARD && <GuardDashboard />}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
};

export default App;