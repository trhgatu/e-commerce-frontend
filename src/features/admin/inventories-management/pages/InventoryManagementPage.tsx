// src/features/admin/inventory-management/pages/InventoryManagementPage.tsx
import { useState, useEffect } from "react";
import {
  Spin,
  Card,
  Space,
  Button
} from 'antd';

import { IInventory } from "@/types";
import { InventoryTable } from "@/features/admin/inventories-management/components";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/ComfirmDeleteDialog";
import ROUTERS from "@/constants/routes";
import { getAllInventories, deleteInventoryById } from "@/features/admin/inventories-management/services/inventoryService";
import {
  Trash2,
  Plus,
  Package,
  Download,
  RefreshCw
} from "lucide-react";
import { SearchInput } from "@/components/common/SearchInput";

export const InventoryManagementPage = () => {
  const navigate = useNavigate();
  const [inventories, setInventories] = useState<IInventory[]>([]);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [inventoryToDelete, setInventoryToDelete] = useState<IInventory | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventories = async () => {
      setLoading(true);
      try {
        const res = await getAllInventories(page + 1, 10, {
          isDeleted: false
        });
        setInventories(res.data);
        setPageCount(res.totalPages);
      } catch (err) {
        console.log(err);
        toast.error("Lỗi khi tải danh sách tồn kho");
      } finally {
        setLoading(false);
      }
    };
    fetchInventories();
  }, [page]);

  const handleSearch = async (query: string) => {
    setSearchTerm(query);
    setLoading(true);
    try {
      const res = await getAllInventories(1, 10, {
        search: query,
        isDeleted: false
      });
      setInventories(res.data);
      setPageCount(res.totalPages);
      setPage(0);
    } catch (err) {
      console.log(err);
      toast.error("Lỗi khi tìm kiếm tồn kho");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const res = await getAllInventories(page + 1, 10);
      console.log(res.data)
      setInventories(res.data);
      setPageCount(res.totalPages);
      toast.success("Đã làm mới danh sách tồn kho");
    } catch (err) {
      console.log(err);
      toast.error("Lỗi khi làm mới danh sách");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (inventoryToDelete) {
      try {
        await deleteInventoryById(inventoryToDelete._id);
        setInventories((prev) => prev.filter((i) => i._id !== inventoryToDelete._id));
        toast.success("Xóa tồn kho thành công");
      } catch {
        toast.error("Xóa tồn kho thất bại");
      }
    }
  };

  return (
    <div className="p-6">
      <Card className="shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <div>
            <p className="text-2xl font-semibold">Quản lý tồn kho</p>
            <p className="text-gray-600 mt-1">
              Theo dõi và cập nhật thông tin kho hàng trong hệ thống
            </p>
          </div>
          <Space className="flex-shrink-0">
            <Button
              onClick={handleRefresh}
              disabled={loading}
              variant="solid"
              color="primary"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Xuất Excel
            </Button>
          </Space>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <SearchInput
            placeholder="Tìm kiếm theo tên sản phẩm..."
            onSearch={handleSearch}
          />
          <Space className="flex-shrink-0">
            <Button
              onClick={() => navigate(ROUTERS.ADMIN.inventories.trash)}
              variant="dashed"
              color="danger"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Thùng rác
            </Button>
            <Button
              onClick={() => navigate(ROUTERS.ADMIN.inventories.create)}
              color="default"
              variant="solid"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm tồn kho
            </Button>
          </Space>
        </div>

        <div className="p-0">
          <Spin spinning={loading} tip="Đang tải danh sách tồn kho...">
            <div className="overflow-x-auto">
              <InventoryTable
                data={inventories}
                onShow={(item) => navigate(ROUTERS.ADMIN.inventories.show(item._id))}
                onEdit={(item) => navigate(ROUTERS.ADMIN.inventories.edit(item._id))}
                onDelete={(item) => setInventoryToDelete(item)}
                pagination={{
                  pageIndex: page,
                  pageCount: pageCount,
                  onPageChange: setPage,
                }}
              />
            </div>
          </Spin>
        </div>

        {!loading && inventories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <Package className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? "Không tìm thấy tồn kho" : "Chưa có tồn kho nào"}
            </h3>
            <p className="text-gray-600 text-center mb-6 max-w-md">
              {searchTerm
                ? `Không tìm thấy tồn kho nào phù hợp với từ khóa "${searchTerm}". Thử tìm lại với từ khóa khác.`
                : "Bắt đầu bằng cách thêm tồn kho đầu tiên vào hệ thống."}
            </p>
            <Button onClick={() => navigate(ROUTERS.ADMIN.inventories.create)}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm tồn kho
            </Button>
          </div>
        )}

        <ConfirmDeleteDialog
          open={!!inventoryToDelete}
          itemName={inventoryToDelete?.productId?.name || ""}
          onCancel={() => setInventoryToDelete(null)}
          onConfirm={confirmDelete}
        />
      </Card>
    </div>
  );
};