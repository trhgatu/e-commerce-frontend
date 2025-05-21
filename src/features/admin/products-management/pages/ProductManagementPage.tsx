import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button";
import { IProduct } from "@/types";
import { ProductTable } from "@/features/admin/products-management/components/ProductTable";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/ComfirmDeleteDialog";
import ROUTERS from "@/constants/routes";
import { softDeleteProductById, getAllProducts } from "@/features/admin/products-management/services/productService";
import { Trash2, Plus } from "lucide-react";

export const ProductManagementPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<IProduct[]>([])
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getAllProducts(page + 1, 10, { isDeleted: false });
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

  /* const handleEdit = (user: IUser) => {
    navigate(ROUTERS.ADMIN.user.edit(user.id))
  } */

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
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">
          Quản lý sản phẩm
        </h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => navigate(ROUTERS.ADMIN.products.trash)} variant="outline">Thùng rác <Trash2 /></Button>
          <Button onClick={() => navigate(ROUTERS.ADMIN.products.create)}>
            Thêm
            <Plus />
          </Button>
        </div>
      </div>
      <ProductTable
        data={products}
        /* onEdit={handleEdit} */
        loading={loading}
        onDelete={(product) => setProductToDelete(product)}
        pagination={{
          pageIndex: page,
          pageCount: pageCount,
          onPageChange: setPage,
        }}
      />
      <ConfirmDeleteDialog
        open={!!productToDelete}
        itemName={productToDelete?.name || ""}
        onCancel={() => setProductToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}