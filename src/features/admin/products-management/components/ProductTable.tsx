import * as React from "react";
import { IProduct } from "@/types";
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

interface ProductTableProps {
  data: IProduct[];
  onEdit?: (product: IProduct) => void;
  onDelete?: (product: IProduct) => void;
  loading?: boolean
  pagination?: {
    pageIndex: number;
    pageCount: number;
    onPageChange: (index: number) => void;
  };
  onShow?: (producrt: IProduct) => void;
  actionRenderer?: (product: IProduct) => React.ReactNode;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  data,
  loading,
  onEdit,
  onDelete,
  onShow,
  pagination,
  actionRenderer,
}) => {
  const columns: ColumnDef<IProduct>[] = [
    {
      accessorKey: "thumbnail",
      header: "Image",
      cell: ({ row }) =>
        row.original.thumbnail ? (
          <img
            src={row.original.thumbnail}
            alt={row.original.name}
            className="h-10 w-10 object-cover rounded"
          />
        ) : (
          "—"
        ),
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) =>
        row.original.price.toLocaleString("en-US", {
          style: "currency",
          currency: "VND",
        }),
    },
    {
      accessorKey: "stock",
      header: "Stock",
    },
    {
      accessorKey: "isFeatured",
      header: "Featured",
      cell: ({ row }) => (row.original.isFeatured ? "Yes" : "No"),
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
                  No products found.
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
