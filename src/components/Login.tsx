
import React, { useState } from 'react';
import { useAuth } from '../context/AppContext';
import { FingerprintIcon, LockClosedIcon, UserIcon, ArrowRightIcon } from './icons/Icons';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        setTimeout(() => {
            const result = login(username, password);
            if (result === 'error') {
                setError('Invalid username or password.');
            }
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-bg">
            <div className="w-full max-w-sm p-8 space-y-8 bg-gray-surface rounded-2xl border border-gray-border shadow-2xl">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 rounded-full bg-gray-light">
                           <FingerprintIcon className="h-10 w-10 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-text-primary">Hostel Entry System</h1>
                    <p className="mt-2 text-sm text-text-secondary">Secure Access Portal</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon className="h-5 w-5 text-text-tertiary" />
                        </div>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            required
                            className="w-full pl-10 pr-3 py-3 bg-gray-light border border-gray-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition"
                            placeholder="Username (admin or guard)"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LockClosedIcon className="h-5 w-5 text-text-tertiary" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="w-full pl-10 pr-3 py-3 bg-gray-light border border-gray-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                     {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-gray-surface disabled:bg-gray-light disabled:text-text-tertiary transition-colors duration-300"
                        >
                           {loading ? 'Signing in...' : 'Sign in'}
                           <span className="absolute right-0 inset-y-0 flex items-center pr-3">
                                <ArrowRightIcon className="h-5 w-5 text-green-300 group-hover:text-white transition" />
                            </span>
                        </button>
                    </div>
                </form>
                 <p className="text-xs text-center text-text-tertiary">
                    Hint: Use 'admin'/'adminpassword' or 'guard'/'guardpassword'.
                </p>
            </div>
        </div>
    );
};

export default Login;