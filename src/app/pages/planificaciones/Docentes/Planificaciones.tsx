import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TablaPlanificacion from "../tabla/TablaPlanificacion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { FileInput, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useDataStore } from "@/store";

export default function PlanificacionesProfesores() {
    const { setData, setType } = useDataStore();
    return (

        <Card>
            <CardHeader className="flex flex-row align-center gap-4">
                <div>
                    <CardTitle>Planificaciones de Profesores</CardTitle>
                    <CardDescription>Lista de planificaciones </CardDescription>

                </div>
                <div>
                    <Button asChild size={'sm'} variant="default" className="ml-auto">
                        <Link to={'/planificacion/'} onClick={() => {
                            setType("create")
                            setData({})
                        }

                        } className="ml-2" >
                           <FileInput /> Asignar Planificacion
                        </Link>

                    </Button>
                </div>


            </CardHeader>
            <CardContent className="grid">

                <ScrollArea className="scroll-container min-w-0">

                    <TablaPlanificacion periodo_id={3} />
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </CardContent>

        </Card>


    )
}