// page.tsx
'use client';

import { ChartAreaInteractive } from "@/components/indicators/indicator-1";

export default function Page() {

    return (
        <div className="container mx-auto py-8 px-4">
            <ChartAreaInteractive />
        </div>
    );
}