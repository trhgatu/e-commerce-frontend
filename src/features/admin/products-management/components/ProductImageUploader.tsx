import { Input } from '@/components/ui/input';
import { Image } from 'antd';
import { useState } from 'react';

export const ProductImageUploader = ({
  onFilesSelected,
}: {
  onFilesSelected: (files: File[]) => void;
}) => {
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setPreviews(files.map((file) => URL.createObjectURL(file)));
    onFilesSelected(files);
  };

  return (
    <div className="flex flex-col gap-2">
      <Input type="file" accept="image/*" multiple onChange={handleFileChange} />
      <div className="flex gap-2 flex-wrap">
        {previews.map((src, idx) => (
          <Image key={idx} src={src} />
        ))}
      </div>
    </div>
  );
};