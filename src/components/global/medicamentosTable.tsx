"use client";
import { useState, useEffect } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@heroui/table";
import { RecipeDetail } from "../modals/clientDetailModal";

interface MedicamentosTableProps {
    data?: RecipeDetail[];
    maxHeight?: string;
}

export default function MedicamentosTable({
    data = [],
    maxHeight = "200px",
}: MedicamentosTableProps) {
    const [medicamentos, setMedicamentos] = useState<RecipeDetail[]>([]);

    useEffect(() => {
        // Validar y asegurar que sea un array con datos válidos
        if (Array.isArray(data)) {
            const validData = data.filter(item =>
                item &&
                typeof item === 'object' &&
                item.id !== undefined
            );
            setMedicamentos(validData);
        } else {
            setMedicamentos([]);
        }
    }, [data]);

    const columns = [
        { key: "nombre_comercial", label: "Nombre Comercial" },
        { key: "cantidad", label: "Cantidad" },
    ];

    return (
        <div className="space-y-4 w-full">
            <div className="rounded-lg shadow-md bg-white w-full text-xs overflow-hidden border">
                <div className="overflow-auto" style={{ maxHeight }}>
                    <Table
                        isHeaderSticky
                        removeWrapper
                        aria-label="Tabla de Medicamentos"
                        classNames={{
                            base: "overflow-visible",
                            table: "min-w-full divide-y divide-gray-200",
                            thead: "[&>tr]:first:rounded-none sticky top-0 z-10",
                            th: "bg-gray-200 text-black font-medium px-3 py-2 text-left tracking-normal sticky top-0",
                            td: "px-3 py-2 text-xs text-gray-700 first:pl-3 last:pr-3",
                            tr: "hover:bg-gray-100",
                        }}
                    >
                        <TableHeader columns={columns}>
                            {(column) => (
                                <TableColumn key={column.key}>
                                    <span className="font-semibold text-left text-xs">
                                        {column.label}
                                    </span>
                                </TableColumn>
                            )}
                        </TableHeader>

                        <TableBody items={medicamentos}>
                            {(item) => (
                                <TableRow key={item.id}>
                                    {(columnKey) => (
                                        <TableCell>
                                            {columnKey === "nombre_comercial" ? (
                                                <span className="truncate max-w-xs inline-block">
                                                    {item.nombre_comercial || "-"}
                                                </span>
                                            ) : columnKey === "cantidad" ? (
                                                <span className="truncate max-w-xs inline-block">
                                                    {item.cantidad || 0}
                                                </span>
                                            ) : null}
                                        </TableCell>
                                    )}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {medicamentos.length === 0 && (
                <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-md">
                    No hay información para mostrar
                </div>
            )}
        </div>
    );
}