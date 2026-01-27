// HeroTable.tsx
"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/table";
import { Eye, SlidersHorizontal, Edit } from "lucide-react";
import { Button } from "./button";
import { useState } from "react";
import StarPriority from "@/components/global/starPriority";

interface ColumnType {
  key: string;
  label: string;
}

interface HeroTableProps {
  columns: ColumnType[];
  rows: any[];
  ariaLabel?: string;
  onView?: (item: any) => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onOptions?: (item: boolean) => void;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalRows: number;
  variantStyle?: string | null;
}

const HeroTable: React.FC<HeroTableProps> = ({
  columns,
  rows,
  ariaLabel = "Tabla",
  onView,
  onOptions,
  onPageChange,
  totalRows,
}) => {
  const [page, setPage] = useState(1);
  const [priority, setPriority] = useState<number>();
  const [optionVisible, setOptionVisible] = useState(false);

  const getStatusClass = (status: string) => {
    if (!status)
      return "bg-gray-400 text-white flex items-center justify-center text-xs font-semibold rounded px-4 py-2";

    if (status.includes("PENDIENTE") || status.includes("Stand by")) {
      return "w-24 h-8 bg-lightblue text-white flex items-center justify-center text-xs font-semibold rounded";
    }
    if (
      status.includes("APROBADA") ||
      status.includes("Ganada") ||
      status.includes("Won")
    ) {
      return "w-24 h-8 bg-maingreen text-white flex items-center justify-center text-xs font-semibold rounded";
    }
    if (
      status.includes("RECHAZADA") ||
      status.includes("Perdidas") ||
      status.includes("SUSPENDIDA")
    ) {
      return "w-24 h-8 bg-red-500 text-white flex items-center justify-center text-xs font-semibold rounded";
    }

    // Default class for unknown status
    return "bg-contrastbackground text-white flex items-center justify-center text-xs font-semibold rounded px-4 py-2";
  };

  const getPlatformClass = (platform: string) => {
    if (platform.includes("Odoo")) {
      return "w-24 h-8 bg-purpleodoo text-white flex items-center justify-center text-xs font-semibold rounded";
    }
    if (platform.includes("Intranet")) {
      return "w-24 h-8 bg-lightblue text-white flex items-center justify-center text-xs font-semibold rounded";
    }
  };

  return (
    <div>
      <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
        <Table
          aria-label={ariaLabel}
          className="min-w-full divide-y divide-gray-200"
        >
          <TableHeader columns={[...columns]}>
            {(column) => (
              <TableColumn
                key={column.key}
                className="bg-contrastbackground text-white font-medium font-semibold px-6 py-4 text-left tracking-wider"
              >
                {column.key === "showOptions" ? (
                  <div className="flex justify-start">
                    <button
                      onClick={() => onOptions && onOptions(true)}
                      className="hover:text-contrastbackground"
                    >
                      <SlidersHorizontal  />
                    </button>
                  </div>
                ) : (
                  column.label
                )}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={rows}>
            {(item) => (
              <TableRow
                key={
                  item.key || item.id || item.id_cliente || item.id_propuesta
                }
                className="hover:bg-gray-50 transition-colors"
              >
                {(columnKey) =>
                  columnKey === "action" ? (
                    <TableCell
                      align={"right"}
                      className="px-6 py-4 whitespace-nowrap flex gap-3 text-right"
                    >
                      <Button
                        title="Ver"
                        className="text-contrastbackground hover:text-lightblue"
                        onClick={() => onView && onView(item)}
                      >
                        <Eye className="w-5 h-5" />
                      </Button>
                      {/* <Button
                        title="Editar"
                        className="text-contrastbackground hover:text-lightblue"
                      >
                        <Edit className="w-5 h-5" />
                      </Button> */}
                    </TableCell>
                  ) : (
                    <TableCell className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {columnKey === "plataforma" ? (
                        <span
                          className={`text-right ${getPlatformClass(
                            item.plataforma
                          )}`}
                        >
                          {item.plataforma}
                        </span>
                      ) : null}
                      {columnKey === "id_estado_oportunidad" ||
                      columnKey === "stage_id" ? (
                        <span
                          className={`text-right ${getStatusClass(
                            item.id_estado_oportunidad ||
                              item.estado_propuesta ||
                              item.stage_id
                          )}`}
                        >
                          {item.id_estado_oportunidad || item.stage_id}
                        </span>
                      ) : null}
                      {columnKey === "plataforma" ||
                      columnKey === "stage_id" ||
                      columnKey === "priority" ? null : (
                        <span
                          className="truncate max-w-xs inline-block align-middle"
                          title={
                            getKeyValue(item, columnKey)
                              ? String(getKeyValue(item, columnKey))
                              : undefined
                          }
                        >
                          {String(getKeyValue(item, columnKey)).startsWith(
                            "null"
                          ) ||
                          String(getKeyValue(item, columnKey)).startsWith(
                            "false"
                          )
                            ? " - "
                            : getKeyValue(item, columnKey)}
                        </span>
                      )}
                      {columnKey === "priority" ? (
                        <span>
                          <StarPriority
                            label="Prioridad"
                            value={item.priority}
                            onChange={setPriority}
                            onlyread={true}
                          />
                        </span>
                      ) : null}
                    </TableCell>
                  )
                }
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end items-center gap-2 mt-4">
        <Button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
          onClick={() => {
            if (page > 1) {
              onPageChange && onPageChange(page - 1);
              setPage(page - 1);
            }
          }}
        >
          Anterior
        </Button>
        <span className="text-sm">
          Página {page} de {totalRows}
        </span>
        <Button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
          onClick={() => {
            if (page < totalRows) {
              onPageChange && onPageChange(page + 1);
              setPage(page + 1);
            }
          }}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
};

export default HeroTable;
