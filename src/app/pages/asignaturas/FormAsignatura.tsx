
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDataStore } from "@/store"
import React from "react"
import AsyncSelect from "react-select/async"

const formSchema = z.object({
    nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
    codigo: z.string().min(4, { message: "El código debe tener al menos 4 caracteres." }),
    descripcion: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres." }),
    area_id: z.string().min(1, { message: "El area es obligatorio." }),
    curso: z.string().min(1, { message: "El curso es obligatorio." }),
});
interface SelectOption {
    value: string;
    label: string;
}
type FormSchema = z.infer<typeof formSchema>;

interface AsyncSelectFieldProps {
    name: keyof FormSchema;
    labelName: string;
    select: SelectOption | null;
    setSelect: React.Dispatch<React.SetStateAction<SelectOption | null>>;
    placeholder: string;
    loadOptions: (inputValue: string) => Promise<SelectOption[]>;
    defaultOptions?: boolean | SelectOption[];
}


export const FormAsignatura = () => {
    const { data: storeData, type } = useDataStore();

    const [loading, setLoading] = useState(false);
    const [selectedArea, setSelectedArea] = useState<SelectOption | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            area_id: storeData?.area_id ? storeData?.area_id.toString() : '',
            curso: storeData?.curso ? storeData?.curso.toString() : '',
            codigo: storeData?.codigo ? storeData?.codigo.toString() : '',
            descripcion: storeData?.descripcion ? storeData?.descripcion.toString() : '',
            nombre: storeData?.nombre ? storeData?.nombre.toString() : '',
        },
    })

    const loadArea = async (inputValue: string): Promise<SelectOption[]> => {
        try {
            const response = await AxiosInstance.get<{ id: number, nombre: string }[]>(`area/areas/search?query=${inputValue}`);

            //const { data } = useSWR<{ id: number, nombre: string }[]>(`/area/areas/search?query=${inputValue}`, getfetcher)
            return response.data.map(area => ({
                value: area.id.toString(),
                label: area.nombre
            }));

        } catch (error) {
            console.error('Error loading areas:', error);
            return [];
        }
    };

    React.useEffect(() => {
        const loadInitialArea = async () => {
            setSelectedArea({
                value: storeData?.area_id.toString(),
                label: storeData?.area_nombre
            })
        };

        if (type === "update") {
            loadInitialArea();
        }

    }, [storeData])


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

    const AsyncSelectField = ({
        name,
        labelName,
        placeholder,
        select,
        setSelect,
        loadOptions,
        defaultOptions
    }: AsyncSelectFieldProps) => (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>{labelName}</FormLabel>
                    <FormControl>
                        <Controller
                            name={name}
                            control={form.control}
                            render={({ field: { onChange, value, ref } }) => (
                                <AsyncSelect
                                    ref={ref}
                                    cacheOptions
                                    defaultOptions={defaultOptions}
                                    value={select}
                                    loadOptions={loadOptions}
                                    onChange={(option) => {
                                        setSelect(option);
                                        onChange(option?.value);
                                    }}
                                    placeholder={placeholder}
                                    className="w-72"
                                    isClearable
                                    loadingMessage={() => "Cargando..."}
                                    noOptionsMessage={({ inputValue }) =>
                                        inputValue ? "No se encontraron resultados" : "Escriba para buscar..."
                                    }
                                />
                            )}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );


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

                        <FormField
                            control={form.control}
                            name="curso"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Estado</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione el Curso" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Primero Bachillerato">Primero Bachillerato</SelectItem>
                                            <SelectItem value="Segundo Bachillerato">Segundo Bachillerato</SelectItem>
                                            <SelectItem value="Tercero Bachillerato">Tercero Bachillerato</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <AsyncSelectField
                            select={selectedArea}
                            setSelect={setSelectedArea}
                            name="area_id"
                            labelName="Area"
                            placeholder="Buscar Area..."
                            loadOptions={loadArea}
                            defaultOptions
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