import React from 'react';
import { AppProvider, useAuth } from './context/AppContext.tsx';
import Login from './components/Login.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import GuardDashboard from './components/GuardDashboard.tsx';
import { UserRole } from './types.ts';

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