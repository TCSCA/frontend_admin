'use client';

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Download } from 'lucide-react';
import Image from 'next/image';

interface ClientRecipePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl?: string; // Opcional, por defecto usará la imagen quemada
}

export default function ClientRecipePreviewModal({
    isOpen,
    onClose,
    imageUrl = '/assets/login.jpg' // Imagen quemada por defecto
}: ClientRecipePreviewModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-5xl max-h-[90vh] bg-white p-0 overflow-hidden">
                <DialogHeader className="px-6 pt-4 pb-2 flex flex-row items-center justify-between">
                    <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <Image
                                    src={imageUrl}
                                    alt="Preview icon"
                                    width={24}
                                    height={24}
                                    className="rounded"
                                />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Vista Previa de Imagen</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {imageUrl.split('/').pop()}
                                </p>
                            </div>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="relative flex items-center justify-center p-6 bg-gray-50">
                    <div className="relative w-full h-[70vh] flex items-center justify-center">
                        <Image
                            src={imageUrl}
                            alt="Vista previa"
                            fill
                            className="object-contain"
                            sizes="(max-width: 1200px) 100vw, 1200px"
                            priority
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2 px-6 py-4 border-t">
                    <Button
                        variant="outline"
                        onClick={() => window.open(imageUrl, '_blank')}
                        className="flex items-center gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Descargar
                    </Button>
                    <Button
                        variant="default"
                        onClick={onClose}
                    >
                        Cerrar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}