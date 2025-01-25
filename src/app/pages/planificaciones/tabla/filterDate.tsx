import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useCustomQueryStates } from "@/app/hooks/useSearchParams"
import { ChevronDown, X } from 'lucide-react'

export default function FiltrosDeFecha() {
  const { setCoordinates, year, mes } = useCustomQueryStates()
  const currentDate = new Date()
  const [selectedDate, setSelectedDate] = useState(currentDate)

  const handleMonthSelect = (month: number) => {
    const newDate = new Date(selectedDate.getFullYear(), month, 1)
    setSelectedDate(newDate)
    setCoordinates({
      mes: (month + 1).toString(),
    })
  }

  const handleYearSelect = (year: number) => {
    const newDate = new Date(year, selectedDate.getMonth(), 1)
    setSelectedDate(newDate)
    setCoordinates({
      year: year.toString()
    })
  }

  const clearFilters = () => {
    const currentDate = new Date()
    setSelectedDate(currentDate)
    setCoordinates({
      mes: null,
      year: null
    })
  }

  const currentMonth = selectedDate.getMonth()
  const currentYear = selectedDate.getFullYear()

  // Generate years from 2023 to the current year
  const years = Array.from({ length: currentDate.getFullYear() - 2023 + 1 }, (_, i) => 2023 + i)

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm"  className="flex items-center gap-2 h-8 border-dashed">
            {new Intl.DateTimeFormat("es-ES", { month: "long" }).format(selectedDate)}
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 max-h-60 overflow-y-auto">
          {Array.from({ length: 12 }, (_, i) => i).map((month) => (
            <DropdownMenuItem
              key={month}
              onSelect={() => handleMonthSelect(month)}
              className={month === currentMonth ? "bg-primary text-primary-foreground" : ""}
            >
              {new Intl.DateTimeFormat("es-ES", { month: "long" }).format(new Date(2023, month, 1))}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size={ "sm" } className="flex items-center gap-2 h-8 border-dashed">
            {currentYear}
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 max-h-60 overflow-y-auto">
          {years.map((year) => (
            <DropdownMenuItem
              key={year}
              onSelect={() => handleYearSelect(year)}
              className={year === currentYear ? "bg-primary text-primary-foreground" : ""}
            >
              {year}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {
        (year || mes) && <Button variant="ghost" onClick={clearFilters} className="flex items-center gap-2">
          <X className="w-4 h-4" />
          Limpiar
        </Button>

      }

    </div>
  )
}

