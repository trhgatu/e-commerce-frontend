import { useState, useEffect } from "react"
import {
  Spin,
  Card,
  Space,
  Button
} from 'antd';
import { Badge } from "@/components/ui/badge";
import { ICategory } from "@/types";
import { CategoryTable } from "@/features/admin/categories-management/components/CategoryTable";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/ComfirmDeleteDialog";
import ROUTERS from "@/constants/routes";
import { softDeleteCategoryById, getAllCategories } from "@/features/admin/categories-management/services/categoryService";
import {
  Trash2,
  Plus,
  FolderOpen,
  Download,
  RefreshCw
} from "lucide-react";
import { SearchInput } from "@/components/common/SearchInput";
import StatusFilter from "@/components/StatusFilter";

export const CategoryManagementPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ICategory[]>([])
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [categoryToDelete, setCategoryToDelete] = useState<ICategory | null>(null);
  const [filteredCategories, setFilteredCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await getAllCategories(page + 1, 10, {
          isDeleted: false
        });
        setCategories(res.data);
        setPageCount(res.totalPages);
      } catch (err) {
        console.log(err)
        toast.error("Lỗi khi tải danh sách danh mục");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [page]);

  useEffect(() => {
    let filtered = categories;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(category => {
        if (statusFilter === 'active') return category.status === 'active';
        if (statusFilter === 'inactive') return !category.status || category.status === 'inactive';
        return true;
      });
    }

    setFilteredCategories(filtered);
  }, [categories, statusFilter]);

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
      const res = await getAllCategories(1, 10, {
        search: query,
        isDeleted: false
      });
      setCategories(res.data);
      setFilteredCategories(res.data);
      setPageCount(res.totalPages);
      setPage(0);
    } catch (err) {
      console.log(err);
      toast.error("Lỗi khi tìm kiếm danh mục");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const res = await getAllCategories(page + 1, 10, {
        isDeleted: false
      });
      setCategories(res.data);
      setPageCount(res.totalPages);
      toast.success("Đã làm mới danh sách danh mục");
    } catch (err) {
      console.log(err);
      toast.error("Lỗi khi làm mới danh sách");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      try {
        await softDeleteCategoryById(categoryToDelete._id);
        setCategories((prev) => prev.filter((c) => c._id !== categoryToDelete._id));
        toast.success("Xóa danh mục thành công");
      } catch {
        toast.error("Xóa danh mục thất bại");
      }
    }
  };

  return (
    <div className="p-6">
      <Card className="shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <div>
            <p className="text-2xl font-semibold">
              Quản lý danh mục
            </p>
            <p className="text-gray-600 mt-1">
              Quản lý toàn bộ danh mục sản phẩm trong hệ thống
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
                placeholder="Tìm kiếm theo tên danh mục..."
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
              onClick={() => navigate(ROUTERS.ADMIN.categories.trash)}
              variant="dashed"
              color="danger"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Thùng rác
            </Button>
            <Button
              onClick={() => navigate(ROUTERS.ADMIN.categories.create)}
              color="default"
              variant="solid"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm danh mục
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
            tip="Đang tải danh sách danh mục..."
          >
            <div className="overflow-x-auto">
              <CategoryTable
                data={filteredCategories}
                onShow={(category) => navigate(ROUTERS.ADMIN.categories.show(category._id))}
                onEdit={(category) => navigate(ROUTERS.ADMIN.categories.edit(category._id))}
                onDelete={(category) => setCategoryToDelete(category)}
                pagination={{
                  pageIndex: page,
                  pageCount: pageCount,
                  onPageChange: setPage,
                }}
              />
            </div>
          </Spin>

          {!loading && categories.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <FolderOpen className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? "Không tìm thấy danh mục" : "Chưa có danh mục nào"}
              </h3>
              <p className="text-gray-600 text-center mb-6 max-w-md">
                {searchTerm
                  ? `Không tìm thấy danh mục nào phù hợp với từ khóa "${searchTerm}". Thử tìm kiếm với từ khóa khác.`
                  : "Bắt đầu bằng cách thêm danh mục đầu tiên vào hệ thống."
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
                <Button onClick={() => navigate(ROUTERS.ADMIN.categories.create)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm danh mục đầu tiên
                </Button>
              )}
            </div>
          )}
        </div>

        <ConfirmDeleteDialog
          open={!!categoryToDelete}
          itemName={categoryToDelete?.name || ""}
          onCancel={() => setCategoryToDelete(null)}
          onConfirm={confirmDelete}
        />
      </Card>
    </div>
  );
};