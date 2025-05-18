import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button";
import { IColor } from "@/types";
import { ColorTable } from "@/features/admin/colors-management/components/ColorTable";
import { useNavigate } from "react-router-dom";
import ROUTERS from "@/constants/routes";
import { getAllColors } from "@/features/admin/colors-management/services/colorService";

export const ColorManagementPage = () => {
  const navigate = useNavigate();
  const [colors, setColors] = useState<IColor[]>([])
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(1)

  useEffect(() => {
  const fetchUsers = async () => {
    const res = await getAllColors(page + 1, 10);
    setColors(res.data);
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
          Colors Management
        </h2>
        <Button onClick={() => navigate(ROUTERS.ADMIN.colors.create)}>
          Create color
        </Button>
      </div>
      <ColorTable
        data={colors}
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