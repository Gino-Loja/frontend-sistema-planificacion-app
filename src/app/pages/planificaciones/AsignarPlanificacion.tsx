import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AxiosInstance } from "@/api/axios";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useDataStore } from "@/store";
import { Profesor } from "../profesores/columns";
import { Asignatura } from '../asignaturas/columns';
import { Periodo } from '../periodo/columns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from "date-fns"
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';


const formSchema = z.object({
  titulo: z.string().min(2, { message: "El título debe tener al menos 2 caracteres." }),
  descripcion: z.string().optional(),
  fecha_subida: z.date(),
  profesor_id: z.string().min(1, { message: "El profesor es obligatorio." }),
  asignaturas_id: z.string().min(1, { message: "La asignatura es obligatoria." }),
  periodo_id: z.string().min(1, { message: "El periodo es obligatorio." }),
});

type FormSchema = z.infer<typeof formSchema>;

interface SelectOption {
  value: string;
  label: string;
}

interface AsyncSelectFieldProps {
  name: keyof FormSchema;
  labelName: string;
  select: SelectOption | null;
  setSelect: React.Dispatch<React.SetStateAction<SelectOption | null>>;
  placeholder: string;
  loadOptions: (inputValue: string) => Promise<SelectOption[]>;
  defaultOptions?: boolean | SelectOption[];
}

export default function AsignarPlanificacion() {
  const [loading, setLoading] = useState(false);

  const { data: storeData, type } = useDataStore();
  const [selectedProfesor, setSelectedProfesor] = useState<SelectOption | null>(null);
  const [selectedAsignatura, setSelectedAsignatura] = useState<SelectOption | null>(null);
  const [selectedPeriodo, setSelectedPeriodo] = useState<SelectOption | null>(null);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: storeData?.titulo || '',
      descripcion: storeData?.descripcion || '',
      fecha_subida: storeData?.fecha_subida ? new Date(storeData?.fecha_subida) : new Date(),
      profesor_id: storeData?.profesor_id ? storeData?.profesor_id.toString() : '',
      asignaturas_id: storeData?.asignaturas_id ? storeData?.asignaturas_id.toString() : '',
      periodo_id: storeData?.periodo_id ? storeData?.periodo_id.toString() : ''
    },
  });

  const loadProfesores = async (inputValue: string): Promise<SelectOption[]> => {
    try {

      const response = await AxiosInstance.get<Profesor[]>(`/profesor/search/name?query=${inputValue}`);
      return response.data.map(profesor => ({
        value: profesor.id.toString(),
        label: profesor.nombre
      }));
    } catch (error) {
      console.error('Error loading profesores:', error);
      return [];
    }
  };

  const loadAsignaturas = async (inputValue: string): Promise<SelectOption[]> => {
    try {
      const response = await AxiosInstance.get<Asignatura[]>(`/asignatura/asignaturas/search?query=${inputValue}`);
      return response.data.map(asignatura => ({
        value: asignatura.id.toString(),
        label: asignatura.nombre
      }));
    } catch (error) {
      console.error('Error loading asignaturas:', error);
      return [];
    }
  };

  const loadPeriodos = async (inputValue: string): Promise<SelectOption[]> => {
    try {
      const response = await AxiosInstance.get<Periodo[]>(`/periodo/periodos/search?query=${inputValue}`);
      return response.data.map(periodo => ({
        value: periodo.id.toString(),
        label: periodo.nombre
      }));
    } catch (error) {
      console.error('Error loading periodos:', error);
      return [];
    }
  };

  // Cargar el profesor inicial si existe


  React.useEffect(() => {
    const loadInitialProfesor = async () => {
      setSelectedProfesor({
        value: storeData?.profesor_id.toString(),
        label: storeData?.profesor_nombre
      })
      setSelectedPeriodo({
        value: storeData?.periodo_id.toString(),
        label: storeData?.periodo_nombre
      })
      setSelectedAsignatura({
        value: storeData?.asignaturas_id.toString(),
        label: storeData?.asignatura_nombre
      })

      // if (storeData?.profesor_id) {
      //   setLoadingPage(true);
      //   try {
      //     const response = await AxiosInstance.get<Profesor>(`/profesor/${storeData.profesor_id}`);
      //     setSelectedProfesor({
      //       value: response.data.id.toString(),
      //       label: response.data.nombre
      //     });
      //   } catch (error) {
      //     console.error('Error loading initial profesor:', error);
      //   }
      // }
      // if (storeData?.periodo_id) {
      //   try {
      //     const response = await AxiosInstance.get<Periodo>(`/periodo/periodo/${storeData.periodo_id}`);
      //     setSelectedPeriodo({
      //       value: response.data.id.toString(),
      //       label: response.data.nombre
      //     });
      //   } catch (error) {
      //     console.error('Error loading initial periodo:', error);
      //   }
      // }
      // if (storeData?.asignaturas_id) {
      //   try {
      //     const response = await AxiosInstance.get<Asignatura>(`/asignatura/${storeData.asignaturas_id}`);
      //     setSelectedAsignatura({
      //       value: response.data.id.toString(),
      //       label: response.data.nombre
      //     });
      //     setLoadingPage(false);
      //   } catch (error) {
      //     console.error('Error loading initial asignatura:', error);
      //   }
      // }
    };

    if (type === "update") {
      loadInitialProfesor();
    }

  }, [storeData]);

  const onSubmit = async (values: FormSchema) => {
    setLoading(true);
    if (type === "create") {
      setLoading(true);
      await AxiosInstance.post('/planificacion/create', { ...values, fecha_subida: format(new Date(values.fecha_subida), 'yyyy-MM-dd') }).then(() => {
        setLoading(false);
        toast.success("Planificación asignada correctamente");
        form.reset();
        form.setValue("titulo", "");
        form.setValue("descripcion", "");
        form.setValue("profesor_id", "");
        form.setValue("asignaturas_id", "");
        form.setValue("periodo_id", "");

      }).catch((e) => {
        setLoading(false);

        toast.error(`${e.response.data.detail}`);
      });


    } else {
      setLoading(true);

      await AxiosInstance.put(`/planificacion/update/${Number(storeData?.id)}`, { ...values, fecha_subida: format(new Date(values.fecha_subida), 'yyyy-MM-dd') }).then(() => {
        setLoading(false);
        toast.success("Planificación actualizada correctamente");

      }).catch((e) => {
        setLoading(false);
        toast.error(`${e.response.data.detail}`);
      });
    }
  };

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

  // if (loadingPage) {
  //   return <FormSkeleton />
  // }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {type === "create" ? "Asignar Planificación" : "Editar Planificación"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingrese el título..." {...field} />
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
                    <Input
                      placeholder="Ingrese la descripción..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fecha_subida"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Establesca la fecha de Entrega</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "LLL dd, y", { locale: es })
                          ) : (
                            <span>Selecciona fecha de entrega</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        locale={es}
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />

            <AsyncSelectField
              select={selectedProfesor}
              setSelect={setSelectedProfesor}
              name="profesor_id"
              labelName="Profesor"
              placeholder="Buscar profesor..."
              loadOptions={loadProfesores}
              defaultOptions
            />
            <AsyncSelectField
              select={selectedAsignatura}
              setSelect={setSelectedAsignatura}
              name="asignaturas_id"
              labelName="Asignatura"
              placeholder="Buscar Asignatura..."
              loadOptions={loadAsignaturas}
              defaultOptions
            />
            <AsyncSelectField
              select={selectedPeriodo}
              setSelect={setSelectedPeriodo}
              name="periodo_id"
              labelName="Periodo"
              placeholder="Buscar Periodo..."
              loadOptions={loadPeriodos}
              defaultOptions
            />

            <Button
              className="w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  {type === "create" ? "Guardando" : "Actualizando"}...
                </>
              ) : (
                type === "create" ? "Asignar Planificación" : "Actualizar Planificación"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}