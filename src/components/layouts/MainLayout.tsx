// src/components/layouts/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import Header from '@/components/common/user/Header';
import Footer from '@/components/common/user/Footer';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow md:pt-36 pt-36">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
