import { RoleTable } from "@/features/admin/roles-management/components"
import { IRole } from "@/types";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import ROUTERS from "@/constants/routes";
import { ConfirmDeleteDialog } from "@/components/ComfirmDeleteDialog";
import { getAllRoles, softDeleteRoleById } from "@/features/admin/roles-management/services/roleService";
import {
    Trash2,
    Plus,
    Package,
    Filter,
    Download,
    RefreshCw
} from "lucide-react";
import { SearchInput } from "@/components/common/searchInput";
import { Button } from "@/components/ui/button";
import { CardContent, CardTitle } from "@/components/ui/card";

export const RoleManagementPage = () => {
    const navigate = useNavigate();
    const [roles, setRoles] = useState<IRole[]>([]);
    const [loading, setLoading] = useState(true);
    const [roleToDelete, setRoleToDelete] = useState<IRole | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0)
    const [pageCount, setPageCount] = useState(1)

    useEffect(() => {
        const fetchRoles = async () => {
            setLoading(true);
            try {
                const res = await getAllRoles(page + 1, 10);
                setRoles(res.data);
                setPageCount(res.totalPages);
            } catch (error) {
                console.error("Error fetching roles:", error);
                toast.error("Lỗi khi tải danh sách vai trò");
            } finally {
                setLoading(false);
            }
        };
        fetchRoles();
    }, [page]);

    const handleSearch = async (query: string) => {
        setSearchTerm(query);
        setLoading(true);
        try {
            const res = await getAllRoles(1, 10, { search: query });
            setRoles(res.data);
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
            const res = await getAllRoles(page + 1, 10);
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
        <div className="min-h-screen bg-gray-50/30">
            <div className="p-6 space-y-6">
                {/* Header Section */}
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                Quản lý vai trò
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Quản lý toàn bộ vai trò trong hệ thống
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
                </div>


                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4 flex-1">
                        <SearchInput
                            placeholder="Tìm kiếm theo tên..."
                            onSearch={handleSearch}
                        />
                        <Button variant="outline" size="sm">
                            <Filter className="h-4 w-4 mr-2" />
                            Bộ lọc
                        </Button>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Button
                            variant="outline"
                            onClick={() => navigate(ROUTERS.ADMIN.roles.trash)}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Thùng rác
                        </Button>
                        <Button
                            onClick={() => navigate(ROUTERS.ADMIN.roles.create)}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm vai trò
                        </Button>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">
                        Danh sách vai trò
                    </CardTitle>
                    {searchTerm && (
                        <Badge variant="secondary" className="text-xs">
                            Kết quả cho: "{searchTerm}"
                        </Badge>
                    )}
                </div>
                <Separator />
                <CardContent className="p-0">
                    <RoleTable
                        data={roles}
                        onShow={(role) => navigate(ROUTERS.ADMIN.roles.show(role._id))}
                        loading={loading}
                        onDelete={(role) => setRoleToDelete(role)}
                        pagination={{
                            pageIndex: page,
                            pageCount: pageCount,
                            onPageChange: setPage,
                        }}
                    />

                    {!loading && roles.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 px-4">
                            <Package className="h-12 w-12 text-gray-400 mb-4" />
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
                                    variant="outline"
                                    onClick={() => {
                                        setSearchTerm("");
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
                </CardContent>

                {/* Delete Confirmation Dialog */}
                <ConfirmDeleteDialog
                    open={!!roleToDelete}
                    itemName={roleToDelete?.name || ""}
                    onCancel={() => setRoleToDelete(null)}
                    onConfirm={confirmDelete}
                />
            </div>
        </div>
    );
}