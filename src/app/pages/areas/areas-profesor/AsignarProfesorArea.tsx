import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import useSWR from "swr";
import { AreaProfesor } from "./columns";
import { getfetcher } from "@/api/axios";
import { TableSkeleton } from "../../TableSkeleton";
import { useDataStore } from "@/store";
import FormAreas from "../FormAreas";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarDays, CalendarIcon, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { CustomDialog } from "../../Dialog";
import CardSkeletonItems from "../../SkeletonCardItems";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Importar el Select de shadcn
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";

export default function AsignarProfesorArea() {
    const { setIsOpen, isOpen, setData, setType } = useDataStore();

    return (
        <div className="w-full">
            <FormAreas />
            <Card>
                <CardHeader className="flex flex-row align-center gap-4">
                    <div>
                        <CardTitle>Profesores por áreas</CardTitle>
                        <CardDescription>Lista de profesores por área</CardDescription>
                    </div>
                    <div>
                        <Button
                            size={'sm'}
                            onClick={() => {
                                setData({})
                                setType("create")
                                setIsOpen(true)
                            }} variant="default" className="ml-auto">
                            Asignar Profesor
                        </Button>
                    </div>
                </CardHeader>
            </Card>
            <FechtDataArea />
        </div>
    )
}

const FechtDataArea: React.FC = () => {
    const { data, error, isLoading, mutate } = useSWR<AreaProfesor[]>('/area/areas-profesor/search', getfetcher);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProfesor, setSelectedProfesor] = useState<string>("Todos"); // Filtro por nombre de profesor
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined); // Filtro de fecha
    
    const { setData, setType, setIsOpen } = useDataStore();

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
        console.log(error);
        return <div>Error al cargar los datos</div>;
    }

    // Extraer la lista de nombres de profesores únicos
    const profesores = Array.from(new Set(data.map(item => item.profesor_nombre)));
    profesores.unshift("Todos"); // Agregar la opción "Todos" al inicio

    // Aplicar filtros
    const filtrosNombres = data.filter(item => {
        const matchesSearchTerm =
            item.area_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.profesor_nombre.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesProfesor = selectedProfesor === "Todos" ? true : item.profesor_nombre === selectedProfesor;
        const matchesDate = selectedDate
                    ? format(new Date(item.fecha_de_ingreso), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                    : true;

        return matchesSearchTerm && matchesProfesor && matchesDate;
    });

    return (
        <div className="container mx-auto mt-4 min-h-screen space-y-4">
            <div className="flex justify-items-start gap-4 items-center">
                <Input
                    type="text"
                    placeholder="Buscar por nombre o área..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md"
                />
                {/* Selector de Profesores */}
                <Label className="text-sm">Profesores:</Label>

                <Select value={selectedProfesor} onValueChange={setSelectedProfesor}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Selecciona un profesor" />
                    </SelectTrigger>
                    <SelectContent>
                        {profesores.map((profesor) => (
                            <SelectItem key={profesor} value={profesor}>
                                {profesor}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtrosNombres.map((item: AreaProfesor) => (
                    <Card key={item.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <Avatar className="w-16 h-16">
                                <AvatarFallback>{item.profesor_nombre.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-xl">{item.profesor_nombre}</CardTitle>
                                <p className="text-sm text-gray-600">ID: {item.profesor_id}</p>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <h3 className="font-semibold mb-2">{item.area_nombre}</h3>
                            <p className="text-sm text-gray-600">ID del área: {item.area_id}</p>
                            <div className="flex items-center mt-4">
                                <CalendarDays className="w-4 h-4 mr-2 text-gray-500" />
                                <span className="text-sm">Fecha de ingreso: {new Date(item.fecha_de_ingreso).toLocaleDateString()}</span>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-gray-50 flex justify-between items-center p-4">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center"
                                onClick={() => {
                                    setData(item);
                                    setType("update");
                                    setIsOpen(true);
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
                                <CustomDialog path="/area/areas-profesor/search" title={"profesor de esta área"} url={`/area/delete/${item.id}`} />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};