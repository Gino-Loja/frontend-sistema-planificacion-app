import { getfetcher } from "@/api/axios";
import useSWR from "swr";
import { columns, DocentesActivos } from "./columns";
import { TableSkeleton } from "../../TableSkeleton";
import { DataTable } from "../../data-table";

export default function TablaDocentesActivos() {

    const { data, error, isLoading, mutate } = useSWR<{estado:string, usuarios: DocentesActivos[]}>('/dashboard/docentes/estado', getfetcher);


    if (isLoading) {
        return <TableSkeleton />;
    }
    if (!data) {
        return <div>Error al cargar los datos</div>;
    }
    


    return (
        <DataTable data={data?.usuarios} columns={columns} />
    );
};
