import React from "react";
import useSWR from 'swr'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import { Periodo, columns } from "./columns";
import { DataTable } from "../data-table";

import { getfetcher } from "@/api/axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import Metricas from "../Metricas";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import CardSkeleton from "../CardSkeleton";
import { TableSkeleton } from "../TableSkeleton";

export default function Profesores() {

    const { data: total, error: errorTotal, isLoading: isLoadingTotal } = useSWR<{ total_periodos: number }>('/periodo/total/count', getfetcher);
    const { data: periodo, error: errorPeriodo, isLoading: isLoadingPeriodo } = useSWR<Periodo>('/periodo/last', getfetcher);


  

    const date = periodo ? format(periodo.fecha_inicio, "LLL dd, y", { locale: es }) + " - " + format(periodo.fecha_fin, "LLL dd, y", { locale: es }) : '';

    return (
        <div className="w-full space-y-4 gap-4">
            <div className="grid lg:grid-cols-3 gap-4">
                {/* Bar Chart Section */}
                <div>
                    {
                        isLoadingTotal ? <CardSkeleton />:
                            <Metricas value={total?.total_periodos.toString() || "0"} title="Periodo lectivos" descripcion="Cantidad de Periodos" />
                    }
                </div>
                <div>
                    <Metricas value={'1'} title="Número de períodos por año" descripcion="Cantidad de Periodos al año" />
                </div>
                <div className="">
                    {
                        isLoadingPeriodo ? <CardSkeleton /> :
                            <Metricas size="text-3xl" value={date} title={periodo?.nombre || 'Sin nombre'}  descripcion={periodo?.descripcion || 'Sin descripción'} />
                    }
                </div>




                {/* Radial Charts Section */}

            </div>

            {/* Data Table Section */}

            <div  >
                <Card>
                    <CardHeader className="flex flex-row align-center gap-4">
                        <div>
                            <CardTitle>Periodo lectivo</CardTitle>
                            <CardDescription>Lista de los periodos lectivos</CardDescription>

                        </div>
                        <div>
                            <Button asChild size={'sm'} variant="default" className="ml-auto">
                                <Link to={'/periodo-lectivo/nuevo'} className="ml-2" >
                                    <UserPlus /> Nuevo Periodo
                                </Link>

                            </Button>
                        </div>


                    </CardHeader>
                    <CardContent className="grid">

                        <ScrollArea className="scroll-container min-w-0">
                            <FechtDataPeriodo />
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </CardContent>

                </Card>


            </div>

        </div>
    )
}

const FechtDataPeriodo: React.FC = () => {

    const { data, error, isLoading } = useSWR<Periodo[]>('/periodo/periodo/', getfetcher);


    if (error) {
        console.log(error);
        return <div>Error al cargar los datos</div>;
    }
    if (isLoading) {
        return <TableSkeleton/>;
    }

    return (
        <DataTable data={data ?? []} columns={columns} />
    );
};
