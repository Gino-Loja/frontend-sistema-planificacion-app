import React from "react";
import useSWR from 'swr'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import { columns, Profesor } from "./columns";
import { DataTable } from "../data-table";
import { BarcharProfesores } from "./Barchart";
import { RadialChartProfesores } from "./RadialChart ";
import { getfetcher } from "@/api/axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import CardSkeleton from "../CardSkeleton";
import { TableSkeleton } from "../TableSkeleton";



export default function Profesores() {

    const { data: total, error: errorTotal, isLoading: isLoadingTotal } = useSWR<{ total: number }>('/profesor/count/total', getfetcher);



    return (
        <div className="w-full space-y-4 gap-4">
            <div className="grid lg:grid-cols-3 gap-4">
                {/* Bar Chart Section */}
                <div className="lg:col-span-2">
                    <BarcharProfesores />
                </div>

                {/* Radial Charts Section */}
                <div className="flex flex-col gap-4">

                    {isLoadingTotal ? <CardSkeleton /> :
                        <RadialChartProfesores data={[total ?? { total: 0 }]} title="Total Docentes" description="Docentes registrados en el sistema" />
                    }
                </div>
            </div>

            {/* Data Table Section */}

            <div  >
                <Card>
                    <CardHeader className="flex flex-row align-center gap-4">
                        <div>
                            <CardTitle>Profesores</CardTitle>
                            <CardDescription>Lista de profesores</CardDescription>

                        </div>
                        <div>
                            <Button asChild size={'sm'} variant="default" className="ml-auto">
                                <Link to={'/profesores/nuevo'} className="ml-2" >
                                <UserPlus /> Nuevo Docente

                                </Link>

                            </Button>
                        </div>


                    </CardHeader>
                    <CardContent className="grid">

                        <ScrollArea className="scroll-container min-w-0">
                            <FechtDataProfesores />
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </CardContent>

                </Card>


            </div>

        </div>
    )
}

const FechtDataProfesores: React.FC = () => {

    const { data, error, isLoading,mutate } = useSWR<Profesor[]>('/profesor', getfetcher);

    if (error) {
        return <div>Error al cargar los datos</div>;
    }
    if (isLoading) {
        return <TableSkeleton/>;
    }

    return (
        <DataTable data={data ?? []} columns={columns} />
    );
};
