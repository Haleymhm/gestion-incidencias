"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
    holidayName: z.string().min(1, "El nombre del día festivo es requerido."),
    holidayDay: z.string()
        .min(1, "El día es requerido.")
        .refine((val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) >= 1 && parseInt(val, 10) <= 31, {
            message: "Día inválido (1-31).",
        }),
    holidayMonth: z.string()
        .min(1, "El mes es requerido.")
        .refine((val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) >= 1 && parseInt(val, 10) <= 12, {
            message: "Mes inválido (1-12).",
        }),
    holidayStatus: z.enum(["ACTIVE", "INACTIVE"], { required_error: "El estado es requerido." }),
});

const months = [
    { value: '1', label: 'Enero' },
    { value: '2', label: 'Febrero' },
    { value: '3', label: 'Marzo' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Mayo' },
    { value: '6', label: 'Junio' },
    { value: '7', label: 'Julio' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' },
];

type HolidayFormValues = z.infer<typeof formSchema>;

interface HolidayModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData: {
        id: string;
        holidayName: string;
        holidayDay: string;
        holidayMonth: string;
        holidayStatus: "ACTIVE" | "INACTIVE";
    } | null;
}

export const HolidayModal: React.FC<HolidayModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    initialData,
}) => {
    const [loading, setLoading] = useState(false);
    const title = initialData ? "Editar Día Festivo" : "Crear Día Festivo";
    const action = initialData ? "Guardar cambios" : "Crear";

    const form = useForm<HolidayFormValues>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                holidayName: initialData.holidayName,
                holidayDay: initialData.holidayDay,
                holidayMonth: initialData.holidayMonth,
                holidayStatus: initialData.holidayStatus,
            });
        } else {
            form.reset({
                holidayName: '',
                holidayDay: '',
                holidayMonth: '',
                holidayStatus: 'ACTIVE',
            });
        }
    }, [initialData, form, isOpen]);

    const onSubmit = async (values: HolidayFormValues) => {
        setLoading(true);
        try {
            const body = {
                holiday_name: values.holidayName,
                holiday_day: String(values.holidayDay).padStart(2, '0'),
                holiday_month: String(values.holidayMonth).padStart(2, '0'),
                holiday_status: values.holidayStatus,
            };
            const url = initialData ? `/api/holidays` : '/api/holidays';
            const method = initialData ? 'PUT' : 'POST';
            const reqBody = initialData ? { ...body, id: initialData.id } : body;
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reqBody),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Algo salió mal.');
            }
            toast.success(initialData ? 'Día festivo actualizado.' : 'Día festivo creado.');
            onSuccess();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (loading) return;
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="holidayName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre del Día Festivo</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Ej: Día de la Independencia" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="holidayDay"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Día</FormLabel>
                                        <FormControl>
                                            <select {...field} disabled={loading} className="w-full h-9 border rounded-md px-2 bg-background">
                                                <option value="">Selecciona un día</option>
                                                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                                    <option key={day} value={String(day)}>
                                                        {day}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            <FormField
                                control={form.control}
                                name="holidayMonth" 
                                render={({ field }) => ( 
                                    <FormItem>
                                        <FormLabel>Mes</FormLabel>
                                        <FormControl>
                                            <select {...field} disabled={loading} className="w-full h-9 border rounded-md px-2 bg-background">
                                                <option value="">Selecciona un mes</option>
                                                {months.map(month => (
                                                    <option key={month.value} value={month.value}>
                                                        {month.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                        </div>
                        <FormField
                            control={form.control}
                            name="holidayStatus"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Estado</FormLabel> 
                                    <select {...field} disabled={loading} className="w-full h-9 border rounded-md px-2 bg-background">
                                            <option value="ACTIVE">Activo</option>
                                            <option value="INACTIVE">Inactivo</option>
                                        </select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={loading}>
                                {action}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}; 