// components/ThumbnailUploader.tsx
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Image } from 'antd';

export const ProductThumbnailUploader = ({
  onFileSelected,
}: {
  onFileSelected: (file: File) => void;
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    onFileSelected(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <Input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <Image src={preview} alt="Preview"/>}
    </div>
  );
};
