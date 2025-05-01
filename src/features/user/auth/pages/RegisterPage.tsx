import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Mail, Lock, User, Facebook, Github } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';

export const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
        setRegisterError('Vui lòng điền đầy đủ thông tin');
        return;
    }

    if (password !== confirmPassword) {
        setRegisterError('Mật khẩu không khớp');
        return;
    }

    if (!agreeTerms) {
        setRegisterError('Vui lòng đồng ý với điều khoản sử dụng');
        return;
    }

    try {
        setIsLoading(true);
        setRegisterError(null);

        // Simulate API call
        await new Promise<void>(resolve => setTimeout(resolve, 1000));

        // For demo purposes - replace with actual registration logic
        console.log('Registration attempt with:', { fullName, email, password });

        // Navigate to login page after successful registration
        // navigate('/login');

    } catch (error: unknown) {
        setRegisterError('Đăng ký thất bại. Vui lòng thử lại sau.');
        console.error('Registration error:', error);
    } finally {
        setIsLoading(false);
    }
};

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-md mx-auto">
        {/* Logo and header */}
        <div className="text-center mb-8">
          <h2 className="mt-6 text-2xl font-semibold text-gray-900">Đăng ký</h2>
          <p className="mt-2 text-gray-600">
            Tạo tài khoản mới để sử dụng dịch vụ của chúng tôi
          </p>
        </div>

        {/* Register form */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          {registerError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {registerError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Full Name field */}
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên
              </label>
              <div className="relative">
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="pl-10"
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <User size={18} />
                </div>
              </div>
            </div>

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
            <div className="mb-4">
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

            {/* Confirm Password field */}
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Lock size={18} />
                </div>
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Terms and conditions agreement */}
            <div className="flex items-center mb-6">
              <Checkbox
                id="agree-terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked === true)}
              />
              <label htmlFor="agree-terms" className="ml-2 text-sm text-gray-600">
                Tôi đồng ý với{' '}
                <Link to="/terms" className="text-blue-600 hover:text-blue-800">
                  Điều khoản sử dụng
                </Link>{' '}
                và{' '}
                <Link to="/privacy" className="text-blue-600 hover:text-blue-800">
                  Chính sách bảo mật
                </Link>
              </label>
            </div>

            {/* Register button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
              disabled={isLoading}
            >
              {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center mt-6 mb-6">
            <div className="absolute border-t border-gray-300 w-full"></div>
            <div className="relative bg-white px-4 text-sm text-gray-500">
              Hoặc tiếp tục với
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

          {/* Login link */}
          <div className="text-center mt-6 text-sm">
            <span className="text-gray-600">Đã có tài khoản? </span>
            <Link to="/auth/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
