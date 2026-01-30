// src/components/common/ModalBase.tsx
"use client";

import React, { ReactNode } from "react";
import { Button } from "../ui/button";

interface ModalBaseProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  card?: boolean; // Nueva propiedad opcional
}

const ModalBase: React.FC<ModalBaseProps> = ({
  open,
  onClose,
  header,
  footer,
  children,
  size = "lg",
  card = true, // Valor predeterminado a true para compatibilidad
}) => {
  if (!open) return null;

  const sizeClasses = {
    sm: "w-1/4",
    md: "w-1/2",
    lg: "w-4/5",
    xl: "w-5/6",
  };

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-gray-800 bg-opacity-90 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>

      {/* Contenedor del modal */}
      <div
        className={`relative bg-background rounded-lg shadow-xl mx-auto transform transition-all duration-300 ease-out animate-scale-in flex flex-col max-h-[90vh] ${sizeClasses[size]}`}
      >
        {/* Header fijo */}
        {header && <div className="p-6">{header}</div>}

        {/* Contenido dentro de card scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-0.5 custom-scrollbar">
            {card ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    {children}
                </div>
            ) : (
                children
            )}
        </div>
        
        {/* Footer fijo */}
        {footer && <div className="p-3">{footer}</div>}
      </div>
    </div>
  );
};

export default ModalBase;