import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { baseColorSchema } from "@/features/admin/colors-management/validator/colorValidator";
import { createColor } from "@/features/admin/colors-management/services/colorService";
import ROUTERS from "@/constants/routes";

type CreateColorFormData = z.infer<typeof baseColorSchema>;

export const CreateColorPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateColorFormData>({
    resolver: zodResolver(baseColorSchema),
  });

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

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Tạo màu mới</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">Tên màu</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="hexCode">Mã màu (HEX)</Label>
          <div className="flex items-center gap-2">
            <Input id="hexCode" {...register("hexCode")} placeholder="#ff0000" />
            <input type="color" onChange={(e) => {
              const hex = e.target.value;
              (document.getElementById("hexCode") as HTMLInputElement).value = hex;
            }} />
          </div>
          {errors.hexCode && <p className="text-sm text-red-500">{errors.hexCode.message}</p>}
        </div>

        <div>
          <Label htmlFor="description">Mô tả</Label>
          <Textarea id="description" rows={3} {...register("description")} />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Đang tạo..." : "Tạo màu"}
        </Button>
      </form>
    </div>
  );
};
