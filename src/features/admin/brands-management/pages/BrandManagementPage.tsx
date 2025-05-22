import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button";
import { getAllBrands, deleteBrandById } from "@/features/admin/brands-management/services/brandService";
import { useNavigate } from "react-router-dom";
import ROUTERS from "@/constants/routes";
import { IBrand } from "@/types";
import { BrandTable } from "@/features/admin/brands-management/components/BrandTable";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/ComfirmDeleteDialog";

export const BrandManagementPage = () => {
    const navigate = useNavigate();
    const [brands, setBrands] = useState<IBrand[]>([])
    const [page, setPage] = useState(0)
    const [pageCount, setPageCount] = useState(1)
    const [brandToDelete, setBrandToDelete] = useState<IBrand | null>(null);

    useEffect(() => {
        const fetchBrands = async () => {
            const res = await getAllBrands(page + 1, 10, {
                isDeleted: false
            });
            setBrands(res.data);
            setPageCount(res.totalPages);
        };
        fetchBrands();
    }, [page]);

    const confirmDelete = async () => {
        if (brandToDelete) {
            try {
                await deleteBrandById(brandToDelete._id);
                setBrands((prev) => prev.filter((b) => b._id !== brandToDelete._id));
                toast.success("Brand deleted successfully");
            } catch {
                toast.error("Failed to delete role");
            } finally {
                setBrandToDelete(null);
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
        <div>
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold">
                        Quản lý thương hiệu
                    </h2>
                    <div className="flex items-center space-x-2">
                        <Button onClick={() => navigate(ROUTERS.ADMIN.brands.create)}>
                            Tạo mới
                        </Button>
                        <Button onClick={() => navigate(ROUTERS.ADMIN.brands.trash)}> Thùng rác </Button>
                    </div>
                </div>
                <BrandTable
                    data={brands}
                    /* onEdit={handleEdit} */
                    onDelete={(brand) => setBrandToDelete(brand)}
                    pagination={{
                        pageIndex: page,
                        pageCount: pageCount,
                        onPageChange: setPage,
                    }}
                />

            </div>
            <ConfirmDeleteDialog
                open={!!brandToDelete}
                itemName={brandToDelete?.name || ""}
                onCancel={() => setBrandToDelete(null)}
                onConfirm={confirmDelete}
            />
        </div>
    )
}