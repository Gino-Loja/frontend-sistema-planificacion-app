
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
import { CheckCircle, XCircle } from "lucide-react"

const formSchema = z.object({
    nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
    codigo: z.string().min(4, { message: "El código debe tener al menos 4 caracteres." }),
    descripcion: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres." }),
});

export const FormAsignatura = () => {

    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({

        resolver: zodResolver(formSchema),

    })

    function onSubmit(values: z.infer<typeof formSchema>) {

        setLoading(true);
        AxiosInstance.post('/asignatura/create', values)
            .then(() => {
                setLoading(false);
                form.reset();
                form.setValue("nombre", "");
                form.setValue("codigo", "");
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
                <CardTitle>Formulario de Asignaturas</CardTitle>
                <CardDescription>Ingrese los datos de la Asignatura</CardDescription>
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
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input placeholder="nombre" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="codigo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Código</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Código" {...field} />
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