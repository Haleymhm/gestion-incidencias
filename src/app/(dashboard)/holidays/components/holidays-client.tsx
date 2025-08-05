"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { HolidayModal } from "./holiday-modal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

// Definir un tipo para la respuesta de la API
export interface Holiday {
    id: string;
    holidayName: string;
    holidayDate: string;
    holidayStatus: string;
    createdAt: string;
    updatedAt: string;
}

const PAGE_SIZE = 10;

export const HolidaysClient = () => {
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletingHoliday, setDeletingHoliday] = useState<Holiday | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        
        return () => clearTimeout(timer);
    }, [search]);

    const fetchHolidays = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(page),
                pageSize: String(PAGE_SIZE),
                search: debouncedSearch,
            });
            const res = await fetch(`/api/holidays?${params.toString()}`);
            if (!res.ok) throw new Error("No se pudieron obtener los días festivos.");
            const { holidays, total, totalPages } = await res.json();
            setHolidays(holidays);
            setTotal(total || 0);
            setTotalPages(totalPages || 1);
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch]);

    useEffect(() => {
        fetchHolidays();
    }, [fetchHolidays]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleCreate = () => {
        setEditingHoliday(null);
        setIsModalOpen(true);
    };

    const handleEdit = (id: string) => {
        const holidayToEdit = holidays.find(h => h.id === id);
        if (holidayToEdit) {
            setEditingHoliday(holidayToEdit);
            setIsModalOpen(true);
        }
    };

    const handleDelete = (id: string) => {
        const holidayToDelete = holidays.find(h => h.id === id);
        if (holidayToDelete) {
            setDeletingHoliday(holidayToDelete);
            setIsDeleteDialogOpen(true);
        }
    };

    const confirmDelete = async () => {
        if (!deletingHoliday) return;
        try {
            const res = await fetch('/api/holidays', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: deletingHoliday.id }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'No se pudo eliminar el día festivo.');
            }
            toast.success('Día festivo eliminado correctamente.');
            fetchHolidays();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsDeleteDialogOpen(false);
            setDeletingHoliday(null);
        }
    };

    const columns = useMemo(() => [
        {
            accessorKey: "holidayName",
            header: "Nombre del Día Festivo",
        },
        {
            accessorKey: "holidayDate",
            header: "Fecha",
            cell: ({ row }: any) => format(new Date(row.original.holidayDate), "d 'de' MMMM 'de' yyyy", { locale: es }),
        },
        {
            accessorKey: "holidayStatus",
            header: "Estado",
            cell: ({ row }: any) => (
                <span className={`px-2 py-1 rounded-full text-xs ${
                    row.original.holidayStatus === 'ACTIVE' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                }`}>
                    {row.original.holidayStatus === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                </span>
            ),
        },
        {
            id: "actions",
            header: "Acciones",
            cell: ({ row }: any) => (
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(row.original.id)}>
                        Editar
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(row.original.id)}>
                        Eliminar
                    </Button>
                </div>
            ),
        },
    ], [holidays]);

    return (
        <>
            <HolidayModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={editingHoliday}
                onSuccess={() => {
                    fetchHolidays();
                    setIsModalOpen(false);
                }}
            />
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Eliminar día festivo?</DialogTitle>
                    </DialogHeader>
                    <p>¿Estás seguro de que deseas eliminar el día festivo "{deletingHoliday?.holidayName}"?</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Eliminar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <div className="flex items-center">
                <Heading
                    title="Días Festivos"
                    description="Gestiona los días festivos del sistema"
                />
                <div className="ml-auto flex items-center gap-2">
                    <Input
                        placeholder="Filtrar por nombre..."
                        value={search}
                        onChange={handleSearch}
                        className="max-w-sm"
                    />
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar
                    </Button>
                </div>
            </div>
            <Separator />
            <DataTable columns={columns} data={holidays} loading={loading} />
            <div className="flex justify-between items-center pt-4 text-sm text-muted-foreground">
                <div className="flex-1">
                    Total de {total} día(s) festivo(s).
                </div>
                <div className="flex items-center gap-2">
                    <span>Página {page} de {totalPages}</span>
                    <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || loading}>
                        Anterior
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || loading}>
                        Siguiente
                    </Button>
                </div>
            </div>
        </>
    );
}; 