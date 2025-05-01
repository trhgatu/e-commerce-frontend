import { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Truck,
  CreditCard,
  X
} from 'lucide-react';

type ProductItem = {
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  quantity?: number;
  size?: string;
  color?: string;
};

type CartItemModalProps = {
  isOpen: boolean;
  onClose: () => void;
  item: ProductItem | null;
  formatCurrency: (price: number) => string;
  onAddToCart: (quantity: number) => void;
};

const CartItemModal: React.FC<CartItemModalProps> = ({
  isOpen,
  onClose,
  item,
  formatCurrency,
  onAddToCart
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');

  useEffect(() => {
    if (item) {
      setQuantity(item.quantity || 1);
      setSelectedSize(item.size || '');
      setSelectedColor(item.color || '');
    }
  }, [item]);

  if (!item) return null;

  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const availableColors = [
    { name: 'Đen', code: '#000000' },
    { name: 'Trắng', code: '#FFFFFF' },
    { name: 'Xanh đậm', code: '#1E3A8A' },
    { name: 'Đỏ', code: '#DC2626' },
    { name: 'Xám', code: '#6B7280' }
  ];

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* overlay */}
      <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose} />
      {/* modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
        <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <button
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 z-10"
            onClick={onClose}
          >
            <X size={24} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: Image */}
            <div className="bg-gray-100 p-6 flex items-center justify-center">
              <img
                src={item.image}
                alt={item.name}
                className="max-h-96 object-contain"
              />
            </div>

            {/* Right: Info */}
            <div className="p-6 overflow-y-auto max-h-[90vh]">
              <h2 className="text-2xl font-semibold text-gray-900">{item.name}</h2>

              {/* Price */}
              <div className="mt-2 flex items-center">
                <p className="text-xl font-bold text-gray-900 mr-2">
                  {formatCurrency(item.price)}
                </p>
                {item.price < item.originalPrice && (
                  <>
                    <p className="text-sm text-gray-500 line-through">
                      {formatCurrency(item.originalPrice)}
                    </p>
                    <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-md">
                      {Math.round(
                        ((item.originalPrice - item.price) / item.originalPrice) * 100
                      )}
                      % giảm
                    </span>
                  </>
                )}
              </div>

              {/* Rating */}
              <div className="mt-2 flex items-center">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#FBBF24" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">(150 đánh giá)</span>
              </div>

              {/* Description */}
              <div className="mt-4 border-t border-gray-200 pt-4 text-sm text-gray-600">
                Sản phẩm chất lượng cao, thiết kế hiện đại, phù hợp với nhiều phong cách.
                Chất liệu cao cấp, bền đẹp, dễ phối đồ trong nhiều dịp khác nhau.
              </div>

              {/* Size Selection */}
              <div className="mt-4">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Kích thước</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    Hướng dẫn chọn size
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      className={`py-2 text-sm font-medium rounded-md border ${
                        selectedSize === size
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900">Màu sắc</h3>
                <div className="flex space-x-2 mt-2">
                  {availableColors.map((color) => (
                    <button
                      key={color.name}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                        selectedColor === color.name ? 'border-blue-600' : 'border-gray-300'
                      }`}
                      onClick={() => setSelectedColor(color.name)}
                      title={color.name}
                    >
                      <span
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: color.code }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900">Số lượng</h3>
                <div className="flex items-center mt-2 border border-gray-300 rounded-md w-min">
                  <button
                    className="px-3 py-2 text-gray-600 hover:text-gray-900"
                    onClick={() => handleQuantityChange(-1)}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 text-gray-800">{quantity}</span>
                  <button
                    className="px-3 py-2 text-gray-600 hover:text-gray-900"
                    onClick={() => handleQuantityChange(1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Truck className="text-gray-500 mr-2" size={18} />
                  <p className="text-sm text-gray-600">
                    Giao hàng miễn phí cho đơn hàng trên 1.000.000đ
                  </p>
                </div>
                <div className="flex items-center mt-2">
                  <CreditCard className="text-gray-500 mr-2" size={18} />
                  <p className="text-sm text-gray-600">
                    Thanh toán an toàn - Nhiều phương thức thanh toán
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 grid grid-cols-3 gap-2">
                <Button
                  onClick={() => onAddToCart(quantity)}
                  className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
                >
                  <ShoppingCart size={18} className="mr-2" />
                  Thêm vào giỏ
                </Button>
                <Button variant="outline" className="text-gray-700 border-gray-300">
                  <Heart size={18} />
                </Button>
              </div>

              {/* Share */}
              <div className="mt-4 flex items-center">
                <Share2 size={16} className="text-gray-500 mr-2" />
                <span className="text-sm text-gray-500">Chia sẻ sản phẩm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default CartItemModal;
