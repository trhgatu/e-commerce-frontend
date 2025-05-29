import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import { z } from "zod";
import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TreeSelect, Card, Typography } from "antd";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createCategory, getAllCategories } from "@/features/admin/categories-management/services/categoryService";
import { buildCategoryTree } from "@/features/admin/categories-management/utils/convertToTreeData";
import { TreeNode } from "@/features/admin/categories-management/utils/convertToTreeData";
import { baseCategorySchema } from "@/features/admin/categories-management/validator/category";

const { Title, Text } = Typography;

type CreateCategoryFormData = z.infer<typeof baseCategorySchema>;

export const CreateCategoryPage = () => {
    const navigate = useNavigate();
    const [categoryTree, setCategoryTree] = useState<TreeNode[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await getAllCategories(1, 100);
            const tree = buildCategoryTree(res.data);
            setCategoryTree(tree);
        };
        fetchCategories();
    }, []);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CreateCategoryFormData>({
        resolver: zodResolver(baseCategorySchema),
    });

    const onSubmit = async (data: CreateCategoryFormData) => {
        const toastId = toast.loading("Creating category...");
        try {
            await createCategory(data);
            toast.success("Category created successfully!", { id: toastId });
            navigate("/admin/categories");
        } catch (error) {
            console.error(error);
            toast.error("Failed to create category.", { id: toastId });
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <Title level={2} className="!text-3xl !font-bold !text-gray-900 !mb-2">
                    Tạo danh mục mới
                </Title>
                <Text className="text-gray-600 text-base">
                    Add a new category to organize your products
                </Text>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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

                {/* Category Hierarchy Info */}
                <Card className="shadow-sm bg-blue-50 border-blue-200">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <Title level={5} className="!text-blue-800 !mb-1">
                                Về cấu trúc danh mục
                            </Title>
                            <Text className="text-blue-700 text-sm">
                                Bạn có thể tạo danh mục độc lập hoặc chọn danh mục cha để tạo cấu trúc phân cấp.
                                Danh mục con sẽ kế thừa thuộc tính từ danh mục cha và giúp tổ chức sản phẩm tốt hơn.
                            </Text>
                        </div>
                    </div>
                </Card>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-4 pt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/admin/categories")}
                        className="px-8 h-10"
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 h-10 bg-blue-600 hover:bg-blue-700"
                    >
                        {isSubmitting ? "Đang tạo..." : "Tạo danh mục"}
                    </Button>
                </div>
            </form>
        </div>
    );
};