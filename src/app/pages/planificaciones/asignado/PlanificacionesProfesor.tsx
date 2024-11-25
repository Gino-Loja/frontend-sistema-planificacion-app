import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Upload, Send, FileUp } from 'lucide-react';

const PlanificacionesAsignadoProfesor = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Juan Pérez",
      date: "2024-11-24T10:30:00Z",
      content: "Por favor revisar la sección de evaluación",
    },
    {
      id: 2,
      author: "Gino Loja",
      date: "2024-11-24T11:45:00Z",
      content: "Contenido actualizado según las observaciones",
    }
  ]);

  const planningData = {
    "id": 8,
    "titulo": "test3",
    "descripcion": "test45",
    "fecha_subida": "2024-11-21T00:00:00Z",
    "profesor_nombre": "Juan Pérez",
    "periodo_nombre": "Test",
    "asignatura_nombre": "Física",
    "area_nombre": "MATEMÁTICA",
    "area_codigo": "MAT",
    "profesor_aprobador_nombre": "Juan Pérez",
    "profesor_revisor_nombre": "Gino Loja",
    "fecha_de_actualizacion": "2024-11-25",
    "estado": null,
    "comentario": null
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Por favor, seleccione un archivo PDF válido');
    }
  };

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: "Usuario Actual",
        date: new Date().toISOString(),
        content: newComment
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  return (
    <div className="container flex h-full min-h-screen gap-6 py-4">
      {/* PDF Viewer Section */}
      <div className="w-1/2 rounded-lg border bg-card">
        <div className="flex h-full flex-col">
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Vista previa del documento</h3>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  id="pdf-upload"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                 // onClick={() => document.getElementById('pdf-upload').click()}
                >
                  <FileUp className="mr-2 h-4 w-4" />
                  Subir PDF
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-muted p-4">
            {selectedFile ? (
            //   <Alert>
            //     <AlertDescription>
            //       Archivo seleccionado: {selectedFile.name}
            //     </AlertDescription>
            //   </Alert>
            <div>s</div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed">
                <Upload className="mb-4 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Sube un archivo PDF para visualizarlo</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="w-1/2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{planningData.titulo}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Detalles de la planificación</h4>
                <Separator />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Asignatura:</p>
                    <p className="text-muted-foreground">{planningData.asignatura_nombre}</p>
                  </div>
                  <div>
                    <p className="font-medium">Área:</p>
                    <p className="text-muted-foreground">{planningData.area_nombre} ({planningData.area_codigo})</p>
                  </div>
                  <div>
                    <p className="font-medium">Profesor:</p>
                    <p className="text-muted-foreground">{planningData.profesor_nombre}</p>
                  </div>
                  <div>
                    <p className="font-medium">Periodo:</p>
                    <p className="text-muted-foreground">{planningData.periodo_nombre}</p>
                  </div>
                  <div>
                    <p className="font-medium">Fecha de subida:</p>
                    <p className="text-muted-foreground">{formatDate(planningData.fecha_subida)}</p>
                  </div>
                  <div>
                    <p className="font-medium">Última actualización:</p>
                    <p className="text-muted-foreground">{formatDate(planningData.fecha_de_actualizacion)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Revisión</h4>
                <Separator />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Revisor:</p>
                    <p className="text-muted-foreground">{planningData.profesor_revisor_nombre}</p>
                  </div>
                  <div>
                    <p className="font-medium">Aprobador:</p>
                    <p className="text-muted-foreground">{planningData.profesor_aprobador_nombre}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Descripción</h4>
                <Separator />
                <p className="text-sm text-muted-foreground">{planningData.descripcion}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Comentarios existentes</h4>
                  <Separator className="my-2" />
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <Card key={comment.id}>
                        <CardContent className="pt-4">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{comment.author}</span>
                            <span className="text-muted-foreground">{formatDate(comment.date)}</span>
                          </div>
                          <p className="mt-2 text-sm">{comment.content}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment">Nuevo comentario</Label>
                  <Textarea
                    id="comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ingrese sus comentarios sobre la planificación..."
                    className="min-h-[100px]"
                  />
                  <Button 
                    className="w-full" 
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim()}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Enviar comentario
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlanificacionesAsignadoProfesor;