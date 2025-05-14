import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Laptop, Monitor, Smartphone, Headphones, Cpu, HardDrive, PlugZap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { setCategory } from '@/store/filterSlice';
import { useAppDispatch } from '@/hooks';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: React.ReactNode;
  count: number;
}

const categories: Category[] = [
  {
    id: 'cat1',
    name: 'Laptop',
    slug: 'gaming-laptop',
    icon: <Laptop className="h-10 w-10" />,
    count: 45
  },
  {
    id: 'cat2',
    name: 'PC',
    slug: 'desktop',
    icon: <Cpu className="h-10 w-10" />,
    count: 38
  },
  {
    id: 'cat3',
    name: 'Màn Hình',
    slug: 'monitor',
    icon: <Monitor className="h-10 w-10" />,
    count: 27
  },
  {
    id: 'cat4',
    name: 'Điện Thoại',
    slug: 'smartphone',
    icon: <Smartphone className="h-10 w-10" />,
    count: 64
  },
  {
    id: 'cat5',
    name: 'Tai Nghe',
    slug: 'headphones',
    icon: <Headphones className="h-10 w-10" />,
    count: 29
  },
  {
    id: 'cat6',
    name: 'Linh Kiện',
    slug: 'components',
    icon: <Cpu className="h-10 w-10" />,
    count: 78
  },
  {
    id: 'cat7',
    name: 'Thiết Bị Lưu Trữ',
    slug: 'storage',
    icon: <HardDrive className="h-10 w-10" />,
    count: 32
  },
  {
    id: 'cat8',
    name: 'Thiết Bị Mạng',
    slug: 'networking',
    icon: <PlugZap className="h-10 w-10" />,
    count: 24
  }
];

const CategorySection: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleCategoryClick = (slug: string) => {
    dispatch(setCategory(slug));
    navigate(`/category/${slug}`);
  }
  return (
    <div>
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Danh mục sản phẩm</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <Link key={category.id}
              to={`/category/${category.slug}`}
              onClick={() => handleCategoryClick(category.slug)}>

              <Card className="hover:shadow-lg transition-shadow bg-white border-none">
                <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                  <div className="mb-3 text-blue-600">
                    {category.icon}
                  </div>
                  <h3 className="text-sm font-medium text-gray-800">{category.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{category.count} sản phẩm</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySection;