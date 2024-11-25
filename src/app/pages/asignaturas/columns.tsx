
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem
    , DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table"
import {  Book, Wrench } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Asignatura = {
    id: number;
    nombre: string;
    codigo: string;
    fecha_creacion: Date;
    descripcion: string;
    area_id: number;
    area_nombre: string;
    curso: string;
};

export const columns: ColumnDef<Asignatura>[] = [
    {
        accessorKey: "id",
        header: "Id",
    },
    { accessorKey: "codigo", header: "Codigo" },
    { accessorKey: "nombre", header: "Nombre" },
    { accessorKey: "descripcion", header: "Descripcion" },

    {
        accessorKey: "fecha_creacion",
        header: "Fecha de Creacion",

    },
    {
        accessorKey: "area_nombre",
        header: "Area",
    },
    {
        accessorKey: "curso",
        header: "Curso",
    },
    {
        id: "Acciones",
        enableHiding: true,
        cell: ({ row }) => {
            return (
                <DropdownMenu >
                    <DropdownMenuTrigger >
                        <Wrench color="#22c55e" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-56 p-2 shadow-md bg-background rounded-box"
                    >
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem
                        // onClick={() => navigator.clipboard.writeText(payment.id)}
                        >
                            < Book />Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                    </DropdownMenuContent>
                </DropdownMenu>
            )

        },
    }
]