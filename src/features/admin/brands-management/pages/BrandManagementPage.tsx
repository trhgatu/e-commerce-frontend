import { useState, useEffect } from "react"
import {
  Spin,
  Card,
  Space,
  Button
} from 'antd';
import { Badge } from "@/components/ui/badge";
import { IBrand } from "@/types";
import { BrandTable } from "@/features/admin/brands-management/components/BrandTable";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/ComfirmDeleteDialog";
import ROUTERS from "@/constants/routes";
import { deleteBrandById, getAllBrands } from "@/features/admin/brands-management/services/brandService";
import {
  Trash2,
  Plus,
  Building2,
  Download,
  RefreshCw
} from "lucide-react";
import { SearchInput } from "@/components/common/searchInput";
import StatusFilter from "@/components/StatusFilter";

export const BrandManagementPage = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState<IBrand[]>([])
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [brandToDelete, setBrandToDelete] = useState<IBrand | null>(null);
  const [filteredBrands, setFilteredBrands] = useState<IBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const res = await getAllBrands(page + 1, 10, {
          isDeleted: false
        });
        setBrands(res.data);
        setPageCount(res.totalPages);
      } catch (err) {
        console.log(err)
        toast.error("Lỗi khi tải danh sách thương hiệu");
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, [page]);

  useEffect(() => {
    let filtered = brands;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(brand => {
        if (statusFilter === 'active') return brand.isActive;
        if (statusFilter === 'inactive') return !brand.isActive;
        return true;
      });
    }

    setFilteredBrands(filtered);
  }, [brands, statusFilter]);

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
  };

  const clearFilters = () => {
    setStatusFilter('all');
  };

  const handleSearch = async (query: string) => {
    setSearchTerm(query);
    setLoading(true);
    try {
      const res = await getAllBrands(1, 10, {
        search: query,
        isDeleted: false
      });
      setBrands(res.data);
      setFilteredBrands(res.data);
      setPageCount(res.totalPages);
      setPage(0);
    } catch (err) {
      console.log(err);
      toast.error("Lỗi khi tìm kiếm thương hiệu");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const res = await getAllBrands(page + 1, 10, {
        isDeleted: false
      });
      setBrands(res.data);
      setPageCount(res.totalPages);
      toast.success("Đã làm mới danh sách thương hiệu");
    } catch (err) {
      console.log(err);
      toast.error("Lỗi khi làm mới danh sách");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (brandToDelete) {
      try {
        await deleteBrandById(brandToDelete._id);
        setBrands((prev) => prev.filter((b) => b._id !== brandToDelete._id));
        toast.success("Xóa thương hiệu thành công");
      } catch {
        toast.error("Xóa thương hiệu thất bại");
      }
    }
  };

  return (
    <div className="p-6">
      <Card className="shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <div>
            <p className="text-2xl font-semibold">
              Quản lý thương hiệu
            </p>
            <p className="text-gray-600 mt-1">
              Quản lý toàn bộ thương hiệu sản phẩm trong hệ thống
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
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Space className="flex-shrink-0">
              <div className="md:col-span-2 lg:col-span-1">
                {/* Nội dung nếu có */}
              </div>
              <SearchInput
                placeholder="Tìm kiếm theo tên thương hiệu..."
                onSearch={handleSearch}
              />
              <div>
                <StatusFilter
                  value={statusFilter}
                  onChange={handleStatusFilter}
                />
              </div>
              <Button
                onClick={clearFilters}
                variant="solid"
                color="primary"
                className="w-full md:w-auto"
                style={{ width: '150px' }}
              >
                Xóa bộ lọc
              </Button>
            </Space>
          </div>

          <Space className="flex-shrink-0">
            <Button
              onClick={() => navigate(ROUTERS.ADMIN.brands.trash)}
              variant="dashed"
              color="danger"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Thùng rác
            </Button>
            <Button
              onClick={() => navigate(ROUTERS.ADMIN.brands.create)}
              color="default"
              variant="solid"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm thương hiệu
            </Button>
          </Space>
        </div>

        <div className="flex items-center justify-between">
          {searchTerm && (
            <Badge variant="secondary" className="text-xs">
              Kết quả cho: "{searchTerm}"
            </Badge>
          )}
        </div>

        <div className="p-0">
          <Spin spinning={loading}
            tip="Đang tải danh sách thương hiệu..."
          >
            <div className="overflow-x-auto">
              <BrandTable
                data={filteredBrands}
                onShow={(brand) => navigate(ROUTERS.ADMIN.brands.show(brand._id))}
                onEdit={(brand) => navigate(ROUTERS.ADMIN.brands.edit(brand._id))}
                onDelete={(brand) => setBrandToDelete(brand)}
                pagination={{
                  pageIndex: page,
                  pageCount: pageCount,
                  onPageChange: setPage,
                }}
              />
            </div>
          </Spin>

          {!loading && brands.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Building2 className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? "Không tìm thấy thương hiệu" : "Chưa có thương hiệu nào"}
              </h3>
              <p className="text-gray-600 text-center mb-6 max-w-md">
                {searchTerm
                  ? `Không tìm thấy thương hiệu nào phù hợp với từ khóa "${searchTerm}". Thử tìm kiếm với từ khóa khác.`
                  : "Bắt đầu bằng cách thêm thương hiệu đầu tiên vào hệ thống."
                }
              </p>
              {searchTerm ? (
                <Button
                  onClick={() => {
                    clearFilters();
                    handleSearch("");
                  }}
                >
                  Xóa bộ lọc
                </Button>
              ) : (
                <Button onClick={() => navigate(ROUTERS.ADMIN.brands.create)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm thương hiệu đầu tiên
                </Button>
              )}
            </div>
          )}
        </div>

        <ConfirmDeleteDialog
          open={!!brandToDelete}
          itemName={brandToDelete?.name || ""}
          onCancel={() => setBrandToDelete(null)}
          onConfirm={confirmDelete}
        />
      </Card>
    </div>
  );
};