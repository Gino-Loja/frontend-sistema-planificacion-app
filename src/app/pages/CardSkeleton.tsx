import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CardSkeleton: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="w-1/3 h-4 " />
        <Skeleton className="h-4 w-4 " />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="w-1/2 h-12 " />
        <Skeleton className="w-3/4 h-4 " />
      </CardContent>
    </Card>
  );
};

export default CardSkeleton;
