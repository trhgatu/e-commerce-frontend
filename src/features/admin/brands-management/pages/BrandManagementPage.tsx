import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getAllBrands, deleteBrandById } from "@/features/admin/brands-management/services/brandService";
import { useNavigate } from "react-router-dom";
import ROUTERS from "@/constants/routes";
import { IBrand } from "@/types";
import { BrandTable } from "@/features/admin/brands-management/components/BrandTable";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/ComfirmDeleteDialog";
import {
  Building2,
  Tag,
  TrendingUp,
  Plus,
  Trash2,
  RefreshCw,
  Download,
  Filter
} from "lucide-react";
import { SearchInput } from "@/components/common/searchInput";

export const BrandManagementPage = () => {
    const navigate = useNavigate();
    const [brands, setBrands] = useState<IBrand[]>([])
    const [page, setPage] = useState(0)
    const [pageCount, setPageCount] = useState(1)
    const [brandToDelete, setBrandToDelete] = useState<IBrand | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

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
                console.log(err);
                toast.error("Lỗi khi tải danh sách thương hiệu");
            } finally {
                setLoading(false);
            }
        };
        fetchBrands();
    }, [page]);

    const handleSearch = async (query: string) => {
        setSearchTerm(query);
        setLoading(true);
        try {
            const res = await getAllBrands(1, 10, {
                isDeleted: false,
                search: query
            });
            setBrands(res.data);
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
            } finally {
                setBrandToDelete(null);
            }
        }
    };

    // Mock statistics - replace with real data
    const stats = [
        {
            title: "Tổng thương hiệu",
            value: brands.length,
            icon: Building2,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50",
        },
        {
            title: "Đang hoạt động",
            value: brands.filter(b => b.isActive).length,
            icon: Tag,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        /* {
            title: "Phổ biến",
            value: brands.filter(b => b.isPopular).length,
            icon: TrendingUp,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
        }, */
    ];

    return (
        <div className="min-h-screen bg-gray-50/30">
            <div className="p-6 space-y-6">
                {/* Header Section */}
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                Quản lý thương hiệu
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Quản lý tất cả thương hiệu sản phẩm trong hệ thống
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                    placeholder="Tìm kiếm thương hiệu..."
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
                                    onClick={() => navigate(ROUTERS.ADMIN.brands.trash)}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Thùng rác
                                </Button>
                                <Button
                                    onClick={() => navigate(ROUTERS.ADMIN.brands.create)}
                                    className="bg-indigo-600 hover:bg-indigo-700"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Thêm thương hiệu
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Popular Brands Preview */}
                {brands.length > 0 && (
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-semibold">
                                Thương hiệu nổi bât
                            </CardTitle>
                            <Separator />
                        </CardHeader>
                    </Card>
                )}

                {/* Brands Table */}
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold">
                                Danh sách thương hiệu
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
                        <BrandTable
                            data={brands}
                            loading={loading}
                            onDelete={(brand) => setBrandToDelete(brand)}
                            pagination={{
                                pageIndex: page,
                                pageCount: pageCount,
                                onPageChange: setPage,
                            }}
                        />

                        {/* Empty State */}
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
                                        variant="outline"
                                        onClick={() => {
                                            setSearchTerm("");
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
                    </CardContent>
                </Card>

                {/* Delete Confirmation Dialog */}
                <ConfirmDeleteDialog
                    open={!!brandToDelete}
                    itemName={brandToDelete?.name || ""}
                    onCancel={() => setBrandToDelete(null)}
                    onConfirm={confirmDelete}
                />
            </div>
        </div>
    );
};