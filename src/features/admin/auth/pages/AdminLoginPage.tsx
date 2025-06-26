import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';

export const AdminLoginPage = () => {
  const { isAuthenticated, isInitialized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isInitialized, isAuthenticated, navigate]);

  if (!isInitialized) return null;
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
};