import React, { useState } from "react";
import useSWR from 'swr';
import { Asignatura } from "./columns";
import { getfetcher } from "@/api/axios";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, CalendarDays, CalendarIcon, Edit, GraduationCap, Trash2, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import MetricasAsignaturas from "../Metricas";
import CardSkeleton from "../CardSkeleton";
import { TableSkeleton } from "../TableSkeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useDataStore } from "@/store";
import { CustomDialog } from "../Dialog";
import CardSkeletonItems from "../SkeletonCardItems";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function Profesores() {
    const { data: total, error: errorTotal, isLoading: isLoadingTotal } = useSWR<{ total_asignaturas: number }>('/asignatura/asignaturas/count', getfetcher);
    const { setData, setType } = useDataStore();

    return (
        <div className="w-full space-y-4 gap-4">
            <div className="grid lg:grid-cols-3 gap-4">
                {isLoadingTotal ? <CardSkeleton /> : (
                    <MetricasAsignaturas value={total?.total_asignaturas.toString() || "0"} title="Asignaturas" descripcion="Cantidad de asignaturas" />
                )}
            </div>
            <div>
                <Card>
                    <CardHeader className="flex flex-row align-center gap-4">
                        <div>
                            <CardTitle>Asignaturas</CardTitle>
                            <CardDescription>Lista de todas las asignaturas</CardDescription>
                        </div>
                        <div>
                            <Button asChild size={'sm'} variant="default" className="ml-auto">
                                <Link onClick={() => { setType("create"); setData({}); }} to={'/dashboard-admin/asignaturas/nuevo'} className="ml-2">
                                    <UserPlus /> Nueva asignatura
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                </Card>
                <FechtDataAsignatura />
            </div>
        </div>
    );
}

const FechtDataAsignatura: React.FC = () => {
    const { data, error, isLoading, mutate } = useSWR<Asignatura[]>('/asignatura', getfetcher);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCurso, setSelectedCurso] = useState<string>("Todos"); // Valor inicial: "Todos"
    const [selectedArea, setSelectedArea] = useState<string>("Todos");   // Valor inicial: "Todos"
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined); // Filtro de fecha

    console.log(data);

    const navigate = useNavigate();
    const { setData, setType } = useDataStore();

    const cursos = ["Todos", "Primero Bachillerato", "Segundo Bachillerato", "Tercero Bachillerato"];
    const areas = [
        "Todos",
        "EDUCACIÓN CULTURAL Y ARTISTICA",
        "EDUCACIÓN FÍSICA",
        "CIENCIAS NATURALES",
        "CIENCIAS SOCIALES",
        "LENGUA Y LITERATURA",
        "MATEMÁTICA",
        "LENGUA EXTRANJERA",
        "TÉCNICA TIC - INFORMÁTICA",
        "INTERDISCIPLINAR",
    ];

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {[...Array(5)].map((_, index) => (
                    <CardSkeletonItems key={index} />
                ))}
            </div>
        );
    }

    if (!data) {
        return <div>Error al cargar los datos</div>;
    }

    const filtrosNombres = data.filter(asignatura => {
        const matchesSearchTerm =
            asignatura.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asignatura.nombre.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCurso = selectedCurso === "Todos" ? true : asignatura.curso === selectedCurso;
        const matchesArea = selectedArea === "Todos" ? true : asignatura.area_nombre === selectedArea;

        // Filtro de fecha
        const matchesDate = selectedDate
            ? format(new Date(asignatura.fecha_creacion), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
            : true;

        return matchesSearchTerm && matchesCurso && matchesArea && matchesDate;
    });

    return (
        <div className="container mx-auto mt-4 min-h-screen">
            <div className="flex justify-items-start gap-4 items-center">
                <Input
                    type="text"
                    placeholder="Buscar por nombre o código..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md"
                />
                {/* Selector de Cursos */}
                <Label className="text-sm">Cursos:</Label>
                <Select value={selectedCurso} onValueChange={setSelectedCurso}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Selecciona un curso" />
                    </SelectTrigger>
                    <SelectContent>
                        {cursos.map((curso) => (
                            <SelectItem key={curso} value={curso}>
                                {curso}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {/* Selector de Áreas */}
                <Label className="text-sm">Áreas:</Label>
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Selecciona un área" />
                    </SelectTrigger>
                    <SelectContent>
                        {areas.map((area) => (
                            <SelectItem key={area} value={area}>
                                {area === "Todos" ? area : area.toUpperCase()} {/* Convertir a mayúsculas */}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {/* Selector de Fecha */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full pl-3 text-left font-normal",
                                !selectedDate && "text-muted-foreground"
                            )}
                        >
                            {selectedDate ? (
                                format(selectedDate, "PPP", { locale: es })
                            ) : (
                                <span>Seleccione la fecha de creación</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            locale={es}
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {filtrosNombres.map((asignatura: Asignatura) => (
                    <Card key={asignatura.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-xl">{asignatura.nombre}</CardTitle>
                                <Badge className="text-sm" variant="secondary">{asignatura.codigo}</Badge>
                            </div>
                            <p className="text-sm text-gray-600">{asignatura.area_nombre}</p>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <div className="flex items-center mb-2">
                                <GraduationCap className="w-4 h-4 mr-2 text-gray-500" />
                                <span className="text-sm">{asignatura.curso}</span>
                            </div>
                            <div className="flex items-center mb-2">
                                <CalendarDays className="w-4 h-4 mr-2 text-gray-500" />
                                <span className="text-sm">Creado: {new Date(asignatura.fecha_creacion).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center mt-4">
                                <BookOpen className="w-4 h-4 mr-2 text-gray-500" />
                                <span className="text-sm">Descripcion: {asignatura.descripcion}</span>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-gray-50 flex justify-between">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center"
                                onClick={() => {
                                    setData(asignatura);
                                    setType("update");
                                    navigate(`/dashboard-admin/asignaturas/editar/`);
                                }}
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                className="flex items-center"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                <CustomDialog path="/asignatura" title={"Asignatura"} url={`/asignatura/${asignatura.id}`} />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};