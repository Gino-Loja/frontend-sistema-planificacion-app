
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AxiosInstance } from "@/api/axios"
import toast from 'react-hot-toast';
import { ReloadIcon } from "@radix-ui/react-icons"
import { useState } from "react"
import { useDataStore } from "@/store"
import { useSWRConfig } from "swr"

const createSchema = z.object({
    nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
    email: z.string().email({ message: "Introduce un email válido." }),
    cedula: z.string().min(10, { message: "La cédula debe tener al menos 10 caracteres." }),
    telefono: z.string().min(10, { message: "El teléfono debe tener al menos 7 caracteres." }),
    direccion: z.string().min(5, { message: "La dirección debe tener al menos 5 caracteres." }),
    rol: z.enum(["Vicerrector", "Director de area", "Docente"]),
    estado: z.boolean(),

    password: z.string()
        .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
            message: "La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial.",
        }),
    is_verified: z.boolean(),
});

const updateSchema = z.object({
    nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }).optional(),
    email: z.string().email({ message: "Introduce un email válido." }).optional(),
    cedula: z.string().min(10, { message: "La cédula debe tener al menos 10 caracteres." }).optional(),
    telefono: z.string().min(10, { message: "El teléfono debe tener al menos 7 caracteres." }).optional(),
    direccion: z.string().min(5, { message: "La dirección debe tener al menos 5 caracteres." }).optional(),
    rol: z.enum(["Vicerrector", "Director de area", "Docente"]).optional(),
    estado: z.boolean(),
    password: z.string()
        .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
            message: "La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial.",
        })
        .optional(),
    is_verified: z.boolean(),
});

export const FormProfesor = () => {

    const [loading, setLoading] = useState(false);
    const { mutate } = useSWRConfig()
    const { data, type } = useDataStore();




    const formSchema = type === "create" ? createSchema : updateSchema;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            is_verified: true,
            estado: true,
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        setLoading(true);
        console.log(type)
        if (type === "create") {
            AxiosInstance.post('/profesor/create', values)
                .then(() => {
                    setLoading(false);
                    form.reset();
                    form.setValue("nombre", "");
                    form.setValue("cedula", "");
                    form.setValue("email", "");
                    form.setValue("telefono", "");
                    form.setValue("direccion", "");
                    form.setValue("password", "");
                    toast.success("Datos guardados")
                    mutate('/profesor');


                })
                .catch((e) => {
                    setLoading(false);
                    toast.error(e.response.data.detail)
                })
        } else {

            AxiosInstance.put(`/profesor/${data.id}`, values)
                .then(() => {
                    setLoading(false);

                    toast.success("Datos Actualizados")
                })
                .catch((e) => {
                    setLoading(false);
                    toast.error(e.response.data.detail)
                })

        }


    }


    return (

        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Profesor</CardTitle>
                <CardDescription>Ingrese los datos del profesor. Todos los campos son obligatorios.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="nombre"
                                defaultValue={data?.nombre}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Apellidos y Nombres</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nombres completos" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                defaultValue={data?.cedula}

                                name="cedula"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cédula</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="Cédula" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="email"
                                defaultValue={data?.email}

                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="correo@ejemplo.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="telefono"
                                defaultValue={data?.telefono}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Celular</FormLabel>
                                        <FormControl>
                                            <Input type="tel" placeholder="099 999 9999" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="direccion"
                            defaultValue={data?.direccion}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dirección</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ingrese su dirección" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contraseña</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una minúscula, un número y un carácter especial.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                defaultValue={data?.estado}
                                name="estado"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Estado</FormLabel>
                                        <Select onValueChange={(value) => field.onChange(value === 'true')}
                                            value={field.value.toString()}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione el estado" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={'true'}>Activo</SelectItem>
                                                <SelectItem value={'false'}>Inactivo</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                defaultValue={data?.rol}
                                name="rol"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Especialidad del docente:</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione el rol" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Docente">Docente</SelectItem>
                                                <SelectItem value="Director de area">Director de Area</SelectItem>
                                                <SelectItem value="Vicerrector">Vicerrector</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button
                            className="w-full"
                            type="submit"
                            disabled={loading}
                            onClick={form.handleSubmit(onSubmit)}
                        >
                            {loading ? (
                                <>
                                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                    {type === "create" ? "Guardando" : "Actualizando"}...
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