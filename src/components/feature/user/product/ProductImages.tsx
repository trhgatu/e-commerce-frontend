// src/components/feature/user/product/ProductImages.tsx
import { useState } from 'react';

interface ProductImagesProps {
  images: string[];
  thumbnail?: string;
  name: string;
}

const ProductImages: React.FC<ProductImagesProps> = ({ images, thumbnail, name }) => {
  const [mainImage, setMainImage] = useState(thumbnail || images[0]);

  return (
    <div className="space-y-4">
      <img
        src={mainImage}
        alt={`${name} main image`}
        className="w-full h-64 md:h-96 object-cover rounded-lg"
        loading="lazy"
      />
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto">
        {images.map((image, index) => (
          <button
            key={image}
            className={`w-16 h-16 flex-shrink-0 rounded-md border-2 ${
              mainImage === image ? 'border-blue-500' : 'border-gray-200'
            }`}
            onClick={() => setMainImage(image)}
            aria-label={`View image ${index + 1} of ${name}`}
          >
            <img
              src={image}
              alt={`${name} thumbnail ${index + 1}`}
              className="w-full h-full object-cover rounded-md"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;