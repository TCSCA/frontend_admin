// page.tsx
'use client';

import { ChartAreaInteractive } from "@/components/indicators/indicator-1";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function Page() {

    return (
        <div className="container mx-auto py-8 px-4">
            <ChartAreaInteractive />
        </div>
    );
}