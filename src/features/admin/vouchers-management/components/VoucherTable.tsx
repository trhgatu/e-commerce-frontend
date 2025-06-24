// src/features/admin/vouchers-management/components/VoucherTable.tsx
import * as React from "react";
import { IVoucher } from "@/types";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
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

import { Tooltip, Space, Button } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
interface VoucherTableProps {
  data: IVoucher[];
  loading?: boolean;
  onEdit?: (voucher: IVoucher) => void;
  onDelete?: (voucher: IVoucher) => void;
  onShow?: (voucher: IVoucher) => void;
  pagination?: {
    pageIndex: number;
    pageCount: number;
    onPageChange: (index: number) => void;
  };
  actionRenderer?: (voucher: IVoucher) => React.ReactNode;
}

export const VoucherTable: React.FC<VoucherTableProps> = ({
  data,
  loading,
  onEdit,
  onDelete,
  onShow,
  pagination,
  actionRenderer,
}) => {
  const columns: ColumnDef<IVoucher>[] = [
    {
      accessorKey: "code",
      header: "Mã voucher",
    },
    {
      accessorKey: "type",
      header: "Loại",
      cell: ({ row }) =>
        row.original.type === "percentage" ? "Phần trăm" : "Cố định",
    },
    {
      accessorKey: "value",
      header: "Giá trị",
      cell: ({ row }) =>
        row.original.type === "percentage"
          ? `${row.original.value}%`
          : `${row.original.value.toLocaleString()}₫`,
    },
    {
      accessorKey: "minOrderValue",
      header: "Tối thiểu đơn hàng",
      cell: ({ row }) => `${row.original.minOrderValue.toLocaleString()}₫`,
    },
    {
      accessorKey: "usageLimit",
      header: "Giới hạn lượt dùng",
    },
    {
      accessorKey: "usageCount",
      header: "Đã dùng",
    },
    {
      accessorKey: "startDate",
      header: "Ngày bắt đầu",
      cell: ({ row }) =>
        new Date(row.original.startDate).toLocaleDateString("vi-VN"),
    },
    {
      accessorKey: "endDate",
      header: "Ngày kết thúc",
      cell: ({ row }) =>
        new Date(row.original.endDate).toLocaleDateString("vi-VN"),
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
              <SkeletonTableRows columnCount={columns.length} />
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  Không có voucher nào.
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
