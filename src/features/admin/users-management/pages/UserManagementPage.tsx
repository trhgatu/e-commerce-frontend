import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getAllUsers } from "@/features/admin/users-management/services/userService";
import { IUser } from "@/types";
import { UserTable } from "@/features/admin/users-management/components/UserTable";
import { useNavigate } from "react-router-dom";
import ROUTERS from "@/constants/routes";
import {
  Users,
  UserCheck,
  UserX,
  Crown,
  Plus,
  RefreshCw,
  Download,
  Filter
} from "lucide-react";
import { SearchInput } from "@/components/common/searchInput";

export const UserManagementPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<IUser[]>([])
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await getAllUsers(page + 1, 10);
        setUsers(res.data);
        setPageCount(res.totalPages);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [page]);

  const handleSearch = async (query: string) => {
    setSearchTerm(query);
    setLoading(true);
    try {
      // Assuming your API supports search
      const res = await getAllUsers(1, 10, { search: query });
      setUsers(res.data);
      setPageCount(res.totalPages);
      setPage(0);
    } catch (err) {
      console.log(err);
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
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Mock statistics - replace with real data
  const stats = [
    {
      title: "Tổng người dùng",
      value: users.length,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Đang hoạt động",
      value: users.filter(u => u.status === 'active').length,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Bị khóa",
      value: users.filter(u => u.status === 'inactive').length,
      icon: UserX,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Quản trị viên",
      value: users.filter(u => u.roleId?.name === 'Admin').length,
      icon: Crown,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Quản lý người dùng
              </h1>
              <p className="text-gray-600 mt-1">
                Quản lý tất cả người dùng trong hệ thống
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
              <Button
                variant="outline"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Xuất Excel
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Bar */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4 flex-1">
                <SearchInput
                  placeholder="Tìm kiếm theo tên, email..."
                  onSearch={handleSearch}
                />
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Bộ lọc
                </Button>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => navigate(ROUTERS.ADMIN.users.create)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm người dùng
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Danh sách người dùng
              </CardTitle>
              {searchTerm && (
                <Badge variant="secondary" className="text-xs">
                  Kết quả cho: "{searchTerm}"
                </Badge>
              )}
            </div>
            <Separator />
          </CardHeader>
          <CardContent className="p-0 px-6">
            <UserTable
              data={users}
              loading={loading}
              pagination={{
                pageIndex: page,
                pageCount: pageCount,
                onPageChange: setPage,
              }}
            />

            {/* Empty State */}
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
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};