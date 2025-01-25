import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const TableSkeleton: React.FC = () => {
    return (
        <div className="rounded-md border">
            <Table className="scroll-container min-w-0">
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            <Skeleton className="h-4  rounded w-1/3"></Skeleton>
                        </TableHead>
                        <TableHead>
                            <Skeleton className="h-4  rounded w-1/4"></Skeleton>
                        </TableHead>
                        <TableHead>
                            <Skeleton className="h-4  rounded w-1/4"></Skeleton>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(5)].map((_, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Skeleton className="h-6  rounded w-full"></Skeleton>
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-6  rounded w-full"></Skeleton>
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-6  rounded w-full"></Skeleton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};