import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button";
import { ICategory } from "@/types";
import { CategoryTable } from "@/features/admin/categories-management/components/CategoryTable";
import { useNavigate } from "react-router-dom";
import ROUTERS from "@/constants/routes";
import { getAllCategories } from "@/features/admin/categories-management/services/categoryService";

export const CategoryManagementPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ICategory[]>([])
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(1)

  useEffect(() => {
  const fetchCategories = async () => {
    const res = await getAllCategories(page + 1, 10);
    setCategories(res.data);
    setPageCount(res.totalPages);
  };
  fetchCategories();
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
          Categories Management
        </h2>
        <Button onClick={() => navigate(ROUTERS.ADMIN.categories.create)}>
          Create category
        </Button>
      </div>
      <CategoryTable
        data={categories}
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