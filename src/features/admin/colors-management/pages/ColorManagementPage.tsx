import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IColor } from "@/types";
import { ColorTable } from "@/features/admin/colors-management/components/ColorTable";
import { useNavigate } from "react-router-dom";
import ROUTERS from "@/constants/routes";
import { getAllColors, softDeleteColorById } from "@/features/admin/colors-management/services/colorService";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/ComfirmDeleteDialog";
import {
  Plus,
  Trash2,
  Palette,
  RefreshCw,
  Download
} from "lucide-react";

export const ColorManagementPage = () => {
  const navigate = useNavigate();
  const [colors, setColors] = useState<IColor[]>([])
  const [page, setPage] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [colorToDelete, setColorToDelete] = useState<IColor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColors = async () => {
      setLoading(true);
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
    fetchColors();
  }, [page]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const res = await getAllColors(page + 1, 10);
      setColors(res.data);
      setPageCount(res.totalPages);
      toast.success("Đã làm mới danh sách màu sắc");
    } catch (err) {
      console.log(err);
      toast.error("Lỗi khi làm mới danh sách");
    } finally {
      setLoading(false);
    }
  };

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

  // Mock statistics - replace with real data
  const stats = [
    {
      title: "Tổng màu sắc",
      value: colors.length,
      icon: Palette,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Quản lý màu sắc
              </h1>
              <p className="text-gray-600 mt-1">
                Quản lý tất cả màu sắc sản phẩm trong hệ thống
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
              <Button
                variant="outline"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Xuất Excel
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>


        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4 flex-1">
            <div className="text-sm text-gray-600">
              Hiển thị {colors.length} màu sắc
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate(ROUTERS.ADMIN.colors.trash)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Thùng rác
            </Button>
            <Button
              onClick={() => navigate(ROUTERS.ADMIN.colors.create)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm màu mới
            </Button>
          </div>
        </div>

        {/* Color Palette Preview */}
        {colors.length > 0 && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">
                Bảng màu hiện tại
              </CardTitle>
              <Separator />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {colors.slice(0, 12).map((color, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center space-y-2 group cursor-pointer"
                  /* onClick={() => navigate(ROUTERS.ADMIN.colors.show?.(color._id))} */
                  >
                    <div
                      className="w-12 h-12 rounded-full border-2 border-gray-200 shadow-sm group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: color.hexCode }}
                      title={color.name}
                    />
                    <span className="text-xs text-gray-600 text-center max-w-[60px] truncate">
                      {color.name}
                    </span>
                  </div>
                ))}
                {colors.length > 12 && (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <span className="text-xs text-gray-500 font-medium">
                        +{colors.length - 12}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      Khác
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        <CardTitle className="text-lg font-semibold">
          Danh sách màu sắc
        </CardTitle>
        <Separator />
        <CardContent className="p-0">
          <ColorTable
            data={colors}
            loading={loading}
            onDelete={(color) => setColorToDelete(color)}
            pagination={{
              pageIndex: page,
              pageCount: pageCount,
              onPageChange: setPage,
            }}
          />

          {/* Empty State */}
          {!loading && colors.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Palette className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Chưa có màu sắc nào
              </h3>
              <p className="text-gray-600 text-center mb-6 max-w-md">
                Bắt đầu bằng cách thêm màu sắc đầu tiên để tạo bảng màu cho sản phẩm của bạn.
              </p>
              <Button onClick={() => navigate(ROUTERS.ADMIN.colors.create)}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm màu đầu tiên
              </Button>
            </div>
          )}
        </CardContent>

        {/* Delete Confirmation Dialog */}
        <ConfirmDeleteDialog
          open={!!colorToDelete}
          itemName={colorToDelete?.name || ""}
          onCancel={() => setColorToDelete(null)}
          onConfirm={confirmDelete}
        />
      </div>
    </div>
  );
};