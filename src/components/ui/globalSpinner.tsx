// components/ui/GlobalSpinner.tsx
"use client";

import { Loader2 } from "lucide-react";

export default function GlobalSpinner() {
  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-[1px] z-[9999] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-2xl shadow-2xl">
        <div className="relative">
          {/* Spinner principal */}
          <Loader2 className="h-16 w-16 animate-spin text-green-600" />

          {/* Spinner secundario para efecto */}
          <Loader2 className="h-12 w-12 animate-spin absolute top-2 left-2 text-green-400" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>

        <div className="text-center">
          <p className="text-xl font-semibold text-gray-800">Cargando...</p>
          <p className="text-sm text-gray-500 mt-1">Por favor espere</p>
        </div>
      </div>
    </div>
  );
}