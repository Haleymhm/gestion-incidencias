'use client';

import type { ReactNode } from 'react';
import NavigationBar from '@/app/(dashboard)/NavigationBar';
import Sidebar from '@/app/(dashboard)/Sidebar';

const DashboardLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        <div className="flex h-screen flex-col">
            <NavigationBar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout; 