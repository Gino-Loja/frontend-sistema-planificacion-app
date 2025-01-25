import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Calendar, 
  BookOpen,
  School
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

const institucionData = {
  "NombreInstitucionEducativa": "Unidad Educativa Francisco de Orellana",
  "CodigoAMIE": "22h00144",
  "Zona": "02",
  "Distrito": "22d02",
  "Provincia": "Orellana",
  "Canton": "Francisco de Orellana",
  "Parroquia": "El Coca",
  "Direccion": "Calle Quito y Auca - Barrio Las Américas",
  "Regimen": "Sierra - Amazonía",
  "Sostenimiento": "Fiscal",
  "Jornada": "Matutina/Vespertina",
  "OfertaEducativa": [
    "Inicial",
    "Básica Media",
    "Básica Superior",
    "Bachillerato en Ciencias",
    "Bachillerato Técnico Informática"
  ],
  "Rector": "Manchay Castillo Guido Antonio",
  "Telefono": "0985976681",
  "CorreoElectronico": "uefo22h00144@gmail.com"
}
 
export default function HoverCardBanner() {
  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <Button 
          className="text-xl text-wrap font-semibold tracking-tight" 
          variant="link"
        >
          Planificación
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-[400px] ml-2">
        <div className="space-y-4">
          {/* Encabezado */}
          <div className="space-y-1">
            <h4 className="text-lg font-semibold text-center">
              {institucionData.NombreInstitucionEducativa}
            </h4>
            <div className="flex items-center justify-center text-sm text-muted-foreground gap-1">
              <Building2 className="h-4 w-4" />
              <span>Código AMIE: {institucionData.CodigoAMIE}</span>
            </div>
          </div>

          {/* Ubicación */}
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
              <div>
                <p>{institucionData.Direccion}</p>
                <p>{`${institucionData.Parroquia}, ${institucionData.Canton}, ${institucionData.Provincia}`}</p>
                <p className="text-muted-foreground">{`Zona ${institucionData.Zona} - Distrito ${institucionData.Distrito}`}</p>
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              <span>Rector: {institucionData.Rector}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4" />
              <span>{institucionData.Telefono}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4" />
              <span>{institucionData.CorreoElectronico}</span>
            </div>
          </div>

          {/* Detalles Institucionales */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span>Jornada: {institucionData.Jornada}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <School className="h-4 w-4" />
              <span>Régimen: {institucionData.Regimen}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4" />
              <div className="flex flex-wrap gap-1">
                <span>Oferta Educativa:</span>
                {institucionData.OfertaEducativa.map((oferta, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800"
                  >
                    {oferta}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}