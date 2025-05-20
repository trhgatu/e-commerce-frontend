import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createProduct } from "../services/productService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectLabel,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { getAllCategories } from "@/features/admin/categories-management/services/categoryService";
import { getAllBrands } from "@/features/admin/brands-management/services/brandService";
import { ICategory } from "@/types/category";
import { IBrand } from "@/types/brand";
import { IColor } from "@/types";
import { getAllColors } from "@/features/admin/colors-management/services/colorService";
import { baseProductSchema } from "@/features/admin/products-management/validator/productValidator";

type CreateProductFormData = z.infer<typeof baseProductSchema>;

export const CreateProductPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [colors, setColors] = useState<IColor[]>([])

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<CreateProductFormData>({
    resolver: zodResolver(baseProductSchema),
    defaultValues: {
      isFeatured: false,
      colorVariants: [],
    },
  });

  const isFeatured = watch("isFeatured");

  useEffect(() => {
    const fetchInitialData = async () => {
      const [categoryRes, brandRes, colorRes] = await Promise.all([
        getAllCategories(1, 100),
        getAllBrands(1, 100),
        getAllColors(1, 100)
      ]);
      setCategories(categoryRes.data);
      setBrands(brandRes.data);
      setColors(colorRes.data)
    };
    fetchInitialData();
  }, []);

  const onSubmit = async (data: CreateProductFormData) => {
    const toastId = toast.loading("Creating product...");
    try {
      await createProduct(data);
      toast.success("Product created successfully!", { id: toastId });
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create product.", { id: toastId });
    }
  };

  return (
    <div className="p-6 max-w-xl">
      <h2 className="text-xl font-semibold mb-4">Create New Product</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Product Name</Label>
          <Input type="text" {...register("name")} />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <Label>Price (VND)</Label>
          <Input type="number" step="1000" {...register("price", { valueAsNumber: true })} />
          {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
        </div>

        <div>
          <Label>Stock</Label>
          <Input type="number" {...register("stock", { valueAsNumber: true })} />
          {errors.stock && <p className="text-sm text-red-500">{errors.stock.message}</p>}
        </div>

        <div>
          <Label>Description</Label>
          <Textarea rows={4} {...register("description")} />
        </div>

        <div>
          <Label>Thumbnail URL</Label>
          <Input type="url" {...register("thumbnail")} />
          {errors.thumbnail && <p className="text-sm text-red-500">{errors.thumbnail.message}</p>}
        </div>

        <div className="">
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <div>
                <Label>Category</Label>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Danh mục</SelectLabel>
                      {categories.map((c) => (
                        <SelectItem key={c._id} value={c._id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.categoryId && (
                  <p className="text-sm text-red-500">{errors.categoryId.message}</p>
                )}
              </div>
            )}
          />

          <Controller
            name="brandId"
            control={control}
            render={({ field }) => (
              <div>
                <Label>Brand</Label>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn thương hiệu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Thương hiệu</SelectLabel>
                      {brands.map((b) => (
                        <SelectItem key={b._id} value={b._id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.brandId && (
                  <p className="text-sm text-red-500">{errors.brandId.message}</p>
                )}
              </div>
            )}
          />
          <div>
            <Label>Color Variants</Label>
            {colors.map((color) => {
              const colorVariants = watch("colorVariants") || [];
              const isSelected = colorVariants.some((v) => v.colorId === color._id);
              const quantity = colorVariants.find((v) => v.colorId === color._id)?.stock || 0;

              return (
                <div key={color._id} className="flex items-center gap-2 mb-2">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => {
                      const updated = checked
                        ? [...colorVariants, { colorId: color._id, stock: 1 }]
                        : colorVariants.filter((v) => v.colorId !== color._id);
                      setValue("colorVariants", updated);
                    }}
                  />
                  <span>{color.name}</span>
                  <div
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: color.hexCode }}
                  />
                  {isSelected && (
                    <Input
                      type="number"
                      value={quantity}
                      className="w-20"
                      onChange={(e) => {
                        const updated = colorVariants.map((v) =>
                          v.colorId === color._id ? { ...v, stock: Number(e.target.value) } : v
                        );
                        setValue("colorVariants", updated);
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={isFeatured}
              onCheckedChange={(checked) => setValue("isFeatured", Boolean(checked))}
            />
            <Label>Mark as featured</Label>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  );
};
