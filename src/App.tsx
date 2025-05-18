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
import { AdminLoginPage } from '@/features/admin/auth/pages/AdminLoginPage';
import AdminRoute from '@/routes/AdminRoute';
import { CategoryManagementPage } from '@/features/admin/categories-management/pages';
import { BrandManagementPage } from '@/features/admin/brands-management/pages';
import { ColorManagementPage } from '@/features/admin/colors-management/pages';
import { CreateProductPage } from '@/features/admin/products-management/pages/CreateProductPage';

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

        <Route path="/admin/auth/login" element={<AdminLoginPage />} />

        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index element={<Navigate to={ROUTERS.ADMIN.dashboard} replace />} />
          <Route path={ROUTERS.ADMIN.dashboard} element={<DashboardPage />} />

          <Route path="products">
            <Route index element={<ProductManagementPage />} />
            <Route path="create" element={<CreateProductPage />} />
          </Route>

          <Route path="users">
            <Route index element={<UserManagementPage />} />
            {/* <Route path="create" element={<CreateUserPage />} />
              <Route path="edit/:id" element={<EditUserPage />} /> */}
          </Route>

          <Route path="categories">
            <Route index element={<CategoryManagementPage />} />
            {/* <Route path="create" element={<CreateUserPage />} />
              <Route path="edit/:id" element={<EditUserPage />} /> */}
          </Route>

          <Route path="brands">
            <Route index element={<BrandManagementPage />} />
            {/* <Route path="create" element={<CreateUserPage />} />
              <Route path="edit/:id" element={<EditUserPage />} /> */}
          </Route>

          <Route path="colors">
            <Route index element={<ColorManagementPage />} />
            {/* <Route path="create" element={<CreateUserPage />} />
              <Route path="edit/:id" element={<EditUserPage />} /> */}
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;