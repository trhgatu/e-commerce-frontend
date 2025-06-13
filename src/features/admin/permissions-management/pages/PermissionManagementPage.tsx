import { useState, useEffect } from "react"
import {
  Spin,
  Card,
  Space,
  Button,
  Select
} from 'antd';
import { Badge } from "@/components/ui/badge";
import { IPermission, PermissionFilter } from "@/types/permission";
import { PermissionTable } from "@/features/admin/permissions-management/components/PermissionTable";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/ComfirmDeleteDialog";
import ROUTERS from "@/constants/routes";
import { softDeletePermissionById, getAllPermissions } from "@/features/admin/permissions-management/services/permissionService";
import {
  Trash2,
  Plus,
  Shield,
  Download,
  RefreshCw
} from "lucide-react";
import { SearchInput } from "@/components/common/SearchInput";

const { Option } = Select;

const PERMISSION_GROUPS = [
  "Quản lý người dùng",
  "Quản lý sản phẩm",
  "Quản lý đơn hàng",
  "Quản lý danh mục",
  "Quản lý vai trò",
  "Quản lý quyền",
  "Báo cáo",
  "Cài đặt hệ thống",
  "Khác"
];

export const PermissionManagementPage = () => {
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState<IPermission[]>([])
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [permissionToDelete, setPermissionToDelete] = useState<IPermission | null>(null);
  const [filteredPermissions, setFilteredPermissions] = useState<IPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [groupFilter, setGroupFilter] = useState<string>('all');

  useEffect(() => {
    const fetchPermissions = async () => {
      setLoading(true);
      try {
        const filters: PermissionFilter = {
          isDeleted: false
        };
        if (groupFilter !== 'all') {
          filters.group = groupFilter;
        }
        const res = await getAllPermissions(page + 1, 10, filters);
        setPermissions(res.data);
        setFilteredPermissions(res.data);
        setPageCount(res.totalPages);
      } catch (err) {
        console.log(err)
        toast.error("Lỗi khi tải danh sách quyền");
      } finally {
        setLoading(false);
      }
    };
    fetchPermissions();
  }, [page, groupFilter]);

  const handleGroupFilter = (value: string) => {
    setGroupFilter(value);
  };

  const clearFilters = () => {
    setGroupFilter('all');
    setSearchTerm('');
  };

  const handleSearch = async (query: string) => {
    setSearchTerm(query);
    setLoading(true);
    try {
      const res = await getAllPermissions(1, 10, {
        search: query,
        isDeleted: false
      });
      setPermissions(res.data);
      setFilteredPermissions(res.data);
      setPageCount(res.totalPages);
      setPage(0);
    } catch (err) {
      console.log(err);
      toast.error("Lỗi khi tìm kiếm quyền");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const res = await getAllPermissions(page + 1, 10, { isDeleted: false });
      setPermissions(res.data);
      setPageCount(res.totalPages);
      toast.success("Đã làm mới danh sách quyền");
    } catch (err) {
      console.log(err);
      toast.error("Lỗi khi làm mới danh sách");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (permissionToDelete) {
      try {
        await softDeletePermissionById(permissionToDelete._id);
        setPermissions((prev) => prev.filter((p) => p._id !== permissionToDelete._id));
        toast.success("Xóa quyền thành công");
      } catch {
        toast.error("Xóa quyền thất bại");
      }
    }
  };

  return (
    <div className="p-6">
      <Card className="shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <div>
            <p className="text-2xl font-semibold">
              Quản lý quyền
            </p>
            <p className="text-gray-600 mt-1">
              Quản lý toàn bộ quyền trong hệ thống
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
                placeholder="Tìm kiếm theo tên hoặc nhãn..."
                onSearch={handleSearch}
              />
              <div>
                <Select
                  placeholder="Lọc theo nhóm"
                  value={groupFilter}
                  onChange={handleGroupFilter}
                  style={{ width: 200 }}
                  size="middle"
                >
                  <Option value="all">Tất cả nhóm</Option>
                  {PERMISSION_GROUPS.map((group) => (
                    <Option key={group} value={group}>
                      {group}
                    </Option>
                  ))}
                </Select>
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
              onClick={() => navigate(ROUTERS.ADMIN.permissions.trash)}
              variant="dashed"
              color="danger"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Thùng rác
            </Button>
            <Button
              onClick={() => navigate(ROUTERS.ADMIN.permissions.create)}
              color="default"
              variant="solid"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm quyền
            </Button>
          </Space>
        </div>

        <div className="flex items-center justify-between">
          {searchTerm && (
            <Badge variant="secondary" className="text-xs">
              Kết quả cho: "{searchTerm}"
            </Badge>
          )}
          {groupFilter !== 'all' && (
            <Badge variant="outline" className="text-xs ml-2">
              Nhóm: {groupFilter}
            </Badge>
          )}
        </div>

        <div className="p-0">
          <Spin spinning={loading}
            tip="Đang tải danh sách quyền..."
          >
            <div className="overflow-x-auto">
              <PermissionTable
                data={filteredPermissions}
                onShow={(permission) => navigate(ROUTERS.ADMIN.permissions.show(permission._id))}
                onEdit={(permission) => navigate(ROUTERS.ADMIN.permissions.edit(permission._id))}
                onDelete={(permission) => setPermissionToDelete(permission)}
                pagination={{
                  pageIndex: page,
                  pageCount: pageCount,
                  onPageChange: setPage,
                }}
              />
            </div>
          </Spin>

          {!loading && permissions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Shield className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? "Không tìm thấy quyền" : "Chưa có quyền nào"}
              </h3>
              <p className="text-gray-600 text-center mb-6 max-w-md">
                {searchTerm
                  ? `Không tìm thấy quyền nào phù hợp với từ khóa "${searchTerm}". Thử tìm kiếm với từ khóa khác.`
                  : "Bắt đầu bằng cách thêm quyền đầu tiên vào hệ thống."
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
                <Button onClick={() => navigate(ROUTERS.ADMIN.permissions.create)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm quyền đầu tiên
                </Button>
              )}
            </div>
          )}
        </div>

        <ConfirmDeleteDialog
          open={!!permissionToDelete}
          itemName={permissionToDelete?.label || permissionToDelete?.name || ""}
          onCancel={() => setPermissionToDelete(null)}
          onConfirm={confirmDelete}
        />
      </Card>
    </div>
  );
};