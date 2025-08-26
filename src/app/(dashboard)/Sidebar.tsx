
'use client';
import Link from 'next/link';
import {
    Building2Icon,
    UserIcon,
    CalendarIcon,
    UsersRound,
    FactoryIcon,
    AlertCircleIcon,
    GiftIcon
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { canAccess } from '@/lib/roleUtils';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        };
        fetchUser();
    }, []);

    const navLinks = [
        { href: '/companies', label: 'Compañías', icon: Building2Icon, rule: 'companies' },
        { href: '/offices', label: 'Oficinas', icon: FactoryIcon, rule: 'offices' },
        { href: '/periods', label: 'Periodos de Pago', icon: CalendarIcon, rule: 'periods' },
        { href: '/incidents', label: 'Incidentes', icon: AlertCircleIcon, rule: 'incidents' },
        { href: '/employees', label: 'Empleados', icon: UsersRound, rule: 'employees' },
        { href: '/users', label: 'Usuarios', icon: UserIcon, rule: 'users' },
        { href: '/holidays', label: 'Días Festivos', icon: GiftIcon, rule: 'holidays' },
    ];

    return (
        <aside className="w-64 flex-shrink-0 bg-white text-black p-4 flex flex-col shadow-sm">
            <nav className="flex flex-col space-y-2">
                {navLinks.map((link) => {
                    if (canAccess(user?.userRol, 'menu', link.rule)) {
                        const isActive = pathname.startsWith(link.href);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-black hover:bg-gray-100",
                                    isActive && "bg-gray-100 text-black"
                                )}
                            >
                                <link.icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        );
                    }
                    return null;
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;
