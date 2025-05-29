import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

type SearchInputProps = {
  placeholder?: string;
  onSearch: (query: string) => void;
  delay?: number;
  defaultValue?: string;
};

export const SearchInput = ({
  placeholder = "Tìm kiếm...",
  onSearch,
  delay = 300,
  defaultValue = "",
}: SearchInputProps) => {
  const [value, setValue] = useState(defaultValue);
  const [debouncedValue, setDebouncedValue] = useState(defaultValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue]);

  const handleClear = () => {
    setValue("");
    onSearch("");
  };

  return (
    <div className="relative w-full">
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pr-10"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
