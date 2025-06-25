import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, Typography, Space, Tag, Descriptions, Button, Skeleton, Alert } from "antd";
import { EditOutlined, ArrowLeftOutlined, DeleteOutlined, GiftOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import { getVoucherById } from "@/features/admin/vouchers-management/services/voucherService";
import ROUTERS from "@/constants/routes";

const { Title, Text } = Typography;

interface VoucherData {
    _id: string;
    code: string;
    type: "percentage" | "fixed";
    value: number;
    minOrderValue: number;
    maxDiscountValue: number;
    usageLimit: number;
    usagePerUser: number;
    usedCount: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export const DetailVoucherPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [voucher, setVoucher] = useState<VoucherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVoucher = async () => {
            if (!id) {
                setError("Voucher ID is required");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await getVoucherById(id);
                setVoucher(response.data);
                setError(null);
            } catch (error) {
                console.error("Failed to fetch voucher:", error);
                setError("Failed to load voucher details");
                toast.error("Không thể tải thông tin voucher");
            } finally {
                setLoading(false);
            }
        };

        fetchVoucher();
    }, [id]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const getVoucherStatus = () => {
        if (!voucher) return { color: "default", text: "Không xác định" };

        if (voucher.isDeleted) return { color: "red", text: "Đã xóa" };
        if (!voucher.isActive) return { color: "orange", text: "Tạm dừng" };

        const now = new Date();
        const startDate = new Date(voucher.startDate);
        const endDate = new Date(voucher.endDate);

        if (now < startDate) return { color: "blue", text: "Sắp diễn ra" };
        if (now > endDate) return { color: "gray", text: "Đã hết hạn" };
        if (voucher.usedCount >= voucher.usageLimit) return { color: "red", text: "Đã hết lượt" };

        return { color: "green", text: "Đang hoạt động" };
    };

    const getUsagePercentage = () => {
        if (!voucher) return 0;
        return Math.round((voucher.usedCount / voucher.usageLimit) * 100);
    };

    const handleEdit = () => {
        navigate(`${ROUTERS.ADMIN.vouchers.root}/edit/${id}`);
    };

    const handleDelete = () => {
        // Add delete confirmation modal logic here
        console.log("Delete voucher:", id);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-6">
                    <Skeleton active paragraph={{ rows: 8 }} />
                </div>
            </div>
        );
    }

    if (error || !voucher) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-6">
                    <Alert
                        message="Lỗi"
                        description={error || "Không tìm thấy voucher"}
                        type="error"
                        showIcon
                        action={
                            <Button size="small" onClick={() => navigate(ROUTERS.ADMIN.vouchers.root)}>
                                Quay lại danh sách
                            </Button>
                        }
                    />
                </div>
            </div>
        );
    }

    const status = getVoucherStatus();

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(ROUTERS.ADMIN.vouchers.root)}
                        className="flex items-center"
                    >
                        Quay lại
                    </Button>
                </div>

                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <GiftOutlined className="text-purple-600 text-xl" />
                        </div>
                        <div>
                            <Title level={2} className="!text-3xl !font-bold !text-gray-900 !mb-2">
                                {voucher.code}
                            </Title>
                            <Space size="middle">
                                <Tag color={status.color}>
                                    {status.text}
                                </Tag>
                                <Text className="text-gray-600">
                                    {voucher.type === 'percentage' ? 'Giảm theo %' : 'Giảm cố định'}
                                </Text>
                            </Space>
                        </div>
                    </div>

                    <Space>
                        <Button
                            icon={<EditOutlined />}
                            type="primary"
                            onClick={handleEdit}
                        >
                            Chỉnh sửa
                        </Button>
                        <Button
                            icon={<DeleteOutlined />}
                            danger
                            onClick={handleDelete}
                        >
                            Xóa
                        </Button>
                    </Space>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Voucher Information */}
                <div className="space-y-6 lg:col-span-2">
                    <Space direction="vertical" size="middle">
                        <Card title="Thông tin voucher" className="shadow-sm">
                            <Descriptions column={1} size="middle">
                                <Descriptions.Item label="Mã voucher">
                                    <Text strong className="text-lg font-mono bg-gray-100 px-2 py-1 rounded">
                                        {voucher.code}
                                    </Text>
                                </Descriptions.Item>

                                <Descriptions.Item label="Loại giảm giá">
                                    <Tag color={voucher.type === 'percentage' ? 'blue' : 'green'}>
                                        {voucher.type === 'percentage' ? 'Phần trăm (%)' : 'Cố định (VND)'}
                                    </Tag>
                                </Descriptions.Item>

                                <Descriptions.Item label="Giá trị giảm">
                                    <Text strong className="text-xl text-red-600">
                                        {voucher.type === 'percentage'
                                            ? `${voucher.value}%`
                                            : formatCurrency(voucher.value)
                                        }
                                    </Text>
                                </Descriptions.Item>

                                <Descriptions.Item label="Giá trị đơn hàng tối thiểu">
                                    <Text className="text-lg">{formatCurrency(voucher.minOrderValue)}</Text>
                                </Descriptions.Item>

                                <Descriptions.Item label="Giá trị giảm tối đa">
                                    <Text className="text-lg">{formatCurrency(voucher.maxDiscountValue)}</Text>
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                        {/* Usage Information */}
                        <Card title="Thông tin sử dụng" className="shadow-sm">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <Text className="text-blue-600 text-sm">Tổng lượt sử dụng</Text>
                                        <div className="text-2xl font-bold text-blue-700">
                                            {voucher.usageLimit}
                                        </div>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-4">
                                        <Text className="text-green-600 text-sm">Đã sử dụng</Text>
                                        <div className="text-2xl font-bold text-green-700">
                                            {voucher.usedCount}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <Text className="text-sm">Tỷ lệ sử dụng</Text>
                                        <Text className="text-sm font-medium">{getUsagePercentage()}%</Text>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${getUsagePercentage()}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <Descriptions column={1} size="small">
                                    <Descriptions.Item label="Số lượt mỗi người dùng">
                                        <Text>{voucher.usagePerUser} lần</Text>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Còn lại">
                                        <Text strong className="text-orange-600">
                                            {(voucher.usageLimit - voucher.usedCount).toLocaleString()} lượt
                                        </Text>
                                    </Descriptions.Item>
                                </Descriptions>
                            </div>
                        </Card>

                        {/* Time Period */}
                        <Card title="Thời gian áp dụng" className="shadow-sm">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Text className="text-gray-600 text-sm">Ngày bắt đầu:</Text>
                                        <br />
                                        <Text strong className="text-green-600">
                                            {formatDate(voucher.startDate)}
                                        </Text>
                                    </div>
                                    <div>
                                        <Text className="text-gray-600 text-sm">Ngày kết thúc:</Text>
                                        <br />
                                        <Text strong className="text-red-600">
                                            {formatDate(voucher.endDate)}
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Space>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">

                    <Space direction="vertical" size="middle">
                        <Card title="Xem trước voucher" className="shadow-sm">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4 text-white">
                                <div className="text-center">
                                    <div className="text-xs opacity-90 mb-1">VOUCHER</div>
                                    <div className="text-lg font-bold font-mono">{voucher.code}</div>
                                    <div className="text-2xl font-bold my-2">
                                        {voucher.type === 'percentage'
                                            ? `${voucher.value}% OFF`
                                            : `${formatCurrency(voucher.value)} OFF`
                                        }
                                    </div>
                                    <div className="text-xs opacity-90">
                                        Đơn tối thiểu {formatCurrency(voucher.minOrderValue)}
                                    </div>
                                </div>
                            </div>
                        </Card>
                        <Card title="Trạng thái" className="shadow-sm">
                            <Space direction="vertical" className="w-full">
                                <div className="flex justify-between items-center">
                                    <Text>Trạng thái:</Text>
                                    <Tag color={status.color} className="ml-2">
                                        {status.text}
                                    </Tag>
                                </div>
                                <div className="flex justify-between items-center">
                                    <Text>Hoạt động:</Text>
                                    <Tag color={voucher.isActive ? "green" : "orange"}>
                                        {voucher.isActive ? "Bật" : "Tắt"}
                                    </Tag>
                                </div>
                                <div className="flex justify-between items-center">
                                    <Text>ID:</Text>
                                    <Text code className="text-sm">{voucher._id}</Text>
                                </div>
                            </Space>
                        </Card>

                        {/* Timestamps */}
                        <Card title="Thời gian" className="shadow-sm">
                            <Space direction="vertical" className="w-full">
                                <div>
                                    <Text className="text-gray-600 text-sm">Ngày tạo:</Text>
                                    <br />
                                    <Text strong>{formatDate(voucher.createdAt)}</Text>
                                </div>
                                <div className="border-t pt-3">
                                    <Text className="text-gray-600 text-sm">Cập nhật lần cuối:</Text>
                                    <br />
                                    <Text strong>{formatDate(voucher.updatedAt)}</Text>
                                </div>
                            </Space>
                        </Card>

                        {/* Quick Stats */}
                        <Card title="Thống kê nhanh" className="shadow-sm">
                            <Space direction="vertical" className="w-full">
                                <div className="flex justify-between items-center">
                                    <Text>Tỷ lệ sử dụng:</Text>
                                    <Text strong className="text-blue-600">{getUsagePercentage()}%</Text>
                                </div>
                                <div className="flex justify-between items-center">
                                    <Text>Hiệu quả:</Text>
                                    <Text strong className={`${getUsagePercentage() > 50 ? 'text-green-600' : 'text-orange-600'}`}>
                                        {getUsagePercentage() > 75 ? 'Cao' :
                                            getUsagePercentage() > 50 ? 'Trung bình' : 'Thấp'}
                                    </Text>
                                </div>
                                <div className="flex justify-between items-center">
                                    <Text>Loại voucher:</Text>
                                    <Tag color={voucher.type === 'percentage' ? 'blue' : 'green'}>
                                        {voucher.type === 'percentage' ? '%' : 'VND'}
                                    </Tag>
                                </div>
                            </Space>
                            <div className="mt-4 pt-4 border-t">
                                <Text className="text-xs text-gray-500">
                                    * Dữ liệu thống kê được cập nhật theo thời gian thực
                                </Text>
                            </div>
                        </Card>

                        {/* Voucher Preview */}

                    </Space>
                </div>
            </div>
        </div>
    );
};