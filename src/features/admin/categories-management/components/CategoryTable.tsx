import * as React from "react";
import { ICategory } from "@/types/";
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
import { PaginationControls } from "@/components/PaginationControls";
import { SkeletonTableRows } from "@/components/SkeletonTableRows";

interface CategoryTableProps {
  data: ICategory[];
  onEdit?: (category: ICategory) => void;
  onDelete?: (category: ICategory) => void;
  onShow?: (category: ICategory) => void;
  pagination?: {
    pageIndex: number;
    pageCount: number;
    onPageChange: (index: number) => void;
  };
  loading?: boolean;
  actionRenderer?: (category: ICategory) => React.ReactNode;
}

export const CategoryTable: React.FC<CategoryTableProps> = ({
  data,
  loading,
  onEdit,
  onShow,
  onDelete,
  pagination,
  actionRenderer
}) => {
  const columns: ColumnDef<ICategory>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "description",
      header: "Mô tả",
      cell: ({ row }) => row.original.description || "—",
    },
    {
      accessorKey: "icon",
      header: "Icon",
      cell: ({ row }) => row.original.icon || "—",
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
          :
          (
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
              >
                Xem
              </Button>
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading ? (
            <SkeletonTableRows columnCount={columns.length} />
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
                No categories found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

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
