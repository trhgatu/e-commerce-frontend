import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateProductById, getProductById } from "../services/productService";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Image } from "antd";
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
import { ICategory, IColor, IBrand, IProduct } from "@/types";
import { getAllColors } from "@/features/admin/colors-management/services/colorService";
import { baseProductSchema } from "@/features/admin/products-management/validator/productValidator";
import { ProductImageUploader, ProductThumbnailUploader } from "@/features/admin/products-management/components";
import { uploadProductImage } from "@/features/admin/products-management/services/imageUploadService";
import { Loader2 } from "lucide-react";
import ROUTERS from "@/constants/routes";

type EditProductFormData = z.infer<typeof baseProductSchema>;

export const EditProductPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [brands, setBrands] = useState<IBrand[]>([]);
    const [colors, setColors] = useState<IColor[]>([]);
    const [product, setProduct] = useState<IProduct | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        setValue,
        watch,
        reset,
    } = useForm<EditProductFormData>({
        resolver: zodResolver(baseProductSchema),
        defaultValues: {
            isFeatured: false,
            colorVariants: [],
        },
    });

    const isFeatured = watch("isFeatured");

    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                toast.error("Product ID is required");
                navigate("/admin/products");
                return;
            }

            try {
                setLoading(true);
                const [productRes, categoryRes, brandRes, colorRes] = await Promise.all([
                    getProductById(id),
                    getAllCategories(1, 100),
                    getAllBrands(1, 100),
                    getAllColors(1, 100)
                ]);

                setProduct(productRes);
                setCategories(categoryRes.data);
                setBrands(brandRes.data);
                setColors(colorRes.data);

                reset({
                    name: productRes.name,
                    description: productRes.description || "",
                    price: productRes.price,
                    stock: productRes.stock,
                    categoryId: productRes.categoryId?._id,
                    brandId: productRes.brandId?._id,
                    isFeatured: productRes.isFeatured || false,
                    colorVariants: productRes.colorVariants?.map((variant): { colorId: string; stock: number } => ({
                        colorId: typeof variant.colorId === "string" ? variant.colorId : variant.colorId?._id,
                        stock: variant.stock
                    })),
                    thumbnail: productRes.thumbnail,
                    images: productRes.images || []
                });
            } catch (error) {
                console.error("Failed to fetch data:", error);
                toast.error("Failed to load product data");
                navigate("/admin/products");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, navigate, reset]);

    const onSubmit = async (data: EditProductFormData) => {
        if (!id) return;

        const toastId = toast.loading("Updating product...");
        try {
            if (thumbnailFile) {
                const url = await uploadProductImage(thumbnailFile);
                data.thumbnail = url;
            }
            if (galleryFiles.length > 0) {
                const urls = await Promise.all(
                    galleryFiles.map((file) => uploadProductImage(file))
                );
                data.images = urls;
            }

            await updateProductById(id, data);
            toast.success("Cập nhật thông tin sản phẩm thành công!", { id: toastId });
            navigate(ROUTERS.ADMIN.products.root);
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi cập nhật sản phẩm.", { id: toastId });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                        <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm</p>
                        <Button onClick={() => navigate("/admin/products")} className="mt-4">
                            Back to Products
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="p-6">
                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Chỉnh sửa sản phẩm: {product.name}
                        </h1>
                        <p className="text-gray-600">Cập nhật thông tin sản phẩm</p>
                    </div>
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
                                    id="stock"
                                    type="number"
                                    placeholder="0"
                                    {...register("stock", { valueAsNumber: true })}
                                    className="h-10"
                                />
                                {errors.stock && (
                                    <p className="text-sm text-red-500 mt-1">{errors.stock.message}</p>
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
                                placeholder="Enter product description..."
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
                                                    {categories.map((c: ICategory) => (
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
                                                    {brands.map((b: IBrand) => (
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
                                {product.thumbnail && !thumbnailFile && (
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-500 mb-2">Current thumbnail:</p>
                                        <Image
                                            width={200}
                                            src={product.thumbnail}
                                            alt="Current thumbnail"
                                            className="w-32 h-32 object-cover rounded-lg border"
                                        />
                                    </div>
                                )}
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
                                    <ProductThumbnailUploader onFileSelected={(file) => setThumbnailFile(file)} />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-sm font-medium text-gray-700">
                                    Bộ sưu tập ảnh
                                </Label>
                                {product.images && product.images.length > 0 && galleryFiles.length === 0 && (
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-500 mb-2">Current images:</p>
                                        <div className="grid grid-cols-3 gap-2">
                                            {product.images.map((img: string, idx: number) => (
                                                <Image
                                                    width={200}
                                                    key={idx}
                                                    src={img}
                                                    alt={`Gallery ${idx + 1}`}
                                                    className="w-20 h-20 object-cover rounded border"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
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
                            {colors.map((color: IColor) => {
                                const colorVariants = watch("colorVariants") || [];
                                const isSelected = colorVariants.some((v) => v.colorId === color._id);
                                const quantity = colorVariants.find((v) => v.colorId === color._id)?.stock || 0;

                                return (
                                    <div
                                        key={color._id}
                                        className={`border rounded-lg p-4 transition-all ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 mb-3">
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
                                                className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                                                style={{ backgroundColor: color.hexCode }}
                                            />
                                            <span className="font-medium text-gray-900">{color.name}</span>
                                        </div>

                                        {isSelected && (
                                            <div className="mt-3">
                                                <Label className="text-xs text-gray-600 mb-1 block">
                                                    Số lượng trong kho
                                                </Label>
                                                <Input
                                                    type="number"
                                                    value={quantity}
                                                    min="0"
                                                    className="h-8 text-sm"
                                                    placeholder="0"
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

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate(`/admin/products/${id}`)}
                            className="px-8"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8"
                        >
                            {isSubmitting ? "Đang cập nhật..." : "Cập nhật sản phẩm"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};