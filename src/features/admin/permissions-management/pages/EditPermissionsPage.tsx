import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, Typography, Skeleton, Alert, Space, Button as AntButton, Select } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    getPermissionById,
    updatePermissionById
} from "@/features/admin/permissions-management/services/permissionService";
import { IPermission, PermissionCreateRequest } from "@/types/permission";
import CancelButton from "@/components/common/admin/CancelButton";
import ROUTERS from "@/constants/routes";
import { basePermissionSchema } from "@/features/admin/permissions-management/validator/permission";
const { Title, Text } = Typography;
const { Option } = Select;

type EditPermissionFormData = z.infer<typeof basePermissionSchema>;

const PERMISSION_GROUPS = [
    "Quản lý người dùng",
    "Quản lý sản phẩm",
    "Quản lý đơn hàng",
    "Quản lý danh mục",
    "Quản lý vai trò",
    "Quản lý quyền",
    "Quản lý thương hiệu",
    "Báo cáo",
    "Cài đặt hệ thống",
    "Khác"
];

export const EditPermissionPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [permission, setPermission] = useState<IPermission | null>(null);
    const [selectedGroup, setSelectedGroup] = useState<string>("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
    } = useForm<EditPermissionFormData>({
        resolver: zodResolver(basePermissionSchema),
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                setError("Permission ID is required");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await getPermissionById(id);
                const permissionData = response;
                setPermission(permissionData);
                setSelectedGroup(permissionData.group);

                reset({
                    name: permissionData.name,
                    label: permissionData.label,
                    group: permissionData.group,
                    description: permissionData.description || "",
                });

                setError(null);
            } catch (error) {
                console.error("Failed to fetch permission:", error);
                setError("Failed to load permission details");
                toast.error("Failed to load permission details");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, reset]);

    const handleGroupChange = (value: string) => {
        setSelectedGroup(value);
        setValue("group", value);
    };

    const onSubmit = async (data: EditPermissionFormData) => {
        if (!id) return;

        const toastId = toast.loading("Đang cập nhật quyền...");
        try {
            await updatePermissionById(id, data as PermissionCreateRequest);
            toast.success("Cập nhật quyền thành công!", { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra khi cập nhật quyền.", { id: toastId });
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

    if (error || !permission) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-6">
                    <Alert
                        message="Lỗi"
                        description={error || "Không tìm thấy quyền"}
                        type="error"
                        showIcon
                        action={
                            <AntButton size="small" onClick={() => navigate(ROUTERS.ADMIN.permissions.root)}>
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
                        onClick={() => navigate(ROUTERS.ADMIN.permissions.root)}
                        className="flex items-center"
                    >
                        Quay lại
                    </AntButton>
                </div>

                <Title level={2} className="!text-3xl !font-bold !text-gray-900 !mb-2">
                    Chỉnh sửa quyền
                </Title>
                <Text className="text-gray-600 text-base">
                    Cập nhật thông tin và cài đặt quyền
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
                                    Đang chỉnh sửa quyền: {permission.label}
                                </Title>
                                <Text className="text-blue-700 text-sm">
                                    ID: {permission._id} • Tên: {permission.name} •
                                    Tạo lúc: {new Date(permission.createdAt).toLocaleDateString('vi-VN')}
                                </Text>
                            </div>
                        </div>
                    </Card>

                    {/* Basic Information Section */}
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
                </Space>

                {/* Permission Update Warning */}
                <Card className="shadow-sm bg-amber-50 border-amber-200">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <Title level={5} className="!text-amber-800 !mb-1">
                                Lưu ý khi cập nhật quyền
                            </Title>
                            <Text className="text-amber-700 text-sm">
                                Việc thay đổi tên quyền có thể ảnh hưởng đến các vai trò đang sử dụng quyền này.
                                Hãy đảm bảo rằng thay đổi này không làm gián đoạn hệ thống phân quyền hiện tại.
                            </Text>
                        </div>
                    </div>
                </Card>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-4 pt-6">
                    <CancelButton to={ROUTERS.ADMIN.permissions.root}/>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 h-10 bg-blue-600 hover:bg-blue-700"
                    >
                        <SaveOutlined className="mr-2" />
                        {isSubmitting ? "Đang cập nhật..." : "Cập nhật quyền"}
                    </Button>
                </div>
            </form>
        </div>
    );
};