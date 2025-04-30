import React, { useEffect, useState } from 'react';
import { mockProducts } from '@/mock/productData';
import ProductCard from '@/features/user/product/components/ProductCard';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const FeaturedProducts: React.FC = () => {
  const featuredProducts = mockProducts
    .filter(product => product.isFeatured)
    .sort((a, b) => {
      if ((a.discountPercent || 0) > 0 && (b.discountPercent || 0) === 0) return -1;
      if ((a.discountPercent || 0) === 0 && (b.discountPercent || 0) > 0) return 1;
      return (b.discountPercent || 0) - (a.discountPercent || 0);
    });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="relative"
    >
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800 md:hidden">
          Sản phẩm nổi bật
        </h3>
      </div>

      {/* Mobile Carousel */}
      {isMobile ? (
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {featuredProducts.map((product) => (
              <CarouselItem key={product._id} className="basis-full md:basis-1/2 lg:basis-1/3">
                <motion.div variants={cardVariants}>
                  <ProductCard product={product} />
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-1" />
          <CarouselNext className="right-1" />
        </Carousel>
      ) : (
        /* Desktop Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 8).map((product) => (
            <motion.div key={product._id} variants={cardVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Xem thêm button */}
      {featuredProducts.length > 8 && (
        <div className="mt-8 text-center">
          <Button variant="outline" className="border-2 border-blue-500 text-blue-500 hover:bg-blue-50">
            Xem tất cả sản phẩm nổi bật
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default FeaturedProducts;