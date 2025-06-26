import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button";
import { IProduct } from "@/types";
import { ProductTable } from "@/features/admin/products-management/components";
import { ConfirmDeleteDialog } from "@/components/ComfirmDeleteDialog";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ROUTERS from "@/constants/routes";
import { hardDeleteProductById, restoreProductById, getAllProducts } from "@/features/admin/products-management/services/productService";
import { Undo2 } from "lucide-react";

export const TrashBinProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<IProduct[]>([])
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const res = await getAllProducts(page + 1, 10, { isDeleted: true });
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

  const handleRestore = async (product: IProduct) => {
    try {
      await restoreProductById(product._id);
      setProducts((prev) => prev.filter((p) => p._id !== product._id));
      toast.success(`Đã khôi phục sản phẩm "${product.name}"`);
    } catch {
      toast.error("Khôi phục thất bại");
    }
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await hardDeleteProductById(productToDelete._id);
        setProducts((prev) => prev.filter((p) => p._id !== productToDelete._id));
        toast.success("Product deleted successfully");
      } catch {
        toast.error("Failed to delete role");
      } finally {
        setProductToDelete(null);
      }
    }
  };

  if( loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">
          Sản phẩm đã xóa
        </h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => navigate(ROUTERS.ADMIN.products.root)} variant="outline">Về trang sản phẩm<Undo2 /></Button>
        </div>
      </div>
      <ProductTable
        data={products}
        onDelete={(product) => setProductToDelete(product)}
        pagination={{
          pageIndex: page,
          pageCount: pageCount,
          onPageChange: setPage,
        }}
        actionRenderer={(product) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleRestore(product)}
            >
              Khôi phục
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setProductToDelete(product)}
            >
              Xoá vĩnh viễn
            </Button>
          </div>
        )}
      />
      <ConfirmDeleteDialog
        open={!!productToDelete}
        itemName={productToDelete?.name || ""}
        onCancel={() => setProductToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}