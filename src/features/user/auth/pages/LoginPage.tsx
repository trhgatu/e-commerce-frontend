// src/features/user/auth/pages/LoginPage.tsx
import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, Facebook, Github } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { login } from '@/store/authSlice';
import { Loader2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useAppSelector(state => state.auth);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return;
    }
    await dispatch(login(formData));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen px-4">
      <div className="max-w-md mx-auto">
        {/* Logo and header */}
        <div className="text-center mb-8">
          <h2 className="mt-6 text-2xl font-semibold text-gray-900">Đăng nhập</h2>
          <p className="mt-2 text-gray-600">
            Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục.
          </p>
        </div>

        {/* Login form */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email field */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="pl-10"
                  required
                  aria-label="Email"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Mail size={18} />
                </div>
              </div>
            </div>

            {/* Password field */}
            <div className="mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  required
                  aria-label="Password"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Lock size={18} />
                </div>
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember me and Forgot password */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={checked => setRememberMe(checked as boolean)}
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                  Nhớ tài khoản
                </label>
              </div>
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                Quên mật khẩu?
              </Link>
            </div>

            {/* Login button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
              disabled={loading || !formData.email || !formData.password}
            >
              {loading ? (
                <span className="flex items-center">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Đang đăng nhập...
                </span>
              ) : (
                'Đăng nhập'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center mt-6 mb-6">
            <div className="absolute border-t border-gray-300 w-full"></div>
            <div className="relative bg-white px-4 text-sm text-gray-500">
              Hoặc đăng nhập với
            </div>
          </div>

          {/* Social login buttons */}
          <div className="grid grid-cols-3 gap-4">
            <Button variant="outline" className="flex items-center justify-center py-2">
              <Facebook size={18} className="mr-2 text-blue-600" />
              <span>Facebook</span>
            </Button>
            <Button variant="outline" className="flex items-center justify-center py-2">
              <Github size={18} className="mr-2" />
              <span>Github</span>
            </Button>
            <Button variant="outline" className="flex items-center justify-center py-2">
              <FaGoogle size={18} className="mr-2" />
              <span>Google</span>
            </Button>
          </div>

          {/* Register link */}
          <div className="text-center mt-6 text-sm">
            <span className="text-gray-600">Chưa có tài khoản? </span>
            <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
