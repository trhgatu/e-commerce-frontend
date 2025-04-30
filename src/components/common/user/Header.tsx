// src/components/common/user/Header.tsx
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Search, ShoppingCart, User, Menu, Heart, Phone, X, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
/* import { useAppSelector, useAppDispatch } from '@/hooks';
import { logout } from '@/store/authSlice'; */

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Hamburger menu animation
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      // Khi mở menu, vô hiệu hóa cuộn trang
      document.body.style.overflow = 'hidden';
    } else {
      // Khi đóng menu, bật lại cuộn trang
      document.body.style.overflow = 'auto';
    }
  };

  // Theo dõi scroll để thay đổi màu header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Đảm bảo overflow được reset khi unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Menu animation variants
  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
      },
    },
  };

  const menuItemVariants = {
    closed: { opacity: 0, x: -10 },
    open: { opacity: 1, x: 0 },
  };

  // Danh mục sản phẩm
  const categories = [
    { name: 'Laptop', slug: 'laptop' },
    { name: 'PC - Máy Tính Bàn', slug: 'desktop' },
    { name: 'Màn Hình', slug: 'monitor' },
    { name: 'Linh Kiện', slug: 'components' },
    { name: 'Phụ Kiện', slug: 'accessories' },
    { name: 'Thiết Bị Thông Minh', slug: 'smart-devices' },
    { name: 'Thiết Bị Mạng', slug: 'networking' },
  ];

  /*  const { isAuthenticated } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  }; */

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-white'
    }`}>
      {/* Top bar */}
      <div className="bg-blue-600 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Phone size={16} className="mr-2" />
              <span className="text-sm">Hotline: 1900 1234</span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-sm">
            <Link to="/about" className="hover:text-blue-200">Về Chúng Tôi</Link>
            <Link to="/contact" className="hover:text-blue-200">Liên Hệ</Link>
            <Link to="/help" className="hover:text-blue-200">Trợ Giúp</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center">
            Tech Store
          </Link>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-xl mx-6">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Search size={18} className="text-gray-500" />
              </div>
            </div>
          </div>

          {/* Navigation - hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/wishlist" className="flex items-center text-gray-700 hover:text-blue-600">
              <Heart size={20} className="mr-1" />
              <span>Yêu Thích</span>
            </Link>
            <Link to="/account" className="flex items-center text-gray-700 hover:text-blue-600">
              <User size={20} className="mr-1" />
              <span>Tài Khoản</span>
            </Link>
            <Link to="/cart" className="flex items-center text-gray-700 hover:text-blue-600 relative">
              <ShoppingCart size={20} className="mr-1" />
              <span>Giỏ Hàng</span>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                0
              </span>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700 z-50"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile search - visible only on mobile */}
        <div className="mt-4 md:hidden">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search size={18} className="text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Category navigation */}
      <div className="bg-gray-100 border-t border-gray-200 overflow-hidden relative">
        <div className="container mx-auto px-4">
          <nav className="hidden md:flex space-x-6 overflow-x-auto scrollbar-hide py-1">
            {categories.map((category) => (
              <div
                key={category.slug}
                onMouseEnter={() => setActiveCategory(category.slug)}
                onMouseLeave={() => setActiveCategory(null)}
                className="relative"
              >
                <Link
                  to={`/category/${category.slug}`}
                  className={`text-gray-700 hover:text-blue-600 whitespace-nowrap flex items-center ${
                    activeCategory === category.slug ? 'text-blue-600' : ''
                  }`}
                >
                  {category.name}
                  <ChevronDown size={14} className="ml-1" />
                </Link>

                {activeCategory === category.slug && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg p-4 min-w-[200px] z-20"
                  >
                    <div className="grid grid-cols-1 gap-2">
                      <Link to={`/category/${category.slug}/all`} className="text-gray-700 hover:text-blue-600 font-medium">
                        Tất cả {category.name}
                      </Link>
                      <Link to={`/category/${category.slug}/bestseller`} className="text-gray-700 hover:text-blue-600">
                        {category.name} Bán Chạy
                      </Link>
                      <Link to={`/category/${category.slug}/new`} className="text-gray-700 hover:text-blue-600">
                        {category.name} Mới Nhất
                      </Link>
                      <Link to={`/category/${category.slug}/promotion`} className="text-gray-700 hover:text-blue-600">
                        {category.name} Khuyến Mãi
                      </Link>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
            <Link to="/promotions" className="text-red-600 font-medium hover:text-red-700 whitespace-nowrap">
              Khuyến Mãi
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile menu - fullscreen overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="exit"
            variants={menuVariants}
            className="fixed inset-0 bg-white z-40 pt-20 overflow-y-auto"
          >
            <div className="container mx-auto px-4 py-6">
              {/* User Actions */}
              <div className="flex justify-around mb-8 border-b border-gray-200 pb-6">
                <Link
                  to="/account"
                  className="flex flex-col items-center text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <motion.div variants={menuItemVariants} className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                    <User size={24} />
                  </motion.div>
                  <motion.span variants={menuItemVariants}>Tài Khoản</motion.span>
                </Link>
                <Link
                  to="/wishlist"
                  className="flex flex-col items-center text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <motion.div variants={menuItemVariants} className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                    <Heart size={24} />
                  </motion.div>
                  <motion.span variants={menuItemVariants}>Yêu Thích</motion.span>
                </Link>
                <Link
                  to="/cart"
                  className="flex flex-col items-center text-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <motion.div variants={menuItemVariants} className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2 relative">
                    <ShoppingCart size={24} />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      0
                    </span>
                  </motion.div>
                  <motion.span variants={menuItemVariants}>Giỏ Hàng</motion.span>
                </Link>
              </div>

              {/* Categories */}
              <div className="mb-8">
                <motion.h3 variants={menuItemVariants} className="text-xl font-bold mb-4 text-gray-800">Danh Mục Sản Phẩm</motion.h3>
                <nav className="grid grid-cols-2 gap-4">
                  {categories.map((category) => (
                    <motion.div key={category.slug} variants={menuItemVariants}>
                      <Link
                        to={`/category/${category.slug}`}
                        className="flex items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="font-medium">{category.name}</span>
                      </Link>
                    </motion.div>
                  ))}
                  <motion.div variants={menuItemVariants}>
                    <Link
                      to="/promotions"
                      className="flex items-center bg-red-50 p-3 rounded-lg hover:bg-red-100 text-red-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="font-medium">Khuyến Mãi</span>
                    </Link>
                  </motion.div>
                </nav>
              </div>

              {/* Support Links */}
              <div>
                <motion.h3 variants={menuItemVariants} className="text-xl font-bold mb-4 text-gray-800">Hỗ Trợ</motion.h3>
                <nav className="flex flex-col space-y-4">
                  <motion.div variants={menuItemVariants}>
                    <Link
                      to="/about"
                      className="block p-3 border-b border-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Về Chúng Tôi
                    </Link>
                  </motion.div>
                  <motion.div variants={menuItemVariants}>
                    <Link
                      to="/contact"
                      className="block p-3 border-b border-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Liên Hệ
                    </Link>
                  </motion.div>
                  <motion.div variants={menuItemVariants}>
                    <Link
                      to="/help"
                      className="block p-3 border-b border-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Trợ Giúp
                    </Link>
                  </motion.div>
                  <motion.div variants={menuItemVariants}>
                    <div className="flex items-center p-3">
                      <Phone size={18} className="mr-2 text-blue-600" />
                      <span>Hotline: 1900 1234</span>
                    </div>
                  </motion.div>
                </nav>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;