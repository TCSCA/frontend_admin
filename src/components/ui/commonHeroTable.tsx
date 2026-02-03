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
import {
  Eye,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
} from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { useState, useMemo, useEffect, useRef } from "react";
import StarPriority from "@/components/global/starPriority";
import Paginator from "./paginator";

interface ColumnType {
  key: string;
  label: string;
  maxWidth?: string;
}

interface HeroTableProps {
  columns: ColumnType[];
  rows: any[];
  ariaLabel?: string;
  onView?: (item: any) => void;
  onUpdate?: (idUpdate: number, item: any) => void;
  onPageChange?: (page: number, limit: number) => void;
  onLimitChange?: (limit: number, page: number) => void;
  totalRows: number;
  totalItems: number;
  table?: string;
}

const CommonHeroTable: React.FC<HeroTableProps> = ({
  columns,
  rows,
  ariaLabel = "Tabla",
  onView,
  onUpdate,
  onPageChange,
  onLimitChange,
  totalRows,
  totalItems = 0,
  table,
}) => {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [priority, setPriority] = useState<number>();

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setPage(1);
    setItemsPerPage(newItemsPerPage);
    onLimitChange && onLimitChange(newItemsPerPage, 1);
  };

  const getStatusClass = (status: string) => {
    if (!status)
      return "bg-gray-400 text-white flex items-center justify-center text-xs font-semibold rounded px-4 py-2";
    if (status.includes("PENDIENTE") || status.includes("Stand by"))
      return "bg-lightblue text-white flex items-center justify-center text-xs font-semibold rounded";
    if (
      status.includes("APROBADA") ||
      status.includes("Ganada") ||
      status.includes("Won")
    )
      return "bg-maingreen text-white flex items-center justify-center text-xs font-semibold rounded";
    if (
      status.includes("RECHAZADA") ||
      status.includes("Perdidas") ||
      status.includes("SUSPENDIDA")
    )
      return "bg-red-500 text-white flex items-center justify-center text-xs font-semibold rounded";
    return "bg-contrastbackground text-white flex items-center justify-center text-xs font-semibold rounded px-4 py-2";
  };

  const getPlatformClass = (platform: string) => {
    if (!platform) return "";
    if (platform.includes("Odoo"))
      return "bg-purple-100 text-purple-800 border-purple-200";
    if (platform.includes("Intranet"))
      return "bg-blue-100 text-blue-800 border-blue-200";
    return "";
  };

  const sortedRows = useMemo(() => {
    if (!sortField) return rows;
    const modifier = sortDirection === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const aValue = getKeyValue(a, sortField) ?? "";
      const bValue = getKeyValue(b, sortField) ?? "";
      if (typeof aValue === "number" && typeof bValue === "number")
        return (aValue - bValue) * modifier;
      const strA = String(aValue).toLowerCase();
      const strB = String(bValue).toLowerCase();
      if (strA < strB) return -1 * modifier;
      if (strA > strB) return 1 * modifier;
      return 0;
    });
  }, [rows, sortField, sortDirection]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sortedRows.length);
  const paginatedRows = sortedRows.slice(startIndex, endIndex);

  const isDataEmpty = totalItems === 0 || rows.length === 0;
  const startDisplay = isDataEmpty ? 0 : startIndex + 1;
  const endCount = isDataEmpty ? 0 : Math.min(endIndex, totalItems);

  return (
    <div className="space-y-4 w-full">
      <div className="rounded-lg shadow-md bg-white w-full text-xs">
        <Table
          isHeaderSticky
          removeWrapper
          aria-label={ariaLabel}
          classNames={{
            base: "max-h-[600px] overflow-y-auto overflow-x-auto relative",
            table: "min-w-full divide-y divide-gray-200",
            thead: "sticky top-0 z-50 bg-gray-200",
            th: "bg-gray-200 text-black font-medium px-3 py-2 text-left tracking-normal sticky top-0 z-50",
          }}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.key}
                className={column.key === "action" ? "w-16" : ""}
              >
                {column.key === "action" ? (
                  <span className="font-semibold flex items-center justify-start h-full">
                    {column.label}
                  </span>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={() => handleSort(column.key)}
                    className="h-auto p-0 font-semibold hover:bg-transparent whitespace-normal w-full text-left justify-start gap-1"
                  >
                    <span className="text-left text-xs">{column.label}</span>
                    <ArrowUpDown
                      className={`h-4 w-4 flex-shrink-0 ml-1 ${sortField === column.key
                        ? "text-white"
                        : "text-gray-300 opacity-80"
                        } ${sortField === column.key && sortDirection === "asc"
                          ? "rotate-180"
                          : ""
                        }`}
                    />
                  </Button>
                )}
              </TableColumn>
            )}
          </TableHeader>

          <TableBody items={paginatedRows}>
            {(item) => (
              <TableRow
                key={item.id || item.key || item.id_oportunidad}
                className="hover:bg-gray-100"
              >
                {(columnKey) =>
                  columnKey === "action" ? (
                    <TableCell className="px-3 py-2 text-xs text-gray-700 first:pl-3 last:pr-3">
                      {table != "requests" ? (
                        <div className="flex items-center">
                          <Button
                            title="Ver"
                            className="text-contrastbackground hover:text-lightblue"
                            onClick={() => onView && onView(item)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : table === "requests" &&
                        item.t_estado_solicitud.nombre === "Pendiente" ? (
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => onUpdate && onUpdate(1, item)}
                            className="w-8 h-8 border border-lightblue text-lightblue shadow-md flex items-center justify-center hover:bg-blue-300 transition-colors duration-200 hover:cursor-grab"
                            title="Aprobar Solicitud"
                            variant="outline"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => onUpdate && onUpdate(2, item)}
                            className="w-8 h-8 border border-red-500 text-red-500 shadow-md flex items-center justify-center hover:bg-red-100 transition-colors duration-200"
                            title="Rechazar Solicitud"
                            variant="outline"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : null}
                    </TableCell>
                  ) : (
                    <TableCell className="px-3 py-2 text-xs text-gray-700 first:pl-3 last:pr-3">
                      {columnKey === "plataforma" ? (
                        <div className="flex items-center">
                          {item.plataforma ? (
                            <Badge
                              className={`inline-flex items-center text-sm font-medium rounded-md px-3 h-6 w-24 ${getPlatformClass(
                                item.plataforma
                              )}`}
                            >
                              <span
                                style={{
                                  wordBreak: "break-word",
                                  whiteSpace: "normal",
                                }}
                              >
                                {item.plataforma}
                              </span>
                            </Badge>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                      ) : columnKey === "t_estado_oportunidad" ||
                        columnKey === "stage_id" ? (
                        <div className="flex items-center">
                          {item.t_estado_oportunidad || item.stage_id ? (
                            <Badge
                              className={`inline-flex items-center w-fit w-48 ${item.stage_class ||
                                getStatusClass(
                                  item.t_estado_oportunidad ||
                                  item.stage_id ||
                                  ""
                                )
                                }`}
                            >
                              <div className="w-2 mr-1">
                                {item["data-stage-icon"] || null}
                              </div>
                              <span className="text-sm ml-1 capitalize whitespace-normal break-words text-center">
                                {item.t_estado_oportunidad || item.stage_id}
                              </span>
                            </Badge>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                      ) : columnKey === "prioridad" ? (
                        <StarPriority
                          value={item.prioridad}
                          onlyread
                          onChange={setPriority}
                        />
                      ) : (
                        <span className="truncate max-w-xs inline-block">
                          {getKeyValue(item, columnKey)
                            ? getKeyValue(item, columnKey)
                            : "-"}
                        </span>
                      )}
                    </TableCell>
                  )
                }
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Paginator
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        total={totalItems}
        itemsPerPage={itemsPerPage}
        handleItemsPerPageChange={setItemsPerPage}
      />
    </div>
  );
};

export default CommonHeroTable;
