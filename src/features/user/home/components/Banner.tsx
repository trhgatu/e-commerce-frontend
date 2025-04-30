import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerSlide {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  buttonText: string;
  link: string;
}

const bannerSlides: BannerSlide[] = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1661961110218-35af7210f803?q=80&w=2670&auto=format&fit=crop',
    title: 'Laptop Gaming Mới Nhất',
    description: 'Trải nghiệm hiệu suất đỉnh cao với các mẫu laptop gaming mới nhất năm 2025',
    buttonText: 'Mua Ngay',
    link: '/category/laptop'
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=2564&auto=format&fit=crop',
    title: 'Khuyến Mãi Cuối Năm',
    description: 'Giảm giá đến 40% cho tất cả các sản phẩm Apple từ ngày 20/11 đến 31/12',
    buttonText: 'Xem Ngay',
    link: '/promotions'
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=2642&auto=format&fit=crop',
    title: 'Bộ Sưu Tập Màn Hình 2025',
    description: 'Khám phá bộ sưu tập màn hình công nghệ mới cho làm việc và giải trí',
    buttonText: 'Khám Phá',
    link: '/category/monitors'
  }
];

const Banner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === bannerSlides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? bannerSlides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[500px] overflow-hidden">
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {bannerSlides.map((slide) => (
          <div key={slide.id} className="min-w-full h-full relative">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.imageUrl})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>
            <div className="relative h-full flex items-center">
              <div className="container mx-auto px-10 md:px-20">
                <div className="max-w-lg bg-white/10 backdrop-blur-sm p-8 rounded-lg">
                  <h1 className="text-4xl font-bold text-white mb-4">{slide.title}</h1>
                  <p className="text-lg text-white mb-6">{slide.description}</p>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md"
                    asChild
                  >
                    <a href={slide.link}>{slide.buttonText}</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              currentSlide === index ? 'bg-blue-600' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;