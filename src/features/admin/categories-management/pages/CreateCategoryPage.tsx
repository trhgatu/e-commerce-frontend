import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import { z } from "zod";
import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TreeSelect } from "antd";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createCategory, getAllCategories } from "@/features/admin/categories-management/services/categoryService";
import { buildCategoryTree } from "@/features/admin/categories-management/utils/convertToTreeData";
import { TreeNode } from "@/features/admin/categories-management/utils/convertToTreeData";
const schema = z.object({
    name: z.string().min(3, 'Category name must be at least 3 characters long').max(255, 'Category name must not exceed 255 characters'),
    description: z.string().optional(),
    icon: z.string().optional(),
    parentId: z.string().optional()
});


type CreateCategoryFormData = z.infer<typeof schema>;

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
        resolver: zodResolver(schema),
    });


    const onSubmit = async (data: CreateCategoryFormData) => {
        const toastId = toast.loading("Creating category...");
        try {
            await createCategory(data);
            toast.success("category created successfully!", { id: toastId });
            navigate("/admin/categories");
        } catch (error) {
            console.error(error);
            toast.error("Failed to create category.", { id: toastId });
        }
    };
    return (
        <div className="p-6 max-w-xl">
            <h2 className="text-xl font-semibold mb-4">Create brand</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <Label>Category name</Label>
                    <Input type="text" {...register("name")} />
                    {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>

                <div>
                    <Label>Description</Label>
                    <Textarea rows={4} {...register("description")} />
                </div>
                <Controller
                    name="parentId"
                    control={control}
                    render={({ field }) => (
                        <TreeSelect
                            {...field}
                            treeData={categoryTree}
                            style={{ width: '100%' }}
                            allowClear
                            placeholder="Select parent category"
                            treeDefaultExpandAll
                        />
                    )}
                />
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Category"}
                </Button>
            </form>
        </div>
    )
}