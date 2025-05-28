import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Image, Button, Tag, Skeleton } from 'antd';
import { EditOutlined, TagOutlined, ShopOutlined } from '@ant-design/icons';
import { getProductById } from '../services/productService';
import { IProduct } from '@/types';

export const DetailProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id!);
        setProduct(data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm</p>
            <Button
              type="primary"
              onClick={() => navigate('/admin/products')}
              className="mt-4"
            >
              Back to Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Chi tiết sản phẩm : {product.name}</h1>
              <p className="text-gray-600 mt-1">Xem thông tin sản phẩm</p>
            </div>
          </div>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/products/edit/${id}`)}
          >
            Edit Product
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Ảnh sản phẩm</h2>

              {/* Thumbnail */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Ảnh bìa</p>
                <div className="bg-gray-50 rounded-lg p-4 flex justify-center">
                  <Image
                    width={250}
                    src={product.thumbnail}
                    className="rounded-lg object-cover"
                    placeholder={
                      <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400">Loading...</span>
                      </div>
                    }
                  />
                </div>
              </div>

              {/* Gallery */}
              {product.images?.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Thư viện ảnh</p>
                  <Image.PreviewGroup>
                    <div className="grid grid-cols-2 gap-3">
                      {product.images.map((url: string, idx: number) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-2">
                          <Image
                            width="100%"
                            height={120}
                            src={url}
                            className="rounded object-cover"
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      ))}
                    </div>
                  </Image.PreviewGroup>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Product Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
                  <div className="flex items-center gap-2">
                    {product.isFeatured && (
                      <Tag color="gold" className="mb-0">
                        ⭐ Nổi bật
                      </Tag>
                    )}
                    <Tag color="green" className="mb-0">
                      In Stock
                    </Tag>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-blue-600">
                    {product.price.toLocaleString()} VND
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Giá bán</p>
                </div>
              </div>

              {product.description && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Mô tả sản phẩm</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b">
                Chi tiết sản phẩm
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 text-lg">📦</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Số lượng tồn kho</p>
                      <p className="text-lg font-semibold text-gray-900">{product.stock} units</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <TagOutlined className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Danh mục</p>
                      <p className="text-lg font-semibold text-gray-900">{product.categoryId.name}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <ShopOutlined className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Thương hiệu</p>
                      <p className="text-lg font-semibold text-gray-900">{product.brandId.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-orange-600 text-lg">🆔</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">ID Sản phẩm</p>
                      <p className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                        {product._id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {product.colorVariants && product.colorVariants.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b">
                  Các biến thể màu sắc
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {product.colorVariants.map((variant, idx: number) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: variant.colorId?.hexCode || '#gray' }}
                        />
                        <span className="font-medium text-gray-900">
                          {variant.colorId?.name || 'Unknown Color'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Stock: </span>
                        <span className={`font-semibold ${variant.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {variant.stock} units
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b">
                Thông tin khác
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Ngày tạo</p>
                  <p className="font-medium text-gray-900">
                    {product.createdAt ? new Date(product.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Cập nhật lần cuối</p>
                  <p className="font-medium text-gray-900">
                    {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString('vi-VN') : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};