import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    type SortingState,
    getPaginationRowModel,
    ColumnFiltersState,
    getFilteredRowModel,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import useSWR from "swr";
import { Skeleton } from "@/components/ui/skeleton";
import { getfetcher } from "@/api/axios";
import { statusColorMap } from "../../planificaciones/tabla/columns";
import { Badge } from "@/components/ui/badge";
import { FiltrosTabla } from "../../FiltrosTabla";
import { Input } from "@/components/ui/input";
import { DatePickerWithRange } from "./DatePickerWithRange";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

type Planificacion = {
    titulo: string;
    descripcion: string;
    fecha_subida: Date;
    fecha_actualizacion: Date;
    estado: string;
    profesor_asignado_nombre: string;
    profesor_revisor_nombre: string;
    nombre_asignatura: string;
    curso: string;
    nombre_area: string;
};
const columns: ColumnDef<Planificacion>[] = [
    {
        accessorKey: "titulo",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Título
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "descripcion",
        header: "Descripción",
    },
    {
        accessorKey: "fecha_subida",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Fecha de Subida
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ getValue }) => {
            return getValue() ? format(getValue(), "dd/MM/yyyy hh:mm") : "";
        },
    },
    {
        accessorKey: "fecha_actualizacion",
        header: "Fecha de Actualización",
        cell: ({ getValue }) => {
            return getValue() ? format(getValue(), "dd/MM/yyyy hh:mm") : "";
        },
    },
    {
        accessorKey: "estado",
        header: "Estado",
        enableHiding: true,
        cell: ({ getValue }) => {
            const estado = getValue() as string;
            const color = statusColorMap[estado as keyof typeof statusColorMap] || "#000000"; // Color por defecto si el estado no está en el mapa
            return (
                <Badge style={{ backgroundColor: color, color: "#ffffff" }}>
                    {estado}
                </Badge>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: "profesor_asignado_nombre",
        header: "Profesor Asignado",
    },
    {
        accessorKey: "profesor_revisor_nombre",
        header: "Profesor Revisor",
    },
    {
        accessorKey: "nombre_asignatura",
        header: "Asignatura",
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: "curso",
        header: "Curso",
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: "nombre_area",
        header: "Área",
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },

];



export function PlanificacionesTablaAdmin({ perido_id }: { perido_id: number }) {
    // Ensure dateRange is always defined
    const [dateRange, setDateRange] = useState<DateRange>({
        from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Default start date (7 days ago)
        to: new Date(), // Default end date (today)
    });


    // Ensure the SWR hook is always called with a valid date range
    const { data, isLoading } = useSWR<Planificacion[]>(
        `/dashboard/metricas/documentos-entregados-rango/?fecha_inicio=${dateRange.from.toISOString().split("T")[0]}&fecha_fin=${dateRange.to.toISOString().split("T")[0]}`,
        getfetcher
    );



    if (isLoading) return <Skeleton className="h-[310px] w-full" />;

    if (!data) return <div>No se encontraron datos</div>;

    // Get unique options for filters



    return (

        <div className="flex items-center space-x-2 mb-4">
            <Tabla data={data}>
                <DatePickerWithRange
                    date={dateRange}
                    onDateChange={(date) => date && setDateRange(date)}
                    className="col-span-2"
                />
            </Tabla>
        </div>

    );
}


function Tabla({ data, children }: { data: Planificacion[], children?: React.ReactNode }) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);


    const cursos = Array.from(new Set(data.map((plan) => plan.curso))).map((curso) => ({
        label: curso,
        value: curso,
    }));

    const estados = Array.from(new Set(data.map((plan) => plan.estado))).map((estado) => ({
        label: estado,
        value: estado,
    }));

    const asignaturas = Array.from(new Set(data.map((plan) => plan.nombre_asignatura))).map((asignatura) => ({
        label: asignatura,
        value: asignatura,
    }));


    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    });


    return (

        <div>
            {/* Filters */}
            <div className="flex items-center space-x-2 mb-4">
                <Input
                    placeholder="Buscar por título"
                    value={(table.getColumn("titulo")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("titulo")?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />

                {table.getColumn("curso") && (
                    <FiltrosTabla
                        column={table.getColumn("curso")}
                        title="Curso"
                        options={cursos}
                    />
                )}
                {table.getColumn("estado") && (
                    <FiltrosTabla
                        column={table.getColumn("estado")}
                        title="Estado"
                        options={estados}
                    />
                )}
                {table.getColumn("nombre_asignatura") && (
                    <FiltrosTabla
                        column={table.getColumn("nombre_asignatura")}
                        title="Asignatura"
                        options={asignaturas}
                    />
                )}

                {children}


            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No hay resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    Anterior
                </Button>
                <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    Siguiente
                </Button>
            </div>
        </div>
    )
}