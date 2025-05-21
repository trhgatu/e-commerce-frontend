import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button";
import { ICategory } from "@/types";
import { CategoryTable } from "@/features/admin/categories-management/components/CategoryTable";
import { useNavigate } from "react-router-dom";
import ROUTERS from "@/constants/routes";
import { getAllCategories, restoreCategoryById, hardDeleteCategoryById } from "@/features/admin/categories-management/services/categoryService";
import { Undo2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/ComfirmDeleteDialog";

export const TrashBinCategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ICategory[]>([])
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [categoryToDelete, setCategoryToDelete] = useState<ICategory | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getAllCategories(page + 1, 10, {
        isDeleted: true
      });
      setCategories(res.data);
      setPageCount(res.totalPages);
    };
    fetchCategories();
  }, [page]);

  const handleRestore = async (category: ICategory) => {
    try {
      await restoreCategoryById(category._id);
      setCategories((prev) => prev.filter((p) => p._id !== category._id));
      toast.success(`Đã khôi phục danh mục "${category.name}"`);
    } catch {
      toast.error("Khôi phục thất bại");
    }
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      try {
        await hardDeleteCategoryById(categoryToDelete._id);
        setCategories((prev) => prev.filter((p) => p._id !== categoryToDelete._id));
        toast.success("Product deleted successfully");
      } catch {
        toast.error("Failed to delete role");
      } finally {
        setCategoryToDelete(null);
      }
    }
  };
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
          Danh mục đã xóa
        </h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => navigate(ROUTERS.ADMIN.categories.root)} variant="outline">Về trang danh mục<Undo2 /></Button>
        </div>
      </div>
      <CategoryTable
        data={categories}
        onDelete={(category) => setCategoryToDelete(category)}
        pagination={{
          pageIndex: page,
          pageCount: pageCount,
          onPageChange: setPage,
        }}
        actionRenderer={(category) => (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleRestore(category)}
            >
              Khôi phục
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setCategoryToDelete(category)}
            >
              Xoá vĩnh viễn
            </Button>
          </div>
        )}
      />
      <ConfirmDeleteDialog
        open={!!categoryToDelete}
        itemName={categoryToDelete?.name || ""}
        onCancel={() => setCategoryToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}