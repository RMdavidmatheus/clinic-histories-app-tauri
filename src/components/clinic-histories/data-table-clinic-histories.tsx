"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Download,
  Columns,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatePresence, motion } from "framer-motion";
import { IconFileSpreadsheet, IconFileTypePdf } from "@tabler/icons-react";
import ModalAddClinicHistories from "./modal-add-clinic-histories";
import { useState } from "react";
import {
  CalculateAge,
  createFetchFunction,
  useContinuousFetch,
} from "@/lib/application-utils";
import { Patient as PatientModel } from "@/models/patients/patient-model";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { API_CONFIG } from "@/config/api";

// -----------------------------
// Columns
// -----------------------------

const columns: ColumnDef<PatientModel>[] = [
  // Selection column
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected()
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleccionar todos"
        className="cursor-pointer"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={`Seleccionar ${row.original.id}`}
        className="cursor-pointer"
      />
    ),
    enableSorting: true,
    enableHiding: false,
    size: 40,
  },
  // Hidden full-text column for global search
  {
    id: "q",
    accessorFn: (r) =>
      `${r.full_name} ${r.document_number} ${r.email} ${r.document_type}`,
    header: "",
    cell: () => null,
    enableHiding: true,
    size: 0,
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <div className="font-mono text-xs">{row.original.id}</div>
    ),
    enableHiding: true,
    size: 60,
  },
  {
    accessorKey: "full_name",
    header: "Nombres",
  },
  {
    accessorKey: "document_type",
    header: "Tipo de documento",
  },
  {
    accessorKey: "document_number",
    header: "Documento",
  },
  {
    accessorKey: "age",
    header: "Edad",
    cell: ({ row }) => CalculateAge(row.original.birth_date),
  },
  {
    accessorKey: "gender",
    header: "Género",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Teléfono",
  },
  // Row actions
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const p = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 cursor-pointer"
              aria-label="Acciones fila"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => alert(`Ver paciente ${p.id}`)}
              className="cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" /> Ver
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => alert(`Editar paciente ${p.id}`)}
              className="cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4" /> Editar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
    size: 50,
  },
];

// -----------------------------
// Component
// -----------------------------

// Crear la función de fetch fuera del componente para evitar re-creaciones
const fetchPatientsData = createFetchFunction<PatientModel[]>(
  API_CONFIG.ENDPOINTS.PATIENTS
);

export default function ClinicHistoriesTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    q: false,
    id: false,
  });
  const [rowSelection, setRowSelection] = useState({});
  const [pageSize, setPageSize] = useState<number>(100);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize,
  });

  // Hook para fetch continuo con performance optimizada
  const {
    data: patients,
    loading,
    error,
    refresh,
    togglePolling,
    isPolling,
    retryCount,
  } = useContinuousFetch<PatientModel[]>(
    fetchPatientsData,
    API_CONFIG.DEFAULT_POLLING_INTERVAL,
    true // habilitado por defecto
  );

  const table = useReactTable({
    data: patients || [],
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Search (sobre la columna oculta 'q')
  const search = (value: string) => {
    table.getColumn("q")?.setFilterValue(value);
  };

  // 👉 IDs seleccionados en un estado controlado
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  React.useEffect(() => {
    const ids = table.getSelectedRowModel().rows.map((r) => r.original.id);
    setSelectedIds(ids);
    console.log("IDs seleccionados:", ids);
  }, [rowSelection, table]);

  // Utilities para exportaciones
  const urlToDataURL = async (url: string) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Exporters (Excel/PDF)
  const exportExcel = async () => {
    try {
      const xlsx = await import("xlsx");
      const rows = table.getFilteredRowModel().rows.map((r) => ({
        full_name: r.original.full_name,
        document_type: r.original.document_type,
        document_number: r.original.document_number,
        age: CalculateAge(r.original.birth_date),
        gender: r.original.gender,
        email: r.original.email,
        phone: r.original.phone,
      }));
      const ws = xlsx.utils.json_to_sheet(rows);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, "Pacientes");
      xlsx.writeFile(wb, `listado-pacientes-${new Date()}.xlsx`);
    } catch (e) {
      console.error(e);
      alert("Para exportar a Excel instala la dependencia: npm i xlsx");
    }
  };

  const exportPDF = async () => {
    try {
      const jsPDF = (await import("jspdf")).default;
      const autoTable = (await import("jspdf-autotable")).default;
      const doc = new jsPDF({ unit: "pt", format: "a4" });

      const PAGE_WIDTH = doc.internal.pageSize.getWidth();
      const PAGE_HEIGHT = doc.internal.pageSize.getHeight();
      const MARGIN_X = 40;
      const BAR_HEIGHT = 72;

      // Barra superior azul
      doc.setFillColor(58, 127, 240);
      doc.rect(0, 0, PAGE_WIDTH, BAR_HEIGHT, "F");

      // Logo (coloca tu archivo en /images/ico.png)
      try {
        const dataUrl = await urlToDataURL("/images/ico.png");
        doc.addImage(dataUrl, "PNG", MARGIN_X, 12, 48, 48);
      } catch {}

      // Título y fecha
      doc.setTextColor(255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("Listado de Pacientes", MARGIN_X + 60, 36);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(
        "Creado el día: " + new Date().toLocaleString("es-CO"),
        MARGIN_X + 60,
        54
      );

      const rows = table.getFilteredRowModel().rows.map((r) => ({
        full_name: r.original.full_name,
        document_type: r.original.document_type,
        document_number: r.original.document_number,
        age: CalculateAge(r.original.birth_date),
        gender: r.original.gender,
        email: r.original.email,
        phone: r.original.phone,
      }));
      const cols = [
        { header: "Nombres", dataKey: "full_name" },
        { header: "Tipo de documento", dataKey: "document_type" },
        { header: "Documento", dataKey: "document_number" },
        { header: "Edad", dataKey: "age" },
        { header: "Género", dataKey: "gender" },
        { header: "Email", dataKey: "email" },
        { header: "Teléfono", dataKey: "phone" },
      ];

      autoTable(doc, {
        columns: cols,
        body: rows,
        startY: BAR_HEIGHT + 24,
        styles: {
          fontSize: 9,
          cellPadding: 6,
          lineColor: [58, 127, 240],
          lineWidth: 0.5,
          halign: "center",
        },
        headStyles: {
          fillColor: [58, 127, 240],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: { fillColor: [248, 251, 255] },
        margin: { left: MARGIN_X, right: MARGIN_X },
        didDrawPage: () => {
          const page = doc.getNumberOfPages();
          doc.setFontSize(9);
          doc.setTextColor(120);
          doc.text(`Página ${page}`, PAGE_WIDTH - MARGIN_X, PAGE_HEIGHT - 18, {
            align: "right",
          });
        },
      });

      doc.save(`listado-pacientes-${new Date()}.pdf`);
    } catch (e) {
      console.error(e);
      alert("Para exportar a PDF instala: npm i jspdf jspdf-autotable");
    }
  };

  // Pagination helpers for shadcn <Pagination>
  const pageCount = table.getPageCount();
  const pageIndex = table.getState().pagination.pageIndex;
  const goTo = (index: number) => table.setPageIndex(index);

  const pageNumbers = React.useMemo(() => {
    const total = pageCount;
    const current = pageIndex;
    const window = 2; // neighbors
    const pages: (number | "ellipsis")[] = [];
    for (let i = 0; i < total; i++) {
      if (
        i === 0 ||
        i === total - 1 ||
        (i >= current - window && i <= current + window)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "ellipsis") {
        pages.push("ellipsis");
      }
    }
    return pages;
  }, [pageCount, pageIndex]);

  return (
    <TooltipProvider>
      <Card className="w-full h-full flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle className="text-3xl font-bold">
                Listado de historias clínicas
              </CardTitle>
              <CardDescription>
                En el siguiente modulo se puede ver el listado de historias clínicas,
                aqui podrás agregar, editar y eliminar historias clínicas.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {/* Controles de polling continuo - Movidos aquí */}
              <div className="flex items-center gap-2 mr-2">
                <div
                  className={`w-2 h-2 rounded-full mr-1 ${
                    isPolling ? "bg-green-500 animate-pulse" : "bg-gray-400"
                  }`}
                ></div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={togglePolling}
                      className="text-xs px-2 py-1 h-auto cursor-pointer"
                    >
                      {isPolling ? "⏸️" : "▶️"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isPolling
                      ? "Pausar sincronización automática"
                      : "Reanudar sincronización automática"}
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={refresh}
                      disabled={loading}
                      className="text-xs px-2 py-1 h-auto cursor-pointer"
                    >
                      🔄
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {loading
                      ? "Actualizando datos..."
                      : "Actualizar datos manualmente"}
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Dropdown Exportar */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                  >
                    <Download className="mr-2 h-4 w-4" /> Exportar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={exportExcel}
                    className="cursor-pointer h-auto"
                  >
                    <IconFileSpreadsheet className="mr-2 h-5 w-5 text-green-700" />{" "}
                    Excel (.xlsx)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={exportPDF}
                    className="cursor-pointer h-auto"
                  >
                    <IconFileTypePdf className="mr-2 h-5 w-5 text-red-700" />{" "}
                    PDF (.pdf)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Eliminar masiva: aparece si hay >=1 seleccionados */}
              {selectedIds.length >= 1 && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key="delete-button"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Button
                      variant="destructive"
                      size="lg"
                      onClick={() => {
                        alert(
                          `Eliminar (temporal): [${selectedIds.join(", ")}]`
                        );
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Eliminar seleccionados
                    </Button>
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Agregar/Editar paciente */}
              <ModalAddClinicHistories />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {/* Indicador de error */}
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded-lg border border-red-200 w-full mb-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span>Error: {error}</span>
                {retryCount > 0 && (
                  <span className="text-xs text-gray-500">
                    (Reintento {retryCount}/3)
                  </span>
                )}
              </div>
            )}

            <Input
              placeholder="Buscar por nombre, apellido o documento..."
              className="max-w-sm"
              onChange={(e) => search(e.target.value)}
            />

            {/* Column visibility */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="cursor-pointer">
                  <Columns className="mr-2 h-4 w-4" /> Columnas
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Mostrar/Ocultar</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                  .getAllLeafColumns()
                  .filter((c) => c.getCanHide() && c.id !== "q")
                  .filter((c) => c.getCanHide() && c.id !== "id")
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="cursor-pointer"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id === "document_type"
                        ? "Tipo de documento"
                        : column.id === "document_number"
                        ? "Documento"
                        : column.id === "age"
                        ? "Edad"
                        : column.id === "gender"
                        ? "Género"
                        : column.id === "email"
                        ? "Email"
                        : column.id === "phone"
                        ? "Teléfono"
                        : column.id === "full_name"
                        ? "Nombres"
                        : column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Page size selector */}
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Registros por página
              </span>
              <Select
                value={String(pageSize)}
                onValueChange={(v) => {
                  const size = Number(v);
                  setPageSize(size);
                  table.setPageSize(size);
                  setPagination((p) => ({
                    ...p,
                    pageSize: size,
                    pageIndex: 0,
                  }));
                }}
              >
                <SelectTrigger className="h-8 w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[100, 150, 200, 250, 300].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col min-h-0">
          <div className="rounded-md border flex-1 min-h-0 overflow-auto overflow-x-auto max-h-[650px]">
            <Table className="min-w-[900px]">
              <TableHeader className="sticky top-0 z-20 bg-background">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        style={{ width: header.getSize() }}
                        className="bg-background sticky top-0 z-20 text-center font-bold text-md"
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={
                              header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : undefined
                            }
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {({ asc: " ⬆", desc: " ⬇" } as const)[
                              header.column.getIsSorted() as string
                            ] ?? null}
                          </div>
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {loading && (!patients || patients.length === 0) ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span>Cargando datos...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className={loading ? "opacity-70" : ""}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="text-center">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No hay resultados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Footer: selection info + polling status + pagination */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="text-sm text-muted-foreground">
                {selectedIds.length === 0
                  ? "Ningún registro seleccionado"
                  : selectedIds.length === 1
                  ? `Seleccionado ID: ${selectedIds[0]}`
                  : `${selectedIds.length} registros seleccionados`}
              </div>
              {patients && (
                <div className="text-xs text-muted-foreground">
                  • {patients.length} pacientes total
                  {patients.length !== 1 ? "es" : ""}
                </div>
              )}
            </div>

            <Pagination className="flex justify-center w-full mr-50">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    aria-label="Anterior"
                    className={
                      table.getCanPreviousPage()
                        ? "cursor-pointer"
                        : "cursor-not-allowed opacity-50"
                    }
                    onClick={() => {
                      if (table.getCanPreviousPage()) table.previousPage();
                    }}
                  >
                    Anterior
                  </PaginationPrevious>
                </PaginationItem>

                {pageNumbers.map((p, idx) => (
                  <PaginationItem
                    key={`${p}-${idx}`}
                    className="cursor-pointer"
                  >
                    {p === "ellipsis" ? (
                      <PaginationEllipsis className="cursor-pointer" />
                    ) : (
                      <PaginationLink
                        className={`cursor-pointer hover:bg-neutral-200 transition-all duration-300 ${
                          p === pageIndex
                            ? "bg-blue-500 text-white transition-all duration-300 hover:bg-blue-400 hover:text-white"
                            : ""
                        }`}
                        isActive={p === pageIndex}
                        onClick={() => goTo(p)}
                      >
                        {p + 1}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    aria-label="Siguiente"
                    className={
                      table.getCanNextPage()
                        ? "cursor-pointer"
                        : "cursor-not-allowed opacity-50"
                    }
                    onClick={() => {
                      if (table.getCanNextPage()) table.nextPage();
                    }}
                  >
                    Siguiente
                  </PaginationNext>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
