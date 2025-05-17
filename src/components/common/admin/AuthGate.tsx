import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { restoreAuth } from '@/store/authSlice';
import Loading from '@/components/common/Loading';

const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { isInitialized } = useAppSelector(state => state.auth);

  useEffect(() => {
    dispatch(restoreAuth());
  }, [dispatch]);

  if (!isInitialized) {
    return <Loading message="🔐 Đang xác thực tài khoản..." />;
  }

  return <>{children}</>;
};

export default AuthGate;
