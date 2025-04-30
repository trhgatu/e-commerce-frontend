// src/components/feature/user/product/ProductInfo.tsx
import { useState } from 'react';
import { IProduct } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
interface ProductInfoProps {
  product: IProduct;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const [selectedColorId, setSelectedColorId] = useState<string | null>(
    product.colorVariants[0]?.colorId._id || null
  );
  const [quantity, setQuantity] = useState(1);
  const isOnSale = product.discountPercent && product.discountPercent > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">{product.name}</h1>
        <Badge className="mt-2 bg-blue-500 text-white">{product.categoryId.name}</Badge>
      </div>
      <div className="flex items-center gap-4">
        <p className="text-2xl text-green-600 font-medium">${product.price.toFixed(2)}</p>
        {isOnSale && (
          <Badge className="bg-red-500 text-white">Sale {product.discountPercent}% Off</Badge>
        )}
      </div>
      <p className="text-gray-600">{product.brand}</p>
      <p className="text-gray-700">{product.description}</p>
      <div>
        <p className="text-yellow-500">
          {product.rating.toFixed(1)} ★ ({product.reviewCount} reviews)
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <label htmlFor="color-select" className="block text-sm font-medium text-gray-700">
            Color
          </label>
          <Select
            value={selectedColorId || undefined}
            onValueChange={setSelectedColorId}
            aria-label="Select product color"
          >
            <SelectTrigger id="color-select" className="w-full md:w-[240px] bg-gray-200">
              <SelectValue placeholder="Select Color" />
            </SelectTrigger>
            <SelectContent>
              {product.colorVariants.map(variant => (
                <SelectItem key={variant.colorId._id} value={variant.colorId._id}>
                  {variant.colorId.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="quantity-input" className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <Input
            id="quantity-input"
            type="number"
            min={1}
            max={product.stock}
            value={quantity}
            onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20"
            aria-label="Select quantity"
          />
        </div>
      </div>
      <Button
        className="w-full bg-blue-500 hover:bg-blue-600"
        disabled={!selectedColorId || quantity > product.stock}
        aria-label={`Add ${product.name} to cart`}
      >
        Add to Cart
      </Button>
    </div>
  );
};

export default ProductInfo;