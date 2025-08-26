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

// -----------------------------
// Types & Fake Data
// -----------------------------

type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  document: string;
  age: number;
  phone: string;
  createdAt: string; // ISO date
};

const FAKE_PATIENTS: Patient[] = Array.from({ length: 500 }).map((_, i) => ({
  id: `${1000 + i}`,
  firstName: [
    "Juan",
    "María",
    "Carlos",
    "Luisa",
    "Ana",
    "Pedro",
    "Sofía",
    "Miguel",
  ][i % 8],
  lastName: ["García", "Rodríguez", "Pérez", "López", "Hernández", "Martínez"][
    i % 6
  ],
  document: `${Math.floor(10000000 + Math.random() * 80000000)}`,
  age: 18 + (i % 60),
  phone: `+57 3${Math.floor(10 + (i % 9))}${Math.floor(
    10000000 + Math.random() * 89999999
  )}`.slice(0, 13),
  createdAt: new Date(Date.now() - i * 86_400_000).toISOString(),
}));

// -----------------------------
// Columns
// -----------------------------

const columns: ColumnDef<Patient>[] = [
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
  {
    id: "q",
    accessorFn: (r) => `${r.firstName} ${r.lastName} ${r.document}`,
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
  },
  {
    accessorKey: "firstName",
    header: "Nombre",
  },
  {
    accessorKey: "lastName",
    header: "Apellido",
  },
  {
    accessorKey: "document",
    header: "Documento",
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.document}</span>
    ),
  },
  {
    accessorKey: "age",
    header: "Edad",
  },
  {
    accessorKey: "phone",
    header: "Teléfono",
  },
  {
    accessorKey: "createdAt",
    header: "Creado",
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleDateString("es-CO"),
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
              className="h-8 w-8 p-0"
              aria-label="Acciones fila"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => alert(`Ver paciente ${p.id}`)}>
              <Eye className="mr-2 h-4 w-4" /> Ver
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert(`Editar paciente ${p.id}`)}>
              <Edit className="mr-2 h-4 w-4" /> Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => alert(`Eliminar paciente ${p.id}`)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Eliminar
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

export default function DataTableClinicHistories() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({ q: false });
  const [rowSelection, setRowSelection] = React.useState({});
  const [pageSize, setPageSize] = React.useState<number>(100);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize,
  });

  const table = useReactTable({
    data: FAKE_PATIENTS,
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

  // Add/Edit button label & handler usando selectedIds
  const onPrimaryAction = () => {
    if (selectedIds.length === 1) {
      alert(`Editar paciente con id: ${selectedIds[0]}`);
    } else {
      alert("Agregar paciente");
    }
  };

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
      const rows = table.getFilteredRowModel().rows.map((r) => r.original);
      const ws = xlsx.utils.json_to_sheet(rows);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, "Pacientes");
      xlsx.writeFile(wb, "pacientes.xlsx");
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
      doc.text("Listado de historias clínicas", MARGIN_X + 60, 36);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(
        "Creado el día: " + new Date().toLocaleString("es-CO"),
        MARGIN_X + 60,
        54
      );

      const rows = table.getFilteredRowModel().rows.map((r) => r.original);
      const cols = [
        { header: "ID", dataKey: "id" },
        { header: "Nombre", dataKey: "firstName" },
        { header: "Apellido", dataKey: "lastName" },
        { header: "Documento", dataKey: "document" },
        { header: "Edad", dataKey: "age" },
        { header: "Teléfono", dataKey: "phone" },
        { header: "Creado", dataKey: "createdAt" },
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

      doc.save(
        `listado-historias-clinicas-${new Date().toLocaleDateString(
          "es-CO"
        )}.pdf`
      );
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
    const window = 2;
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
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle className="text-3xl font-bold">
              Listado de historias clínicas
            </CardTitle>
            <CardDescription>
              En el siguiente modulo se puede ver el listado de historias
              clínicas, aqui podrás agregar, editar y eliminar historias
              clínicas.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {/* Dropdown Exportar */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="cursor-pointer">
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
                  <IconFileTypePdf className="mr-2 h-5 w-5 text-red-700" /> PDF
                  (.pdf)
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
                      alert(`Eliminar (temporal): [${selectedIds.join(", ")}]`);
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
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize cursor-pointer"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
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
                setPagination((p) => ({ ...p, pageSize: size, pageIndex: 0 }));
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
                      className="bg-background sticky top-0 z-20"
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
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
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

        {/* Footer: selection info + pagination */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-start">
          <div className="text-sm text-muted-foreground">
            {selectedIds.length === 0
              ? "Ningún registro seleccionado"
              : selectedIds.length === 1
              ? `Seleccionado ID: ${selectedIds[0]}`
              : `${selectedIds.length} registros seleccionados`}
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
                <PaginationItem key={`${p}-${idx}`}>
                  {p === "ellipsis" ? (
                    <PaginationEllipsis />
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
  );
}
