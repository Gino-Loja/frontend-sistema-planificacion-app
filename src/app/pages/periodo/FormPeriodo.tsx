
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
import { useState } from "react"
import { CalendarIcon, CheckCircle, XCircle } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import React from "react"
import { DateRange } from "react-day-picker"
import { addDays, format } from "date-fns"
import { es } from 'date-fns/locale';



const formSchema = z.object({
    nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
    // fecha_inicio: z.string().min(10, { message: "La fecha de inicio debe tener al menos 10 caracteres." }),
    // fecha_fin: z.string().min(10, { message: "La fecha de fin debe tener al menos 10 caracteres." }),

    descripcion: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres." }),
});

export const FormPeriodo = () => {

    const [loading, setLoading] = useState(false);
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(2022, 0, 20),
        to: new Date(2022,3, 20),
    })


    const form = useForm<z.infer<typeof formSchema>>({

        resolver: zodResolver(formSchema),

    })

    function onSubmit(values: z.infer<typeof formSchema>) {

        setLoading(true);
        AxiosInstance.post('/periodo/create', {...values, fecha_inicio: date?.from, fecha_fin: date?.to
        })
            .then(() => {
                setLoading(false);
                form.reset();
                form.setValue("nombre", "");
                form.setValue("descripcion", "");

                toast.success("Datos guardados")

            })
            .catch((e) => {
                setLoading(false);
                toast.error(e.response.data.detail)
            })

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

                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre del periodo</FormLabel>
                                    <FormControl>
                                        <Input placeholder="nombre" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />



                        <FormField
                            control={form.control}
                            name="descripcion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descripción</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Descripción" {...field} />
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
                                        numberOfMonths={3}
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
                                'Guardar'
                            )}
                        </Button>
                    </form>
                </Form>

            </CardContent>

        </Card>

    )
}