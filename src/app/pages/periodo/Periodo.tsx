import React from "react";
import useSWR from 'swr'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import { Periodo, columns } from "./columns";
import { DataTable } from "../data-table";

import { getfetcher } from "@/api/axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarRange, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import CardSkeleton from "../CardSkeleton";
import { TableSkeleton } from "../TableSkeleton";
import { useDataStore } from "@/store";

export default function Profesores() {

    const { data: total, error: errorTotal, isLoading: isLoadingTotal } = useSWR<{ total_periodos: number }>('/periodo/total/count', getfetcher);
    const { data: periodo, error: errorPeriodo, isLoading: isLoadingPeriodo } = useSWR<Periodo>('/periodo/last', getfetcher);



    const date = periodo ? format(periodo.fecha_inicio, "LLL dd, y", { locale: es }) + " - " + format(periodo.fecha_fin, "LLL dd, y", { locale: es }) : '';
    const { setData, setType } = useDataStore();

    return (
        <div className="w-full space-y-4 gap-4">
            <div className="grid lg:grid-cols-4 gap-4">
                {/* Bar Chart Section */}
                <div>
                    {
                        isLoadingTotal ? <CardSkeleton /> :

                        <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Periodo lectivos</CardTitle>
                            <CalendarRange className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold">{total?.total_periodos.toString() || "0"}</div>
                            <p className="text-xs text-muted-foreground">Cantidad de Periodos</p>
                        </CardContent>
                    </Card>
                    }
                </div>
                <div>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium">Número de períodos por año</CardTitle>
                            <CalendarRange className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold">{1}</div>
                            <p className="text-xs text-muted-foreground">Cantidad de Periodos al año</p>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid lg:col-span-2">
                    {
                        isLoadingPeriodo ? <CardSkeleton /> :

                            <Card className="hover:shadow-lg transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                    <CardTitle className="text-sm font-medium">Periodo actual</CardTitle>
                                    <CalendarRange className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-xl font-bold">{date}</div>
                                    <p className="text-xs text-muted-foreground">Fecha inicio - Fecha fin</p>
                                </CardContent>
                            </Card>
                        // <Metricas size="text-4xl" value={date} title={periodo?.nombre || 'Sin nombre'}  descripcion={periodo?.descripcion || 'Sin descripción'} />
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
                            <CardDescription>Lista de periodos lectivos</CardDescription>

                        </div>
                        <div>
                            <Button asChild size={'sm'} variant="default" className="ml-auto">
                                <Link onClick={
                                    () => {
                                         setType("create")
                                        setData({})
                                    }
                                } to={'/dashboard-admin/periodo-lectivo/nuevo'} className="ml-2" >
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

    const { data, error, isLoading, mutate } = useSWR<Periodo[]>('/periodo/periodo/', getfetcher);


    if (error) {
        console.log(error);
        return <div>Error al cargar los datos</div>;
    }
    if (isLoading) {
        return <TableSkeleton />;
    }

    return (
        <DataTable data={data ?? []} columns={columns} />
    );
};
