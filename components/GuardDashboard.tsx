
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useData } from '../context/AppContext';
import { UserRole, Student, StudentStatus } from '../types';
import Header from './Header';
import { FingerprintIcon, CheckCircleIcon, XCircleIcon, UserGroupIcon, SearchIcon, QrcodeIcon, CameraIcon } from './icons/Icons';
import { DESTINATIONS } from '../constants';

declare const Html5Qrcode: any;

const ScanResultCard: React.FC<{ student: Student; action: 'ENTRY' | 'EXIT' }> = ({ student, action }) => {
    const actionText = action === 'ENTRY' ? 'Checked In' : 'Checked Out';
    const actionColor = action === 'ENTRY' ? 'text-status-green' : 'text-status-yellow';

    return (
        <div className="bg-gray-surface p-6 rounded-xl border border-gray-border flex flex-col items-center text-center animate-fade-in w-full">
             <img src={student.photoUrl} alt={student.name} className="w-32 h-32 rounded-full object-cover border-4 border-gray-border shadow-lg mb-4" />
            <h3 className="text-2xl font-bold text-text-primary">{student.name}</h3>
            <p className="text-text-secondary">ID: {student.id} | Room: {student.roomNumber}</p>
            <div className={`mt-4 flex items-center font-semibold text-lg ${actionColor}`}>
                {action === 'ENTRY' ? <CheckCircleIcon className="h-7 w-7 mr-2" /> : <XCircleIcon className="h-7 w-7 mr-2" />}
                <span>{actionText} Successfully</span>
            </div>
        </div>
    );
};

const DestinationSelector: React.FC<{ student: Student; onConfirm: (destination: string) => void; onCancel: () => void; }> = ({ student, onConfirm, onCancel }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selected, setSelected] = useState('');

    const filteredDestinations = useMemo(() => 
        DESTINATIONS.filter(d => d.toLowerCase().includes(searchTerm.toLowerCase())), 
    [searchTerm]);

    return (
        <div className="bg-gray-surface p-6 rounded-xl border border-gray-border w-full animate-fade-in">
            <h3 className="font-bold text-lg text-center mb-1 text-text-primary">Select Destination</h3>
            <p className="text-center text-sm text-text-secondary mb-4">For <span className="font-semibold text-text-primary">{student.name}</span></p>
            
            <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-text-tertiary" />
                </div>
                <input
                    type="text"
                    placeholder="Search destination..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-light border border-gray-border text-text-primary rounded-md focus:ring-1 focus:ring-primary focus:border-primary"
                />
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {filteredDestinations.map(dest => (
                    <button 
                        key={dest} 
                        onClick={() => setSelected(dest)}
                        className={`w-full text-left p-2 rounded-md transition-colors text-sm ${selected === dest ? 'bg-primary text-white' : 'text-text-primary hover:bg-gray-light'}`}
                    >
                        {dest}
                    </button>
                ))}
            </div>

            <div className="mt-6 flex gap-3">
                <button onClick={onCancel} className="w-full py-2 px-4 bg-gray-light text-text-primary font-semibold rounded-md hover:opacity-80 transition-opacity">Cancel</button>
                <button 
                    onClick={() => onConfirm(selected)}
                    disabled={!selected}
                    className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-md hover:opacity-90 transition-opacity disabled:bg-gray-light disabled:text-text-tertiary"
                >
                    Confirm Exit
                </button>
            </div>
        </div>
    )
}

const QrScanner: React.FC<{ onScanSuccess: (decodedText: string) => void; onClose: () => void; }> = ({ onScanSuccess, onClose }) => {
    const scannerRef = useRef<any>(null);

    useEffect(() => {
        const scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner;
        let isStopped = false;

        const successCallback = (decodedText: string) => {
            if (isStopped) return;
            isStopped = true;
            
            scanner.stop()
                .then(() => {
                    onScanSuccess(decodedText);
                })
                .catch(err => {
                    console.error("Error stopping scanner after success:", err);
                    onScanSuccess(decodedText);
                });
        };
        
        const errorCallback = (errorMessage: string) => {
            // Ignore common "QR code not found" errors
        };

        const config = {
            fps: 10,
            qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
                const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
                const qrboxSize = Math.floor(minEdge * 0.7);
                return { width: qrboxSize, height: qrboxSize };
            },
            aspectRatio: 1.0,
            supportedScanTypes: []
        };

        scanner.start({ facingMode: "environment" }, config, successCallback, errorCallback)
            .catch(err => {
                console.error("Unable to start scanner", err);
                alert("Error: Could not start QR scanner. Please ensure camera permissions are granted.");
                onClose();
            });

        return () => {
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop()
                    .catch((err: any) => {
                        console.error("Failed to stop scanner on cleanup.", err);
                    });
            }
        };
    }, [onScanSuccess, onClose]);

    return (
        <div className="fixed inset-0 bg-black/90 z-20 flex flex-col items-center justify-center p-4">
            <div className="bg-gray-surface rounded-xl shadow-2xl w-full max-w-md relative animate-fade-in border border-gray-border">
                <div id="qr-reader" className="w-full rounded-t-xl overflow-hidden aspect-square"></div>
                <div className="p-4 text-center border-t border-gray-border">
                    <p className="text-sm text-text-secondary">Align student's QR code within the frame.</p>
                </div>
                 <button
                    onClick={onClose}
                    className="absolute -top-4 -right-4 bg-gray-light rounded-full p-1 text-text-primary hover:text-red-400 shadow-lg transition-transform hover:scale-110"
                    aria-label="Close scanner"
                >
                    <XCircleIcon className="h-10 w-10" />
                </button>
            </div>
        </div>
    );
};

const FingerprintVerifier: React.FC<{
    onVerify: (studentId: string) => void;
    onCancel: () => void;
}> = ({ onVerify, onCancel }) => {
    const { students } = useData();
    const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
    const [isVerifying, setIsVerifying] = useState(false);

    const handleVerification = () => {
        if (!selectedStudentId) return;
        setIsVerifying(true);
        // Simulate scanning delay
        setTimeout(() => {
            onVerify(selectedStudentId);
            setIsVerifying(false);
        }, 1500);
    };
    
    if (isVerifying) {
        return (
            <div className="text-center">
                <FingerprintIcon className="h-32 w-32 text-primary mx-auto animate-pulse-fast" />
                <p className="mt-4 text-lg font-semibold text-text-secondary">Verifying Fingerprint...</p>
                <p className="text-sm text-text-tertiary">Please wait.</p>
            </div>
        )
    }

    return (
        <div className="bg-gray-surface p-6 rounded-xl border border-gray-border w-full animate-fade-in">
            <h3 className="font-bold text-lg text-center mb-4 text-text-primary">Verify Student Fingerprint</h3>
            <div className="space-y-4">
                <div>
                    <label htmlFor="student-select" className="block text-sm font-medium text-text-secondary mb-1">Select Student:</label>
                    <select
                        id="student-select"
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                        className="w-full p-3 bg-gray-light border border-gray-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                        <option value="" disabled>-- Select a student --</option>
                        {students.map(s => (
                            <option key={s.id} value={s.id}>{s.name} - {s.id}</option>
                        ))}
                    </select>
                </div>
                <div className="mt-6 flex gap-3">
                    <button onClick={onCancel} className="w-full py-2 px-4 bg-gray-light text-text-primary font-semibold rounded-md hover:opacity-80 transition-opacity">Cancel</button>
                    <button 
                        onClick={handleVerification}
                        disabled={!selectedStudentId || isVerifying}
                        className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-md hover:opacity-90 transition-opacity disabled:bg-gray-light disabled:text-text-tertiary"
                    >
                        Verify
                    </button>
                </div>
            </div>
        </div>
    );
};


const GuardDashboard: React.FC = () => {
    const { students, logStudentMovement } = useData();
    const [view, setView] = useState<'idle' | 'fingerprint' | 'processing' | 'result' | 'destination_select'>('idle');
    const [viewData, setViewData] = useState<any>(null);
    const [error, setError] = useState('');
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    const counts = useMemo(() => {
        const inside = students.filter(s => s.status === StudentStatus.INSIDE).length;
        const outside = students.length - inside;
        return { inside, outside, total: students.length };
    }, [students]);

    const processStudentVerification = useCallback((studentId: string) => {
        setError('');
        setView('processing');
        setViewData(null);

        setTimeout(() => {
            const student = students.find(s => s.id.toUpperCase() === studentId.toUpperCase());
            
            if (!student) {
                setView('idle');
                setError('Invalid Student ID.');
                return;
            }

            const action = student.status === StudentStatus.INSIDE ? 'EXIT' : 'ENTRY';
            
            if (action === 'ENTRY') {
                const updatedStudent = logStudentMovement(studentId, 'ENTRY');
                 if (updatedStudent) {
                    setView('result');
                    setViewData({ student: updatedStudent, action: 'ENTRY' });
                } else {
                    setView('idle');
                    setError('Could not process the request.');
                }
            } else { // Action is 'EXIT'
                setView('destination_select');
                setViewData({ student });
            }
        }, 500);
    }, [logStudentMovement, students]);
    
    const handleQrScanned = (studentId: string) => {
        setIsScannerOpen(false);
        processStudentVerification(studentId);
    };

    const handleConfirmExit = (destination: string) => {
        if (!viewData?.student) return;

        const updatedStudent = logStudentMovement(viewData.student.id, 'EXIT', destination);
        if (updatedStudent) {
            setView('result');
            setViewData({ student: updatedStudent, action: 'EXIT' });
        } else {
            setView('idle');
            setError('Could not process the exit log.');
        }
    };

    const resetView = () => {
        setView('idle');
        setViewData(null);
        setError('');
    };

    useEffect(() => {
        if (view === 'result' || error) {
            const timer = setTimeout(() => {
                resetView();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [view, error]);

    return (
        <>
            <Header role={UserRole.GUARD} />
             {isScannerOpen && <QrScanner onScanSuccess={handleQrScanned} onClose={() => setIsScannerOpen(false)} />}
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                     <div className="bg-gray-surface border border-gray-border p-6 rounded-lg shadow-lg flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-text-secondary">Students Inside</p>
                            <p className="text-3xl font-bold text-status-green">{counts.inside}</p>
                        </div>
                        <CheckCircleIcon className="h-10 w-10 text-status-green/50"/>
                    </div>
                    <div className="bg-gray-surface border border-gray-border p-6 rounded-lg shadow-lg flex items-center justify-between">
                         <div>
                            <p className="text-sm font-medium text-text-secondary">Students Outside</p>
                            <p className="text-3xl font-bold text-status-yellow">{counts.outside}</p>
                        </div>
                        <XCircleIcon className="h-10 w-10 text-status-yellow/50"/>
                    </div>
                    <div className="bg-gray-surface border border-gray-border p-6 rounded-lg shadow-lg flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-text-secondary">Total Students</p>
                            <p className="text-3xl font-bold text-text-primary">{counts.total}</p>
                        </div>
                        <UserGroupIcon className="h-10 w-10 text-text-tertiary"/>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-surface p-8 rounded-xl shadow-lg border border-gray-border flex flex-col items-center justify-center min-h-[300px]">
                        <h2 className="text-2xl font-bold text-center mb-6 text-text-primary">Verification Terminal</h2>
                         {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                         <div className="w-full max-w-xs space-y-4">
                            <button
                                onClick={() => setIsScannerOpen(true)}
                                disabled={view !== 'idle'}
                                className="w-full flex items-center justify-center gap-3 py-4 px-4 text-white font-bold bg-primary rounded-lg hover:opacity-90 disabled:bg-gray-light disabled:text-text-tertiary disabled:cursor-not-allowed transition-all duration-200 shadow-md text-lg"
                            >
                                <CameraIcon className="h-8 w-8"/> Scan Student QR
                            </button>
                            <button
                                onClick={() => setView('fingerprint')}
                                disabled={view !== 'idle'}
                                className="w-full flex items-center justify-center gap-3 py-4 px-4 text-text-primary font-bold bg-gray-light rounded-lg hover:bg-gray-border disabled:bg-gray-light disabled:text-text-tertiary disabled:cursor-not-allowed transition-all duration-200 shadow-md text-lg"
                            >
                                <FingerprintIcon className="h-8 w-8"/> Verify Fingerprint
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-center min-h-[300px]">
                        {(() => {
                            switch (view) {
                                case 'processing':
                                    return (
                                        <div className="text-center">
                                            <QrcodeIcon className="h-32 w-32 text-primary mx-auto animate-pulse-fast" />
                                            <p className="mt-4 text-lg font-semibold text-text-secondary">Processing...</p>
                                            <p className="text-sm text-text-tertiary">Verifying student status.</p>
                                        </div>
                                    );
                                case 'fingerprint':
                                    return <FingerprintVerifier onVerify={processStudentVerification} onCancel={resetView} />;
                                case 'destination_select':
                                    return <DestinationSelector student={viewData.student} onConfirm={handleConfirmExit} onCancel={resetView}/>;
                                case 'result':
                                    return <ScanResultCard student={viewData.student} action={viewData.action} />;
                                case 'idle':
                                default:
                                    return (
                                        <div className="text-center text-text-tertiary p-8 border-2 border-dashed border-gray-border rounded-lg w-full">
                                            <QrcodeIcon className="h-24 w-24 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-text-secondary">Verification results will appear here</h3>
                                            <p className="text-sm">Ready for student verification.</p>
                                        </div>
                                    );
                            }
                        })()}
                    </div>

                </div>
            </main>
        </>
    );
};

export default GuardDashboard;
