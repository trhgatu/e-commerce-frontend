import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { IBrand, ICategory, IColor } from "@/types";
import { getAllBrands } from "@/features/admin/brands-management/services/brandService";
import { getAllCategories } from "@/features/admin/categories-management/services/categoryService";
import { getAllColors } from "@/features/admin/colors-management/services/colorService";
import { baseProductSchema } from "@/features/admin/products-management/validator/productValidator";
import { ProductImageUploader, ProductThumbnailUploader } from ".";
import { uploadProductImage } from "../services/imageUploadService";
import { z } from "zod";

type ProductFormData = z.infer<typeof baseProductSchema>;

type ProductFormProps = {
  initialValues?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isSubmitting: boolean;
  submitLabel?: string;
};

export const ProductForm = ({
  initialValues = {},
  onSubmit,
  isSubmitting,
  submitLabel = "Save",
}: ProductFormProps) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [colors, setColors] = useState<IColor[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(baseProductSchema),
    defaultValues: {
      isFeatured: false,
      colorVariants: [],
      ...initialValues,
    },
  });

  const isFeatured = watch("isFeatured");

  useEffect(() => {
    const fetchData = async () => {
      const [categoryRes, brandRes, colorRes] = await Promise.all([
        getAllCategories(1, 100),
        getAllBrands(1, 100),
        getAllColors(1, 100),
      ]);
      setCategories(categoryRes.data);
      setBrands(brandRes.data);
      setColors(colorRes.data);
    };
    fetchData();
  }, []);

  const handleFormSubmit = async (data: ProductFormData) => {
    if (thumbnailFile) {
      data.thumbnail = await uploadProductImage(thumbnailFile);
    }
    if (galleryFiles.length) {
      data.images = await Promise.all(galleryFiles.map(uploadProductImage));
    }
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Basic Info */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b">
          Thông tin cơ bản
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name">Tên sản phẩm *</Label>
            <Input id="name" {...register("name")} placeholder="Nhập tên sản phẩm" />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="price">Giá tiền (VND) *</Label>
            <Input id="price" type="number" step="1000" {...register("price", { valueAsNumber: true })} />
            {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
          </div>

          <div>
            <Label htmlFor="stock">Số lượng trong kho *</Label>
            <Input id="stock" type="number" {...register("stock", { valueAsNumber: true })} />
            {errors.stock && <p className="text-sm text-red-500">{errors.stock.message}</p>}
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="isFeatured"
              checked={isFeatured}
              onCheckedChange={(checked) => setValue("isFeatured", Boolean(checked))}
            />
            <Label htmlFor="isFeatured">Nổi bật</Label>
          </div>
        </div>

        <div className="mt-6">
          <Label htmlFor="description">Mô tả sản phẩm</Label>
          <Textarea id="description" rows={4} {...register("description")} />
        </div>
      </div>

      {/* Category & Brand */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-6 pb-3 border-b">Danh mục & Thương hiệu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <div>
                <Label>Danh mục *</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue placeholder="Chọn danh mục" /></SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId.message}</p>}
              </div>
            )}
          />

          <Controller
            name="brandId"
            control={control}
            render={({ field }) => (
              <div>
                <Label>Thương hiệu *</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue placeholder="Chọn thương hiệu" /></SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Brands</SelectLabel>
                      {brands.map((b) => (
                        <SelectItem key={b._id} value={b._id}>{b.name}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.brandId && <p className="text-sm text-red-500">{errors.brandId.message}</p>}
              </div>
            )}
          />
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-6 pb-3 border-b">Ảnh sản phẩm</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Label>Ảnh đại diện</Label>
            <ProductThumbnailUploader onFileSelected={setThumbnailFile} />
          </div>
          <div>
            <Label>Bộ sưu tập ảnh</Label>
            <ProductImageUploader onFilesSelected={setGalleryFiles} />
          </div>
        </div>
      </div>

      {/* Color Variants */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-6 pb-3 border-b">Màu sắc và Biến thể</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {colors.map((color) => {
            const colorVariants = watch("colorVariants") || [];
            const isSelected = colorVariants.some((v) => v.colorId === color._id);
            const quantity = colorVariants.find((v) => v.colorId === color._id)?.stock || 0;

            return (
              <div
                key={color._id}
                className={`border rounded-lg p-4 transition ${
                  isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => {
                      const updated = checked
                        ? [...colorVariants, { colorId: color._id, stock: 1 }]
                        : colorVariants.filter((v) => v.colorId !== color._id);
                      setValue("colorVariants", updated);
                    }}
                  />
                  <div
                    className="w-5 h-5 rounded-full border"
                    style={{ backgroundColor: color.hexCode }}
                  />
                  <span>{color.name}</span>
                </div>

                {isSelected && (
                  <div>
                    <Label>Số lượng</Label>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const updated = colorVariants.map((v) =>
                          v.colorId === color._id ? { ...v, stock: Number(e.target.value) } : v
                        );
                        setValue("colorVariants", updated);
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-4 pt-6">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Đang xử lý..." : submitLabel}
        </Button>
      </div>
    </form>
  );
};
