import React from "react";
import useSWR from 'swr'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import { Asignatura, columns } from "./columns";
import { DataTable } from "../data-table";

import { getfetcher } from "@/api/axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import MetricasAsignaturas from "../Metricas";
import CardSkeleton from "../CardSkeleton";
import { TableSkeleton } from "../TableSkeleton";



export default function Profesores() {

    const { data: total, error: errorTotal, isLoading: isLoadingTotal } = useSWR<{ total_asignaturas: number }>('/asignatura/asignaturas/count', getfetcher);
    


    return (
        <div className="w-full space-y-4 gap-4">
            <div className="grid lg:grid-cols-3 gap-4">
                {/* Bar Chart Section */}
                <div>
                    {
                        isLoadingTotal ? <CardSkeleton /> :
                        <MetricasAsignaturas value={total?.total_asignaturas.toString() || "0"} title="Asignaturas" descripcion="Cantidad de asignaturas" />

                    }
                </div>
              

                {/* Radial Charts Section */}
                
            </div>

            {/* Data Table Section */}

            <div  >
                <Card>
                    <CardHeader className="flex flex-row align-center gap-4">
                        <div>
                            <CardTitle>Asignaturas</CardTitle>
                            <CardDescription>Lista de todas las asignaturas</CardDescription>

                        </div>
                        <div>
                            <Button asChild size={'sm'} variant="default" className="ml-auto">
                                <Link to={'/asignaturas/nuevo'} className="ml-2" >
                                <UserPlus /> Nueva asignatura
                                </Link>

                            </Button>
                        </div>


                    </CardHeader>
                    <CardContent className="grid">

                        <ScrollArea className="scroll-container min-w-0">
                            <FechtDataAsignatura />
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </CardContent>

                </Card>


            </div>

        </div>
    )
}

const FechtDataAsignatura: React.FC = () => {

    const { data, error, isLoading } = useSWR<Asignatura[]>('/asignatura', getfetcher);


    if (error) {
        console.log(error);
        return <div>Error al cargar los datos</div>;
    }
    if (isLoading) {
        return <TableSkeleton/>;
    }
    console.log(data)

    return (
        <DataTable data={data ?? []} columns={columns} />
    );
};
