// src/components/layouts/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import Header from '@/components/common/user/Header';
import Footer from '@/components/common/user/Footer';
import { Toaster } from '@/components/ui/sonner';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow pt-(--header-height)">
        <Outlet />
        <Toaster/>
      </main>
      <Footer />
    </div>
  );
};
