import { useState, useEffect } from "react"
import {
  Spin,
  Card,
  Space,
  Button
} from 'antd';
import { Badge } from "@/components/ui/badge";
import { IUser } from "@/types";
import { UserTable } from "@/features/admin/users-management/components/UserTable";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/ComfirmDeleteDialog";
import ROUTERS from "@/constants/routes";
import { getAllUsers, softDeleteUserById } from "@/features/admin/users-management/services/userService";
import {
  Trash2,
  Plus,
  Users,
  Download,
  RefreshCw
} from "lucide-react";
import StatusFilter from "@/components/StatusFilter";
import { SearchInput } from "@/components/common/SearchInput";

export const UserManagementPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<IUser[]>([])
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await getAllUsers(page + 1, 10);
        setUsers(res.data);
        setPageCount(res.totalPages);
      } catch (err) {
        console.log(err)
        toast.error("Lỗi khi tải danh sách người dùng");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [page]);

  useEffect(() => {
    let filtered = users;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => {
        if (statusFilter === 'active') return user.status === 'active';
        if (statusFilter === 'inactive') return user.status === 'inactive';
        return true;
      });
    }

    setFilteredUsers(filtered);
  }, [users, statusFilter]);

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
      const res = await getAllUsers(1, 10, { search: query });
      setUsers(res.data);
      setFilteredUsers(res.data);
      setPageCount(res.totalPages);
      setPage(0);
    } catch (err) {
      console.log(err);
      toast.error("Lỗi khi tìm kiếm người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers(page + 1, 10);
      setUsers(res.data);
      setPageCount(res.totalPages);
      toast.success("Đã làm mới danh sách người dùng");
    } catch (err) {
      console.log(err);
      toast.error("Lỗi khi làm mới danh sách");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await softDeleteUserById(userToDelete._id);
        setUsers((prev) => prev.filter((u) => u._id !== userToDelete._id));
        toast.success("Xóa người dùng thành công");
      } catch {
        toast.error("Xóa người dùng thất bại");
      }
    }
  };

  return (
    <div className="p-6">
      <Card className="shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <div>
            <p className="text-2xl font-semibold">
              Quản lý người dùng
            </p>
            <p className="text-gray-600 mt-1">
              Quản lý toàn bộ người dùng trong hệ thống
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
                placeholder="Tìm kiếm theo tên, email..."
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
              onClick={() => navigate(ROUTERS.ADMIN.users.trash)}
              variant="dashed"
              color="danger"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Thùng rác
            </Button>
            <Button
              onClick={() => navigate(ROUTERS.ADMIN.users.create)}
              color="default"
              variant="solid"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm người dùng
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
            tip="Đang tải danh sách người dùng..."
          >
            <div className="overflow-x-auto">
              <UserTable
                data={filteredUsers}
                onShow={(user) => navigate(ROUTERS.ADMIN.users.show(user._id))}
                onEdit={(user) => navigate(ROUTERS.ADMIN.users.edit(user._id))}
                onDelete={(user) => setUserToDelete(user)}
                pagination={{
                  pageIndex: page,
                  pageCount: pageCount,
                  onPageChange: setPage,
                }}
              />
            </div>
          </Spin>

          {!loading && users.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Users className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? "Không tìm thấy người dùng" : "Chưa có người dùng nào"}
              </h3>
              <p className="text-gray-600 text-center mb-6 max-w-md">
                {searchTerm
                  ? `Không tìm thấy người dùng nào phù hợp với từ khóa "${searchTerm}". Thử tìm kiếm với từ khóa khác.`
                  : "Bắt đầu bằng cách thêm người dùng đầu tiên vào hệ thống."
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
                <Button onClick={() => navigate(ROUTERS.ADMIN.users.create)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm người dùng đầu tiên
                </Button>
              )}
            </div>
          )}
        </div>

        <ConfirmDeleteDialog
          open={!!userToDelete}
          itemName={userToDelete?.fullName || userToDelete?.email || ""}
          onCancel={() => setUserToDelete(null)}
          onConfirm={confirmDelete}
        />
      </Card>
    </div>
  );
};