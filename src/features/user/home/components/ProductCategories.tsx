import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { mockProducts } from '@/mock/productData';
import ProductCard from '@/features/user/product/components/ProductCard';
import { IProduct } from '@/types/product';

interface CategorySection {
  id: string;
  title: string;
  slug: string;
  filter: (product: IProduct) => boolean;
  bgColor: string;
  accentColor: string;
  svgPattern: React.ReactNode;
}


const GridPattern = () => (
  <svg className="absolute inset-0 opacity-10" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
);

const DiagonalPattern = () => (
  <svg className="absolute inset-0 opacity-10" width="100%" height="100%">
    <defs>
      <pattern id="diagonalHatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="1" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#diagonalHatch)" />
  </svg>
);

const categories: CategorySection[] = [
  {
    id: 'laptop',
    title: 'LAPTOP',
    slug: 'laptop',
    filter: (product) => product.tags?.includes('laptop') || product.categoryId.name.toLowerCase().includes('laptop'),
    bgColor: 'bg-blue-50',
    accentColor: 'text-blue-600',
    svgPattern: <GridPattern />
  },
  {
    id: 'pc',
    title: 'PC - MÁY TÍNH BÀN',
    slug: 'desktop',
    filter: (product) => product.tags?.includes('pc') || product.categoryId.name.toLowerCase().includes('pc'),
    bgColor: 'bg-indigo-50',
    accentColor: 'text-indigo-600',
    svgPattern: <GridPattern />
  },
  {
    id: 'apple',
    title: 'APPLE',
    slug: 'apple',
    filter: (product) => product.brand.toLowerCase() === 'apple',
    bgColor: 'bg-gray-50',
    accentColor: 'text-gray-600',
    svgPattern: <GridPattern />
  },
  {
    id: 'gaming',
    title: 'GAMING',
    slug: 'gaming',
    filter: (product) => product.tags?.includes('gaming') || product.categoryId.name.toLowerCase().includes('gaming'),
    bgColor: 'bg-red-50',
    accentColor: 'text-red-600',
    svgPattern: <DiagonalPattern />
  }
];

const ProductCategories: React.FC = () => {
  return (
    <div className="space-y-24">
      {categories.map((category) => {
        const categoryProducts = mockProducts.filter(category.filter).slice(0, 5);

        return (
          <div key={category.id} className={`relative overflow-hidden rounded-2xl ${category.bgColor} ${category.accentColor} p-8 pt-12`}>
            {/* SVG Background Pattern */}
            {category.svgPattern}

            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">{category.title}</h2>
                <Link to={`/category/${category.slug}`}>
                  <Button variant="outline" className={`border-2 ${category.accentColor}`}>
                    Xem tất cả <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-6">
                {categoryProducts.length > 0 ? (
                  categoryProducts.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))
                ) : (
                  <div className="col-span-4 text-center py-10">
                    <p>Không tìm thấy sản phẩm nào trong danh mục này.</p>
                  </div>
                )}
              </div>

              {categoryProducts.length > 0 && (
                <div className="mt-8 text-center md:hidden">
                  <Link to={`/category/${category.slug}`}>
                    <Button variant="outline" className={`border-2 ${category.accentColor}`}>
                      Xem thêm <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductCategories;