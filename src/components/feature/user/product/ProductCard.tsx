// src/components/feature/user/product/ProductCard.tsx
import { IProduct } from '@/types/product';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: IProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const isOnSale = product.discountPercent && product.discountPercent > 0;

  return (
    <Card
      className="w-full bg-white shadow-md transition-transform hover:scale-105"
      role="article"
      aria-labelledby={`product-${product._id}`}
    >
      <Link to={`/product/${product._id}`} aria-label={`View details of ${product.name}`}>
        <CardHeader className="p-4">
          <img
            src={product.thumbnail || product.images[0] || 'https://via.placeholder.com/150'}
            alt={product.name}
            className="w-full h-40 object-cover rounded-md"
            loading="lazy"
          />
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          <Badge className="bg-blue-500 text-white">{product.categoryId.name}</Badge>
          <CardTitle id={`product-${product._id}`} className="text-lg font-semibold line-clamp-2">
            {product.name}
          </CardTitle>
        </CardContent>
      </Link>
      <CardContent className="p-4 pt-0 space-y-2">
        <p className="text-green-600 font-medium">${product.price.toFixed(2)}</p>
        {isOnSale && (
          <Badge className="bg-red-500 text-white">Sale {product.discountPercent}% Off</Badge>
        )}
        <div className="flex space-x-2">
          {product.colorVariants.map(variant => (
            <div
              key={variant.colorId._id}
              className="w-6 h-6 rounded-full border"
              style={{ backgroundColor: variant.colorId.hexCode }}
              title={variant.colorId.name}
              aria-label={`Color ${variant.colorId.name}`}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <Button
          className="w-full bg-blue-500 hover:bg-blue-600"
          disabled={!product.colorVariants.length}
          aria-label={`Add ${product.name} to cart`}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;