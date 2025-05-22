// components/ThumbnailUploader.tsx
import { useState } from 'react';

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
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Preview" className="w-48 h-auto border rounded" />}
    </div>
  );
};
