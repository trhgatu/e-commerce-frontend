import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Mail, Lock, Facebook, Github } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setLoginError('Vui lòng nhập email và mật khẩu');
      return;
    }

    try {
      setIsLoading(true);
      setLoginError(null);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes - replace with actual authentication logic
      console.log('Login attempt with:', { email, password, rememberMe });

      // Navigate to home page after successful login
      // navigate('/');

    } catch (error) {
      setLoginError('Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập của bạn.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
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
          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {loginError}
            </div>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="pl-10"
                  required
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
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Lock size={18} />
                </div>
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
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
              disabled={isLoading}
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
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
