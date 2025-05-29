import { useNavigate } from "react-router-dom"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createBrand } from "@/features/admin/brands-management/services/brandService";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const schema = z.object({
    name: z.string().min(2, "Brand name is required"),
    description: z.string().optional(),
    logo: z.string().url("Logo must be a valid URL").optional(),
});


type CreateBrandFormData = z.infer<typeof schema>;

export const CreateBrandPage = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CreateBrandFormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: CreateBrandFormData) => {
        const toastId = toast.loading("Creating brand...");
        try {
            await createBrand(data);
            toast.success("Brand created successfully!", { id: toastId });
            navigate("/admin/brands");
        } catch (error) {
            console.error(error);
            toast.error("Failed to create brand.", { id: toastId });
        }
    };
    return (
        <div className="p-6 max-w-xl">
            <h2 className="text-xl font-semibold mb-4">Create brand</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <Label>Brand name</Label>
                    <Input type="text" {...register("name")} />
                    {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>

                <div>
                    <Label>Description</Label>
                    <Textarea rows={4} {...register("description")} />
                </div>
                <div>
                    <Label>Logo URL</Label>
                    <Input type="url" {...register("logo")} />
                    {errors.logo && <p className="text-sm text-red-500">{errors.logo.message}</p>}
                </div>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Brand"}
                </Button>
            </form>
        </div>
    )
}