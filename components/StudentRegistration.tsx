
import React, { useState, useEffect, useCallback } from 'react';
import { useData } from '../context/AppContext';
import { Student } from '../types';
import { UserIcon, OfficeBuildingIcon, CheckCircleIcon, DocumentDownloadIcon, PhotographIcon, FingerprintIcon } from './icons/Icons';

declare const QRCode: any;

const StudentRegistration: React.FC = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [fingerprintScanned, setFingerprintScanned] = useState(false);
    const [isScanningFingerprint, setIsScanningFingerprint] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [registeredStudent, setRegisteredStudent] = useState<Student | null>(null);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const { registerStudent } = useData();

    useEffect(() => {
        if (registeredStudent) {
            QRCode.toDataURL(registeredStudent.id, { errorCorrectionLevel: 'H', width: 256, color: { dark: '#F5F5F7', light: '#1e1e1e' } })
                .then((url: string) => {
                    setQrCodeUrl(url);
                })
                .catch((err: any) => {
                    console.error('Failed to generate QR code', err);
                });
        }
    }, [registeredStudent]);

    const handleFileChange = (files: FileList | null) => {
        if (files && files[0]) {
            const file = files[0];
            setPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        handleFileChange(e.dataTransfer.files);
    }, []);

    const handleFingerprintScan = () => {
        setIsScanningFingerprint(true);
        setFingerprintScanned(false);
        setTimeout(() => {
            setIsScanningFingerprint(false);
            setFingerprintScanned(true);
        }, 2000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !room || !photoPreview || !fingerprintScanned) return;
        
        setIsSubmitting(true);
        setRegisteredStudent(null);
        setQrCodeUrl('');
        setEmailSent(false);
        
        setTimeout(() => {
            const newStudent = registerStudent(name, room, photoPreview);
            setRegisteredStudent(newStudent);
            setName('');
            setRoom('');
            setPhoto(null);
            setPhotoPreview(null);
            setFingerprintScanned(false);
            setIsSubmitting(false);
        }, 1000);
    };

    const handleEmail = () => {
        setEmailSent(true);
        setTimeout(() => setEmailSent(false), 3000);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-surface p-8 rounded-xl shadow-lg border border-gray-border">
                <h2 className="text-2xl font-bold mb-6 text-text-primary">New Student Registration</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label 
                            htmlFor="photo-upload"
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-border border-dashed rounded-lg cursor-pointer bg-gray-light/50 hover:bg-gray-light"
                        >
                            {photoPreview ? (
                                <img src={photoPreview} alt="Student preview" className="h-full w-full object-cover rounded-lg"/>
                            ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-text-secondary">
                                    <PhotographIcon className="w-10 h-10 mb-3"/>
                                    <p className="mb-2 text-sm">Click to upload or drag and drop</p>
                                    <p className="text-xs">PNG, JPG or JPEG</p>
                                </div>
                            )}
                            <input id="photo-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={(e) => handleFileChange(e.target.files)} />
                        </label>
                    </div>

                    <div>
                        <div className={`flex items-center justify-between p-3 rounded-lg border ${fingerprintScanned ? 'border-status-green bg-status-green/10' : 'border-gray-border bg-gray-light/50'} transition-colors`}>
                            <div className="flex items-center gap-3">
                                <FingerprintIcon className={`h-8 w-8 ${fingerprintScanned ? 'text-status-green' : 'text-text-tertiary'}`} />
                                <div>
                                    <p className={`font-semibold ${fingerprintScanned ? 'text-text-primary' : 'text-text-secondary'}`}>
                                        {fingerprintScanned ? 'Fingerprint Captured' : 'Biometric Data'}
                                    </p>
                                    <p className="text-xs text-text-tertiary">
                                        {fingerprintScanned ? 'Ready for registration.' : 'Required for new students.'}
                                    </p>
                                </div>
                            </div>
                            {!fingerprintScanned && (
                                <button
                                    type="button"
                                    onClick={handleFingerprintScan}
                                    disabled={isScanningFingerprint}
                                    className="px-4 py-2 text-sm font-semibold bg-gray-light text-text-primary rounded-md hover:opacity-80 transition-opacity disabled:opacity-50"
                                >
                                    {isScanningFingerprint ? 'Scanning...' : 'Scan Now'}
                                </button>
                            )}
                            {fingerprintScanned && <CheckCircleIcon className="h-6 w-6 text-status-green" />}
                        </div>
                    </div>

                     <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon className="h-5 w-5 text-text-tertiary" />
                        </div>
                        <input
                            type="text"
                            placeholder="Student Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full pl-10 pr-3 py-3 bg-gray-light border border-gray-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition"
                        />
                    </div>
                     <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <OfficeBuildingIcon className="h-5 w-5 text-text-tertiary" />
                        </div>
                        <input
                            type="text"
                            placeholder="Room Number (e.g., A-101)"
                            value={room}
                            onChange={(e) => setRoom(e.target.value)}
                            required
                            className="w-full pl-10 pr-3 py-3 bg-gray-light border border-gray-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition"
                        />
                    </div>
                    <button 
                        type="submit"
                        disabled={isSubmitting || !name || !room || !photo || !fingerprintScanned}
                        className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-md hover:opacity-90 transition-colors disabled:bg-gray-light disabled:text-text-tertiary"
                    >
                        {isSubmitting ? 'Registering...' : 'Register Student'}
                    </button>
                </form>
            </div>
             <div className="flex items-center justify-center">
                {registeredStudent ? (
                     <div className="bg-gray-surface p-6 rounded-lg border border-gray-border flex flex-col items-center text-center animate-fade-in w-full max-w-sm">
                        <CheckCircleIcon className="h-16 w-16 text-status-green mb-4" />
                        <h3 className="text-xl font-bold text-text-primary">Registration Successful!</h3>
                        
                         {qrCodeUrl ? (
                            <img src={qrCodeUrl} alt={`QR Code for ${registeredStudent.name}`} className="my-4 rounded-lg shadow-md" />
                        ) : (
                            <div className="w-64 h-64 bg-gray-light my-4 flex items-center justify-center rounded-lg"><p>Generating QR...</p></div>
                        )}
                        
                        <p className="text-lg font-semibold text-text-primary">{registeredStudent.name}</p>
                        <p className="text-text-secondary">ID: <span className="font-mono bg-gray-light px-2 py-1 rounded">{registeredStudent.id}</span></p>
                        <p className="text-text-secondary">Room: {registeredStudent.roomNumber}</p>
                        
                        <div className="mt-6 w-full space-y-3">
                             <a
                                href={qrCodeUrl}
                                download={`QRCode_${registeredStudent.id}.png`}
                                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-primary/20 text-primary font-semibold rounded-md hover:bg-primary/30 transition-colors"
                            >
                                <DocumentDownloadIcon className="h-5 w-5"/>
                                Download QR Code
                            </a>
                             <button 
                                onClick={handleEmail}
                                disabled={!qrCodeUrl || emailSent}
                                className="w-full py-2 px-4 bg-gray-light text-text-primary font-semibold rounded-md hover:opacity-80 transition-colors disabled:bg-status-green disabled:text-text-primary disabled:cursor-not-allowed"
                            >
                                {emailSent ? 'Sent to Email!' : 'Email QR Code'}
                            </button>
                        </div>

                        <button onClick={() => setRegisteredStudent(null)} className="mt-6 text-sm text-primary hover:underline">
                            Register Another Student
                        </button>
                    </div>
                ) : (
                    <div className="text-center text-text-tertiary p-8 border-2 border-dashed border-gray-border rounded-lg w-full">
                         <h3 className="text-lg font-medium text-text-secondary">New student details will appear here upon successful registration.</h3>
                     </div>
                )}
            </div>
        </div>
    );
};

export default StudentRegistration;
