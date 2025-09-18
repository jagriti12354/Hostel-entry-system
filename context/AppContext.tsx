import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { UserRole, Student, LogEntry, StudentStatus } from '../types';
import { ADMIN_USERNAME, ADMIN_PASSWORD, GUARD_USERNAME, GUARD_PASSWORD, INITIAL_STUDENTS, INITIAL_LOGS } from '../constants';

interface User {
    username: string;
    role: UserRole;
}

interface AppContextType {
    user: User | null;
    login: (username: string, pass: string) => 'success' | 'error';
    logout: () => void;
    students: Student[];
    logs: LogEntry[];
    registerStudent: (name: string, room: string, photoUrl: string) => Student;
    logStudentMovement: (studentId: string, action: 'ENTRY' | 'EXIT', destination?: string) => Student | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
    const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);

    const login = (username: string, pass: string): 'success' | 'error' => {
        const trimmedUsername = username.trim();
        const trimmedPassword = pass.trim();

        if (trimmedUsername.toLowerCase() === ADMIN_USERNAME && trimmedPassword === ADMIN_PASSWORD) {
            setUser({ username: ADMIN_USERNAME, role: UserRole.ADMIN });
            return 'success';
        }
        if (trimmedUsername.toLowerCase() === GUARD_USERNAME && trimmedPassword === GUARD_PASSWORD) {
            setUser({ username: GUARD_USERNAME, role: UserRole.GUARD });
            return 'success';
        }
        return 'error';
    };

    const logout = () => {
        setUser(null);
    };

    const registerStudent = (name: string, roomNumber: string, photoUrl: string): Student => {
        const newId = `ST${1001 + students.length}`;
        const newStudent: Student = {
            id: newId,
            name,
            roomNumber,
            photoUrl: photoUrl,
            status: StudentStatus.INSIDE,
        };
        setStudents(prev => [...prev, newStudent]);
        return newStudent;
    };

    const logStudentMovement = useCallback((studentId: string, action: 'ENTRY' | 'EXIT', destination?: string): Student | null => {
        const student = students.find(s => s.id.toUpperCase() === studentId.toUpperCase());
        if (!student) return null;

        const newStatus = action === 'ENTRY' ? StudentStatus.INSIDE : StudentStatus.OUTSIDE;
        
        if (student.status === newStatus && action === 'ENTRY') {
            return student; // No change needed
        }
        
        const updatedStudent = { ...student, status: newStatus };

        setStudents(prev => prev.map(s => s.id === studentId.toUpperCase() ? updatedStudent : s));

        const newLog: LogEntry = {
            id: `L${logs.length + 1}`,
            studentId: student.id,
            studentName: student.name,
            timestamp: new Date(),
            action: action
        };

        if (action === 'EXIT' && destination) {
            newLog.destination = destination;
        }

        setLogs(prev => [newLog, ...prev]);
        
        return updatedStudent;
    }, [students, logs]);


    return (
        <AppContext.Provider value={{ user, login, logout, students, logs, registerStudent, logStudentMovement }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AppProvider');
    }
    return context;
};

export const useData = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useData must be used within an AppProvider');
    }
    return context;
};