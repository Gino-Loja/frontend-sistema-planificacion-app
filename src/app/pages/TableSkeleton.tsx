import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const TableSkeleton: React.FC = () => {
    return (
        <div className="rounded-md border">
            <Table className="scroll-container min-w-0">
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                        </TableHead>
                        <TableHead>
                            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                        </TableHead>
                        <TableHead>
                            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(5)].map((_, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <div className="h-6 bg-gray-200 rounded w-full"></div>
                            </TableCell>
                            <TableCell>
                                <div className="h-6 bg-gray-200 rounded w-full"></div>
                            </TableCell>
                            <TableCell>
                                <div className="h-6 bg-gray-200 rounded w-full"></div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};