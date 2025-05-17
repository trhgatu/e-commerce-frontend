import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { login } from '@/store/authSlice';
import { useEffect } from 'react';

const schema = z.object({
  identifier: z
    .string()
    .min(3, 'Vui lòng nhập email hoặc username hợp lệ'),
  password: z
    .string()
    .min(1, 'Mật khẩu tối thiểu 1 ký tự'),
});

type LoginFormData = z.infer<typeof schema>;

export const AdminLoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, isAuthenticated, user, error } = useAppSelector(state => state.auth);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(schema),
    defaultValues: { identifier: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    await dispatch(login(data));
  };

  useEffect(() => {
    console.log("✅ user info:", user);
    if (isAuthenticated && user?.role === 'admin') {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow-md w-96 space-y-4">
        <h2 className="text-xl font-semibold text-center">Admin Login</h2>

        <Input {...form.register('identifier')} placeholder="Email hoặc Username" />
        {form.formState.errors.identifier && (
          <p className="text-red-500 text-sm">{form.formState.errors.identifier.message}</p>
        )}

        <Input type="password" {...form.register('password')} placeholder="Mật khẩu" />
        {form.formState.errors.password && (
          <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>
      </form>
    </div>
  );
};
