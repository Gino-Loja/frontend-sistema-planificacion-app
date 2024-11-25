import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollBar } from "@/components/ui/scroll-area";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Link } from "react-router-dom";
import { DataTable } from "../../data-table";
import useSWR from "swr";
import { AreaProfesor, columns } from "./columns";
import { getfetcher } from "@/api/axios";
import { TableSkeleton } from "../../TableSkeleton";
import { useDataStore } from "@/store";
import FormAreas from "../FormAreas";

export default function AsignarProfesorArea() {
    const { setIsOpen, isOpen, setData, setType } = useDataStore();

    console.log(isOpen)




    return (
        <div className="w-full">
            <FormAreas />
            <Card>
                <CardHeader className="flex flex-row align-center gap-4">
                    <div>
                        <CardTitle>Profesores por área</CardTitle>
                        <CardDescription>Lista de profesores por área</CardDescription>

                    </div>
                    <div>
                        <Button
                        size={'sm'}
                            onClick={() => {
                                setData({})
                                setType("create")
                                setIsOpen(true)}} variant="default" className="ml-auto">
                            Asignar Profesor
                        </Button>
                    </div>


                </CardHeader>
                <CardContent className="grid">

                    <ScrollArea className="scroll-container min-w-0">
                        <FechtDataArea />
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </CardContent>

            </Card>


        </div>
    )
}

const FechtDataArea: React.FC = () => {

    const { data, error, isLoading, mutate } = useSWR<AreaProfesor[]>('/area/areas-profesor/search', getfetcher);

    if (error) {
        console.log(error);
        return <div>Error al cargar los datos</div>;
    }
    if (isLoading) {
        return <TableSkeleton />;
    }

    console.log(data)
    return (
        <DataTable data={data ?? []} columns={columns} />
    );
};