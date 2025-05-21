import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button";
import { IColor } from "@/types";
import { ColorTable } from "@/features/admin/colors-management/components/ColorTable";
import { useNavigate } from "react-router-dom";
import ROUTERS from "@/constants/routes";
import { getAllColors, softDeleteColorById } from "@/features/admin/colors-management/services/colorService";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/ComfirmDeleteDialog";
import { Plus, Trash2 } from "lucide-react";
export const ColorManagementPage = () => {
  const navigate = useNavigate();
  const [colors, setColors] = useState<IColor[]>([])
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [colorToDelete, setColorToDelete] = useState<IColor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllColors(page + 1, 10);
        setColors(res.data);
        setPageCount(res.totalPages);
      } catch (err) {
        console.log(err)
        toast.error("Không thể tải danh sách màu sắc")
      } finally {
        setLoading(false)
      }
    };
    fetchUsers();
  }, [page]);

  const confirmDelete = async () => {
    if (colorToDelete) {
      try {
        await softDeleteColorById(colorToDelete._id);
        setColors((prev) => prev.filter((c) => c._id !== colorToDelete._id));
        toast.success("Xóa màu thành công");
      } catch {
        toast.error("Xóa màu thất bại");
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
          Colors Management
        </h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => navigate(ROUTERS.ADMIN.colors.trash)} variant="outline">Thùng rác <Trash2 /></Button>
          <Button onClick={() => navigate(ROUTERS.ADMIN.colors.create)}>
            Thêm
            <Plus />
          </Button>
        </div>
      </div>
      <ColorTable
        data={colors}
        loading={loading}
        onDelete={(color) => setColorToDelete(color)}
        /* onEdit={handleEdit} */
        pagination={{
          pageIndex: page,
          pageCount: pageCount,
          onPageChange: setPage,
        }}
      />
      <ConfirmDeleteDialog
        open={!!colorToDelete}
        itemName={colorToDelete?.name || ""}
        onCancel={() => setColorToDelete(null)}
        onConfirm={confirmDelete}

      />
    </div>
  )
}