import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Image } from 'antd';
import { getProductById } from '../services/productService'; // mày đã có API này
import { IProduct } from '@/types';

export const DetailProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<IProduct | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getProductById(id!);
        setProduct(data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
      }
    };
    fetch();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">{product.name}</h2>
      <p className="text-gray-600">{product.description}</p>
      <p className="text-lg">💰 Giá: {product.price.toLocaleString()} VND</p>
      <p className="text-lg">📦 Kho: {product.stock}</p>
      <p className="text-lg">🗂 Danh mục: {product.categoryId.name}</p>
      <p className="text-lg">🏷 Thương hiệu: {product.brandId.name}</p>

      <div>
        <h3 className="font-semibold">Ảnh đại diện</h3>
        <Image width={200} src={product.thumbnail} />
      </div>

      {product.images?.length > 0 && (
        <div>
          <h3 className="font-semibold mt-4">Thư viện ảnh sản phẩm</h3>
          <Image.PreviewGroup>
            <div className="flex flex-wrap gap-2 mt-2">
              {product.images.map((url: string, idx: number) => (
                <Image key={idx} width={120} src={url} />
              ))}
            </div>
          </Image.PreviewGroup>
        </div>
      )}
    </div>
  );
};
