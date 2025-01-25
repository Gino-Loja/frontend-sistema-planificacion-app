import React, { useState } from 'react';
import AsyncSelect from 'react-select/async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import toast from 'react-hot-toast';
import { Textarea } from '@/components/ui/textarea';
import { I18nProvider } from 'react-aria';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { es } from 'date-fns/locale';


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
  descripcion?: string;
  defaultOptions?: boolean | SelectOption[];
}

export default function AsignarPlanificacion() {
  const [loading, setLoading] = useState(false);
  const { data: storeData, type, setData } = useDataStore();
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
    if (storeData) {
      const loadInitialProfesor = async () => {
        setSelectedProfesor({
          value: storeData.profesor_id?.toString(),
          label: storeData.profesor_nombre,
        });
        setSelectedPeriodo({
          value: storeData.periodo_id?.toString(),
          label: storeData.periodo_nombre,
        });
        setSelectedAsignatura({
          value: storeData.asignaturas_id?.toString(),
          label: storeData.asignatura_nombre,
        });
      };
  
      if (type === "update") {
        loadInitialProfesor();
      }
      
    }else{
      form.reset({
        titulo: '',
        descripcion: '',
        fecha_subida: new Date(),
        profesor_id: '',
        asignaturas_id: '',
        periodo_id: '',
    });
    }
  }, [storeData, type]);

  const onSubmit = async (values: FormSchema) => {
    setLoading(true);
    if (type === "create") {
      setLoading(true);
      await AxiosInstance.post('/planificacion/create', values).then(() => {
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
        toast.error(`No se pudo asignar la planificación: ${e.response.data.detail}`);
      });


    } else {
      setLoading(true);
      await AxiosInstance.put(`/planificacion/update/${Number(storeData?.id_planificacion)}`, values).then(() => {
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
    descripcion = '',
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
                  key={name}
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
          <FormDescription>
            {descripcion}
          </FormDescription>
        </FormItem>
      )}
    />
  );

  function handleDateSelect(date: Date | undefined) {
    if (date) {
      form.setValue("fecha_subida", date);
    }
  }

  function handleTimeChange(type: "hour" | "minute" | "ampm", value: string) {
    const currentDate = form.getValues("fecha_subida") || new Date();
    let newDate = new Date(currentDate);

    if (type === "hour") {
      const hour = parseInt(value, 10);
      newDate.setHours(newDate.getHours() >= 12 ? hour + 12 : hour);
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value, 10));
    } else if (type === "ampm") {
      const hours = newDate.getHours();
      if (value === "AM" && hours >= 12) {
        newDate.setHours(hours - 12);
      } else if (value === "PM" && hours < 12) {
        newDate.setHours(hours + 12);
      }
    }

    form.setValue("fecha_subida", newDate);
  }




  // if (loadingPage) {
  //   return <FormSkeleton />
  // }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {type === "create" ? "Asignar Planificación" : "Editar Planificación"}
        </CardTitle>
        <CardDescription>
          Complete los detalles de la planificación a continuación.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingrese el título de la planificación" {...field} />
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
                    <Textarea
                      placeholder="Ingrese una breve descripción de la planificación"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="fecha_subida"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de Entrega</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: es })
                          ) : (
                            <span>Seleccione la fecha de entrega</span>
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
                  <FormDescription>
                    La fecha límite para la entrega de la planificación.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="fecha_subida"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de Entrega:</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "MM/dd/yyyy hh:mm aa")
                          ) : (
                            <span>MM/DD/YYYY hh:mm aa</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <div className="sm:flex">
                        <I18nProvider locale="es">
                          <Calendar
                            disabled={(date) => date < new Date()}
                            locale={es}
                            mode="single"
                            selected={field.value}
                            onSelect={handleDateSelect}
                            initialFocus
                          />

                        </I18nProvider>

                        <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                          <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                              {Array.from({ length: 12 }, (_, i) => i + 1)
                                .reverse()
                                .map((hour) => (
                                  <Button
                                    key={hour}
                                    size="icon"
                                    variant={
                                      field.value &&
                                        field.value.getHours() % 12 === hour % 12
                                        ? "default"
                                        : "ghost"
                                    }
                                    className="sm:w-full shrink-0 aspect-square"
                                    onClick={() =>
                                      handleTimeChange("hour", hour.toString())
                                    }
                                  >
                                    {hour}
                                  </Button>
                                ))}
                            </div>
                            <ScrollBar
                              orientation="horizontal"
                              className="sm:hidden"
                            />
                          </ScrollArea>
                          <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                              {Array.from({ length: 12 }, (_, i) => i * 5).map(
                                (minute) => (
                                  <Button
                                    key={minute}
                                    size="icon"
                                    variant={
                                      field.value &&
                                        field.value.getMinutes() === minute
                                        ? "default"
                                        : "ghost"
                                    }
                                    className="sm:w-full shrink-0 aspect-square"
                                    onClick={() =>
                                      handleTimeChange("minute", minute.toString())
                                    }
                                  >
                                    {minute.toString().padStart(2, "0")}
                                  </Button>
                                )
                              )}
                            </div>
                            <ScrollBar
                              orientation="horizontal"
                              className="sm:hidden"
                            />
                          </ScrollArea>
                          <ScrollArea className="">
                            <div className="flex sm:flex-col p-2">
                              {["AM", "PM"].map((ampm) => (
                                <Button
                                  key={ampm}
                                  size="icon"
                                  variant={
                                    field.value &&
                                      ((ampm === "AM" &&
                                        field.value.getHours() < 12) ||
                                        (ampm === "PM" &&
                                          field.value.getHours() >= 12))
                                      ? "default"
                                      : "ghost"
                                  }
                                  className="sm:w-full shrink-0 aspect-square"
                                  onClick={() => handleTimeChange("ampm", ampm)}
                                >
                                  {ampm}
                                </Button>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Por favor selecciona tu fecha y hora.
                  </FormDescription>
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
              descripcion='Seleccione el profesor para asignar la planificacion.'
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
              descripcion='Seleccione la asignatura de la planificación.'
              defaultOptions
            />


            <AsyncSelectField
              select={selectedPeriodo}
              setSelect={setSelectedPeriodo}
              name="periodo_id"
              labelName="Periodo"
              placeholder="Buscar Periodo..."
              descripcion='Seleccione el periodo de la planificación.'
              loadOptions={loadPeriodos}
              defaultOptions
            />
          </form>
          <Button
            className="w-full mt-2"
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
              type === "create" ? "Asignar Planificación" : "Actualizar Planificación"
            )}
          </Button>
        </Form>
      </CardContent>

    </Card>
  );
}