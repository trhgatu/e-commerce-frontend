import * as React from "react";
import { IBrand } from "@/types/brand"
import { SkeletonTableRows } from "@/components/SkeletonTableRows";
import {
    ColumnDef,
    getCoreRowModel,
    useReactTable,
    flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface BrandTableProps {
    data: IBrand[];
    onEdit?: (brand: IBrand) => void;
    onDelete?: (brand: IBrand) => void;
    onShow?: (brand: IBrand) => void;
    loading?: boolean;
    pagination?: {
        pageIndex: number;
        pageCount: number;
        onPageChange: (index: number) => void;
    };
}

export const BrandTable: React.FC<BrandTableProps> = ({
    data,
    onEdit,
    onDelete,
    loading,
    pagination,
}) => {
    const columns: ColumnDef<IBrand>[] = [
        {
            accessorKey: "name",
            header: "Tên thương hiệu",
        },
        {
            accessorKey: "description",
            header: "Mô tả",
            cell: ({ row }) => row.original.description || "—",
        },
        {
            accessorKey: "logo",
            header: "Logo",
            cell: ({ row }) =>
                row.original.logo ? (
                    <img src={row.original.logo} alt="logo" className="h-8 w-8 rounded" />
                ) : (
                    "—"
                ),
        },
        {
            accessorKey: "createdAt",
            header: "Thời gian tạo",
            cell: ({ row }) =>
                new Date(row.original.createdAt).toLocaleDateString(),
        },
        {
            id: "actions",
            header: "Thao tác",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit?.(row.original)}
                    >
                        Edit
                    </Button>
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDelete?.(row.original)}
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <SkeletonTableRows columnCount={columns.length} thumbnailIndexes={[0]} />
                    ) : table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center">
                                Không có thương hiệu nào.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {pagination && (
                <div className="flex justify-end items-center gap-4 p-4">
                    <span>
                        Page {pagination.pageIndex + 1} of {pagination.pageCount}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => pagination.onPageChange(pagination.pageIndex - 1)}
                        disabled={pagination.pageIndex <= 0}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => pagination.onPageChange(pagination.pageIndex + 1)}
                        disabled={pagination.pageIndex >= pagination.pageCount - 1}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
};
