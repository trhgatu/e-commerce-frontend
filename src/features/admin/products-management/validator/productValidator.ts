import { z } from 'zod';

export const baseProductSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  price: z.number({ invalid_type_error: "Price must be a number" }).min(0),
  totalStock: z.number({ invalid_type_error: "Stock must be a number" }).min(0),
  description: z.string().optional(),
  thumbnail: z.string().url("Thumbnail must be a valid URL").optional(),
  isFeatured: z.boolean().optional(),
  categoryId: z.string().min(1, "Category is required"),
  brandId: z.string().min(1, "Brand is required"),
  availableColors: z
    .array(
      z.string().min(1)
    )
    .optional(),
  images: z
    .array(z.string().url("Each image must be a valid URL"))
    .optional(),
});
