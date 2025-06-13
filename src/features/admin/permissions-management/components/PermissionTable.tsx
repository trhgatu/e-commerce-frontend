import * as React from "react";
import { IPermission } from "@/types";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";;
import { PaginationControls } from "@/components/PaginationControls";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tooltip, Space, Button } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";

interface PermissionTableProps {
  data: IPermission[];
  onEdit?: (permission: IPermission) => void;
  onDelete?: (permission: IPermission) => void;
  pagination?: {
    pageIndex: number;
    pageCount: number;
    onPageChange: (index: number) => void;
  };
  onShow?: (permission: IPermission) => void;
  actionRenderer?: (permission: IPermission) => React.ReactNode;
}

export const PermissionTable: React.FC<PermissionTableProps> = ({
  data,
  onEdit,
  onDelete,
  onShow,
  pagination,
  actionRenderer,
}) => {
  const columns: ColumnDef<IPermission>[] = [
    {
      accessorKey: "name",
      header: "Tên quyền",
    },
    {
      accessorKey: "label",
      header: "Nhãn",
    },
    {
      accessorKey: "group",
      header: "Nhóm quyền",
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
        actionRenderer ? (
          actionRenderer(row.original)
        ) : (
          <Space size="small">
            <Tooltip title="Xem chi tiết">
              <Button
                type="text"
                icon={<EyeOutlined />}
                size="small"
                onClick={() => onShow?.(row.original)}
              />
            </Tooltip>
            <Tooltip title="Chỉnh sửa">
              <Button
                type="text"
                icon={<EditOutlined />}
                size="small"
                onClick={() => onEdit?.(row.original)}
              />
            </Tooltip>
            <Tooltip title="Xóa">
              <Button
                type="text"
                icon={<DeleteOutlined />}
                danger
                size="small"
                onClick={() => onDelete?.(row.original)}
              />
            </Tooltip>
          </Space>
        ),
    }

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
            {table.getRowModel().rows.length ? (
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
                  Không có quyền nào.
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
