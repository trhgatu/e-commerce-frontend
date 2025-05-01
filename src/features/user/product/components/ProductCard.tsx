// src/features/user/product/components/ProductCard.tsx
import { Link } from 'react-router-dom';
import { IProduct } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star } from 'lucide-react';

// Hàm lấy màu gradient cho danh mục
const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    'Gaming Laptop': 'from-blue-500 to-blue-700',
    Ultrabook: 'from-green-500 to-green-700',
    'Gaming PC': 'from-red-500 to-red-700',
    Workstation: 'from-purple-500 to-purple-700',
    '4K Monitor': 'from-cyan-500 to-cyan-700',
    'FHD Monitor': 'from-gray-500 to-gray-700',
  };
  return colors[category] || 'from-gray-500 to-gray-700';
};

interface ProductCardProps {
  product: IProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const isOnSale = product.discountPercent && product.discountPercent > 0;
  const isFavorite = false; // Placeholder for favorite state
  const discountedPrice = isOnSale && product.discountPercent
    ? product.price * (1 - product.discountPercent / 100)
    : null;

  /* const handleAddToCart = () => {
    if (product.colorVariants.length > 0) {
      dispatch(
        addToCart({
          product,
          quantity: 1,
          selectedColorId: product.colorVariants[0].colorId._id,
        })
      );
    }
  };
 */
  return (
    <motion.div
      className="group bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      whileHover={{ scale: 1.02 }}
      role="article"
      aria-labelledby={`product-${product._id}`}
    >
      {/* Image Container */}
      <div className="relative">
        <Link to={`/product/${product._id}`} aria-label={`Xem chi tiết ${product.name}`}>
          <img
            src={product.thumbnail || product.images[0] || 'https://via.placeholder.com/150'}
            alt={product.name}
            className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* Category Badge */}
          <Badge
            className={`absolute top-4 left-4 bg-gradient-to-r ${getCategoryColor(
              product.categoryId.name
            )} text-white text-xs font-medium px-2.5 py-1 rounded-full`}
          >
            {product.categoryId.name}
          </Badge>
          {/* Rating Badge */}
          <div className="absolute -bottom-3 right-4 bg-white px-3 py-1 rounded-full shadow-md flex items-center">
            <Star className="text-yellow-400 mr-1 h-4 w-4" aria-hidden="true" />
            <span className="font-bold">{product.rating.toFixed(1)}</span>
            <span className="text-gray-500 text-xs ml-1">({product.reviewCount})</span>
          </div>
        </Link>
        {/* Favorite Button */}
        <button
          /* onClick={handleToggleWishlist} */
          className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md transition-transform duration-300 hover:scale-110 group-hover:bg-red-50"
          aria-label={isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
        >
          {isFavorite ? (
            <Heart className="text-red-500 h-5 w-5" />
          ) : (
            <Heart className="text-gray-400 group-hover:text-red-500 h-5 w-5" />
          )}
        </button>
        {/* Sale/New Badge */}
        {isOnSale && (
          <Badge className="absolute top-12 left-4 bg-red-500 text-white text-xs py-1 px-2">
            -{product.discountPercent}%
          </Badge>
        )}
        {product.isNew && (
          <Badge className="absolute top-4 left-4 mt-8 bg-blue-500 text-white text-xs py-1 px-2">
            Mới
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col">
        <Link to={`/product/${product._id}`}>
          <h3
            id={`product-${product._id}`}
            className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2"
          >
            {product.name}
          </h3>
        </Link>

        {/* Info */}
        <div className="space-y-2 mb-3 text-sm text-gray-500">
          <div className="flex items-center">
            <span className="font-medium text-blue-500 mr-2">Thương hiệu:</span>
            <span>{product.brand}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-blue-500 mr-2">Tình trạng:</span>
            <span
              className={`px-2 py-0.5 text-xs rounded-full ${
                product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {product.stock > 0 ? 'Mở bán' : 'Hết hàng'}
            </span>
          </div>
        </div>

        {/* Color Variants */}
        {product.colorVariants.length > 0 && (
          <div className="flex space-x-1 mt-auto mb-3">
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

        {/* Price and Actions */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            {discountedPrice ? (
              <div className='flex flex-col'>
                <span className="text-lg font-semibold text-red-600">
                  {discountedPrice.toLocaleString('vi-VN')}₫
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {product.price.toLocaleString('vi-VN')}₫
                </span>
              </div>
            ) : (
              <span className="text-lg font-semibold text-gray-800">
                {product.price.toLocaleString('vi-VN')}₫
              </span>
            )}
          </div>
          <Button
            className="text-blue-600 group-hover:text-blue-800 bg-blue-200  flex items-center text-sm font-medium"
            variant="ghost"
            /* onClick={handleAddToCart} */
            disabled={!product.colorVariants.length || product.stock <= 0}
            aria-label={`Thêm ${product.name} vào giỏ hàng`}
          >
            <ShoppingCart className="mr-1 h-4 w-4" />
            Thêm
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;