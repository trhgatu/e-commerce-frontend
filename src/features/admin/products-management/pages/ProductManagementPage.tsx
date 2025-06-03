import { useState, useEffect } from "react"
import {
  Spin,
  Card,
  Space,
  Button
} from 'antd';
import { Badge } from "@/components/ui/badge";
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
  Download,
  RefreshCw
} from "lucide-react";
import { SearchInput } from "@/components/common/SearchInput";
import StatusFilter from "@/components/StatusFilter";

export const ProductManagementPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<IProduct[]>([])
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>('all');

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

  useEffect(() => {
    let filtered = products;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(category => {
        if (statusFilter === 'active') return category.status === 'active';
        if (statusFilter === 'inactive') return !category.status || category.status === 'inactive';
        return true;
      });
    }

    setFilteredProducts(filtered);
  }, [products, statusFilter]);
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
      const res = await getAllProducts(1, 10, { search: query });
      setProducts(res.data);
      setFilteredProducts(res.data);
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

  return (
    <div className="p-6">
      <Card className="shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <div>
            <p className="text-2xl font-semibold">
              Quản lý sản phẩm
            </p>
            <p className="text-gray-600 mt-1">
              Quản lý toàn bộ sản phẩm trong hệ thống
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
                placeholder="Tìm kiếm theo tên..."
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
                style={{ width: '150px' }} // Cố định chiều rộng của Button
              >
                Xóa bộ lọc
              </Button>
            </Space>
          </div>


          <Space className="flex-shrink-0">
            <Button
              onClick={() => navigate(ROUTERS.ADMIN.products.trash)}
              variant="dashed"
              color="danger"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Thùng rác
            </Button>
            <Button
              onClick={() => navigate(ROUTERS.ADMIN.products.create)}
              color="default"
              variant="solid"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm sản phẩm
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
            tip="Đang tải danh sách sản phẩm..."
          >
            <div className="overflow-x-auto">
              <ProductTable
                data={filteredProducts}
                onShow={(product) => navigate(ROUTERS.ADMIN.products.show(product._id))}
                onEdit={(product) => navigate(ROUTERS.ADMIN.products.edit(product._id))}
                onDelete={(product) => setProductToDelete(product)}
                pagination={{
                  pageIndex: page,
                  pageCount: pageCount,
                  onPageChange: setPage,
                }}
              />
            </div>
          </Spin>

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
                  onClick={() => {
                    clearFilters();
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
        </div>

        <ConfirmDeleteDialog
          open={!!productToDelete}
          itemName={productToDelete?.name || ""}
          onCancel={() => setProductToDelete(null)}
          onConfirm={confirmDelete}
        />
      </Card >
    </div >
  );
};