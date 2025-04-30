// src/features/user/product/components/ProductCard.tsx
import { IProduct } from '@/types/product';
import { CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { AnimatedCard } from '@/components/ui/animated-card';

interface ProductCardProps {
  product: IProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const isOnSale = product.discountPercent && product.discountPercent > 0;

  // Tính giá sau khi giảm
  const discountedPrice = isOnSale && product.discountPercent
    ? product.price * (1 - (product.discountPercent / 100))
    : null;

  return (
    <AnimatedCard
      className="w-full bg-white shadow-sm hover:shadow-lg"
      role="article"
      aria-labelledby={`product-${product._id}`}
    >
      <div className="relative">
        <Link to={`/product/${product._id}`} aria-label={`Xem chi tiết ${product.name}`}>
          <CardHeader className="p-4 pb-2">
            {isOnSale && (
              <Badge className="absolute top-2 right-2 bg-red-500 text-white z-10">
                -{product.discountPercent}%
              </Badge>
            )}
            {product.isNew && (
              <Badge className="absolute top-2 left-2 bg-blue-500 text-white z-10">
                Mới
              </Badge>
            )}
            <img
              src={product.thumbnail || product.images[0] || 'https://via.placeholder.com/150'}
              alt={product.name}
              className="w-full h-48 object-contain rounded-md transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-2">
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs bg-gray-50">
                {product.categoryId.name}
              </Badge>
              <Badge variant="outline" className="text-xs bg-gray-50">
                {product.brand}
              </Badge>
            </div>
            <CardTitle id={`product-${product._id}`} className="text-base font-medium line-clamp-2 min-h-[3rem]">
              {product.name}
            </CardTitle>

            <div className="flex items-baseline space-x-2">
              {discountedPrice ? (
                <>
                  <span className="text-lg font-semibold text-red-600">
                    {discountedPrice.toLocaleString('vi-VN')}₫
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {product.price.toLocaleString('vi-VN')}₫
                  </span>
                </>
              ) : (
                <span className="text-lg font-semibold text-gray-800">
                  {product.price.toLocaleString('vi-VN')}₫
                </span>
              )}
            </div>

            {product.colorVariants.length > 0 && (
              <div className="flex space-x-1">
                {product.colorVariants.slice(0, 4).map(variant => (
                  <div
                    key={variant.colorId._id}
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: variant.colorId.hexCode }}
                    title={variant.colorId.name}
                    aria-label={`Màu ${variant.colorId.name}`}
                  />
                ))}
                {product.colorVariants.length > 4 && (
                  <div className="w-4 h-4 rounded-full border flex items-center justify-center text-xs bg-gray-100">
                    +{product.colorVariants.length - 4}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Link>

        <CardFooter className="p-3 pt-0 flex gap-2">
          <Button
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white flex gap-2 items-center"
            disabled={!product.colorVariants.length || product.stock <= 0}
            aria-label={`Thêm ${product.name} vào giỏ hàng`}
            size="sm"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Thêm vào giỏ</span>
          </Button>
          <Button
            className="w-9 h-9 p-0"
            variant="outline"
            size="icon"
            aria-label="Thêm vào yêu thích"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </CardFooter>

        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <Badge className="bg-gray-500 text-white text-sm py-1 px-3">Hết hàng</Badge>
          </div>
        )}
      </div>
    </AnimatedCard>
  );
};

export default ProductCard;