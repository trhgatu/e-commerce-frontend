import { useNavigate } from "react-router-dom"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, Typography, Space } from "antd";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createBrand } from "@/features/admin/brands-management/services/brandService";
import CancelButton from "@/components/common/admin/CancelButton";
import { baseBrandSchema } from "@/features/admin/brands-management/validator/brand";
import ROUTERS from "@/constants/routes";

const { Title, Text } = Typography;



type CreateBrandFormData = z.infer<typeof baseBrandSchema>;

export const CreateBrandPage = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CreateBrandFormData>({
        resolver: zodResolver(baseBrandSchema),
    });

    const onSubmit = async (data: CreateBrandFormData) => {
        const toastId = toast.loading("Creating brand...");
        try {
            // Clean up empty string values
            const cleanedData = {
                ...data,
                logo: data.logo || undefined,
                website: data.website || undefined,
                email: data.email || undefined,
            };

            await createBrand(cleanedData);
            toast.success("Brand created successfully!", { id: toastId });
            navigate("/admin/brands");
        } catch (error) {
            console.error(error);
            toast.error("Failed to create brand.", { id: toastId });
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <Title level={2} className="!text-3xl !font-bold !text-gray-900 !mb-2">
                    Tạo thương hiệu mới
                </Title>
                <Text className="text-gray-600 text-base">
                    Add a new brand to organize your products by manufacturer
                </Text>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <Space size="middle" direction="vertical">
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
                                    Tên thương hiệu *
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Nhập tên thương hiệu"
                                    {...register("name")}
                                    className="h-10"
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="logo" className="text-sm font-medium text-gray-700">
                                    Logo URL
                                </Label>
                                <Input
                                    id="logo"
                                    type="url"
                                    placeholder="https://example.com/logo.png"
                                    {...register("logo")}
                                    className="h-10"
                                />
                                {errors.logo && (
                                    <p className="text-sm text-red-500 mt-1">{errors.logo.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="space-y-2">
                                <Label htmlFor="website" className="text-sm font-medium text-gray-700">
                                    Website
                                </Label>
                                <Input
                                    id="website"
                                    type="url"
                                    placeholder="https://brand-website.com"
                                    {...register("website")}
                                    className="h-10"
                                />
                                {errors.website && (
                                    <p className="text-sm text-red-500 mt-1">{errors.website.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                    Email liên hệ
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="contact@brand.com"
                                    {...register("email")}
                                    className="h-10"
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="mt-6">
                            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                                Mô tả thương hiệu
                            </Label>
                            <Textarea
                                id="description"
                                rows={4}
                                placeholder="Nhập mô tả cho thương hiệu..."
                                {...register("description")}
                                className="mt-2 resize-none"
                            />
                        </div>
                    </Card>

                    {/* Brand Info */}
                    <Card className="shadow-sm bg-green-50 border-green-200">
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <Title level={5} className="!text-green-800 !mb-1">
                                    Về thương hiệu
                                </Title>
                                <Text className="text-green-700 text-sm">
                                    Thương hiệu giúp khách hàng dễ dàng nhận biết và lựa chọn sản phẩm.
                                    Thông tin logo và website sẽ hiển thị trên trang sản phẩm để tăng uy tín và độ tin cậy.
                                </Text>
                            </div>
                        </div>
                    </Card>
                </Space>

                <div className="flex justify-end gap-4 pt-6">
                    <CancelButton to={ROUTERS.ADMIN.brands?.root || "/admin/brands"}/>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 h-10 bg-green-600 hover:bg-green-700"
                    >
                        {isSubmitting ? "Đang tạo..." : "Tạo thương hiệu"}
                    </Button>
                </div>
            </form>
        </div>
    );
};