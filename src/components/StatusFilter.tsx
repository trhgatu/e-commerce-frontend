import { Select } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

const { Option } = Select;

interface StatusFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ value, onChange }) => {
  return (
    <div>
      <Select
        className="w-full"
        placeholder="Lọc theo trạng thái"
        value={value}
        onChange={onChange}
        suffixIcon={<FilterOutlined />}
        style={{ width: '200px' }}
      >
        <Option value="all">Tất cả trạng thái</Option>
        <Option value="active">Hoạt động</Option>
        <Option value="inactive">Không hoạt động</Option>
      </Select>
    </div>
  );
};

export default StatusFilter;