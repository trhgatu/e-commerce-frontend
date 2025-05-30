import React from 'react';
import { mockProducts } from '@/mock/productData';
import ProductCard from './ProductCard';

interface RelatedProductsProps {
  categoryId: string;
  currentProductId: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ categoryId, currentProductId }) => {
  const relatedProducts = mockProducts
    .filter(product => product.categoryId._id === categoryId && product._id !== currentProductId)
    .slice(0, 4);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {relatedProducts.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default RelatedProducts;