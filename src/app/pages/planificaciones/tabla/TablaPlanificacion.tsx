import useSWR from "swr";
import { DataTable } from "../../data-table";
import { TableSkeleton } from "../../TableSkeleton";
import { getfetcher } from "@/api/axios";
import { columns, Planificaciones } from "./columns";

export default function TablaPlanificacion({ periodo_id }: { periodo_id: number }) {
    const { data, error, isLoading, mutate } = useSWR<Planificaciones[]>(`/planificacion/search/?query=${periodo_id}`, getfetcher);

    if (error) {
        return <div>Error al cargar los datos</div>;
    }
    if (isLoading) {
        return <TableSkeleton />;
    }

    return (<DataTable data={data ?? []} columns={columns} />
    )
}