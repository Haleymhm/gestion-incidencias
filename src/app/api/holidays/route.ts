import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

// GET: Listar días festivos con paginación y búsqueda
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    const search = searchParams.get('search') || '';

    const where = search
        ? { holidayName: { contains: search, mode: 'insensitive' as const } }
        : {};

    try {
        const [holidays, total] = await Promise.all([
            prisma.holiday.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: { holidayDate: 'asc' },
            }),
            prisma.holiday.count({ where }),
        ]);

        return NextResponse.json({
            holidays,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        });
    } catch (error) {
        return NextResponse.json({ message: 'Error al obtener días festivos' }, { status: 500 });
    }
}

// POST: Crear un nuevo día festivo
export async function POST(request: NextRequest) {
    try {
        const { holiday_name, holiday_date, holiday_status } = await request.json();
        if (!holiday_name || !holiday_date || holiday_status === undefined) {
            return NextResponse.json({ message: 'Todos los campos son requeridos' }, { status: 400 });
        }
        const holiday = await prisma.holiday.create({
            data: {
                holidayName: holiday_name,
                holidayDate: new Date(holiday_date),
                holidayStatus: holiday_status,
            },
        });

        return NextResponse.json(holiday, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error al crear día festivo' }, { status: 500 });
    }
}

// PUT: Editar un día festivo (requiere id en el body)
export async function PUT(request: NextRequest) {
    try {
        const { id, holiday_name, holiday_date, holiday_status } = await request.json();
        if (!id || !holiday_name || !holiday_date || holiday_status === undefined) {
            return NextResponse.json({ message: 'Todos los campos son requeridos' }, { status: 400 });
        }
        const holiday = await prisma.holiday.update({
            where: { id },
            data: {
                holidayName: holiday_name,
                holidayDate: new Date(holiday_date),
                holidayStatus: holiday_status,
            },
        });

        return NextResponse.json(holiday);
    } catch (error) {
        return NextResponse.json({ message: 'Error al editar día festivo' }, { status: 500 });
    }
}

// DELETE: Eliminar un día festivo (requiere id en el body)
export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();
        if (!id) {
            return NextResponse.json({ message: 'El id es requerido' }, { status: 400 });
        }
        await prisma.holiday.delete({ where: { id } });

        return NextResponse.json({ message: 'Día festivo eliminado correctamente' });
    } catch (error) {
        return NextResponse.json({ message: 'Error al eliminar día festivo' }, { status: 500 });
    }
} 