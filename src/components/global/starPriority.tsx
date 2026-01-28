// components/ui/StarPriority.tsx
"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils"; // Utilidad para unir clases, común en proyectos con shadcn/ui. Si no la tienes, puedes quitarla y usar strings.

// Define las propiedades que recibirá el componente
interface StarPriorityProps {
  value: number; // El valor actual de la prioridad (1, 2, o 3)
  onChange: (value: number) => void; // Función para notificar al formulario padre del cambio
  label?: string; // Una etiqueta opcional para el campo
  onlyread?: boolean; // Si es true, el componente será de solo lectura
}

export default function StarPriority({
  value,
  onChange,
  label,
  onlyread,
}: StarPriorityProps) {
  // Estado para manejar el efecto "hover" (cuando el mouse pasa por encima)
  const [hover, setHover] = useState(0);

  // El valor a mostrar será el del hover si existe, si no, el valor seleccionado
  const displayValue = hover || value;

  return (
    <div className="flex flex-col gap-2">
      {onlyread ? (
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((starValue) => (
            <Star
              key={starValue}
              // Lógica para determinar si la estrella está llena o vacía
              className={cn(
                "h-8 w-8 cursor-pointer transition-all duration-150 ease-in-out",
                displayValue >= starValue
                  ? "text-yellow-400 fill-yellow-400" // Estilo para estrella llena
                  : "text-gray-300", // Estilo para estrella vacía
              )}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((starValue) => (
            <Star
              key={starValue}
              // Lógica para determinar si la estrella está llena o vacía
              className={cn(
                "h-8 w-8 cursor-pointer transition-all duration-150 ease-in-out",
                displayValue >= starValue
                  ? "text-yellow-400 fill-yellow-400" // Estilo para estrella llena
                  : "text-gray-300", // Estilo para estrella vacía
                "hover:scale-110" // Efecto visual al pasar el mouse
              )}
              // Eventos del mouse
              onClick={() => onChange(starValue)}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(0)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
