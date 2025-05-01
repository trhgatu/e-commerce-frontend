import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layouts';
import HomePage from '@/pages/user/HomePage';
import { AdminPage } from '@/pages/admin/AdminPage';
import ProductDetailPage from '@/pages/user/ProductDetailPage';
import ScrollToTop from '@/components/ScrollToTop';
import LoginPage from '@/features/user/auth/pages/LoginPage';

function App() {
  return (
    <Router>
      <ScrollToTop/>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
        </Route>

        <Route path="/auth" element={<MainLayout />}>
          <Route path="login"  element={<LoginPage />} />
        </Route>


        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;