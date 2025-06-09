import { useState, useEffect } from "react"
import {
  Spin,
  Card,
  Space,
  Button
} from 'antd';
import { Badge } from "@/components/ui/badge";
import { IRole } from "@/types";
import { RoleTable } from "@/features/admin/roles-management/components/RoleTable";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/ComfirmDeleteDialog";
import ROUTERS from "@/constants/routes";
import { getAllRoles, softDeleteRoleById } from "@/features/admin/roles-management/services/roleService";
import {
  Trash2,
  Plus,
  Shield,
  Download,
  RefreshCw
} from "lucide-react";
import { SearchInput } from "@/components/common/SearchInput";
import StatusFilter from "@/components/StatusFilter";

export const RoleManagementPage = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<IRole[]>([])
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [roleToDelete, setRoleToDelete] = useState<IRole | null>(null);
  const [filteredRoles, setFilteredRoles] = useState<IRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const res = await getAllRoles(page + 1, 10, {
          isDeleted: false
        });
        setRoles(res.data);
        setPageCount(res.totalPages);
      } catch (err) {
        console.log(err)
        toast.error("Lỗi khi tải danh sách vai trò");
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, [page]);

  useEffect(() => {
    let filtered = roles;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(role => {
        if (statusFilter === 'active') return role.isActive;
        if (statusFilter === 'inactive') return !role.isActive;
        return true;
      });
    }

    setFilteredRoles(filtered);
  }, [roles, statusFilter]);

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setSearchTerm("");
  };

  const handleSearch = async (query: string) => {
    setSearchTerm(query);
    setLoading(true);
    try {
      const res = await getAllRoles(1, 10, {
        search: query,
        isDeleted: false
      });
      setRoles(res.data);
      setFilteredRoles(res.data);
      setPageCount(res.totalPages);
      setPage(0);
    } catch (err) {
      console.log(err);
      toast.error("Lỗi khi tìm kiếm vai trò");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const res = await getAllRoles(page + 1, 10, {
        isDeleted: false
      });
      setRoles(res.data);
      setPageCount(res.totalPages);
      toast.success("Đã làm mới danh sách vai trò");
    } catch (err) {
      console.log(err);
      toast.error("Lỗi khi làm mới danh sách");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (roleToDelete) {
      try {
        await softDeleteRoleById(roleToDelete._id);
        setRoles((prev) => prev.filter((r) => r._id !== roleToDelete._id));
        toast.success("Xóa vai trò thành công");
      } catch {
        toast.error("Xóa vai trò thất bại");
      }
    }
  };

  return (
    <div className="p-6">
      <Card className="shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <div>
            <p className="text-2xl font-semibold">
              Quản lý vai trò
            </p>
            <p className="text-gray-600 mt-1">
              Quản lý toàn bộ vai trò trong hệ thống
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
                placeholder="Tìm kiếm theo tên vai trò..."
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
              onClick={() => navigate(ROUTERS.ADMIN.roles.trash)}
              variant="dashed"
              color="danger"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Thùng rác
            </Button>
            <Button
              onClick={() => navigate(ROUTERS.ADMIN.roles.create)}
              color="default"
              variant="solid"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm vai trò
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
            tip="Đang tải danh sách vai trò..."
          >
            <div className="overflow-x-auto">
              <RoleTable
                data={filteredRoles}
                onShow={(role) => navigate(ROUTERS.ADMIN.roles.show(role._id))}
                onEdit={(role) => navigate(ROUTERS.ADMIN.roles.edit(role._id))}
                onDelete={(role) => setRoleToDelete(role)}
                pagination={{
                  pageIndex: page,
                  pageCount: pageCount,
                  onPageChange: setPage,
                }}
              />
            </div>
          </Spin>

          {!loading && roles.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Shield className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? "Không tìm thấy vai trò" : "Chưa có vai trò nào"}
              </h3>
              <p className="text-gray-600 text-center mb-6 max-w-md">
                {searchTerm
                  ? `Không tìm thấy vai trò nào phù hợp với từ khóa "${searchTerm}". Thử tìm kiếm với từ khóa khác.`
                  : "Bắt đầu bằng cách thêm vai trò đầu tiên vào hệ thống."
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
                <Button onClick={() => navigate(ROUTERS.ADMIN.roles.create)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm vai trò đầu tiên
                </Button>
              )}
            </div>
          )}
        </div>

        <ConfirmDeleteDialog
          open={!!roleToDelete}
          itemName={roleToDelete?.name || ""}
          onCancel={() => setRoleToDelete(null)}
          onConfirm={confirmDelete}
        />
      </Card>
    </div>
  );
};