import React, { useState } from "react";
import { ProductList } from "@/features/user/product/components";
import { Banner, CategorySection, PromotionSection, FeaturedProducts, ProductCategories } from "@/features/user/home/components";
import { motion } from "framer-motion";

// Animation variants
const pageVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const sectionVariants = {
  initial: { y: 20, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const HomePage: React.FC = () => {
  const [page, setPage] = useState(1);

  return (
    <motion.div
      className="space-y-8 pb-16"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* Hero Banner */}
      <motion.div variants={sectionVariants}>
        <Banner />
      </motion.div>

      {/* Danh mục sản phẩm */}
      <motion.div variants={sectionVariants} className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <CategorySection />
        </div>
      </motion.div>

      {/* Sản phẩm nổi bật */}
      <motion.div variants={sectionVariants} className="container mx-auto px-4 py-8">
        <div className="mb-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Sản Phẩm Nổi Bật</h2>
          <FeaturedProducts />
        </div>
      </motion.div>

      {/* Danh mục sản phẩm (PC, Laptop, Apple, Gaming) */}
      <motion.div variants={sectionVariants} className="container mx-auto px-4 py-4">
        <ProductCategories />
      </motion.div>

      {/* Khuyến mãi */}
      <motion.div variants={sectionVariants} className="bg-gray-50 py-8">
        <PromotionSection />
      </motion.div>

      {/* Tất cả sản phẩm */}
      <motion.div variants={sectionVariants} className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Tất Cả Sản Phẩm</h2>
          <ProductList page={page} setPage={setPage} />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default HomePage