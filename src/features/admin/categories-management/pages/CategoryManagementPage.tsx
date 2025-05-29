import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button";
import { ICategory } from "@/types";
import { CategoryTable } from "@/features/admin/categories-management/components/CategoryTable";
import { useNavigate } from "react-router-dom";
import ROUTERS from "@/constants/routes";
import { getAllCategories, softDeleteCategoryById } from "@/features/admin/categories-management/services/categoryService";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/ComfirmDeleteDialog";
import { Plus, Trash2 } from "lucide-react";

export const CategoryManagementPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ICategory[]>([])
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [categoryToDelete, setCategoryToDelete] = useState<ICategory | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await getAllCategories(page + 1, 10, {
          isDeleted: false
        });
        setCategories(res.data);
        setPageCount(res.totalPages);
      } catch (err) {
        console.log(err)
        toast.error("Lỗi khi tải danh sách danh mục sản phẩm");
      } finally {
        setLoading(false)
      }
    };
    fetchCategories();
  }, [page]);

  const confirmDelete = async () => {
    if (categoryToDelete) {
      try {
        await softDeleteCategoryById(categoryToDelete._id);
        setCategories((prev) => prev.filter((c) => c._id !== categoryToDelete._id));
        toast.success("Xóa danh mục thành công");
      } catch {
        toast.error("Xóa danh mục thất bại");
      } finally {
        setCategoryToDelete(null);
      }
    }
  };
  /* const handleEdit = (user: IUser) => {
    navigate(ROUTERS.ADMIN.user.edit(user.id))
  } */
 const handleShow = (category: ICategory) => {
  navigate(ROUTERS.ADMIN.categories.show(category._id));
 }

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
        <div className="flex items-center space-x-2">
          <Button onClick={() => navigate(ROUTERS.ADMIN.categories.trash)} variant="outline">Thùng rác <Trash2 /></Button>
          <Button onClick={() => navigate(ROUTERS.ADMIN.categories.create)}>
            Thêm
            <Plus />
          </Button>
        </div>
      </div>
      <CategoryTable
        data={categories}
        loading={loading}
        /* onEdit={handleEdit} */
        onDelete={(category) => setCategoryToDelete(category)}
        onShow={handleShow}
        pagination={{
          pageIndex: page,
          pageCount: pageCount,
          onPageChange: setPage,
        }}
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