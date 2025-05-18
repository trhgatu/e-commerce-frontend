import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createProduct } from "../services/productService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { getAllCategories } from "@/features/admin/categories-management/services/categoryService";
import { getAllBrands } from "@/features/admin/brands-management/services/brandService";
import { ICategory } from "@/types/category";
import { IBrand } from "@/types/brand";

const schema = z.object({
  name: z.string().min(2, "Product name is required"),
  price: z.number({ invalid_type_error: "Price must be a number" }).min(0),
  stock: z.number({ invalid_type_error: "Stock must be a number" }).min(0),
  description: z.string().optional(),
  thumbnail: z.string().url("Thumbnail must be a valid URL").optional(),
  isFeatured: z.boolean().optional(),
  categoryId: z.string().min(1, "Category is required"),
  brand: z.string().min(1, "Brand is required"),
});

type CreateProductFormData = z.infer<typeof schema>;

export const CreateProductPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<CreateProductFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      isFeatured: false,
    },
  });

  const isFeatured = watch("isFeatured");

  useEffect(() => {
    const fetchInitialData = async () => {
      const [categoryRes, brandRes] = await Promise.all([
        getAllCategories(1, 100),
        getAllBrands(1, 100),
      ]);
      setCategories(categoryRes.data);
      setBrands(brandRes.data);
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

        <div>
          <Label>Category</Label>
          <select {...register("categoryId")} className="w-full border px-2 py-2 rounded">
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId.message}</p>}
        </div>

        <div>
          <Label>Brand</Label>
          <select {...register("brand")} className="w-full border px-2 py-2 rounded">
            <option value="">Select brand</option>
            {brands.map((b) => (
              <option key={b._id} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
          {errors.brand && <p className="text-sm text-red-500">{errors.brand.message}</p>}
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
      </form>
    </div>
  );
};
