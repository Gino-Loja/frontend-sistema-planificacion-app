
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AxiosInstance } from "@/api/axios"
import toast, { Toaster } from 'react-hot-toast';
import { ReloadIcon } from "@radix-ui/react-icons"
import { useEffect, useState } from "react"
import { CalendarIcon, CheckCircle, XCircle } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import React from "react"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { es } from 'date-fns/locale';
import { useDataStore } from "@/store"
import { useSWRConfig } from "swr"


// pdf *
// string($binary)
// No se ha seleccionado ningún archivo
// id_planificacion *
// integer
// id_planificacion
// area_codigo *
// string
// area_codigo
// id_usuario *
// integer
// id_usuario
// nombre_asignatura *
// string
// nombre_asignatura
// periodo_nombre *
const formSchema = z.object({
    pdf: z.instanceof(File).refine((file) => file.size <= 1 * 1024 * 1024, {
        message: "El archivo debe ser menor a 1 MB.",
    }),
    id_planificacion: z.number().min(1, { message: "El campo id_planificacion es obligatorio." }),
    area_codigo: z.string().min(1, { message: "El campo area_codigo es obligatorio." }),
    id_usuario: z.number().min(1, { message: "El campo id_usuario es obligatorio." }),
    nombre_asignatura: z.string().min(1, { message: "El campo nombre_asignatura es obligatorio." }),
    periodo_nombre: z.string().min(1, { message: "El campo periodo_nombre es obligatorio." }),
});



export const FormSubirPdf = () => {
    const [loading, setLoading] = useState(false);
    const [date, setDate] = React.useState<DateRange | undefined>()
    const { data, type } = useDataStore();
    const { mutate } = useSWRConfig()

    useEffect(() => {
        if (type === "update") {
            setDate({
                from: data?.fecha_inicio,
                to: data?.fecha_fin,
            })
        }
    }, [data, type])


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),

    })

    function onSubmit(values: z.infer<typeof formSchema>) {


        if (type === "create") {
            setLoading(true);
            AxiosInstance.post('/periodo/create', {
                ...values, fecha_inicio: date?.from, fecha_fin: date?.to
            })
                .then(() => {
                    setLoading(false);
                    form.reset();
                    form.setValue("nombre", "");
                    form.setValue("descripcion", "");
                    mutate('/periodo/periodo/');
                    toast.success("Datos guardados")

                })
                .catch((e) => {
                    setLoading(false);
                    toast.error(e.response.data.detail)
                })
        }
        else {
            setLoading(true);

            AxiosInstance.put(`/periodo/periodo/${data.id}`, {
                ...values, fecha_inicio: date?.from, fecha_fin: date?.to
            })
                .then(() => {
                    setLoading(false);
                    mutate('/periodo/periodo/');
                    toast.success("Datos guardados")
                })
                .catch((e) => {
                    setLoading(false);
                    toast.error(e.response.data.detail)
                })

        }


        // toast.promise(
        //     AxiosInstance.post('/profesor/create', values)
        //     ,
        //     {
        //         loading: 'Saving...',
        //         success: (r) => {

        //             form.reset();
        //             return <b>Saved!</b>
        //         },
        //         error: <b>Could not save.</b>,
        //     }
        // );


    }


    return (

        <Card className="mx-auto w-1/2">
            <CardHeader>
                <CardTitle>Formulario de Periodos</CardTitle>
                <CardDescription>Ingrese los datos del periodo</CardDescription>
            </CardHeader>
            <CardContent>
                <Toaster
                    toastOptions={{
                        success: {
                            className: "!bg-green-500 !text-white !border-green-600",
                            iconTheme: {
                                primary: 'white',
                                secondary: 'green',
                            },
                            icon: <CheckCircle className="h-5 w-5" />,
                        },
                        error: {
                            className: "!bg-red-500 !text-white !border-red-600",
                            iconTheme: {
                                primary: 'white',
                                secondary: 'red',
                            },
                            icon: <XCircle className="h-5 w-5" />,
                        },
                    }}
                />

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="nombre"
                            defaultValue={data?.nombre}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre del periodo</FormLabel>
                                    <FormControl>
                                        <Input defaultValue={field.value} placeholder="nombre" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />



                        <FormField
                            control={form.control}
                            name="descripcion"
                            defaultValue={data?.descripcion}

                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descripción</FormLabel>
                                    <FormControl>
                                        <Input defaultValue={field.value} type="text" placeholder="Descripción" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormLabel className="mt-2">Seleccione la duracion del periodo</FormLabel>

                        <div className={cn("grid gap-2")}>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="date"
                                        variant={"outline"}
                                        className={cn(
                                            "w-[300px] justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon />
                                        {date?.from ? (
                                            date.to ? (
                                                <>
                                                    {format(date.from, "LLL dd, y", { locale: es })} -{" "}
                                                    {format(date.to, "LLL dd, y", { locale: es })}
                                                </>
                                            ) : (
                                                format(date.from, "LLL dd, y", { locale: es })
                                            )
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        locale={es}
                                        initialFocus
                                        mode="range"
                                        defaultMonth={date?.from}
                                        selected={date}
                                        onSelect={setDate}
                                        numberOfMonths={2}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                type === "create" ? 'Guardar' : 'Actualizar'
                            )}
                        </Button>
                    </form>
                </Form>

            </CardContent>

        </Card>

    )
}