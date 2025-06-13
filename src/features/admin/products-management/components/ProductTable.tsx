import * as React from "react";
import { IProduct, ProductStatus } from "@/types";
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
import { Badge, Tooltip, Space, Button, Image } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";

interface ProductTableProps {
  data: IProduct[];
  onEdit?: (product: IProduct) => void;
  onDelete?: (product: IProduct) => void;
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
  onEdit,
  onDelete,
  onShow,
  pagination,
  actionRenderer,
}) => {
  const columns: ColumnDef<IProduct>[] = [
    {
      accessorKey: "thumbnail",
      header: "Ảnh bìa",
      cell: ({ row }) =>
        row.original.thumbnail ? (
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <Image
              src={row.original.thumbnail}
              alt={row.original.name}
              width={60}
              height={60}
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        ) : (
          "—"
        ),
    },
    {
      accessorKey: "name",
      header: "Tên sản phẩm",
    },
    {
      accessorKey: "price",
      header: "Giá",
      cell: ({ row }) =>
        row.original.price.toLocaleString("en-US", {
          style: "currency",
          currency: "VND",
        }),
    },
    {
      accessorKey: "totalStock",
      header: "Kho",
    },
    {
      accessorKey: "isFeatured",
      header: "Nổi bật",
      cell: ({ row }) => (row.original.isFeatured ? "Yes" : "No"),
    },
    {
      accessorKey: "categoryId.name",
      header: "Danh mục",
      cell: ({ row }) =>
        row.original.categoryId?.name || "—",
    },
    {
      accessorKey: "brandId.name",
      header: "Thương hiệu",
      cell: ({ row }) =>
        row.original.brandId?.name || "—",
    },
    {
      accessorKey: "images",
      header: "Thư viện ảnh",
      cell: ({ row }) =>
        row.original.images?.length ? (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Image.PreviewGroup>
              {row.original.images.map((url: string, idx: number) => (
                <Image
                  key={idx}
                  src={url}
                  alt={`img-${idx}`}
                  width={48}
                  height={48}
                  preview={{ maskClassName: "custom-preview-mask" }}
                  style={{
                    objectFit: "cover",
                    borderRadius: 4,
                    border: "1px solid #f0f0f0",
                  }}
                />
              ))}
            </Image.PreviewGroup>
          </div>
        ) : (
          "—"
        ),
    },
    {
      accessorKey: "availableColors",
      header: "Màu sắc",
      cell: ({ row }) =>
        row.original.availableColors?.length ? (
          <div className="flex gap-1 flex-wrap">
            {row.original.availableColors.map((color, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1 text-xs px-1 py-0.5 border rounded"
                title={color.name}
              >
                <span>{color.name}</span>
                <div
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: color.hexCode || "#ccc" }}
                />
              </div>
            ))}
          </div>
        ) : (
          "—"
        ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status: ProductStatus = row.original.status ?? ProductStatus.DRAFT;

        const getStatusColor = (status: ProductStatus): "success" | "error" | "warning" | "default" => {
          switch (status) {
            case ProductStatus.ACTIVE:
              return "success";
            case ProductStatus.INACTIVE:
              return "error";
            case ProductStatus.DRAFT:
              return "warning";
            case ProductStatus.OUT_OF_STOCK:
            case ProductStatus.DISCONTINUED:
              return "error";
            default:
              return "default";
          }
        };

        const getStatusLabel = (status: ProductStatus) => {
          switch (status) {
            case ProductStatus.ACTIVE:
              return "Hoạt động";
            case ProductStatus.INACTIVE:
              return "Ngưng hoạt động";
            case ProductStatus.DRAFT:
              return "Bản nháp";
            case ProductStatus.OUT_OF_STOCK:
              return "Hết hàng";
            case ProductStatus.DISCONTINUED:
              return "Ngừng bán";
            default:
              return "Không xác định";
          }
        };

        return (
          <Badge
            status={getStatusColor(status)}
            text={getStatusLabel(status)}
          />
        );
      },
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
