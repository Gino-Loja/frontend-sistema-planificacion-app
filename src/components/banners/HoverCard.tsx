import { CalendarIcon } from "@radix-ui/react-icons"
 

import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
 
export default function HoverCardBanner() {
  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <Button className="text-xl text-wrap font-semibold tracking-tight" variant="link">Planificacion</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 ml-5">
        <div className="flex justify-between space-x-4">
         
          <div className="space-y-1">
            <h4 className="text-md text-center font-semibold">Unidad Educativa "Francisco de Orellana"</h4>
            <p className="text-sm text-muted-foreground">
                De Puerto Francisco De Orellana, Orellana, Ecuador
            </p>
            <div className="flex items-center pt-2">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                Joined December 2021
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}