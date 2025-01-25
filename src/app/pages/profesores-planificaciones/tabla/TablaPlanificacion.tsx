import useSWR from "swr";
import { DataTable } from "../../data-table";
import { TableSkeleton } from "../../TableSkeleton";
import { getfetcher } from "@/api/axios";
import { columns, Planificaciones } from "./columns";
import { useCustomQueryStates } from "@/app/hooks/useSearchParams";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function TablaPlanificacion({ periodo_id }: { periodo_id: number }) {

    

    const { user } = useAuth()

    const { filter, mes, year, setCoordinates } = useCustomQueryStates();
    

    useEffect(() => {
        setCoordinates({
            filter: filter ? filter : periodo_id.toString(),
        })
    },[filter])
    
    

    const { data, error, isLoading, mutate } = useSWR<Planificaciones[]>(`/planificacion/search/me/?profesor_id=${user?.id}&query=${filter ? Number(filter) : periodo_id}&year=${year}&mes=${mes}`, getfetcher);
    if (error) {
        return <div>Error al cargar los datos</div>;
    }
    if (isLoading) {
        return <TableSkeleton />;
    }

    return (<DataTable data={data ?? []} columns={columns} />
    )
}