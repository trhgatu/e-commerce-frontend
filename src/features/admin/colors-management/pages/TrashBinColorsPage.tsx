import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button";
import { IColor } from "@/types";
import { ColorTable } from "@/features/admin/colors-management/components/ColorTable";
import { useNavigate } from "react-router-dom";
import ROUTERS from "@/constants/routes";
import { getAllColors , restoreColorById, hardDeleteColorById} from "@/features/admin/colors-management/services/colorService";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/ComfirmDeleteDialog";
import { Undo2 } from "lucide-react";

export const TrashBinColorsPage = () => {
    const navigate = useNavigate();
    const [colors, setColors] = useState<IColor[]>([])
    const [page, setPage] = useState(0)
    const [pageCount, setPageCount] = useState(1)
    const [colorToDelete, setColorToDelete] = useState<IColor | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await getAllColors(page + 1, 10, {
                    isDeleted: true
                });
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

    const handleRestore = async (color: IColor) => {
        try {
          await restoreColorById(color._id);
          setColors((prev) => prev.filter((c) => c._id !== color._id));
          toast.success(`Đã khôi phục màu "${color.name}"`);
        } catch {
          toast.error("Khôi phục thất bại");
        }
      };

    const confirmDelete = async () => {
        if (colorToDelete) {
            try {
                await hardDeleteColorById(colorToDelete._id);
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
                    Màu đã xóa
                </h2>
                <div className="flex items-center space-x-2">
                    <Button onClick={() => navigate(ROUTERS.ADMIN.colors.root)} variant="outline">Về trang màu sắc<Undo2 /></Button>
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
                actionRenderer={(color) => (
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRestore(color)}
                        >
                            Khôi phục
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setColorToDelete(color)}
                        >
                            Xoá vĩnh viễn
                        </Button>
                    </div>
                )}
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