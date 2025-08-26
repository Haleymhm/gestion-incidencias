
'use client';
import Link from 'next/link';
import { Separator } from "@/components/ui/separator";
import {
    Building2Icon, UserIcon, CalendarIcon, UsersRound,
    FactoryIcon, AlertCircleIcon, GiftIcon, WalletCardsIcon,
    ChartNoAxesCombined, FileSearchIcon, TentTree,
    Coffee, CalendarSync
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { canAccess } from '@/lib/roleUtils';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
    const copyrigth = process.env.NEXT_PUBLIC_APP_COPYRIGTH;
    const company = process.env.NEXT_PUBLIC_APP_COMPANY;
    const version = process.env.NEXT_PUBLIC_APP_VERSION;
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

    const navMain = [
        { href: '/dayoff', label: 'Dia de Descanso', icon: Coffee, rule: 'dayoff' },
        { href: '/movimientos', label: 'Incidencias', icon: ChartNoAxesCombined, rule: 'incidencias' },
        { href: '/review', label: 'Revisión', icon: FileSearchIcon, rule: 'datos' },
        { href: '/generate-disk', label: 'Generar cvs', icon: CalendarIcon, rule: 'reportes' },
    ];

    return (
        <aside className={cn(
            "bg-white text-black flex flex-col shadow-sm transition-all duration-300 ease-in-out",
            isOpen ? "w-64 p-4" : "w-20 p-4"
        )}>
            <div className="flex justify-center py-4">
                <Link href="/dashboard">
                    <Image src={isOpen ? "/images/ollamani-logo.png" : "/images/ollamani-logo-mini..png"} alt="Ollamani Grupo" width={isOpen ? 177 : 40} height={isOpen ? 60 : 40} />
                </Link>
            </div>
            <nav className="flex flex-col space-y-2">
                <label className={cn('pt-5 text-blue-800 font-bold', !isOpen && 'hidden')}> MANTENIMIENTO</label>
                {navLinks.map((link) => {
                    if (canAccess(user?.userRol, 'menu', link.rule)) {
                        const isActive = pathname.startsWith(link.href);

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-black hover:bg-gray-100 flex-nowrap whitespace-nowrap",
                                    isActive && "bg-gray-100 text-black",
                                    !isOpen && "justify-center"
                                )}
                            >
                                <link.icon className="h-6 w-6" />
                                <span className={cn(!isOpen && "hidden")}>{link.label}</span>
                            </Link>
                        );
                    }

                    return null;
                })}

                <Separator className={cn(!isOpen && "hidden")} />
                <label className={cn('pt-5 text-blue-800 font-bold', !isOpen && 'hidden')}> INCIDNCIAS</label>
                {navMain.map((link) => {
                    if (canAccess(user?.userRol, 'dashboard', link.rule)) {
                        const isActive = pathname.startsWith(link.href);

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-black hover:bg-gray-100 flex-nowrap whitespace-nowrap",
                                    isActive && "bg-gray-100 text-black",
                                    !isOpen && "justify-center"
                                )}
                            >
                                <link.icon className="h-6 w-6 text-[#f39200]" />
                                <span className={cn(!isOpen && "hidden")}>{link.label}</span>
                            </Link>
                        );
                    }

                    return null;
                })}
            </nav>
            <span className={cn("mt-auto text-xs text-gray-400 text-center py-4", !isOpen && "hidden")}>
                &copy; {copyrigth} {new Date().getFullYear()} <br />
                {version}
            </span>
        </aside>
    );
};

export default Sidebar;
