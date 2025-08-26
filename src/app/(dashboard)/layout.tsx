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
        <div className="flex h-screen flex-col">
            <NavigationBar onToggleSidebar={toggleSidebar} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar isOpen={isSidebarOpen} />
                <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout; 