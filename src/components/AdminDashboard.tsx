
import React, { useState, useMemo, useEffect } from 'react';
import Header from './Header';
import { UserRole, Student, StudentStatus } from '../types';
import StudentRegistration from './StudentRegistration';
import StudentLogSheet from './StudentLogSheet';
import { useData } from '../context/AppContext';
import { HomeIcon, UserAddIcon, TableIcon, UserGroupIcon, CheckCircleIcon, XCircleIcon, QrcodeIcon, DocumentDownloadIcon } from './icons/Icons';
import QRCode from 'qrcode';


const StudentDetailModal: React.FC<{ student: Student; onClose: () => void; }> = ({ student, onClose }) => {
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    useEffect(() => {
        QRCode.toDataURL(student.id, { errorCorrectionLevel: 'H', width: 256, color: { dark: '#F5F5F7', light: '#1e1e1e' } })
            .then(setQrCodeUrl)
            .catch((err: any) => console.error(err));
    }, [student]);

    return (
        <div className="fixed inset-0 bg-black/70 z-20 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-surface p-6 rounded-xl border border-gray-border shadow-lg flex flex-col items-center text-center animate-fade-in w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <img src={student.photoUrl} alt={student.name} className="w-24 h-24 rounded-full object-cover border-4 border-gray-border shadow-md" />
                <h3 className="text-xl font-bold text-text-primary mt-4">{student.name}</h3>
                <p className="text-text-secondary">ID: <span className="font-mono bg-gray-light px-2 py-1 rounded">{student.id}</span></p>
                <p className="text-text-secondary">Room: {student.roomNumber}</p>
                
                {qrCodeUrl ? (
                    <img src={qrCodeUrl} alt={`QR Code for ${student.name}`} className="my-4 rounded-lg shadow-md border border-gray-border" />
                ) : (
                    <div className="w-64 h-64 bg-gray-light my-4 flex items-center justify-center rounded-lg"><p>Generating QR...</p></div>
                )}
                
                <a
                    href={qrCodeUrl}
                    download={`QRCode_${student.id}.png`}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-primary/20 text-primary font-semibold rounded-md hover:bg-primary/30 transition-colors"
                >
                    <DocumentDownloadIcon className="h-5 w-5"/>
                    Download QR Code
                </a>
                <button onClick={onClose} className="mt-4 text-sm text-text-secondary hover:underline">Close</button>
            </div>
        </div>
    );
};


const ManageStudents: React.FC = () => {
    const { students } = useData();
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    return (
        <>
        {selectedStudent && <StudentDetailModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />}
        <div className="bg-gray-surface p-6 rounded-xl shadow-lg border border-gray-border">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Student Roster</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-border">
                    <thead className="bg-gray-surface">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Room No.</th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-surface divide-y divide-gray-border">
                        {students.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-light transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-full" src={student.photoUrl} alt="" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-text-primary">{student.name}</div>
                                            <div className="text-sm text-text-secondary font-mono">{student.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {student.status === StudentStatus.INSIDE ? (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-status-green/20 text-status-green">
                                            Inside
                                        </span>
                                    ) : (
                                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-status-yellow/20 text-status-yellow">
                                            Outside
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{student.roomNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => setSelectedStudent(student)} className="flex items-center gap-2 text-primary hover:opacity-80">
                                        <QrcodeIcon className="h-5 w-5"/> View QR Code
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </>
    );
};


const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const { students } = useData();

    const counts = useMemo(() => {
        const inside = students.filter(s => s.status === StudentStatus.INSIDE).length;
        const outside = students.length - inside;
        return { inside, outside, total: students.length };
    }, [students]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'register':
                return <StudentRegistration />;
            case 'logs':
                return <StudentLogSheet />;
            case 'manage':
                return <ManageStudents />;
            case 'dashboard':
            default:
                return (
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                );
        }
    };

    const TabButton: React.FC<{ tabId: string; icon: React.ReactNode; label: string }> = ({ tabId, icon, label }) => (
         <button
            onClick={() => setActiveTab(tabId)}
            className={`flex-1 flex items-center justify-center gap-3 px-3 py-2.5 font-semibold text-sm rounded-lg transition-all duration-200 ${
                activeTab === tabId
                    ? 'bg-gray-light text-text-primary shadow'
                    : 'text-text-secondary hover:bg-gray-light/50 hover:text-text-primary'
            }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    )

    return (
        <>
            <Header role={UserRole.ADMIN} />
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="bg-gray-surface rounded-lg border border-gray-border p-2 mb-8">
                     <nav className="flex space-x-2">
                        <TabButton tabId="dashboard" icon={<HomeIcon className="h-5 w-5"/>} label="Dashboard" />
                        <TabButton tabId="register" icon={<UserAddIcon className="h-5 w-5"/>} label="Register" />
                        <TabButton tabId="logs" icon={<TableIcon className="h-5 w-5"/>} label="Logs" />
                        <TabButton tabId="manage" icon={<UserGroupIcon className="h-5 w-5"/>} label="Manage" />
                    </nav>
                </div>
                <div>
                    {renderTabContent()}
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;