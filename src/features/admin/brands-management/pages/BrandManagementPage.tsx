import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button";
import { getAllBrands, deleteBrandById } from "@/features/admin/brands-management/services/brandService";
import { useNavigate } from "react-router-dom";
import ROUTERS from "@/constants/routes";
import { IBrand } from "@/types";
import { BrandTable } from "@/features/admin/brands-management/components/BrandTable";
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

export const BrandManagementPage = () => {
    const navigate = useNavigate();
    const [brands, setBrands] = useState<IBrand[]>([])
    const [page, setPage] = useState(0)
    const [pageCount, setPageCount] = useState(1)
    const [brandToDelete, setBrandToDelete] = useState<IBrand | null>(null);

    useEffect(() => {
        const fetchBrands = async () => {
            const res = await getAllBrands(page + 1, 10);
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
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">
                    Brands Management
                </h2>
                <Button onClick={() => navigate(ROUTERS.ADMIN.brands.create)}>
                    Create brand
                </Button>
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
            <AlertDialog open={!!brandToDelete} onOpenChange={(open) => !open && setBrandToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xoá</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xoá thương hiệu <strong>{brandToDelete?.name}</strong> không? Hành động này không thể hoàn tác.
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