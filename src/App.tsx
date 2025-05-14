import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from '@/components/layouts';
import HomePage from '@/features/user/home/pages/HomePage';
import ProductDetailPage from '@/features/user/product/pages/ProductDetailPage';
import ScrollToTop from '@/components/ScrollToTop';
import { RegisterPage, LoginPage } from '@/features/user/auth/pages';
import CartPage from '@/features/user/cart/pages/CartPage';
import ProductListingPage from '@/features/user/product/pages/ProductListingPage';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import DashboardPage from '@/pages/admin/Dashboard';
import ROUTERS from '@/constants/routes';
import { ProductManagementPage } from '@/features/admin/products-management/pages';
import { UserManagementPage } from '@/features/admin/users-management/pages';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path='products' element={<ProductListingPage />} />
          <Route path="category/:slug" element={<ProductListingPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
        </Route>

        <Route path="/auth" element={<MainLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>


        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to={ROUTERS.ADMIN.dashboard} replace />} />
          <Route path={ROUTERS.ADMIN.dashboard} element={<DashboardPage />} />
          <Route path={ROUTERS.ADMIN.products} element={<ProductManagementPage />} />
          <Route path={ROUTERS.ADMIN.users} element={<UserManagementPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;