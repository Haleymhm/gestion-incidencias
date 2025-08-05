"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { Holiday } from "./holidays-client";

const formSchema = z.object({
    holidayName: z.string().min(1, "El nombre del día festivo es requerido."),
    holidayDate: z.date({ required_error: "La fecha es requerida." }),
    holidayStatus: z.enum(["ACTIVE", "INACTIVE"], { required_error: "El estado es requerido." }),
});

type HolidayFormValues = z.infer<typeof formSchema>;

interface HolidayModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData: Holiday | null;
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
                holidayDate: new Date(initialData.holidayDate),
                holidayStatus: initialData.holidayStatus as "ACTIVE" | "INACTIVE",
            });
        } else {
            form.reset({
                holidayName: '',
                holidayDate: new Date(),
                holidayStatus: 'ACTIVE',
            });
        }
    }, [initialData, form, isOpen]);

    const onSubmit = async (values: HolidayFormValues) => {
        setLoading(true);
        try {
            const body = {
                holiday_name: values.holidayName,
                holiday_date: values.holidayDate,
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
                        <FormField
                            control={form.control}
                            name="holidayDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fecha</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                    disabled={loading}
                                                >
                                                    {field.value ? format(field.value, "d 'de' MMMM 'de' yyyy", { locale: es }) : <span>Selecciona una fecha</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={loading}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="holidayStatus"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Estado</FormLabel>
                                    <FormControl>
                                        <select {...field} disabled={loading} className="w-full border rounded px-2 py-2">
                                            <option value="ACTIVE">Activo</option>
                                            <option value="INACTIVE">Inactivo</option>
                                        </select>
                                    </FormControl>
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