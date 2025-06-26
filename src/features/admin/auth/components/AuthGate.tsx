'use client';
// src/features/auth/components/AuthGate.tsx
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Loading from '@/components/common/Loading';

export const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const { restoreAuth, isInitialized } = useAuth();

  useEffect(() => {
    restoreAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isInitialized) {
    return <Loading message="🔐 Đang xác thực tài khoản..." />;
  }

  return <>{children}</>;
};