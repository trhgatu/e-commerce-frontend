// src/pages/user/ProductDetailPage.tsx
import { useParams } from 'react-router-dom';
import ProductImages from '@/components/feature/user/product/ProductImages';
import ProductInfo from '@/components/feature/user/product/ProductInfo';
import { mockProducts } from '@/components/feature/user/product';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = mockProducts.find(p => p._id === id);

  if (!product) {
    return <div className="text-center p-4 text-red-500">Product not found</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen mt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductImages images={product.images} thumbnail={product.thumbnail} name={product.name} />
        <ProductInfo product={product} />
      </div>
    </div>
  );
};

export default ProductDetailPage;