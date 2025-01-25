
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



const formSchema = z.object({
    nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
    // fecha_inicio: z.string().min(10, { message: "La fecha de inicio debe tener al menos 10 caracteres." }),
    // fecha_fin: z.string().min(10, { message: "La fecha de fin debe tener al menos 10 caracteres." }),

    descripcion: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres." }),
});

export const FormPeriodo = () => {



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

        <Card className="mx-auto w-min">
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

                        <FormLabel className="mt-2 mb-2">Seleccione la duracion del periodo</FormLabel>

                        <div className={cn("grid gap-2 align-center")}>

                            <Calendar
                                locale={es}
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={2}
                            />

                        </div>


                        <div className="flex justify-center">
                            <Button className="min-w-72" type="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    type === "create" ? 'Guardar' : 'Actualizar'
                                )}
                            </Button>
                        </div>

                    </form>
                </Form>

            </CardContent>

        </Card>

    )
}