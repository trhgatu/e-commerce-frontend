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
import { ICategory, IColor, IBrand } from "@/types";
import { getAllColors } from "@/features/admin/colors-management/services/colorService";
import { baseProductSchema } from "@/features/admin/products-management/validator/productValidator";
import { ProductImageUploader, ProductThumbnailUploader } from "@/features/admin/products-management/components";
import { uploadProductImage } from "@/features/admin/products-management/services/imageUploadService";

type CreateProductFormData = z.infer<typeof baseProductSchema>;

export const CreateProductPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [colors, setColors] = useState<IColor[]>([])
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
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
      availableColors: [],
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
      if (thumbnailFile) {
        const url = await uploadProductImage(thumbnailFile);
        data.thumbnail = url;
      }
      if (galleryFiles.length) {
        const urls = await Promise.all(
          galleryFiles.map((file) => uploadProductImage(file))
        );
        data.images = urls;
      }
      await createProduct(data);
      toast.success("Product created successfully!", { id: toastId });
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create product.", { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tạo sản phẩm mới</h1>
          <p className="text-gray-600">Add a new product to your inventory</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            {/* Basic Information Section */}
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              Thông tin cơ bản
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Tên sản phẩm *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nhập tên sản phẩm"
                  {...register("name")}
                  className="h-10"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                  Giá tiền (VND) *
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="1000"
                  placeholder="0"
                  {...register("price", { valueAsNumber: true })}
                  className="h-10"
                />
                {errors.price && (
                  <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock" className="text-sm font-medium text-gray-700">
                  Số lượng trong kho *
                </Label>
                <Input
                  id="totalStock"
                  type="number"
                  placeholder="0"
                  {...register("totalStock", { valueAsNumber: true })}
                  className="h-10"
                />
                {errors.totalStock && (
                  <p className="text-sm text-red-500 mt-1">{errors.totalStock.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-3 h-10">
                  <Checkbox
                    id="featured"
                    checked={isFeatured}
                    onCheckedChange={(checked) => setValue("isFeatured", Boolean(checked))}
                  />
                  <Label htmlFor="featured" className="text-sm font-medium text-gray-700">
                    Nổi bật
                  </Label>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Mô tả sản phẩm
              </Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="Nhập mô tả sản phẩm..."
                {...register("description")}
                className="mt-2 resize-none"
              />
            </div>
          </div>

          {/* Category & Brand Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              Danh mục & Thương hiệu
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Danh mục *</Label>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Categories</SelectLabel>
                          {categories.map((c) => (
                            <SelectItem key={c._id} value={c._id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.categoryId && (
                      <p className="text-sm text-red-500 mt-1">{errors.categoryId.message}</p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="brandId"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Thương hiệu *</Label>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Chọn thương hiệu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Brands</SelectLabel>
                          {brands.map((b) => (
                            <SelectItem key={b._id} value={b._id}>
                              {b.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {errors.brandId && (
                      <p className="text-sm text-red-500 mt-1">{errors.brandId.message}</p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              Ảnh sản phẩm
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Ảnh đại diện
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
                  <ProductThumbnailUploader onFileSelected={(file) => setThumbnailFile(file)} />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Bộ sưu tập ảnh
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
                  <ProductImageUploader onFilesSelected={setGalleryFiles} />
                </div>
              </div>
            </div>
          </div>

          {/* Color Variants Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              Màu sắc và Biến thể
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {colors.map((color) => {
                const selectedColorIds = watch("availableColors") || [];
                const isSelected = selectedColorIds.includes(color._id);

                return (
                  <div
                    key={color._id}
                    className={`border rounded-lg p-4 transition-all ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                          const updated = checked
                            ? [...selectedColorIds, color._id]
                            : selectedColorIds.filter((id) => id !== color._id);
                          setValue("availableColors", updated);
                        }}
                      />
                      <div
                        className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: color.hexCode }}
                      />
                      <span className="font-medium text-gray-900">{color.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/products")}
              className="px-8"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-8"
            >
              {isSubmitting ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};