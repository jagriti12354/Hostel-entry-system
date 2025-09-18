import React, { useState, useMemo } from 'react';
import { useData } from '../context/AppContext';
import { LogEntry } from '../types';
import { ArrowSmRightIcon, ArrowSmLeftIcon, DocumentDownloadIcon, CalendarIcon } from './icons/Icons';

const StudentLogSheet: React.FC = () => {
    const { logs } = useData();
    const [isExporting, setIsExporting] = useState(false);
    const [exportSuccess, setExportSuccess] = useState(false);

    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    const todayString = today.toISOString().split('T')[0];

    const [selectedDate, setSelectedDate] = useState<string>(todayString);

    const filteredLogs = useMemo(() => {
        if (!selectedDate) return logs;
        return logs.filter(log => {
            const logDate = new Date(log.timestamp);
            logDate.setMinutes(logDate.getMinutes() - logDate.getTimezoneOffset());
            return logDate.toISOString().split('T')[0] === selectedDate;
        });
    }, [logs, selectedDate]);

    const handleExport = () => {
        if (filteredLogs.length === 0) return;

        setIsExporting(true);
        setExportSuccess(false);

        setTimeout(() => {
            const headers = ['Log ID', 'Student ID', 'Student Name', 'Action', 'Destination', 'Timestamp'];
            const rows = filteredLogs.map(log => [
                log.id,
                log.studentId,
                log.studentName,
                log.action,
                log.destination || '',
                `"${log.timestamp.toLocaleString()}"`
            ]);

            let csvContent = "data:text/csv;charset=utf-8,"
                + headers.join(",") + "\n"
                + rows.map(e => e.join(",")).join("\n");

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `hostel_logs_${selectedDate}.csv`);
            document.body.appendChild(link);

            link.click();
            document.body.removeChild(link);

            setIsExporting(false);
            setExportSuccess(true);
            setTimeout(() => setExportSuccess(false), 4000);
        }, 1500);
    };


    return (
        <div className="bg-gray-surface p-6 rounded-xl shadow-lg border border-gray-border">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-text-primary">Student Movement Log</h2>
                 <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <div className="flex items-center gap-2 bg-gray-light border border-gray-border rounded-md p-2 w-full sm:w-auto">
                        <CalendarIcon className="h-5 w-5 text-text-secondary" />
                        <label htmlFor="log-date" className="text-sm font-medium text-text-secondary sr-only">Select Date</label>
                        <input
                            type="date"
                            id="log-date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            max={todayString}
                            className="bg-transparent focus:outline-none text-sm text-text-primary"
                            style={{colorScheme: 'dark'}}
                        />
                    </div>
                    <div className="relative w-full sm:w-auto">
                        <button
                            onClick={handleExport}
                            disabled={isExporting || filteredLogs.length === 0}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/20 rounded-md hover:bg-primary/30 disabled:bg-gray-light disabled:text-text-tertiary disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            <DocumentDownloadIcon className="h-5 w-5" />
                            {isExporting ? 'Exporting...' : 'Export CSV'}
                        </button>
                        {exportSuccess && (
                            <span className="absolute -bottom-7 right-0 text-xs bg-green-500/20 text-status-green px-2 py-1 rounded-md animate-fade-in shadow-sm">
                                Download started!
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <div className="min-w-full align-middle">
                    <div className="shadow-sm ring-1 ring-gray-border rounded-lg">
                        <table className="min-w-full divide-y divide-gray-border">
                            <thead className="bg-gray-light/50">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-text-primary sm:pl-6">Student Name</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-text-primary">Student ID</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-text-primary">Action</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-text-primary">Destination</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-text-primary">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-border bg-gray-surface">
                                {filteredLogs.length > 0 ? filteredLogs.map((log: LogEntry) => (
                                    <tr key={log.id} className="hover:bg-gray-light/50 transition-colors">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-text-primary sm:pl-6">{log.studentName}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-text-secondary font-mono">{log.studentId}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-text-secondary">
                                            {log.action === 'ENTRY' ? (
                                                <span className="inline-flex items-center rounded-full bg-status-green/20 px-2.5 py-0.5 text-xs font-medium text-status-green">
                                                    <ArrowSmRightIcon className="h-4 w-4 mr-1"/>
                                                    Entry
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-status-yellow/20 px-2.5 py-0.5 text-xs font-medium text-status-yellow">
                                                    <ArrowSmLeftIcon className="h-4 w-4 mr-1"/>
                                                    Exit
                                                </span>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-text-secondary">{log.destination || '—'}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-text-secondary">{log.timestamp.toLocaleString()}</td>
                                    </tr>
                                )) : (
                                     <tr>
                                        <td colSpan={5} className="text-center py-10 text-text-secondary">
                                            No log entries found for the selected date.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentLogSheet;