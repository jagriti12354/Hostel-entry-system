
import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../context/AppContext';
import { Student, StudentStatus } from '../types';
import { ChipIcon, FingerprintIcon } from './icons/Icons';
import { DESTINATIONS } from '../constants';

type ActivityLog = {
    id: number;
    message: string;
    type: 'info' | 'success' | 'error';
    timestamp: string;
};

const BridgeApplication: React.FC = () => {
    const { students, logStudentMovement } = useData();
    const [selectedStudentId, setSelectedStudentId] = useState<string>('');
    const [destination, setDestination] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

    const selectedStudent = useMemo(() => {
        return students.find(s => s.id === selectedStudentId);
    }, [selectedStudentId, students]);

    const isExitAction = selectedStudent?.status === StudentStatus.INSIDE;

    useEffect(() => {
        if (!selectedStudentId && students.length > 0) {
            setSelectedStudentId(students[0].id);
        }
        if (isExitAction) {
            setDestination(DESTINATIONS[0]);
        }
    }, [selectedStudentId, students, isExitAction]);

    const addLog = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
        setActivityLogs(prev => [
            { id: Date.now(), message, type, timestamp: new Date().toLocaleTimeString() },
            ...prev
        ]);
    };

    const handleSimulateScan = async () => {
        if (!selectedStudent) {
            addLog("No student selected for simulation.", 'error');
            return;
        }

        setIsProcessing(true);
        addLog(`[INITIATING] Simulating scan for ${selectedStudent.name} (${selectedStudent.id}).`);

        await new Promise(res => setTimeout(res, 500));
        const action = isExitAction ? 'EXIT' : 'ENTRY';
        addLog(`[STATUS CHECK] Student is currently ${selectedStudent.status}. Action determined as: ${action}.`);

        await new Promise(res => setTimeout(res, 500));
        addLog("[API CALL] Sending request to Hostel Management System...");

        await new Promise(res => setTimeout(res, 1000));
        const result = logStudentMovement(selectedStudent.id, action, isExitAction ? destination : undefined);

        if (result) {
            const successMessage = action === 'ENTRY'
                ? `Student ${result.name} logged in successfully.`
                : `Student ${result.name} logged out to ${destination}.`;
            addLog(`[SUCCESS] ${successMessage}`, 'success');
        } else {
            addLog(`[FAILURE] Failed to process log for ${selectedStudent.name}.`, 'error');
        }

        setIsProcessing(false);
    };

    const getLogColor = (type: ActivityLog['type']) => {
        switch (type) {
            case 'success': return 'text-status-green';
            case 'error': return 'text-red-500';
            default: return 'text-text-secondary';
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-surface p-8 rounded-xl shadow-lg border border-gray-border">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-text-primary">Biometric Bridge</h2>
                    <span className="flex items-center gap-2 text-sm font-medium text-status-green bg-status-green/20 px-3 py-1 rounded-full">
                        <span className="h-2 w-2 bg-status-green rounded-full animate-pulse"></span>
                        Active & Listening
                    </span>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <label htmlFor="student-select" className="block text-sm font-medium text-text-secondary mb-1">Simulate Scan For:</label>
                        <select
                            id="student-select"
                            value={selectedStudentId}
                            onChange={(e) => setSelectedStudentId(e.target.value)}
                            className="w-full p-3 bg-gray-light border border-gray-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                            {students.map(s => (
                                <option key={s.id} value={s.id}>{s.name} - {s.id}</option>
                            ))}
                        </select>
                    </div>

                    {isExitAction && (
                        <div>
                            <label htmlFor="destination-select" className="block text-sm font-medium text-text-secondary mb-1">Destination (for Exit):</label>
                            <select
                                id="destination-select"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                className="w-full p-3 bg-gray-light border border-gray-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                                {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    )}
                    
                    <button
                        onClick={handleSimulateScan}
                        disabled={isProcessing}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 text-white font-bold bg-primary rounded-lg hover:opacity-90 disabled:bg-gray-light disabled:text-text-tertiary disabled:cursor-not-allowed transition-all duration-200 shadow-md text-lg"
                    >
                        <FingerprintIcon className="h-6 w-6" />
                        {isProcessing ? 'Processing Scan...' : 'Simulate Scan'}
                    </button>
                </div>
            </div>

            <div className="bg-gray-surface p-6 rounded-xl shadow-lg border border-gray-border">
                 <h3 className="text-lg font-bold text-text-primary mb-4">Activity Log</h3>
                 <div className="bg-gray-bg rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm space-y-2">
                    {activityLogs.length > 0 ? activityLogs.map(log => (
                        <div key={log.id}>
                            <span className="text-text-tertiary mr-2">{log.timestamp}</span>
                            <span className={`${getLogColor(log.type)}`}>{log.message}</span>
                        </div>
                    )) : (
                        <p className="text-text-tertiary">Awaiting simulation...</p>
                    )}
                 </div>
            </div>
        </div>
    );
};

export default BridgeApplication;
