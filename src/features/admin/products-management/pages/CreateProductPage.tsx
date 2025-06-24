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
import { ArrowLeft, Package, Image, Palette, Tag, DollarSign } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className=" px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/products")}
            className="mb-4 text-gray-600 hover:text-gray-900 p-0 h-auto font-normal"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Tạo sản phẩm mới
              </h1>
              <p className="text-gray-600 mt-1">Add a new product to your inventory</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Thông tin cơ bản</h2>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nhập tên sản phẩm"
                    {...register("name")}
                    className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-2">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="price" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Giá tiền (VND) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="1000"
                    placeholder="0"
                    {...register("price", { valueAsNumber: true })}
                    className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-2">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="stock" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Số lượng trong kho <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="totalStock"
                    type="number"
                    placeholder="0"
                    {...register("totalStock", { valueAsNumber: true })}
                    className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  />
                  {errors.totalStock && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-2">
                      {errors.totalStock.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700">Tùy chọn</Label>
                  <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <Checkbox
                      id="featured"
                      checked={isFeatured}
                      onCheckedChange={(checked) => setValue("isFeatured", Boolean(checked))}
                    />
                    <Label htmlFor="featured" className="text-sm font-medium text-gray-700 cursor-pointer">
                      Đánh dấu là sản phẩm nổi bật
                    </Label>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Label htmlFor="description" className="text-sm font-semibold text-gray-700 block mb-3">
                  Mô tả sản phẩm
                </Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Nhập mô tả sản phẩm..."
                  {...register("description")}
                  className="resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Category & Brand Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-8 py-6 border-b border-gray-200/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <Tag className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Danh mục & Thương hiệu</h2>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        Danh mục <span className="text-red-500">*</span>
                      </Label>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors">
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
                        <p className="text-sm text-red-500 mt-2">{errors.categoryId.message}</p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name="brandId"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        Thương hiệu <span className="text-red-500">*</span>
                      </Label>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors">
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
                        <p className="text-sm text-red-500 mt-2">{errors.brandId.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-8 py-6 border-b border-gray-200/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Image className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Ảnh sản phẩm</h2>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label className="text-sm font-semibold text-gray-700">
                    Ảnh đại diện
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200">
                    <ProductThumbnailUploader onFileSelected={(file) => setThumbnailFile(file)} />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-semibold text-gray-700">
                    Bộ sưu tập ảnh
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200">
                    <ProductImageUploader onFilesSelected={setGalleryFiles} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Color Variants Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-8 py-6 border-b border-gray-200/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Palette className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Màu sắc và Biến thể</h2>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {colors.map((color) => {
                  const selectedColorIds = watch("availableColors") || [];
                  const isSelected = selectedColorIds.includes(color._id);

                  return (
                    <div
                      key={color._id}
                      className={`border-2 rounded-xl p-5 transition-all duration-200 cursor-pointer hover:shadow-md ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        const updated = isSelected
                          ? selectedColorIds.filter((id) => id !== color._id)
                          : [...selectedColorIds, color._id];
                        setValue("availableColors", updated);
                      }}
                    >
                      <div className="flex items-center gap-4">
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
                          className="w-6 h-6 rounded-full border-2 border-white shadow-md ring-2 ring-gray-200"
                          style={{ backgroundColor: color.hexCode }}
                        />
                        <span className="font-medium text-gray-900 text-sm">{color.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Enhanced Submit Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8">
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/products")}
                className="px-8 py-3 h-auto font-medium border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 h-auto font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </div>
                ) : (
                  "Create Product"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};