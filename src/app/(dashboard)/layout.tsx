'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import NavigationBar from '@/app/(dashboard)/NavigationBar';
import Sidebar from '@/app/(dashboard)/Sidebar';

const DashboardLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar isOpen={isSidebarOpen} />
            <div className="flex flex-1 flex-col overflow-hidden">
                <NavigationBar onToggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-y-auto">
                    <div className="p-6">{children}</div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout; 