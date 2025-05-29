import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks';
import Loading from '@/components/common/Loading';

const AdminRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated, user, loading } = useAppSelector(state => state.auth);

  if (loading) {
    return <Loading message="Đang kiểm tra quyền truy cập admin..." />;
  }


  if (!isAuthenticated || user?.role.name !== 'Admin') {
    return <Navigate to="/admin/auth/login" replace />;
  }

  return children;
};

export default AdminRoute;
