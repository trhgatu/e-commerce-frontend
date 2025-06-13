import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, Typography, Select } from "antd";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createPermission } from "@/features/admin/permissions-management/services/permissionService";
import ROUTERS from "@/constants/routes";
import { basePermissionSchema } from "@/features/admin/permissions-management/validator/permission";
const { Title, Text } = Typography;
const { Option } = Select;



type CreatePermissionFormData = z.infer<typeof basePermissionSchema>;

const PERMISSION_GROUPS = [
    "Quản lý người dùng",
    "Quản lý sản phẩm",
    "Quản lý đơn hàng",
    "Quản lý danh mục",
    "Quản lý vai trò",
    "Quản lý quyền",
    "Báo cáo",
    "Cài đặt hệ thống",
    "Khác"
];

export const CreatePermissionPage = () => {
    const navigate = useNavigate();
    const [selectedGroup, setSelectedGroup] = useState<string>("");

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<CreatePermissionFormData>({
        resolver: zodResolver(basePermissionSchema),
    });

    const onSubmit = async (data: CreatePermissionFormData) => {
        const toastId = toast.loading("Đang tạo quyền...");
        console.log("Form data:", data);
        try {
            await createPermission(data);
            toast.success("Tạo quyền thành công!", { id: toastId });
            navigate(ROUTERS.ADMIN.permissions.root);
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra khi tạo quyền.", { id: toastId });
        }
    };

    const handleGroupChange = (value: string) => {
        setSelectedGroup(value);
        setValue("group", value);
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <Title level={2} className="!text-3xl !font-bold !text-gray-900 !mb-2">
                    Tạo quyền mới
                </Title>
                <Text className="text-gray-600 text-base">
                    Thêm quyền mới để quản lý truy cập hệ thống
                </Text>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <Card className="shadow-sm">
                    <div className="mb-6">
                        <Title level={3} className="!text-xl !font-semibold !text-gray-900 !mb-0">
                            Thông tin cơ bản
                        </Title>
                        <div className="w-full h-px bg-gray-200 mt-3"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                Tên quyền *
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Ví dụ: users.create, products.view"
                                {...register("name")}
                                className="h-10"
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="label" className="text-sm font-medium text-gray-700">
                                Nhãn hiển thị *
                            </Label>
                            <Input
                                id="label"
                                type="text"
                                placeholder="Ví dụ: Tạo người dùng, Xem sản phẩm"
                                {...register("label")}
                                className="h-10"
                            />
                            {errors.label && (
                                <p className="text-sm text-red-500 mt-1">{errors.label.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="space-y-2">
                            <Label htmlFor="group" className="text-sm font-medium text-gray-700">
                                Nhóm quyền *
                            </Label>
                            <Select
                                placeholder="Chọn nhóm quyền"
                                className="w-full"
                                size="large"
                                value={selectedGroup}
                                onChange={handleGroupChange}
                            >
                                {PERMISSION_GROUPS.map((group) => (
                                    <Option key={group} value={group}>
                                        {group}
                                    </Option>
                                ))}
                            </Select>
                            {errors.group && (
                                <p className="text-sm text-red-500 mt-1">{errors.group.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-6">
                        <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                            Mô tả quyền
                        </Label>
                        <Textarea
                            id="description"
                            rows={4}
                            placeholder="Mô tả chi tiết về quyền này..."
                            {...register("description")}
                            className="mt-2 resize-none"
                        />
                    </div>
                </Card>

                {/* Permission Info */}
                <Card className="shadow-sm bg-blue-50 border-blue-200">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <Title level={5} className="!text-blue-800 !mb-1">
                                Về quyền hệ thống
                            </Title>
                            <Text className="text-blue-700 text-sm">
                                Tên quyền nên theo format "resource.action" (ví dụ: users.create, products.view).
                                Nhãn hiển thị sẽ được hiển thị trong giao diện người dùng.
                                Nhóm quyền giúp tổ chức và quản lý quyền một cách có hệ thống.
                            </Text>
                        </div>
                    </div>
                </Card>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-4 pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate(ROUTERS.ADMIN.permissions.root)}
                        className="px-8 h-10"
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 h-10 bg-blue-600 hover:bg-blue-700"
                    >
                        {isSubmitting ? "Đang tạo..." : "Tạo quyền"}
                    </Button>
                </div>
            </form>
        </div>
    );
};