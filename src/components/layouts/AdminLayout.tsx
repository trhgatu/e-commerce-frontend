import { Outlet } from 'react-router-dom';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';

export const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen">
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <main className="flex-1">
          <SidebarInset>
            <SiteHeader />
            <Outlet />
          </SidebarInset>
        </main>
      </SidebarProvider>
    </div>
  );
};