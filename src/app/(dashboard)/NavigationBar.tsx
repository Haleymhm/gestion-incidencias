'use client';
import Link from 'next/link';
import Image from 'next/image';
import { BellIcon, HouseIcon, PowerIcon, CalendarIcon, MenuIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const NavigationBar = ({ onToggleSidebar }: { onToggleSidebar: () => void }) => {
    const [user, setUser] = useState<any>(null);
    const [currentPeriod, setCurrentPeriod] = useState<any>(null); // Nuevo estado
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                console.log(data);
                setUser(data.user);
            } else {
                setUser(null);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchPeriod = async () => {
            const res = await fetch('/api/periods/current');
            if (res.ok) {
                const data = await res.json();
                setCurrentPeriod(data);
            } else {
                setCurrentPeriod(null);
            }
        };
        fetchPeriod();
    }, []);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    return (
        <header className="w-full flex items-center justify-between px-6 py-4 bg-white shadow-sm z-10">
            <div className="flex items-center gap-4">
                <button onClick={onToggleSidebar} className="text-gray-500 hover:text-gray-700">
                    <MenuIcon className="w-6 h-6" />
                </button>
                <span className="text-lg text-[#0047BA] font-medium py-4 px-3">
                    <span className="font-bold text-[#0047BA]">Gestión de Cultura y Desarrollo</span>
                    <span className="text-gray-400">  |  </span>
                    {currentPeriod ? (
                        <span className="inline-flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4 inline-block text-blue-900" />
                            <span className="text-[#0047BA] font-semibold">{currentPeriod.periodName}</span>
                            <span className="text-gray-400 text-xs ml-2">({new Date(currentPeriod.periodStart).toLocaleDateString()} - {new Date(currentPeriod.periodEnd).toLocaleDateString()})</span>
                        </span>
                    ) : (
                        <span className="text-gray-400">Sin periodo actual</span>
                    )}
                </span>
            </div>
            <div className="flex items-center gap-6 text-gray-400">
                <span className="text-gray-500 text-sm">Hola <span className="font-bold text-[#0047BA]">{user ? user.userName : '...'}</span></span>
                <Link href="/dashboard" className="flex items-center"><HouseIcon className="w-5 h-5" /></Link>
                <BellIcon className="w-5 h-5" />
                <PowerIcon className="w-5 h-5 cursor-pointer" onClick={handleLogout} aria-label="Cerrar sesión" />
            </div>
        </header>
    );
};

export default NavigationBar;
