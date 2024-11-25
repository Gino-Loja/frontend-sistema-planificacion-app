
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AxiosInstance } from "@/api/axios"
import toast, { Toaster } from 'react-hot-toast';
import { ReloadIcon } from "@radix-ui/react-icons"
import { useState } from "react"
import { CheckCircle, XCircle } from "lucide-react"
import { useDataStore } from "@/store"
import { useSWRConfig } from "swr"

const formSchema = z.object({
    nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
    email: z.string().email({ message: "Introduce un email válido." }),
    cedula: z.string().min(10, { message: "La cédula debe tener al menos 10 caracteres." }),
    telefono: z.string().min(10, { message: "El teléfono debe tener al menos 7 caracteres." }),
    direccion: z.string().min(5, { message: "La dirección debe tener al menos 5 caracteres." }),
    rol: z.enum(["Vicerrector", "Director de area", "Docente"]),
    estado: z.enum(["Activo", "Inactivo"]),
    password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
});

export const FormProfesor = () => {

    const [loading, setLoading] = useState(false);
    const { mutate } = useSWRConfig()


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        setLoading(true);
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
        }else{

            AxiosInstance.put(`/profesor/${data.id}`, values)
            .then(() => {
                setLoading(false);

                toast.success("Datos guardados")
            })
            .catch((e) => {
                setLoading(false);
                toast.error(e.response.data.detail)
            })

        }
      

    }

    const { data, type } = useDataStore();

    

    return (

        <Card className="mx-auto w-1/2">
            <CardHeader>
                <CardTitle>Formulario de Profesores</CardTitle>
                <CardDescription>Ingrese los datos de los profesores</CardDescription>
            </CardHeader>
            <CardContent>
          

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="nombre"
                            defaultValue={data?.nombre}

                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Apellidos y Nombres</FormLabel>
                                    <FormControl>
                                        <Input defaultValue={field.value} placeholder="nombres completos" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="cedula"
                            defaultValue={data?.cedula}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cedula</FormLabel>
                                    <FormControl>
                                        <Input type="number" defaultValue={field.value} placeholder="Cedula" {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            defaultValue={data?.email}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input defaultValue={field.value} placeholder="email" {...field} />
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
                                        <Input type="number" defaultValue={field.value} placeholder="celular" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="direccion"
                            defaultValue={data?.direccion}

                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Direccion</FormLabel>
                                    <FormControl>
                                        <Input type="text" defaultValue={field.value} placeholder="ingrese su direccion" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            defaultValue={data?.password}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contrasena</FormLabel>
                                    <FormControl>
                                        <Input type="password" defaultValue={field.value} placeholder="***" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />






                        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                            <FormField
                                control={form.control}
                                defaultValue={data?.estado}
                                name="estado"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Estado</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione el estado" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Activo">Activo</SelectItem>
                                                <SelectItem value="Inactivo">Inactivo</SelectItem>
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
                                        <FormLabel>Rol</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione el rol" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Docente">Docente</SelectItem>
                                                <SelectItem value="Director de area">Coordinador</SelectItem>
                                                <SelectItem value="Vicerrector">Vicerrector</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button className="w-full" type="submit" disabled={loading}>
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