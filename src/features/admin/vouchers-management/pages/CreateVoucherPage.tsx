import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, Typography } from "antd";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { baseVoucherSchema } from "@/features/admin/vouchers-management/validator/voucher";
import { createVoucher } from "@/features/admin/vouchers-management/services/voucherService";
import ROUTERS from "@/constants/routes";

const { Title, Text } = Typography;

type CreateVoucherFormData = z.infer<typeof baseVoucherSchema>;

export const CreateVoucherPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateVoucherFormData>({
    resolver: zodResolver(baseVoucherSchema),
  });

  const onSubmit = async (data: CreateVoucherFormData) => {
    const toastId = toast.loading("Đang tạo voucher...");
    try {
      await createVoucher(data);
      toast.success("Tạo voucher thành công!", { id: toastId });
      navigate(ROUTERS.ADMIN.vouchers.root);
    } catch (error) {
      console.error(error);
      toast.error("Tạo voucher thất bại.", { id: toastId });
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <Title level={2} className="!text-3xl !font-bold !text-gray-900 !mb-2">
          Tạo voucher mới
        </Title>
        <Text className="text-gray-600 text-base">
          Thêm mã giảm giá để khuyến mãi cho khách hàng
        </Text>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card className="shadow-sm">
          <div className="mb-6">
            <Title level={3} className="!text-xl !font-semibold !text-gray-900 !mb-0">
              Thông tin voucher
            </Title>
            <div className="w-full h-px bg-gray-200 mt-3"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="code">Mã voucher *</Label>
              <Input id="code" {...register("code")} className="h-10" />
              {errors.code && <p className="text-sm text-red-500">{errors.code.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Loại giảm giá *</Label>
              <select id="type" {...register("type")} className="h-10 border rounded px-2">
                <option value="percentage">Phần trăm</option>
                <option value="fixed">Cố định</option>
              </select>
              {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Giá trị giảm *</Label>
              <Input type="number" id="value" {...register("value", { valueAsNumber: true })} className="h-10" />
              {errors.value && <p className="text-sm text-red-500">{errors.value.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="minOrderValue">Giá trị đơn hàng tối thiểu *</Label>
              <Input type="number" id="minOrderValue" {...register("minOrderValue", { valueAsNumber: true })} className="h-10" />
              {errors.minOrderValue && <p className="text-sm text-red-500">{errors.minOrderValue.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxDiscountValue">Giá trị giảm tối đa *</Label>
              <Input type="number" id="maxDiscountValue" {...register("maxDiscountValue", { valueAsNumber: true })} className="h-10" />
              {errors.maxDiscountValue && <p className="text-sm text-red-500">{errors.maxDiscountValue.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="usageLimit">Số lượt sử dụng *</Label>
              <Input type="number" id="usageLimit" {...register("usageLimit", { valueAsNumber: true })} className="h-10" />
              {errors.usageLimit && <p className="text-sm text-red-500">{errors.usageLimit.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="usagePerUser">Số lượt mỗi người dùng *</Label>
              <Input type="number" id="usagePerUser" {...register("usagePerUser", { valueAsNumber: true })} className="h-10" />
              {errors.usagePerUser && <p className="text-sm text-red-500">{errors.usagePerUser.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Ngày bắt đầu *</Label>
              <Input type="date" id="startDate" {...register("startDate")} className="h-10" />
              {errors.startDate && <p className="text-sm text-red-500">{errors.startDate.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Ngày kết thúc *</Label>
              <Input type="date" id="endDate" {...register("endDate")} className="h-10" />
              {errors.endDate && <p className="text-sm text-red-500">{errors.endDate.message}</p>}
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(ROUTERS.ADMIN.vouchers.root)}
            className="px-8 h-10"
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="px-8 h-10 bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? "Đang tạo..." : "Tạo voucher"}
          </Button>
        </div>
      </form>
    </div>
  );
};