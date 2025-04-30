// src/components/common/user/Footer.tsx
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Send, MapPin, Phone, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Tech Store</h3>
                        <p className="text-gray-300 mb-4">
                            Cung cấp các sản phẩm công nghệ chất lượng cao với giá cả cạnh tranh. Chúng tôi cam kết mang đến trải nghiệm mua sắm tuyệt vời nhất cho khách hàng.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                                <Facebook size={20} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                                <Twitter size={20} />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                                <Instagram size={20} />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Useful Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Liên Kết Hữu Ích</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/about" className="text-gray-300 hover:text-white">Về Chúng Tôi</Link>
                            </li>
                            <li>
                                <Link to="/terms" className="text-gray-300 hover:text-white">Điều Khoản Sử Dụng</Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="text-gray-300 hover:text-white">Chính Sách Bảo Mật</Link>
                            </li>
                            <li>
                                <Link to="/faq" className="text-gray-300 hover:text-white">Câu Hỏi Thường Gặp</Link>
                            </li>
                            <li>
                                <Link to="/shipping" className="text-gray-300 hover:text-white">Chính Sách Vận Chuyển</Link>
                            </li>
                            <li>
                                <Link to="/returns" className="text-gray-300 hover:text-white">Chính Sách Đổi Trả</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Liên Hệ</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <MapPin size={20} className="mr-2 mt-1 flex-shrink-0" />
                                <span className="text-gray-300">123 Đường Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh</span>
                            </li>
                            <li className="flex items-center">
                                <Phone size={20} className="mr-2 flex-shrink-0" />
                                <span className="text-gray-300">1900 1234</span>
                            </li>
                            <li className="flex items-center">
                                <Mail size={20} className="mr-2 flex-shrink-0" />
                                <a href="mailto:info@techstore.vn" className="text-gray-300 hover:text-white">
                                    info@techstore.vn
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Đăng Ký Nhận Tin</h3>
                        <p className="text-gray-300 mb-4">
                            Nhận thông tin về sản phẩm mới và khuyến mãi đặc biệt.
                        </p>
                        <div className="flex">
                            <Input
                                type="email"
                                placeholder="Email của bạn"
                                className="bg-gray-700 text-white border-gray-600 rounded-r-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 rounded-l-none">
                                <Send size={16} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-gray-900 py-4">
                <div className="container mx-auto px-4 text-center text-gray-400">
                    <p>© 2025 Tech Store. Tất cả các quyền được bảo lưu.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;