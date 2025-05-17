import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface LoadingProps {
    message?: string;
    fullscreen?: boolean;
}

const Loading = ({ message = 'Đang tải dữ liệu...', fullscreen = true }: LoadingProps) => {
    return (
        <div
            className={`flex flex-col items-center justify-center ${fullscreen ? 'min-h-screen' : 'py-10'
                } text-gray-600`}
        >
            <Spin indicator={<LoadingOutlined />} size="large" />
            <p className="mt-4 text-sm text-gray-500">{message}</p>
        </div>
    );
};

export default Loading;
