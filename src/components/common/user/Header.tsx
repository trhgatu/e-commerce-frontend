import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, ShoppingCart, Menu, Heart, Phone, X, ChevronDown, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { logout } from '@/store/authSlice';
import { setSearch } from '@/store/filterSlice';
import { mockProducts } from '@/mock/productData';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useAppSelector(state => state.auth);
  /* const cartItems = useAppSelector(state => state.cart.items); */
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(mockProducts.map(p => p.categoryId.name))).map(name => ({
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
  }));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = isMobileMenuOpen ? 'auto' : 'hidden';
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
    setIsMobileMenuOpen(false);
  };

  const handleCategoryClick = (name: string, slug: string) => {
    dispatch(setSearch(name));
    navigate(`/category/${slug}`);
    setIsMobileMenuOpen(false);
  };

  const menuVariants = {
    closed: { opacity: 0, y: -20, transition: { duration: 0.2 } },
    open: { opacity: 1, y: 0, transition: { duration: 0.3, staggerChildren: 0.05 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const menuItemVariants = {
    closed: { opacity: 0, x: -10 },
    open: { opacity: 1, x: 0 },
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white'
        }`}
    >
      <div className="bg-blue-600 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Phone size={16} className="mr-2" />
            <span className="text-sm">Hotline: 1900 1234</span>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-sm">
            {loading ? (
              <Skeleton className="h-6 w-24" />
            ) : isAuthenticated ? (
              <>
                <span className="text-blue-200">Xin chào, {user?.name}</span>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="hover:text-blue-200">
                    Admin
                  </Link>
                )}
                <button onClick={handleLogout} className="hover:text-blue-200">
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/login" className="hover:text-blue-200">
                  Đăng nhập
                </Link>
                <span className="text-blue-300">|</span>
                <Link to="/auth/register" className="hover:text-blue-200">
                  Đăng ký
                </Link>
              </>
            )}
            <span className="text-blue-300">|</span>
            <Link to="/about" className="hover:text-blue-200">
              Về chúng tôi
            </Link>
            <Link to="/contact" className="hover:text-blue-200">
              Liên hệ
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center">
            Tech Store
          </Link>
          <div className="hidden md:flex flex-1 max-w-xl mx-6">
            <div className="relative w-full">
              {loading ? (
                <Skeleton className="h-10 w-full rounded-lg" />
              ) : (
                <Input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300"
                  onChange={(e) => {
                    dispatch(setSearch(e.target.value));
                    navigate(`/products`);
                  }}
                  aria-label="Search products"
                />
              )}
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            ) : isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" asChild>
                  <Link to="/account" className="flex items-center">
                    <User size={20} className="mr-1" />
                    {user?.name}
                  </Link>
                </Button>
                {user?.role === 'admin' && (
                  <Button variant="ghost" asChild>
                    <Link to="/admin">Admin</Link>
                  </Button>
                )}
                <Button variant="ghost" onClick={handleLogout}>
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/auth/login">Đăng nhập</Link>
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700" asChild>
                  <Link to="/auth/register">Đăng ký</Link>
                </Button>
              </div>
            )}
            <Link to="/wishlist" className="flex items-center text-gray-700 hover:text-blue-600">
              <Heart size={20} className="mr-1" aria-hidden="true" />
            </Link>
            <Link to="/cart" className="flex items-center text-gray-700 hover:text-blue-600 relative">
              <ShoppingCart size={20} className="mr-1" aria-hidden="true" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {/* {cartItems.length} */}
              </span>
            </Link>
          </nav>
          <button
            className="md:hidden text-gray-700 z-50"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
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
        <div className="mt-4 md:hidden">
          <div className="relative w-full">
            {loading ? (
              <Skeleton className="h-10 w-full rounded-lg" />
            ) : (
              <Input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300"
                onChange={(e) => {
                  dispatch(setSearch(e.target.value));
                  navigate(`/products`);
                }}
                aria-label="Search products"
              />
            )}
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </div>

      <div className="bg-gray-100 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <nav className="hidden md:flex space-x-6 py-2 overflow-x-auto scrollbar-hide">
            {categories.map(category => (
              <div
                key={category.slug}
                className="relative"
                onMouseEnter={() => setActiveCategory(category.slug)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <button
                  onClick={() => handleCategoryClick(category.name, category.slug)}
                  className={`text-gray-700 hover:text-blue-600 flex items-center whitespace-nowrap ${activeCategory === category.slug ? 'text-blue-600' : ''
                    }`}
                >
                  {category.name}
                  <ChevronDown size={14} className="ml-1" />
                </button>
                <AnimatePresence>
                  {activeCategory === category.slug && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg p-4 min-w-[200px] z-20"
                    >
                      <Link
                        to={`/category/${category.slug}`}
                        className="block text-gray-700 hover:text-blue-600 font-medium"
                        onClick={() => handleCategoryClick(category.name, category.slug)}
                      >
                        Tất cả {category.name}
                      </Link>
                      <Link
                        to={`/category/${category.slug}/bestseller`}
                        className="block text-gray-700 hover:text-blue-600"
                      >
                        {category.name} Bán Chạy
                      </Link>
                      <Link
                        to={`/category/${category.slug}/new`}
                        className="block text-gray-700 hover:text-blue-600"
                      >
                        {category.name} Mới Nhất
                      </Link>
                      <Link
                        to={`/category/${category.slug}/promotion`}
                        className="block text-gray-700 hover:text-blue-600"
                      >
                        {category.name} Khuyến Mãi
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            <Link to="/promotions" className="text-red-600 font-medium hover:text-red-700 whitespace-nowrap">
              Khuyến Mãi
            </Link>
          </nav>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="exit"
            className="fixed inset-0 bg-white z-40 pt-20 pb-8 overflow-y-auto md:hidden"
          >
            <div className="container mx-auto px-4">
              <div className="flex flex-col space-y-3 mb-8 border-b border-gray-200 pb-6">
                {loading ? (
                  <Skeleton className="h-10 w-32 mx-auto rounded-md" />
                ) : isAuthenticated ? (
                  <>
                    <motion.div variants={menuItemVariants} className="flex items-center justify-center">
                      <User size={24} className="mr-2" />
                      <span className="text-lg font-medium">{user?.name}</span>
                    </motion.div>
                    {user?.role === 'admin' && (
                      <motion.div variants={menuItemVariants}>
                        <Link to="/admin" className="block p-3 text-center" onClick={toggleMobileMenu}>
                          Admin
                        </Link>
                      </motion.div>
                    )}
                    <motion.div variants={menuItemVariants}>
                      <button
                        onClick={handleLogout}
                        className="w-full p-3 text-center text-gray-700 hover:text-blue-600"
                      >
                        Đăng xuất
                      </button>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div variants={menuItemVariants}>
                      <Button variant="outline" size="lg" className="w-full" asChild>
                        <Link to="/login" onClick={toggleMobileMenu}>
                          Đăng nhập
                        </Link>
                      </Button>
                    </motion.div>
                    <motion.div variants={menuItemVariants}>
                      <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                        <Link to="/register" onClick={toggleMobileMenu}>
                          Đăng ký
                        </Link>
                      </Button>
                    </motion.div>
                  </>
                )}
              </div>
              <div className="flex justify-around mb-8 border-b border-gray-200 pb-6">
                <Link
                  to="/wishlist"
                  className="flex flex-col items-center text-gray-700"
                  onClick={toggleMobileMenu}
                >
                  <motion.div
                    variants={menuItemVariants}
                    className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2"
                  >
                    <Heart size={24} />
                  </motion.div>
                  <motion.span variants={menuItemVariants}>Yêu Thích</motion.span>
                </Link>
                <Link
                  to="/cart"
                  className="flex flex-col items-center text-gray-700 relative"
                  onClick={toggleMobileMenu}
                >
                  <motion.div
                    variants={menuItemVariants}
                    className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2 relative"
                  >
                    <ShoppingCart size={24} />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {/*  {cartItems.length} */}
                    </span>
                  </motion.div>
                  <motion.span variants={menuItemVariants}>Giỏ Hàng</motion.span>
                </Link>
              </div>
              <div className="mb-8">
                <motion.h3 variants={menuItemVariants} className="text-xl font-bold mb-4 text-gray-800">
                  Danh Mục Sản Phẩm
                </motion.h3>
                <nav className="flex flex-col space-y-2">
                  {categories.map(category => (
                    <motion.div key={category.slug} variants={menuItemVariants}>
                      <button
                        onClick={() => handleCategoryClick(category.name, category.slug)}
                        className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 text-left"
                      >
                        {category.name}
                      </button>
                    </motion.div>
                  ))}
                  <motion.div variants={menuItemVariants}>
                    <Link
                      to="/promotions"
                      className="block p-3 bg-red-50 rounded-lg hover:bg-red-100 text-red-600"
                      onClick={toggleMobileMenu}
                    >
                      Khuyến Mãi
                    </Link>
                  </motion.div>
                </nav>
              </div>
              <div>
                <motion.h3 variants={menuItemVariants} className="text-xl font-bold mb-4 text-gray-800">
                  Hỗ Trợ
                </motion.h3>
                <nav className="flex flex-col space-y-2">
                  <motion.div variants={menuItemVariants}>
                    <Link to="/about" className="block p-3 border-b border-gray-100" onClick={toggleMobileMenu}>
                      Về Chúng Tôi
                    </Link>
                  </motion.div>
                  <motion.div variants={menuItemVariants}>
                    <Link to="/contact" className="block p-3 border-b border-gray-100" onClick={toggleMobileMenu}>
                      Liên Hệ
                    </Link>
                  </motion.div>
                  <motion.div variants={menuItemVariants}>
                    <Link to="/help" className="block p-3 border-b border-gray-100" onClick={toggleMobileMenu}>
                      Trợ Giúp
                    </Link>
                  </motion.div>
                  <motion.div variants={menuItemVariants} className="flex items-center p-3">
                    <Phone size={18} className="mr-2 text-blue-600" />
                    <span>Hotline: 1900 1234</span>
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