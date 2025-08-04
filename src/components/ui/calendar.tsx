'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/registry/new-york-v4/ui/button';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

function Calendar({ className, classNames, showOutsideDays = true, ...props }: React.ComponentProps<typeof DayPicker>) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn('p-3', className)}
            
            {...props}
        />
    );
}

export { Calendar };
