// src/components/feature/user/product/ProductList.tsx
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { IProduct } from '@/types/product';
import { Button } from '@/components/ui/button';
import { mockProducts } from '@/mock/productData';


interface ProductListProps {
    page: number;
    setPage: (page: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({ page, setPage }) => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [totalPages] = useState(Math.ceil(mockProducts.length / 9));

    useEffect(() => {
        const start = (page - 1) * 9;
        const end = start + 9;
        setProducts(mockProducts.slice(start, end));
    }, [page]);

    const handlePrevPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
            <div className="flex justify-center space-x-4">
                <Button onClick={handlePrevPage} disabled={page === 1} variant="outline">
                    Previous
                </Button>
                <span className="self-center">Page {page} of {totalPages}</span>
                <Button onClick={handleNextPage} disabled={page === totalPages} variant="outline">
                    Next
                </Button>
            </div>
        </div>
    );
};

export default ProductList;