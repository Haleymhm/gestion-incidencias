'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlarmClockIcon, Megaphone, PenToolIcon, SearchIcon, WalletCardsIcon, TentTree, Coffee, ChartNoAxesCombined, FileSearchIcon, CalendarSync } from 'lucide-react';

// Es una buena práctica definir una interfaz para los datos del usuario.
interface User {
  id: string;
  name: string;
  email: string;
}

const icons = {
  incidencias: <WalletCardsIcon className="w-12 h-12 group-hover:scale-110 transition-transform" />,
  vacaciones: <TentTree className="w-12 h-12 group-hover:scale-110 transition-transform" />,
  tiempolibre: <Coffee className="w-12 h-12 group-hover:scale-110 transition-transform" />,
  reportes: <ChartNoAxesCombined className="w-12 h-12 group-hover:scale-110 transition-transform" />,
  datos: <FileSearchIcon className="w-12 h-12 group-hover:scale-110 transition-transform" />,
  comunicados: <Megaphone className="w-12 h-12 group-hover:scale-110 transition-transform" />,
  nomina: <CalendarSync className="w-12 h-12 group-hover:scale-110 transition-transform" />,
};

// Reglas de visibilidad por rol
const buttonRules = {
  incidencias: ['SUPER_ADMIN', 'ENCARGADO_RRHH', 'SUPERVISOR_REGIONES', 'ENCARGADO_CASINO'],
  datos: ['SUPER_ADMIN', 'ENCARGADO_RRHH', 'SUPERVISOR_REGIONES'],
  reportes: ['SUPER_ADMIN', 'ENCARGADO_RRHH'],
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [incidenciasCount, setIncidenciasCount] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        router.push('/login');
      }
    };
    checkSession();
  }, [router]);

  useEffect(() => {
    const fetchIncidenciasCount = async () => {
      try {
        // Obtener periodo actual
        const periodRes = await fetch('/api/periods/current');
        if (!periodRes.ok) {
          setIncidenciasCount(0);
          
          return;
        }
        const period = await periodRes.json();
        // Contar movimientos activos de ese periodo
        const movRes = await fetch(`/api/movements?page=1&pageSize=1&periodId=${period.id}`);
        if (!movRes.ok) {
          setIncidenciasCount(0);

          return;
        }
        const movData = await movRes.json();
        console.log(movData);
        setIncidenciasCount(movData.total || 0);
      } catch {
        setIncidenciasCount(0);
      }
    };
    fetchIncidenciasCount();
  }, []);

  // Función para verificar permisos de botones
  const canAccessButton = (button: keyof typeof buttonRules) => {
    if (!user || !(user as any).userRol) return false;
    
    return buttonRules[button].includes((user as any).userRol);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Cargando...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfafe]">
      {/* Header */}
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">



      </main>
    </div>
  );
}


