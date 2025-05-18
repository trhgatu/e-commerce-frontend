import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button";
import { IProduct } from "@/types";
import { ProductTable } from "@/features/admin/products-management/components/ProductTable";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogAction


} from "@/components/ui/alert-dialog";
import ROUTERS from "@/constants/routes";
import { deleteProductById, getAllProducts } from "@/features/admin/products-management/services/productService";

export const ProductManagementPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<IProduct[]>([])
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);


  useEffect(() => {
    const fetchProducts = async () => {
      const res = await getAllProducts(page + 1, 10);
      setProducts(res.data);
      setPageCount(res.totalPages);
    };
    fetchProducts();
  }, [page]);

  /* const handleEdit = (user: IUser) => {
    navigate(ROUTERS.ADMIN.user.edit(user.id))
  } */

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await deleteProductById(productToDelete._id);
        setProducts((prev) => prev.filter((p) => p._id !== productToDelete._id));
        toast.success("Product deleted successfully");
      } catch {
        toast.error("Failed to delete role");
      } finally {
        setProductToDelete(null);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">
          Products Management
        </h2>
        <Button onClick={() => navigate(ROUTERS.ADMIN.products.create)}>
          Create Product
        </Button>
      </div>
      <ProductTable
        data={products}
        /* onEdit={handleEdit} */
        onDelete={(product) => setProductToDelete(product)}
        pagination={{
          pageIndex: page,
          pageCount: pageCount,
          onPageChange: setPage,
        }}
      />
      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xoá</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xoá sản phẩm <strong>{productToDelete?.name}</strong> không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Xoá</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}