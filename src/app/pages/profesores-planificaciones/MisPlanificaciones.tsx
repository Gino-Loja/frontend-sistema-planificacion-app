import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { FileInput, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useDataStore } from "@/store";
import useSWR from "swr";
import { getfetcher } from "@/api/axios";
import { Periodo } from "../periodo/columns";
import TablaPlanificacion from "./tabla/TablaPlanificacion";

export default function MisPlanificaciones() {
    const { setData, setType } = useDataStore();
    const { data: periodo, error: errorPeriodo, isLoading: isLoadingPeriodo } = useSWR<Periodo>('/periodo/last', getfetcher);
    return (

        <Card>
            <CardHeader className="flex flex-row align-center gap-4">
                <div>
                    <CardTitle>Planificaciones Asignadas</CardTitle>
                    <CardDescription>Lista de planificaciones </CardDescription>

                </div>
                


            </CardHeader>
            <CardContent className="grid">

                <ScrollArea className="scroll-container min-w-0">
                    {
                        periodo && <TablaPlanificacion periodo_id={periodo?.id} />
                    }
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </CardContent>

        </Card>


    )
}