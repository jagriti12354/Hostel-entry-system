
export enum UserRole {
    ADMIN = 'ADMIN',
    GUARD = 'GUARD',
}

export enum StudentStatus {
    INSIDE = 'INSIDE',
    OUTSIDE = 'OUTSIDE',
}

export interface Student {
    id: string;
    name: string;
    roomNumber: string;
    photoUrl: string;
    status: StudentStatus;
}

export interface LogEntry {
    id: string;
    studentId: string;
    studentName: string;
    timestamp: Date;
    action: 'ENTRY' | 'EXIT';
    destination?: string;
}