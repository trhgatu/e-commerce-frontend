import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { z } from "zod";
import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TreeSelect, Card, Typography, Skeleton, Alert, Space, Button as AntButton } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    getCategoryById,
    updateCategoryById,
    getAllCategories
} from "@/features/admin/categories-management/services/categoryService";
import { buildCategoryTree } from "@/features/admin/categories-management/utils/convertToTreeData";
import { TreeNode } from "@/features/admin/categories-management/utils/convertToTreeData";
import { baseCategorySchema } from "@/features/admin/categories-management/validator/category";
import { ICategory } from "@/types";

const { Title, Text } = Typography;

type EditCategoryFormData = z.infer<typeof baseCategorySchema>;

interface CategoryData {
    _id: string;
    name: string;
    parentId: string | null;
    description: string;
    isDeleted: boolean;
    slug: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export const EditCategoryPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [categoryTree, setCategoryTree] = useState<TreeNode[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [category, setCategory] = useState<CategoryData | null>(null);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<EditCategoryFormData>({
        resolver: zodResolver(baseCategorySchema),
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                setError("Category ID is required");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                // Fetch category details and all categories in parallel
                const [categoryRes, categoriesRes] = await Promise.all([
                    getCategoryById(id),
                    getAllCategories(1, 100)
                ]);

                const categoryData = categoryRes.data;
                setCategory(categoryData);

                // Build category tree excluding current category to prevent circular references
                const filteredCategories: ICategory[] = categoriesRes.data.filter((cat: ICategory) => cat._id !== id);
                const tree = buildCategoryTree(filteredCategories);
                setCategoryTree(tree);

                // Populate form with existing data
                reset({
                    name: categoryData.name,
                    description: categoryData.description || "",
                    parentId: categoryData.parentId || undefined,
                });

                setError(null);
            } catch (error) {
                console.error("Failed to fetch category:", error);
                setError("Failed to load category details");
                toast.error("Failed to load category details");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, reset]);

    const onSubmit = async (data: EditCategoryFormData) => {
        if (!id) return;

        const toastId = toast.loading("Updating category...");
        try {
            await updateCategoryById(id, data);
            toast.success("Category updated successfully!", { id: toastId });
            navigate(`/admin/categories/${id}`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update category.", { id: toastId });
        }
    };

    const handleCancel = () => {
        navigate(`/admin/categories/${id}`);
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

    if (error || !category) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-6">
                    <Alert
                        message="Lỗi"
                        description={error || "Không tìm thấy danh mục"}
                        type="error"
                        showIcon
                        action={
                            <AntButton size="small" onClick={() => navigate("/admin/categories")}>
                                Quay lại danh sách
                            </AntButton>
                        }
                    />
                </div>
            </div>
        );
    }

    return (
        <div className=" p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <AntButton
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(`/admin/categories/${id}`)}
                        className="flex items-center"
                    >
                        Quay lại
                    </AntButton>
                </div>

                <Title level={2} className="!text-3xl !font-bold !text-gray-900 !mb-2">
                    Chỉnh sửa danh mục
                </Title>
                <Text className="text-gray-600 text-base">
                    Update category information and settings
                </Text>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <Space direction="vertical" size="middle">
                    <Card className="shadow-sm bg-blue-50 border-blue-200">
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <Title level={5} className="!text-blue-800 !mb-1">
                                    Đang chỉnh sửa: {category.name}
                                </Title>
                                <Text className="text-blue-700 text-sm">
                                    ID: {category._id} • Slug: {category.slug} •
                                    Tạo lúc: {new Date(category.createdAt).toLocaleDateString('vi-VN')}
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
                                    Tên danh mục *
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Nhập tên danh mục"
                                    {...register("name")}
                                    className="h-10"
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                                )}
                            </div>

                            <Controller
                                name="parentId"
                                control={control}
                                render={({ field }) => (
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-gray-700">
                                            Danh mục cha
                                        </Label>
                                        <TreeSelect
                                            {...field}
                                            treeData={categoryTree}
                                            style={{ width: '100%', height: '40px' }}
                                            allowClear
                                            placeholder="Chọn danh mục cha (tùy chọn)"
                                            treeDefaultExpandAll
                                            className="h-10"
                                        />
                                        <Text className="text-xs text-gray-500">
                                            Danh mục hiện tại không được hiển thị để tránh tham chiếu vòng
                                        </Text>
                                    </div>
                                )}
                            />
                        </div>

                        <div className="mt-6">
                            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                                Mô tả danh mục
                            </Label>
                            <Textarea
                                id="description"
                                rows={4}
                                placeholder="Nhập mô tả cho danh mục..."
                                {...register("description")}
                                className="mt-2 resize-none"
                            />
                        </div>
                    </Card>
                </Space>

                {/* Category Hierarchy Warning */}
                <Card className="shadow-sm bg-amber-50 border-amber-200">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <Title level={5} className="!text-amber-800 !mb-1">
                                Lưu ý khi thay đổi cấu trúc
                            </Title>
                            <Text className="text-amber-700 text-sm">
                                Việc thay đổi danh mục cha có thể ảnh hưởng đến cấu trúc phân cấp hiện tại.
                                Hãy đảm bảo rằng thay đổi này không làm gián đoạn tổ chức sản phẩm của bạn.
                            </Text>
                        </div>
                    </div>
                </Card>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-4 pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        className="px-8 h-10"
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 h-10 bg-blue-600 hover:bg-blue-700"
                    >
                        <SaveOutlined className="mr-2" />
                        {isSubmitting ? "Đang cập nhật..." : "Cập nhật danh mục"}
                    </Button>
                </div>
            </form>
        </div>
    );
};