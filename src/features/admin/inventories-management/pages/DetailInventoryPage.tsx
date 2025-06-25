import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, Typography, Space, Tag, Descriptions, Button, Skeleton, Alert } from "antd";
import { EditOutlined, ArrowLeftOutlined, DeleteOutlined, DropboxOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import { getInventoryById } from "@/features/admin/inventories-management/services/inventoryService";
import ROUTERS from "@/constants/routes";

import { IInventory } from "@/types";

const { Title, Text } = Typography;


export const DetailInventoryPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [inventory, setInventory] = useState<IInventory | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInventory = async () => {
            if (!id) {
                setError("Inventory ID is required");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await getInventoryById(id);
                setInventory(response.data);
                setError(null);
            } catch (error) {
                console.error("Failed to fetch inventory:", error);
                setError("Failed to load inventory details");
                toast.error("Không thể tải thông tin tồn kho");
            } finally {
                setLoading(false);
            }
        };

        fetchInventory();
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

    const getInventoryStatus = () => {
        if (!inventory) return { color: "default", text: "Không xác định" };

        if (inventory.isDeleted) return { color: "red", text: "Đã xóa" };

        switch (inventory.status) {
            case "in_stock":
                return { color: "green", text: "Còn hàng" };
            case "low_stock":
                return { color: "orange", text: "Sắp hết hàng" };
            case "out_of_stock":
                return { color: "red", text: "Hết hàng" };
            case "discontinued":
                return { color: "gray", text: "Ngừng kinh doanh" };
            default:
                return { color: "default", text: "Không xác định" };
        }
    };

    const getStockPercentage = () => {
        if (!inventory || inventory.minQuantity === 0) return 0;
        return Math.round((inventory.quantity / inventory.maxQuantity) * 100);
    };

    const getStockLevel = () => {
        if (!inventory) return "Không xác định";

        const percentage = getStockPercentage();
        if (percentage >= 80) return "Đầy kho";
        if (percentage >= 50) return "Trung bình";
        if (percentage >= 20) return "Thấp";
        return "Rất thấp";
    };

    const getStockLevelColor = () => {
        const percentage = getStockPercentage();
        if (percentage >= 80) return "text-green-600";
        if (percentage >= 50) return "text-blue-600";
        if (percentage >= 20) return "text-orange-600";
        return "text-red-600";
    };

    const getTotalValue = () => {
        if (!inventory) return 0;
        return inventory.quantity * inventory.productId.price;
    };

    const handleEdit = () => {
        navigate(`${ROUTERS.ADMIN.inventories.root}/edit/${id}`);
    };

    const handleDelete = () => {
        // Add delete confirmation modal logic here
        console.log("Delete inventory:", id);
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

    if (error || !inventory) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-6">
                    <Alert
                        message="Lỗi"
                        description={error || "Không tìm thấy tồn kho"}
                        type="error"
                        showIcon
                        action={
                            <Button size="small" onClick={() => navigate(ROUTERS.ADMIN.inventories.root)}>
                                Quay lại danh sách
                            </Button>
                        }
                    />
                </div>
            </div>
        );
    }

    const status = getInventoryStatus();

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(ROUTERS.ADMIN.inventories.root)}
                        className="flex items-center"
                    >
                        Quay lại
                    </Button>
                </div>

                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <DropboxOutlined className="text-blue-600 text-xl" />
                        </div>
                        <div>
                            <Title level={2} className="!text-3xl !font-bold !text-gray-900 !mb-2">
                                {inventory.productId.name}
                            </Title>
                            <Space size="middle">
                                <Tag color={status.color}>
                                    {status.text}
                                </Tag>
                                <Text className="text-gray-600">
                                    Vị trí: {inventory.location}
                                </Text>
                                {inventory.productId.categoryId && (
                                    <Text className="text-gray-600">
                                        Danh mục: {inventory.productId.categoryId.name}
                                    </Text>
                                )}
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
                {/* Inventory Information */}
                <div className="space-y-6 lg:col-span-2">
                    <Space direction="vertical" size="middle">
                        <Card title="Thông tin sản phẩm" className="shadow-sm">
                            <Descriptions column={1} size="middle">
                                <Descriptions.Item label="Tên sản phẩm">
                                    <Text strong className="text-lg">
                                        {inventory.productId.name}
                                    </Text>
                                </Descriptions.Item>

                                <Descriptions.Item label="Giá bán">
                                    <Text strong className="text-xl text-green-600">
                                        {formatCurrency(inventory.productId.price)}
                                    </Text>
                                </Descriptions.Item>

                                {inventory.productId.categoryId && (
                                    <Descriptions.Item label="Danh mục">
                                        <Tag color="blue">{inventory.productId.categoryId.name}</Tag>
                                    </Descriptions.Item>
                                )}

                                {inventory.productId.brandId && (
                                    <Descriptions.Item label="Thương hiệu">
                                        <Tag color="purple">{inventory.productId.brandId.name}</Tag>
                                    </Descriptions.Item>
                                )}

                                <Descriptions.Item label="Vị trí kho">
                                    <Text className="text-lg font-medium bg-gray-100 px-2 py-1 rounded">
                                        {inventory.location}
                                    </Text>
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                        {/* Stock Information */}
                        <Card title="Thông tin tồn kho" className="shadow-sm">
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <Text className="text-blue-600 text-sm">Số lượng hiện tại</Text>
                                        <div className="text-2xl font-bold text-blue-700">
                                            {inventory.quantity}
                                        </div>
                                    </div>
                                    <div className="bg-orange-50 rounded-lg p-4">
                                        <Text className="text-orange-600 text-sm">Mức tối thiểu</Text>
                                        <div className="text-2xl font-bold text-orange-700">
                                            {inventory.minQuantity || "Không giới hạn"}
                                        </div>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-4">
                                        <Text className="text-green-600 text-sm">Mức tối đa</Text>
                                        <div className="text-2xl font-bold text-green-700">
                                            {inventory.maxQuantity || "Không giới hạn"}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <Text className="text-sm">Mức độ tồn kho</Text>
                                        <Text className="text-sm font-medium">{getStockPercentage()}%</Text>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${getStockPercentage()}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="bg-purple-50 rounded-lg p-4">
                                    <Text className="text-purple-600 text-sm">Tổng giá trị tồn kho</Text>
                                    <div className="text-2xl font-bold text-purple-700">
                                        {formatCurrency(getTotalValue())}
                                    </div>
                                    <Text className="text-xs text-purple-600 mt-1">
                                        ({inventory.quantity} × {formatCurrency(inventory.productId.price)})
                                    </Text>
                                </div>
                            </div>
                        </Card>

                        {/* Additional Information */}
                        <Card title="Thông tin bổ sung" className="shadow-sm">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <Text className="text-gray-600 text-sm">Lần nhập kho gần nhất:</Text>
                                        <br />
                                        <Text strong className="text-blue-600">
                                            {formatDate(inventory.lastRestocked)}
                                        </Text>
                                    </div>
                                    {inventory.notes && (
                                        <div className="border-t pt-3">
                                            <Text className="text-gray-600 text-sm">Ghi chú:</Text>
                                            <br />
                                            <Text className="bg-yellow-50 p-2 rounded border-l-4 border-yellow-400 block">
                                                {inventory.notes}
                                            </Text>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </Space>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Space direction="vertical" size="middle">
                        <Card title="Xem trước sản phẩm" className="shadow-sm">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-4 text-white">
                                <div className="text-center">
                                    <div className="text-xs opacity-90 mb-1">SẢN PHẨM</div>
                                    <div className="text-lg font-bold">{inventory.productId.name}</div>
                                    <div className="text-2xl font-bold my-2">
                                        {formatCurrency(inventory.productId.price)}
                                    </div>
                                    <div className="text-xs opacity-90">
                                        Còn lại: {inventory.quantity} sản phẩm
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
                                    <Text>Mức tồn kho:</Text>
                                    <Text strong className={getStockLevelColor()}>
                                        {getStockLevel()}
                                    </Text>
                                </div>
                                <div className="flex justify-between items-center">
                                    <Text>ID:</Text>
                                    <Text code className="text-sm">{inventory._id}</Text>
                                </div>
                            </Space>
                        </Card>

                        {/* Timestamps */}
                        <Card title="Thời gian" className="shadow-sm">
                            <Space direction="vertical" className="w-full">
                                <div>
                                    <Text className="text-gray-600 text-sm">Ngày tạo:</Text>
                                    <br />
                                    <Text strong>{formatDate(inventory.createdAt)}</Text>
                                </div>
                                <div className="border-t pt-3">
                                    <Text className="text-gray-600 text-sm">Cập nhật lần cuối:</Text>
                                    <br />
                                    <Text strong>{formatDate(inventory.updatedAt)}</Text>
                                </div>
                                <div className="border-t pt-3">
                                    <Text className="text-gray-600 text-sm">Nhập kho gần nhất:</Text>
                                    <br />
                                    <Text strong>{formatDate(inventory.lastRestocked)}</Text>
                                </div>
                            </Space>
                        </Card>

                        {/* Quick Stats */}
                        <Card title="Thống kê nhanh" className="shadow-sm">
                            <Space direction="vertical" className="w-full">
                                <div className="flex justify-between items-center">
                                    <Text>Tỷ lệ tồn kho:</Text>
                                    <Text strong className="text-blue-600">{getStockPercentage()}%</Text>
                                </div>
                                <div className="flex justify-between items-center">
                                    <Text>Mức độ:</Text>
                                    <Text strong className={getStockLevelColor()}>
                                        {getStockLevel()}
                                    </Text>
                                </div>
                                <div className="flex justify-between items-center">
                                    <Text>Giá trị kho:</Text>
                                    <Text strong className="text-green-600">
                                        {formatCurrency(getTotalValue())}
                                    </Text>
                                </div>
                                <div className="flex justify-between items-center">
                                    <Text>Trạng thái:</Text>
                                    <Tag color={status.color}>
                                        {status.text}
                                    </Tag>
                                </div>
                            </Space>
                            <div className="mt-4 pt-4 border-t">
                                <Text className="text-xs text-gray-500">
                                    * Dữ liệu thống kê được cập nhật theo thời gian thực
                                </Text>
                            </div>
                        </Card>

                        {/* Stock Alerts */}
                        {inventory.quantity <= inventory.minQuantity && (
                            <Card title="Cảnh báo" className="shadow-sm border-orange-200">
                                <div className="bg-orange-50 rounded-lg p-3">
                                    <Text className="text-orange-800 text-sm font-medium">
                                        ⚠️ Mức tồn kho thấp
                                    </Text>
                                    <br />
                                    <Text className="text-orange-600 text-xs">
                                        Số lượng hiện tại ({inventory.quantity})
                                        đã xuống dưới mức tối thiểu ({inventory.maxQuantity}).
                                        Cần nhập thêm hàng.
                                    </Text>
                                </div>
                            </Card>
                        )}
                    </Space>
                </div>
            </div>
        </div>
    );
};