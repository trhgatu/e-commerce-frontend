import * as React from "react";
import { IRole } from "@/types";
import {
    ColumnDef,
    getCoreRowModel,
    useReactTable,
    flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { PaginationControls } from "@/components/PaginationControls";
import { SkeletonTableRows } from "@/components/SkeletonTableRows";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface RoleTableProps {
    data: IRole[];
    onEdit?: (role: IRole) => void;
    onDelete?: (role: IRole) => void;
    loading?: boolean
    pagination?: {
        pageIndex: number;
        pageCount: number;
        onPageChange: (index: number) => void;
    };
    onShow?: (role: IRole) => void;
    actionRenderer?: (role: IRole) => React.ReactNode;
}

export const RoleTable: React.FC<RoleTableProps> = ({
    data,
    loading,
    onEdit,
    onDelete,
    onShow,
    pagination,
    actionRenderer,
}) => {
    const columns: ColumnDef<IRole>[] = [
        {
            accessorKey: "name",
            header: "Tên vai trò",
        },
        {
            accessorKey: "description",
            header: "Mô tả"
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
            cell: ({ row }) =>
                actionRenderer ? actionRenderer(row.original)
                    : (
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onEdit?.(row.original)}
                            >
                                Sửa
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onShow?.(row.original)}

                            >Chi tiết</Button>

                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => onDelete?.(row.original)}
                            >
                                Xóa
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
        <div>
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
                                    Không có sản phẩm nào.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>

                </Table>
            </div>
            {pagination && (
                <PaginationControls
                    pageIndex={pagination.pageIndex}
                    pageCount={pagination.pageCount}
                    onPageChange={pagination.onPageChange}
                />
            )}
        </div>
    );
};
