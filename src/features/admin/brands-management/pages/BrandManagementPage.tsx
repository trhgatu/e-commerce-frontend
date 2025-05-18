import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button";
import { getAllBrands } from "@/features/admin/brands-management/services/brandService";
import { useNavigate } from "react-router-dom";
import ROUTERS from "@/constants/routes";
import { IBrand } from "@/types";
import { BrandTable } from "@/features/admin/brands-management/components/BrandTable";

export const BrandManagementPage = () => {
    const navigate = useNavigate();
    const [brands, setBrands] = useState<IBrand[]>([])
    const [page, setPage] = useState(0)
    const [pageCount, setPageCount] = useState(1)

    useEffect(() => {
        const fetchBrands = async () => {
            const res = await getAllBrands(page + 1, 10);
            setBrands(res.data);
            setPageCount(res.totalPages);
        };
        fetchBrands();
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
                    Brands Management
                </h2>
                <Button onClick={() => navigate(ROUTERS.ADMIN.brands.create)}>
                    Create brand
                </Button>
            </div>
            <BrandTable
                data={brands}
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