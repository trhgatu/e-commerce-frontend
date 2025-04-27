import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layouts/MainLayout';
import { HomePage } from '@/pages/user/HomePage';
import { AdminPage } from '@/pages/admin/AdminPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
        </Route>

        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;