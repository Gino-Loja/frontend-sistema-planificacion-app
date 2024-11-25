import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function Metricas({ value, title, descripcion, size="text-6xl" }: { value: string, title: string, descripcion: string, size?: string }) {
    return (
        <Card className="text-center">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-2">
                <div className={`${size} font-bold`}>{value}</div>
                <p className="text-xs text-muted-foreground">
                    {descripcion}
                </p>
            </CardContent>
        </Card>

    )
}