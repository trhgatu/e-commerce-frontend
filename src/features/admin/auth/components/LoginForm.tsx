'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { LoginFormValues } from '@/features/admin/auth/validators/loginSchema';
import { LoginSchema } from '@/features/admin/auth/validators/loginSchema';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const LoginForm = () => {
  const { login, loading, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    await login(data);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-md w-96 space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">Admin Login</h2>

        <Input {...register('identifier')} placeholder="Email hoặc Username" />
        {errors.identifier && (
          <p className="text-red-500 text-sm">{errors.identifier.message}</p>
        )}

        <Input type="password" {...register('password')} placeholder="Mật khẩu" />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" disabled={loading || isSubmitting} className="w-full">
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>
      </form>
    </div>
  );
};
