import * as React from "react";
import { IColor } from "@/types";
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

interface ColorTableProps {
  data: IColor[];
  onEdit?: (color: IColor) => void;
  onDelete?: (color: IColor) => void;
  onShow?: (color: IColor) => void;
  loading?: boolean;
  pagination?: {
    pageIndex: number;
    pageCount: number;
    onPageChange: (index: number) => void;
  };
  actionRenderer?: (product: IColor) => React.ReactNode;
}

export const ColorTable: React.FC<ColorTableProps> = ({
  data,
  loading,
  onEdit,
  onShow,
  onDelete,
  actionRenderer,
  pagination,
}) => {
  const columns: ColumnDef<IColor>[] = [
    {
      accessorKey: "name",
      header: "Color Name",
    },
    {
      accessorKey: "hexCode",
      header: "Hex Code",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded border"
            style={{ backgroundColor: row.original.hexCode }}
          />
          <span>{row.original.hexCode}</span>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => row.original.description || "—",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "Actions",
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
                No colors found.
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
