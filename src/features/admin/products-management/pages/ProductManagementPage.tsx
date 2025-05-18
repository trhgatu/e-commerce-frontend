import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button";
import { IProduct } from "@/types";
import { ProductTable } from "@/features/admin/products-management/components/ProductTable";
import { useNavigate } from "react-router-dom";
import ROUTERS from "@/constants/routes";
import { getALlProducts } from "@/features/admin/products-management/services/productService";

export const ProductManagementPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<IProduct[]>([])
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(1)

  useEffect(() => {
  const fetchUsers = async () => {
    const res = await getALlProducts(page + 1, 10);
    setProducts(res.data);
    setPageCount(res.totalPages);
  };
  fetchUsers();
}, [page]);

  /* const handleEdit = (user: IUser) => {
    navigate(ROUTERS.ADMIN.user.edit(user.id))
  } */

  /* const handleDelete = async (role: Role) => {
    if (window.confirm(`Are you sure you want to delete ${role.roleName}?`)) {
      await deleteRoleById(role.id)
      setRoles((prev) => prev.filter((r) => r.id !== role.id))
    }
  } */
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
        pagination={{
          pageIndex: page,
          pageCount: pageCount,
          onPageChange: setPage,
        }}
      />
    </div>
  )
}