import { Card, CardHeader, CardContent } from "@/components/ui/card";

const CardSkeleton: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="w-1/3 h-4 bg-gray-300 rounded" />
        <div className="h-4 w-4 bg-gray-300 rounded" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="w-1/2 h-12 bg-gray-300 rounded" />
        <div className="w-3/4 h-4 bg-gray-200 rounded" />
      </CardContent>
    </Card>
  );
};

export default CardSkeleton;
