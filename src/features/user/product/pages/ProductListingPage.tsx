// src/pages/user/ProductListingPage.tsx
import { useState, useEffect, useMemo } from 'react';
import { mockProducts } from '@/mock/productData';
import ProductCard from '@/features/user/product/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setCategory, setBrand, setSearch } from '@/features/user/filter/reducers/filterSlice'
import { motion } from 'framer-motion';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useParams } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const ProductListingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const dispatch = useAppDispatch();
  const { category, brand, search } = useAppSelector(state => state.filter);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (slug) {
      const categoryName = mockProducts.find(p => p.categoryId.name.toLowerCase().replace(/\s+/g, '-') === slug)?.categoryId.name;
      if (categoryName) {
        dispatch(setCategory(categoryName));
      }
    }
  }, [slug, dispatch]);

  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      let match = true;
      if (category && product.categoryId.name !== category) match = false;
      if (brand && product.brand !== brand) match = false;
      if (search && !product.name.toLowerCase().includes(search.toLowerCase())) match = false;
      return match;
    });
  }, [category, brand, search]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const categories = Array.from(new Set(mockProducts.map(p => p.categoryId.name)));
  const brands = Array.from(new Set(mockProducts.map(p => p.brand)));

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearch(e.target.value || null));
    setPage(1);
  };

  const handleCategoryChange = (value: string) => {
    dispatch(setCategory(value === 'all' ? null : value));
    setPage(1);
  };

  const handleBrandChange = (value: string) => {
    dispatch(setBrand(value === 'all' ? null : value));
    setPage(1);
  };

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Tất cả sản phẩm</h1>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={search || ''}
            onChange={handleSearch}
            className="w-full"
            aria-label="Search products"
          />
        </div>
        <div className="flex gap-4">
          <Select onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={handleBrandChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Thương hiệu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả thương hiệu</SelectItem>
              {brands.map(b => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-5 gap-6"
      >
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map(product => (
            <motion.div key={product._id} variants={cardVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-500">Không tìm thấy sản phẩm nào</div>
        )}
      </motion.div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationPrevious
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              className={page === 1 ? 'cursor-not-allowed opacity-50' : ''}
              aria-label="Previous page"
            />
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setPage(i + 1)}
                  isActive={page === i + 1}
                  aria-label={`Page ${i + 1}`}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationNext
              onClick={() => page !== totalPages && setPage(prev => Math.min(prev + 1, totalPages))}
              className={page === totalPages ? 'cursor-not-allowed opacity-50' : ''}
              aria-label="Next page"
            />
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default ProductListingPage;