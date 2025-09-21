
import { Student, StudentStatus, LogEntry } from './types';

export const ADMIN_USERNAME = 'admin';
export const ADMIN_PASSWORD = 'adminpassword';
export const GUARD_USERNAME = 'guard';
export const GUARD_PASSWORD = 'guardpassword';

export const INITIAL_STUDENTS: Student[] = [
    { id: 'ST1001', name: 'Rohan Sharma', roomNumber: 'A-101', photoUrl: 'https://picsum.photos/seed/ST1001/200', status: StudentStatus.INSIDE },
    { id: 'ST1002', name: 'Priya Patel', roomNumber: 'A-102', photoUrl: 'https://picsum.photos/seed/ST1002/200', status: StudentStatus.INSIDE },
    { id: 'ST1003', name: 'Amit Singh', roomNumber: 'B-205', photoUrl: 'https://picsum.photos/seed/ST1003/200', status: StudentStatus.OUTSIDE },
    { id: 'ST1004', name: 'Sneha Verma', roomNumber: 'B-206', photoUrl: 'https://picsum.photos/seed/ST1004/200', status: StudentStatus.INSIDE },
    { id: 'ST1005', name: 'Vikram Rathod', roomNumber: 'C-301', photoUrl: 'https://picsum.photos/seed/ST1005/200', status: StudentStatus.OUTSIDE },
];

export const INITIAL_LOGS: LogEntry[] = [
    { id: 'L001', studentId: 'ST1003', studentName: 'Amit Singh', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), action: 'EXIT', destination: 'Library'},
    { id: 'L002', studentId: 'ST1005', studentName: 'Vikram Rathod', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), action: 'EXIT', destination: 'Out of Campus'},
];

export const DESTINATIONS = [
    'LHC (Lecture Hall Complex)',
    'CSC (Computer Services Centre)',
    'SAC (Student Activity Center)',
    'Library',
    'Sports Complex',
    'Main Building',
    'Out of Campus',
];