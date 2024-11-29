import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Upload, Send, FileUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDataStore } from '@/store';
import PdfView from '../PdfView';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import { AxiosInstance } from '@/api/axios';

const formSchema = z.object({
  pdf: z.instanceof(File).refine((file) => file.size <= 1 * 1024 * 1024, {
    message: 'El pdf debe ser menor a 1 MB.',
  }),
  id_planificacion: z.number(),
  area_codigo: z.string(),
  id_usuario: z.number(),
  nombre_asignatura: z.string(),
  periodo_nombre: z.string(),
});

const fetchPdf = async (archivo: string) => {
  const response = await AxiosInstance.get('/planificacion/descargar-planificacion', {
    params: { ruta_archivo: archivo },
    responseType: 'blob',
  });
  return URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
};

const PlanificacionesAsignadoProfesor = () => {
  const { data } = useDataStore();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Juan Pérez',
      date: '2024-11-24T10:30:00Z',
      content: 'Por favor revisar la sección de evaluación',
    },
    {
      id: 2,
      author: 'Gino Loja',
      date: '2024-11-24T11:45:00Z',
      content: 'Contenido actualizado según las observaciones',
    },
  ]);

  const { data: pdfUrl, error, isLoading } = useSWR(
    data?.archivo ? `/planificacion/descargar-planificacion?ruta_archivo=${data.archivo}` : null,
    () => fetchPdf(data.archivo)
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id_planificacion: data?.id,
      area_codigo: data?.area_codigo,
      id_usuario: data?.profesor_id,
      nombre_asignatura: data?.asignatura_nombre,
      periodo_nombre: data?.periodo_nombre,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    AxiosInstance.put('/planificacion/subir-pdf', values, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(() => {
        toast.success('Datos guardados');
      })
      .catch(() => {
        toast.error('Error al subir el archivo');
      });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];
    if (file && file.type === 'application/pdf') {
      form.setValue('pdf', file);
    } else {
      alert('Por favor, seleccione un archivo PDF válido');
    }
  };

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: 'Usuario Actual',
        date: new Date().toISOString(),
        content: newComment,
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container flex h-full min-h-screen gap-6 py-4 lg:grid-cols-2">
      {/* PDF Viewer Section */}
      <div className="w-3/5 rounded-lg border bg-card">
        <form className="flex h-full flex-col" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Vista previa del documento</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    form.resetField('pdf');
                  }}
                >
                  Subir otro documento
                </Button>
                <Button variant="outline" type="submit">
                  <FileUp className="mr-2 h-4 w-4" />
                  Guardar planificación
                </Button>
              </div>
            </div>
          </div>
          <div
            style={{
              maxHeight: '800px',
            }}
            className="flex-1 bg-muted p-4"
          >
            {isLoading ? (
              <div className="flex h-full items-center justify-center">Cargando PDF...</div>
            ) : pdfUrl ? (
              <PdfView pdf={pdfUrl} />
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed">
                <div className="w-full">
                  <label htmlFor="file-input" className="block cursor-pointer">
                    <div className="flex h-full flex-col items-center justify-center">
                      <Upload className="mb-4 h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Sube un archivo PDF para visualizarlo</p>
                    </div>
                  </label>
                  <input
                    id="file-input"
                    type="file"
                    accept=".pdf"
                    {...form.register('pdf', { required: true })}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Details Section */}
      <div className="w-2/5 space-y-6">
        <Tabs defaultValue="general">
          <TabsList className="w-full">
            <TabsTrigger className="w-full" value="general">
              General
            </TabsTrigger>
            <TabsTrigger className="w-full" value="comentarios">
              Comentarios
            </TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>{data?.titulo}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Detalles de la planificación</h4>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Asignatura:</p>
                        <p className="text-muted-foreground">{data?.asignatura_nombre}</p>
                      </div>
                      <div>
                        <p className="font-medium">Área:</p>
                        <p className="text-muted-foreground">
                          {data?.area_nombre} ({data?.area_codigo})
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Profesor:</p>
                        <p className="text-muted-foreground">{data?.profesor_nombre}</p>
                      </div>
                      <div>
                        <p className="font-medium">Periodo:</p>
                        <p className="text-muted-foreground">{data?.periodo_nombre}</p>
                      </div>
                      <div>
                        <p className="font-medium">Fecha de subida:</p>
                        <p className="text-muted-foreground">{formatDate(data?.fecha_subida)}</p>
                      </div>
                      <div>
                        <p className="font-medium">Última actualización:</p>
                        <p className="text-muted-foreground">{formatDate(data?.fecha_de_actualizacion)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="comentarios">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Comentarios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Comentarios existentes</h4>
                    <Separator className="my-2" />
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <Card key={comment.id} className="w-full">
                          <CardHeader>
                            <CardTitle>{comment.author}</CardTitle>
                            <p className="text-xs text-muted-foreground">{formatDate(comment.date)}</p>
                          </CardHeader>
                          <CardContent>{comment.content}</CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="new-comment">Agregar un comentario</Label>
                    <Textarea
                      id="new-comment"
                      placeholder="Escribe tu comentario aquí..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button variant="outline" onClick={handleSubmitComment}>
                      <Send className="mr-2 h-4 w-4" />
                      Enviar comentario
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PlanificacionesAsignadoProfesor;


