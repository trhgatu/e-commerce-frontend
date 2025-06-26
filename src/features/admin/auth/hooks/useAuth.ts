import { useAppDispatch, useAppSelector } from '@/store/hook';
import { login, logout, restoreAuth } from '@/store/authSlice';
import type { LoginFormValues } from '../validators/loginSchema';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isInitialized, user, token, loading, error } =
    useAppSelector((state) => state.auth);

  return {
    // state
    isAuthenticated,
    isInitialized,
    user,
    token,
    loading,
    error,

    // actions
    login: (data: LoginFormValues) => dispatch(login(data)),
    restoreAuth: () => dispatch(restoreAuth()),
    logout: () => dispatch(logout()),
  };
};