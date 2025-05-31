import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

import { baseColorSchema } from "@/features/admin/colors-management/validator/colorValidator";
import { createColor } from "@/features/admin/colors-management/services/colorService";
import ROUTERS from "@/constants/routes";
import CancelButton from "@/components/common/admin/CancelButton";

type CreateColorFormData = z.infer<typeof baseColorSchema>;

export const CreateColorPage = () => {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState("#ff0000");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<CreateColorFormData>({
    resolver: zodResolver(baseColorSchema),
    defaultValues: {
      hexCode: "#ff0000"
    }
  });

  const hexCode = watch("hexCode") || "#ff0000";

  const onSubmit = async (data: CreateColorFormData) => {
    const toastId = toast.loading("Đang tạo màu...");
    try {
      await createColor(data);
      toast.success("Tạo màu thành công!", { id: toastId });
      navigate(ROUTERS.ADMIN.colors.root);
    } catch (error) {
      console.error(error);
      toast.error("Tạo màu thất bại.", { id: toastId });
    }
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setValue("hexCode", color);
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedColor(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tạo màu mới</h1>
          <p className="text-gray-600">Thêm màu sắc mới vào bộ sưu tập của bạn</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                Thông tin màu sắc
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Color Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Tên màu *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Ví dụ: Đỏ cherry, Xanh dương navy..."
                    {...register("name")}
                    className="h-10"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Color Code */}
                <div className="space-y-2">
                  <Label htmlFor="hexCode" className="text-sm font-medium text-gray-700">
                    Mã màu (HEX) *
                  </Label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Input
                        id="hexCode"
                        placeholder="#ff0000"
                        {...register("hexCode")}
                        onChange={handleHexInputChange}
                        className="h-10 font-mono"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={selectedColor}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                        title="Chọn màu"
                      />
                      <div
                        className="w-10 h-10 rounded border border-gray-300 shadow-sm"
                        style={{ backgroundColor: hexCode }}
                        title="Màu hiện tại"
                      />
                    </div>
                  </div>
                  {errors.hexCode && (
                    <p className="text-sm text-red-500 mt-1">{errors.hexCode.message}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Mô tả
                  </Label>
                  <Textarea
                    id="description"
                    rows={3}
                    placeholder="Mô tả chi tiết về màu sắc này..."
                    {...register("description")}
                    className="resize-none"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-4 pt-6">
                  <CancelButton to={ROUTERS.ADMIN.colors.root}/>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8"
                  >
                    {isSubmitting ? "Đang tạo..." : "Tạo màu"}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Xem trước</h3>

              {/* Color Preview */}
              <div className="space-y-4">
                <div className="text-center">
                  <div
                    className="w-full h-32 rounded-lg border-2 border-gray-200 shadow-inner mb-3 transition-all duration-200"
                    style={{ backgroundColor: hexCode }}
                  />
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    {watch("name") || "Tên màu"}
                  </p>
                  <p className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {hexCode.toUpperCase()}
                  </p>
                </div>

                {/* Color Info */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">RGB:</span>
                      <span className="font-mono text-gray-700">
                        {(() => {
                          const hex = hexCode.replace('#', '');
                          const r = parseInt(hex.substr(0, 2), 16);
                          const g = parseInt(hex.substr(2, 2), 16);
                          const b = parseInt(hex.substr(4, 2), 16);
                          return `${r}, ${g}, ${b}`;
                        })()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">HEX:</span>
                      <span className="font-mono text-gray-700">{hexCode.toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                {/* Sample Usage */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-3">Ví dụ sử dụng:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: hexCode }}
                      />
                      <span className="text-xs text-gray-600">Biểu tượng màu</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-3 rounded border"
                        style={{ backgroundColor: hexCode }}
                      />
                      <span className="text-xs text-gray-600">Thanh màu</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};