

import { ColumnDef } from "@tanstack/react-table"
import Acciones from "./Acciones";
import { Badge } from "@/components/ui/badge"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Profesor = {
    id: number;
    nombre: string;
    email: string;
    fecha_creacion: Date;
    cedula: string;
    telefono: string;
    direccion: string;
    rol: string;
    estado: boolean;
    password: string;
    is_verified: boolean;
};




export const columns: ColumnDef<Profesor>[] = [
    {
        accessorKey: "id",
        header: "Id",

    },
    {
        accessorKey: "cedula",
        header: "Cedula",
    },
    {
        accessorKey: "nombre",
        header: "Nombres",
    },
    {
        accessorKey: "estado",

        cell: ({ getValue }) => {
            const value = getValue() as boolean;
            return value ? <Badge variant="default">Activo</Badge> : <Badge variant="destructive">Inactivo</Badge>;
        },

        header: "Estado",
    },
    {
        accessorKey: "email",

        header: "Email",
    },
    { accessorKey: "telefono", header: "Telefono" },
    { accessorKey: "direccion", header: "Direccion" },

    {
        accessorKey: "rol",
        cell: ({ getValue }) => {
            const value = getValue() as string;
            
            return <Badge className="text-bold border shadow text-nowrap " variant={'outline'} >{value}</Badge>;
        },

        header: "Rol"
    },
    {
        accessorKey: "fecha_creacion",
        header: "Fecha de Creacion",

    },
    {
        id: "Acciones",
        enableHiding: true,
        cell: ({ row }) => {
            return (
                <Acciones data={row.original} />
            )

        },
    }
]