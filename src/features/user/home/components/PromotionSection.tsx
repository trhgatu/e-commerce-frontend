import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface Promotion {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  link: string;
  color: string;
}

const promotions: Promotion[] = [
  {
    id: 'promo1',
    title: 'Khuyến mãi Black Friday',
    description: 'Giảm giá đến 50% cho các sản phẩm công nghệ mới nhất',
    imageUrl: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?q=80&w=2670&auto=format&fit=crop',
    buttonText: 'Mua Ngay',
    link: '/promotions/black-friday',
    color: 'bg-purple-600'
  },
  {
    id: 'promo2',
    title: 'Flash Sale',
    description: 'Chỉ trong 24 giờ - Giảm giá sốc các sản phẩm laptop gaming',
    imageUrl: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=2532&auto=format&fit=crop',
    buttonText: 'Xem Ngay',
    link: '/promotions/flash-sale',
    color: 'bg-red-600'
  },
  {
    id: 'promo3',
    title: 'Combo Văn Phòng',
    description: 'Tiết kiệm 20% khi mua bộ thiết bị văn phòng đầy đủ',
    imageUrl: 'https://images.unsplash.com/photo-1593642634367-d91a135587b5?q=80&w=2738&auto=format&fit=crop',
    buttonText: 'Khám Phá',
    link: '/promotions/office-combo',
    color: 'bg-blue-600'
  }
];

const PromotionSection: React.FC = () => {
  return (
    <div>
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Khuyến Mãi Đặc Biệt</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="rounded-lg overflow-hidden shadow-md relative h-[300px] group"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${promo.imageUrl})` }}
              >
                <div className={`absolute inset-0 ${promo.color} opacity-70`}></div>
              </div>

              <div className="relative h-full flex flex-col justify-center p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{promo.title}</h3>
                <p className="mb-4">{promo.description}</p>
                <div>
                  <Button
                    className="bg-white text-gray-800 hover:bg-gray-100"
                    asChild
                  >
                    <Link to={promo.link}>{promo.buttonText}</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionSection;