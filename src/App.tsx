import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layouts';
import HomePage from '@/pages/user/HomePage';
import { AdminPage } from '@/pages/admin/AdminPage';
import ProductDetailPage from '@/pages/user/ProductDetailPage';
import ScrollToTop from '@/components/ScrollToTop';
import { RegisterPage, LoginPage } from '@/features/user/auth/pages';
import CartPage from '@/features/user/cart/pages/CartPage';
import ProductListingPage from '@/features/user/product/pages/ProductListingPage';

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


        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;