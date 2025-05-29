import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { IProduct } from "@/types";
import { ProductTable } from "@/features/admin/products-management/components/ProductTable";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/ComfirmDeleteDialog";
import ROUTERS from "@/constants/routes";
import { softDeleteProductById, getAllProducts } from "@/features/admin/products-management/services/productService";
import {
  Trash2,
  Plus,
  Package,
  TrendingUp,
  Filter,
  Download,
  RefreshCw
} from "lucide-react";
import { SearchInput } from "@/components/common/searchInput";

export const ProductManagementPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<IProduct[]>([])
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await getAllProducts(page + 1, 10);
        setProducts(res.data);
        setPageCount(res.totalPages);
      } catch (err) {
        console.log(err)
        toast.error("Lỗi khi tải danh sách sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page]);

  const handleSearch = async (query: string) => {
    setSearchTerm(query);
    setLoading(true);
    try {
      const res = await getAllProducts(1, 10, { search: query });
      setProducts(res.data);
      setPageCount(res.totalPages);
      setPage(0);
    } catch (err) {
      console.log(err);
      toast.error("Lỗi khi tìm kiếm sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const res = await getAllProducts(page + 1, 10);
      setProducts(res.data);
      setPageCount(res.totalPages);
      toast.success("Đã làm mới danh sách sản phẩm");
    } catch (err) {
      console.log(err);
      toast.error("Lỗi khi làm mới danh sách");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await softDeleteProductById(productToDelete._id);
        setProducts((prev) => prev.filter((p) => p._id !== productToDelete._id));
        toast.success("Xóa sản phẩm thành công");
      } catch {
        toast.error("Xóa sản phẩm thất bại");
      }
    }
  };

  // Mock statistics - replace with real data
  const stats = [
    {
      title: "Tổng sản phẩm",
      value: products.length,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    /* {
      title: "Đang bán",
      value: products.filter(p => p.status === 'active').length,
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-50",
    }, */
    {
      title: "Hết hàng",
      value: products.filter(p => p.stock === 0).length,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
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
                Quản lý sản phẩm
              </h1>
              <p className="text-gray-600 mt-1">
                Quản lý toàn bộ sản phẩm trong hệ thống
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
              onClick={() => navigate(ROUTERS.ADMIN.products.trash)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Thùng rác
            </Button>
            <Button
              onClick={() => navigate(ROUTERS.ADMIN.products.create)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm sản phẩm
            </Button>
          </div>
        </div>



        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Danh sách sản phẩm
          </CardTitle>
          {searchTerm && (
            <Badge variant="secondary" className="text-xs">
              Kết quả cho: "{searchTerm}"
            </Badge>
          )}
        </div>
        <Separator />
        <CardContent className="p-0">
          <ProductTable
            data={products}
            onShow={(product) => navigate(ROUTERS.ADMIN.products.show(product._id))}
            loading={loading}
            onDelete={(product) => setProductToDelete(product)}
            pagination={{
              pageIndex: page,
              pageCount: pageCount,
              onPageChange: setPage,
            }}
          />

          {!loading && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Package className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? "Không tìm thấy sản phẩm" : "Chưa có sản phẩm nào"}
              </h3>
              <p className="text-gray-600 text-center mb-6 max-w-md">
                {searchTerm
                  ? `Không tìm thấy sản phẩm nào phù hợp với từ khóa "${searchTerm}". Thử tìm kiếm với từ khóa khác.`
                  : "Bắt đầu bằng cách thêm sản phẩm đầu tiên vào hệ thống."
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
                <Button onClick={() => navigate(ROUTERS.ADMIN.products.create)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm sản phẩm đầu tiên
                </Button>
              )}
            </div>
          )}
        </CardContent>

        {/* Delete Confirmation Dialog */}
        <ConfirmDeleteDialog
          open={!!productToDelete}
          itemName={productToDelete?.name || ""}
          onCancel={() => setProductToDelete(null)}
          onConfirm={confirmDelete}
        />
      </div>
    </div>
  );
};