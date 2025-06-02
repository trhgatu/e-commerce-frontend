import { Input } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
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

  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      allowClear={{
        clearIcon: <CloseCircleOutlined />,
      }}
    />
  );
};
