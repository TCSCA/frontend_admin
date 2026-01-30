"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface GlobalModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    message: string | React.ReactNode;
    icon?: React.ReactNode;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    size?: "sm" | "md" | "lg" | "xl";
    confirmVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    isLoading?: boolean;
    showConfirmButton?: boolean;
    showCancelButton?: boolean;
}

const GlobalModal: React.FC<GlobalModalProps> = ({
    open,
    onClose,
    title,
    message,
    icon,
    onConfirm,
    onCancel,
    confirmText = "Aceptar",
    cancelText = "Cancelar",
    size = "md",
    confirmVariant = "destructive",
    isLoading = false,
    showConfirmButton = true,
    showCancelButton = true,
}) => {
    if (!open) return null;

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }}
        >
            <div
                className="bg-white rounded-lg w-full max-w-md mx-4"
                style={{
                    position: 'relative',
                    zIndex: 10000,
                    pointerEvents: 'auto'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        {icon ? icon : <AlertTriangle className="h-8 w-8 text-amber-500" />}
                    </div>

                    <div className="flex justify-center text-gray-600 mb-6">
                        {typeof message === 'string' ? <p>{message}</p> : message}
                    </div>

                    <div className="flex justify-center gap-3">
                        {showCancelButton && (
                            <Button
                                variant="outline"
                                onClick={handleCancel}
                                className="border-gray-300"
                                disabled={isLoading}
                            >
                                {cancelText}
                            </Button>
                        )}

                        {showConfirmButton && (
                            <Button
                                variant={confirmVariant}
                                onClick={onConfirm}
                                className={confirmVariant === 'destructive' ? "bg-red-600 hover:bg-red-500 text-white h-9 px-4 text-sm" : "h-9 px-4 text-sm"}
                                disabled={isLoading}
                            >
                                {isLoading ? "Cargando..." : confirmText}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalModal;