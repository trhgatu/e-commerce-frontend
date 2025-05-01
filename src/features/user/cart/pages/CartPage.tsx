import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Minus,
    Plus,
    Trash2,
    ShoppingBag,
    CreditCard,
    ChevronRight,
} from 'lucide-react';
import CartItemModal from '@/features/user/cart/components/CartItemModal';

interface CartItem {
    _id: string;
    name: string;
    price: number;
    originalPrice: number;
    image: string;
    color: string;
    size: string;
    quantity: number;
}
const mockCartItems: CartItem[] = [
    {
        _id: '1',
        name: 'Áo thun nam Premium',
        price: 299000,
        originalPrice: 350000,
        image: '/api/placeholder/80/80',
        color: 'Đen',
        size: 'L',
        quantity: 2,
    },
    {
        _id: '2',
        name: 'Quần jean nam Slim Fit',
        price: 499000,
        originalPrice: 599000,
        image: '/api/placeholder/80/80',
        color: 'Xanh đậm',
        size: 'M',
        quantity: 1,
    },
    {
        _id: '3',
        name: 'Giày thể thao Lifestyle',
        price: 799000,
        originalPrice: 899000,
        image: '/api/placeholder/80/80',
        color: 'Trắng',
        size: '42',
        quantity: 1,
    },
];


const CartPage = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
    const [promoCode, setPromoCode] = useState('');
    const [isPromoApplied, setIsPromoApplied] = useState(false);
    const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Calculate cart totals
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const discount = isPromoApplied ? subtotal * 0.1 : 0; // 10% discount when promo applied
    const shipping = subtotal > 1000000 ? 0 : 30000; // Free shipping over 1,000,000 VND
    const total = subtotal - discount + shipping;

    const handleQuantityChange = (_id: string, change: number) => {
        setCartItems(cartItems.map(item => {
            if (item._id === _id) {
                const newQuantity = Math.max(1, item.quantity + change); // Prevent quantity below 1
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const handleRemoveItem = (_id: string) => {
        setCartItems(cartItems.filter(item => item._id !== _id));
    };

    const handleApplyPromo = () => {
        // In a real app, you would validate the promo code against an API
        if (promoCode.toLowerCase() === 'giamgia10') {
            setIsPromoApplied(true);
        } else {
            alert('Mã giảm giá không hợp lệ');
            setIsPromoApplied(false);
        }
    };

    const openItemModal = (item: CartItem) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const closeItemModal = () => {
        setIsModalOpen(false);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
            .format(amount)
            .replace('₫', 'đ');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-semibold text-gray-900 mb-8">Giỏ hàng của bạn</h1>

                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <div className="flex justify-center mb-4">
                            <ShoppingBag size={64} className="text-gray-300" />
                        </div>
                        <h2 className="text-xl font-medium text-gray-900 mb-2">Giỏ hàng trống</h2>
                        <p className="text-gray-500 mb-6">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            Tiếp tục mua sắm
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart items section */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="border-b border-gray-200 py-4 px-4 sm:px-6 flex justify-between items-center">
                                    <h2 className="text-lg font-medium text-gray-900">
                                        Sản phẩm ({cartItems.reduce((total, item) => total + item.quantity, 0)})
                                    </h2>
                                    <Button variant="ghost" className="text-sm text-gray-500" onClick={() => setCartItems([])}>
                                        Xóa tất cả
                                    </Button>
                                </div>

                                <ul className="divide-y divide-gray-200">
                                    {cartItems.map((item) => (
                                        <li key={item._id} className="px-4 sm:px-6 py-4">
                                            <div className="flex items-center">
                                                {/* Product image */}
                                                <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden cursor-pointer" onClick={() => openItemModal(item)}>
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-center object-cover" />
                                                </div>

                                                {/* Product details */}
                                                <div className="ml-4 flex-1">
                                                    <div className="flex justify-between">
                                                        <div>
                                                            <h3 className="text-sm font-medium text-gray-900 cursor-pointer" onClick={() => openItemModal(item)}>
                                                                {item.name}
                                                            </h3>
                                                            <p className="mt-1 text-sm text-gray-500">
                                                                {item.color} | {item.size}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {formatCurrency(item.price)}
                                                            </p>
                                                            {item.price < item.originalPrice && (
                                                                <p className="mt-1 text-xs text-gray-500 line-through">
                                                                    {formatCurrency(item.originalPrice)}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Quantity and remove controls */}
                                                    <div className="flex items-center justify-between mt-4">
                                                        <div className="flex items-center border border-gray-300 rounded-md">
                                                            <button
                                                                className="px-2 py-1 text-gray-600 hover:text-gray-900"
                                                                onClick={() => handleQuantityChange(item._id, -1)}
                                                            >
                                                                <Minus size={16} />
                                                            </button>
                                                            <span className="px-4 py-1 text-gray-800">{item.quantity}</span>
                                                            <button
                                                                className="px-2 py-1 text-gray-600 hover:text-gray-900"
                                                                onClick={() => handleQuantityChange(item._id, 1)}
                                                            >
                                                                <Plus size={16} />
                                                            </button>
                                                        </div>
                                                        <button
                                                            className="text-gray-400 hover:text-red-500"
                                                            onClick={() => handleRemoveItem(item._id)}
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Continue shopping button */}
                            <div className="mt-4">
                                <Button variant="outline" className="text-blue-600 border-blue-600">
                                    Tiếp tục mua sắm
                                </Button>
                            </div>
                        </div>

                        {/* Order summary section */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow">
                                <div className="border-b border-gray-200 py-4 px-6">
                                    <h2 className="text-lg font-medium text-gray-900">Tóm tắt đơn hàng</h2>
                                </div>

                                <div className="p-6">
                                    {/* Promo code */}
                                    <div className="mb-6">
                                        <label htmlFor="promo-code" className="block text-sm font-medium text-gray-700 mb-2">
                                            Mã giảm giá
                                        </label>
                                        <div className="flex">
                                            <Input
                                                id="promo-code"
                                                type="text"
                                                placeholder="Nhập mã giảm giá"
                                                value={promoCode}
                                                onChange={(e) => setPromoCode(e.target.value)}
                                                className="rounded-r-none"
                                            />
                                            <Button
                                                onClick={handleApplyPromo}
                                                className="rounded-l-none bg-blue-600 hover:bg-blue-700 text-white"
                                            >
                                                Áp dụng
                                            </Button>
                                        </div>
                                        {isPromoApplied && (
                                            <p className="mt-2 text-sm text-green-600">Mã giảm giá đã được áp dụng!</p>
                                        )}
                                        <p className="mt-2 text-xs text-gray-500">Sử dụng mã "GIAMGIA10" để nhận ưu đãi 10%</p>
                                    </div>

                                    {/* Order summary */}
                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between">
                                            <p className="text-sm text-gray-600">Tạm tính</p>
                                            <p className="text-sm font-medium text-gray-900">{formatCurrency(subtotal)}</p>
                                        </div>

                                        {isPromoApplied && (
                                            <div className="flex justify-between">
                                                <p className="text-sm text-gray-600">Giảm giá</p>
                                                <p className="text-sm font-medium text-green-600">-{formatCurrency(discount)}</p>
                                            </div>
                                        )}

                                        <div className="flex justify-between">
                                            <p className="text-sm text-gray-600">Phí vận chuyển</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {shipping === 0 ? 'Miễn phí' : formatCurrency(shipping)}
                                            </p>
                                        </div>

                                        <div className="border-t border-gray-200 pt-4 flex justify-between">
                                            <p className="text-base font-medium text-gray-900">Tổng cộng</p>
                                            <p className="text-base font-bold text-gray-900">{formatCurrency(total)}</p>
                                        </div>
                                    </div>

                                    {/* Checkout button */}
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center">
                                        <CreditCard size={18} className="mr-2" />
                                        Thanh toán
                                        <ChevronRight size={16} className="ml-1" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Cart item modal */}
            <CartItemModal
                isOpen={isModalOpen}
                onClose={closeItemModal}
                item={selectedItem}
                formatCurrency={formatCurrency}
                onAddToCart={(quantity: number) => {
                    if (selectedItem) {
                        setCartItems(prev =>
                            prev.map(item =>
                                item._id === selectedItem._id ? { ...item, quantity } : item
                            )
                        );
                    }
                    closeItemModal();
                }}
            />
        </div>
    );
};

export default CartPage;