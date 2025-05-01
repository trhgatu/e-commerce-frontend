// src/pages/user/ProductDetailPage.tsx
import { useParams } from 'react-router-dom';
import { RelatedProducts } from '@/features/user/product/components';
import { mockProducts } from '@/mock/productData';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Share2, ShoppingCart, Star, ChevronRight, Truck, Shield, RotateCcw } from 'lucide-react';

// Custom tabs implementation since the ui/tabs module might not be available
const TabContent: React.FC<{
  isActive: boolean;
  children: React.ReactNode;
  className?: string;
}> = ({ isActive, children, className = "" }) => {
  if (!isActive) return null;
  return (
    <div className={`bg-white p-4 rounded-md mt-4 ${className}`}>
      {children}
    </div>
  );
};

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = mockProducts.find(p => p._id === id);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product?.colorVariants[0]?.colorId._id || null
  );
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(product?.thumbnail || product?.images[0]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Không tìm thấy sản phẩm</h2>
        <p className="text-gray-600 mb-8">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <Button asChild>
          <a href="/">Quay lại trang chủ</a>
        </Button>
      </div>
    );
  }

  const handleChangeColor = (colorId: string) => {
    setSelectedColor(colorId);
  };

  const handleImageClick = (imageUrl: string) => {
    setMainImage(imageUrl);
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  // Calculate discounted price
  const discountedPrice = product.discountPercent
    ? product.price * (1 - product.discountPercent / 100)
    : null;

  return (
    <div className="container mx-auto px-4">
      {/* Breadcrumb */}
      <div className="flex items-center py-4 text-sm text-gray-500">
        <a href="/" className="hover:text-blue-600">Trang chủ</a>
        <ChevronRight size={16} className="mx-1" />
        <a href={`/category/${product.categoryId._id}`} className="hover:text-blue-600">
          {product.categoryId.name}
        </a>
        <ChevronRight size={16} className="mx-1" />
        <span className="text-gray-700">{product.name}</span>
      </div>

      {/* Product details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Product Images */}
        <div>
          <div className="mb-4 border rounded-lg overflow-hidden bg-white p-4">
            <img
              src={mainImage || product.images[0]}
              alt={product.name}
              className="w-full h-[400px] object-contain"
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {product.images.map((image, index) => (
              <div
                key={index}
                className={`border rounded-md cursor-pointer p-2 ${
                  mainImage === image ? 'border-blue-500' : 'border-gray-200'
                }`}
                onClick={() => handleImageClick(image)}
              >
                <img
                  src={image}
                  alt={`${product.name} - ảnh ${index + 1}`}
                  className="w-full h-16 object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>

          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 mr-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={i < Math.floor(product.rating) ? 'fill-current' : 'stroke-current fill-none'}
                />
              ))}
            </div>
            <span className="text-gray-500">
              {product.rating} ({product.reviewCount} đánh giá)
            </span>
            <span className="mx-2 text-gray-300">|</span>
            <span className="text-green-600">
              {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
            </span>
          </div>

          <div className="mb-6">
            {discountedPrice ? (
              <div className="flex items-center">
                <span className="text-3xl font-bold text-red-600 mr-3">
                  {discountedPrice.toLocaleString('vi-VN')}₫
                </span>
                <span className="text-xl text-gray-500 line-through">
                  {product.price.toLocaleString('vi-VN')}₫
                </span>
                <span className="ml-2 bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-medium">
                  -{product.discountPercent}%
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-gray-800">
                {product.price.toLocaleString('vi-VN')}₫
              </span>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Màu sắc</h3>
            <div className="flex space-x-2">
              {product.colorVariants.map(variant => (
                <button
                  key={variant.colorId._id}
                  className={`w-10 h-10 rounded-full p-1 ${
                    selectedColor === variant.colorId._id
                      ? 'ring-2 ring-blue-500 ring-offset-1'
                      : 'ring-1 ring-gray-200'
                  }`}
                  onClick={() => handleChangeColor(variant.colorId._id)}
                  aria-label={`Màu ${variant.colorId.name}`}
                  title={variant.colorId.name}
                >
                  <span
                    className="block w-full h-full rounded-full"
                    style={{ backgroundColor: variant.colorId.hexCode }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Số lượng</h3>
            <div className="flex items-center">
              <button
                className="w-10 h-10 border border-gray-300 flex items-center justify-center rounded-l-md"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <div className="w-12 h-10 border-t border-b border-gray-300 flex items-center justify-center">
                {quantity}
              </div>
              <button
                className="w-10 h-10 border border-gray-300 flex items-center justify-center rounded-r-md"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= 10}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Thêm vào giỏ hàng
            </Button>
            <Button variant="outline" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm">Giao hàng miễn phí</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm">Bảo hành 12 tháng</span>
              </div>
              <div className="flex items-center">
                <RotateCcw className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm">Đổi trả trong 7 ngày</span>
              </div>
            </div>
          </div>

          <div className="prose prose-sm max-w-none">
            <p>{product.description}</p>
          </div>
        </div>
      </div>

      {/* Custom Tabs Implementation */}
      <div className="mb-16">
        <div className="border-b border-gray-200">
          <div className="flex -mb-px">
            <button
              className={`py-2 px-4 font-medium text-sm ${
                activeTab === "description"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("description")}
            >
              Mô tả sản phẩm
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm ${
                activeTab === "specifications"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("specifications")}
            >
              Thông số kỹ thuật
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm ${
                activeTab === "reviews"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Đánh giá ({product.reviewCount})
            </button>
          </div>
        </div>

        <TabContent isActive={activeTab === "description"}>
          <div className="prose prose-blue max-w-none">
            <h3>Mô tả chi tiết sản phẩm {product.name}</h3>
            <p>
              {product.description || 'Đang cập nhật thông tin chi tiết...'}
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies aliquam, mauris nisl aliquet nunc,
              vitae ultricies nisl nunc eget nunc. Nullam auctor, nisl eget ultricies aliquam, mauris nisl aliquet nunc, vitae ultricies nisl nunc eget nunc.
            </p>
          </div>
        </TabContent>

        <TabContent isActive={activeTab === "specifications"}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-lg mb-4">Thông số cơ bản</h3>
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Thương hiệu</td>
                    <td className="py-2 font-medium">{product.brand}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Model</td>
                    <td className="py-2 font-medium">{product.name}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Năm sản xuất</td>
                    <td className="py-2 font-medium">2025</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Thông số kỹ thuật</h3>
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">CPU</td>
                    <td className="py-2 font-medium">Intel Core i9</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">RAM</td>
                    <td className="py-2 font-medium">32GB DDR5</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Ổ cứng</td>
                    <td className="py-2 font-medium">1TB SSD PCIe NVMe</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabContent>

        <TabContent isActive={activeTab === "reviews"}>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Đánh giá của khách hàng</h3>
              <Button>Viết đánh giá</Button>
            </div>
            <div className="border-b pb-4 mb-4">
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400 mr-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < 5 ? 'fill-current' : 'stroke-current fill-none'}
                    />
                  ))}
                </div>
                <span className="font-medium">Rất hài lòng</span>
              </div>
              <div className="flex justify-between mb-2">
                <div>
                  <span className="font-medium">Nguyễn Văn A</span>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-gray-500">20/05/2025</span>
                </div>
                <span className="text-green-600">Đã mua hàng</span>
              </div>
              <p className="text-gray-700">
                Sản phẩm rất tốt, đóng gói cẩn thận, giao hàng nhanh. Màn hình hiển thị sắc nét,
                pin dùng được cả ngày. Rất hài lòng với sản phẩm này!
              </p>
            </div>
          </div>
        </TabContent>
      </div>

      {/* Related products */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Sản Phẩm Liên Quan</h2>
        <RelatedProducts categoryId={product.categoryId._id} currentProductId={product._id} />
      </div>
    </div>
  );
};

export default ProductDetailPage;