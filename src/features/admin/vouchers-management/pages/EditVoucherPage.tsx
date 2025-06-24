import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { z } from "zod";
import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, Typography, Skeleton, Alert, Space, Button as AntButton, Select, DatePicker } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    getVoucherById,
    updateVoucherById
} from "@/features/admin/vouchers-management/services/voucherService";
import { baseVoucherSchema } from "@/features/admin/vouchers-management/validator/voucher";
import { IVoucher } from "@/types";
import CancelButton from "@/components/common/admin/CancelButton";
import ROUTERS from "@/constants/routes";
import dayjs from "dayjs";

const { Title, Text } = Typography;

type EditVoucherFormData = z.infer<typeof baseVoucherSchema>;

export const EditVoucherPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [voucher, setVoucher] = useState<IVoucher | null>(null);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch
    } = useForm<EditVoucherFormData>({
        resolver: zodResolver(baseVoucherSchema),
        defaultValues: {
            type: "percentage",
            isActive: true,
        },
    });

    const voucherType = watch("type");

    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                setError("Voucher ID is required");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const voucherRes = await getVoucherById(id);
                const voucherData = voucherRes.data;
                setVoucher(voucherData);

                reset({
                    code: voucherData.code,
                    type: voucherData.type,
                    value: voucherData.value,
                    minOrderValue: voucherData.minOrderValue,
                    maxDiscountValue: voucherData.maxDiscountValue,
                    usageLimit: voucherData.usageLimit,
                    usagePerUser: voucherData.usagePerUser,
                    startDate: dayjs(voucherData.startDate).format("YYYY-MM-DD"),
                    endDate: dayjs(voucherData.endDate).format("YYYY-MM-DD"),
                    isActive: voucherData.isActive,
                });

                setError(null);
            } catch (error) {
                console.error("Failed to fetch voucher:", error);
                setError("Failed to load voucher details");
                toast.error("Failed to load voucher details");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, reset]);

    const onSubmit = async (data: EditVoucherFormData) => {
        if (!id) return;

        const toastId = toast.loading("Đang cập nhật voucher...");

        const payload = {
            ...data,
            startDate: dayjs(data.startDate).toISOString(),
            endDate: dayjs(data.endDate).toISOString(),
        };

        try {
            await updateVoucherById(id, payload);
            toast.success("Cập nhật voucher thành công!", { id: toastId });
            navigate(ROUTERS.ADMIN.vouchers.edit(id));
        } catch (error) {
            console.error(error);
            toast.error("Cập nhật voucher thất bại.", { id: toastId });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-6">
                    <Skeleton active paragraph={{ rows: 8 }} />
                </div>
            </div>
        );
    }

    if (error || !voucher) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-6">
                    <Alert
                        message="Lỗi"
                        description={error || "Không tìm thấy voucher"}
                        type="error"
                        showIcon
                        action={
                            <AntButton size="small" onClick={() => navigate("/admin/vouchers")}>
                                Quay lại danh sách
                            </AntButton>
                        }
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <AntButton
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(ROUTERS.ADMIN.vouchers.root)}
                        className="flex items-center"
                    >
                        Quay lại
                    </AntButton>
                </div>

                <Title level={2} className="!text-3xl !font-bold !text-gray-900 !mb-2">
                    Chỉnh sửa voucher
                </Title>
                <Text className="text-gray-600 text-base">
                    Cập nhật thông tin mã giảm giá và cài đặt
                </Text>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <Space direction="vertical" size="middle" className="w-full">
                    <Card className="shadow-sm bg-blue-50 border-blue-200">
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <Title level={5} className="!text-blue-800 !mb-1">
                                    Đang chỉnh sửa: {voucher.code}
                                </Title>
                                <Text className="text-blue-700 text-sm">
                                    ID: {voucher._id} •
                                    Trạng thái: {voucher.isActive ? "Hoạt động" : "Vô hiệu hóa"} •
                                    Tạo lúc: {new Date(voucher.createdAt).toLocaleDateString('vi-VN')}
                                </Text>
                            </div>
                        </div>
                    </Card>

                    {/* Basic Information Section */}
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

                            <Controller
                                name="type"
                                control={control}
                                render={({ field }) => (
                                    <div className="space-y-2">
                                        <Label htmlFor="type">Loại giảm giá *</Label>
                                        <Select
                                            {...field}
                                            id="type"
                                            options={[
                                                { label: "Phần trăm", value: "percentage" },
                                                { label: "Cố định", value: "fixed" },
                                            ]}
                                            className="w-full"
                                        />
                                        {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
                                    </div>
                                )}
                            />

                            <div className="space-y-2">
                                <Label htmlFor="value">
                                    Giá trị giảm * {voucherType === "percentage" ? "(%)" : "(VNĐ)"}
                                </Label>
                                <Input type="number" id="value" {...register("value", { valueAsNumber: true })} className="h-10" />
                                {errors.value && <p className="text-sm text-red-500">{errors.value.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="minOrderValue">Giá trị đơn hàng tối thiểu (VNĐ) *</Label>
                                <Input type="number" id="minOrderValue" {...register("minOrderValue", { valueAsNumber: true })} className="h-10" />
                                {errors.minOrderValue && <p className="text-sm text-red-500">{errors.minOrderValue.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="maxDiscountValue">Giá trị giảm tối đa (VNĐ) *</Label>
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

                            <Controller
                                name="startDate"
                                control={control}
                                render={({ field }) => (
                                    <div className="space-y-2">
                                        <Label htmlFor="startDate">Ngày bắt đầu *</Label>
                                        <DatePicker
                                            id="startDate"
                                            format="YYYY-MM-DD"
                                            className="w-full h-10"
                                            value={field.value ? dayjs(field.value) : null}
                                            onChange={(date) => field.onChange(date ? date.format("YYYY-MM-DD") : "")}
                                        />
                                        {errors.startDate && <p className="text-sm text-red-500">{errors.startDate.message}</p>}
                                    </div>
                                )}
                            />

                            <Controller
                                name="endDate"
                                control={control}
                                render={({ field }) => (
                                    <div className="space-y-2">
                                        <Label htmlFor="endDate">Ngày kết thúc *</Label>
                                        <DatePicker
                                            id="endDate"
                                            format="YYYY-MM-DD"
                                            className="w-full h-10"
                                            value={field.value ? dayjs(field.value) : null}
                                            onChange={(date) => field.onChange(date ? date.format("YYYY-MM-DD") : "")}
                                        />
                                        {errors.endDate && <p className="text-sm text-red-500">{errors.endDate.message}</p>}
                                    </div>
                                )}
                            />

                            <Controller
                                name="isActive"
                                control={control}
                                render={({ field }) => (
                                    <div className="space-y-2">
                                        <Label htmlFor="isActive">Trạng thái *</Label>
                                        <Select
                                            {...field}
                                            id="isActive"
                                            options={[
                                                { label: "Hoạt động", value: true },
                                                { label: "Vô hiệu hóa", value: false },
                                            ]}
                                            className="w-full"
                                        />
                                        {errors.isActive && <p className="text-sm text-red-500">{errors.isActive.message}</p>}
                                    </div>
                                )}
                            />
                        </div>
                    </Card>
                </Space>

                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    {voucher.usageCount !== undefined && (
                        <Card className="shadow-sm bg-green-50 border-green-200">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <Title level={5} className="!text-green-800 !mb-1">
                                        Thống kê sử dụng
                                    </Title>
                                    <Text className="text-green-700 text-sm">
                                        Đã sử dụng: {voucher.usageCount || 0}/{voucher.usageLimit} lần •
                                        Còn lại: {voucher.usageLimit - (voucher.usageCount || 0)} lần
                                    </Text>
                                </div>
                            </div>
                        </Card>
                    )}

                    <Card className="shadow-sm bg-amber-50 border-amber-200">
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center mt-0.5">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <Title level={5} className="!text-amber-800 !mb-1">
                                    Lưu ý khi cập nhật voucher
                                </Title>
                                <Text className="text-amber-700 text-sm">
                                    Việc thay đổi thông tin voucher có thể ảnh hưởng đến những đơn hàng đang sử dụng mã này.
                                    Hãy đảm bảo rằng các thay đổi không gây ảnh hưởng tiêu cực đến trải nghiệm khách hàng.
                                </Text>
                            </div>
                        </div>
                    </Card>
                </Space>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-4 pt-6">
                    <CancelButton to={ROUTERS.ADMIN.vouchers.root} />
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 h-10 bg-blue-600 hover:bg-blue-700"
                    >
                        <SaveOutlined className="mr-2" />
                        {isSubmitting ? "Đang cập nhật..." : "Cập nhật voucher"}
                    </Button>
                </div>
            </form>
        </div>
    );
};