import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, Typography, Space, Tag, Descriptions, Button, Skeleton, Alert } from "antd";
import { EditOutlined, ArrowLeftOutlined, DeleteOutlined, FolderOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import { getCategoryById } from "@/features/admin/categories-management/services/categoryService";

const { Title, Text } = Typography;

interface CategoryData {
    _id: string;
    name: string;
    parentId: string | null;
    description: string;
    isDeleted: boolean;
    slug: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export const DetailCategoryPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [category, setCategory] = useState<CategoryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategory = async () => {
            if (!id) {
                setError("Category ID is required");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await getCategoryById(id);
                setCategory(response.data);
                setError(null);
            } catch (error) {
                console.error("Failed to fetch category:", error);
                setError("Failed to load category details");
                toast.error("Failed to load category details");
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
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

    const handleEdit = () => {
        navigate(`/admin/categories/edit/${id}`);
    };

    const handleDelete = () => {
        // Add delete confirmation modal logic here
        console.log("Delete category:", id);
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

    if (error || !category) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-6">
                    <Alert
                        message="Lỗi"
                        description={error || "Không tìm thấy danh mục"}
                        type="error"
                        showIcon
                        action={
                            <Button size="small" onClick={() => navigate("/admin/categories")}>
                                Quay lại danh sách
                            </Button>
                        }
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate("/admin/categories")}
                        className="flex items-center"
                    >
                        Quay lại
                    </Button>
                </div>

                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FolderOutlined className="text-blue-600 text-xl" />
                        </div>
                        <div>
                            <Title level={2} className="!text-3xl !font-bold !text-gray-900 !mb-2">
                                {category.name}
                            </Title>
                            <Space size="middle">
                                <Tag color={category.isDeleted ? "red" : "green"}>
                                    {category.isDeleted ? "Đã xóa" : "Hoạt động"}
                                </Tag>
                                <Text className="text-gray-600">
                                    Slug: {category.slug}
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
                {/* Category Information */}
                <div className="space-y-6 lg:col-span-2">
                    <Space direction="vertical" size="middle">
                        <Card title="Thông tin danh mục" className="shadow-sm">
                            <Descriptions column={1} size="middle">
                                <Descriptions.Item label="Tên danh mục">
                                    <Text strong className="text-lg">{category.name}</Text>
                                </Descriptions.Item>

                                <Descriptions.Item label="Mô tả">
                                    {category.description ? (
                                        <Text className="text-gray-700">{category.description}</Text>
                                    ) : (
                                        <Text className="text-gray-400 italic">Chưa có mô tả</Text>
                                    )}
                                </Descriptions.Item>

                                <Descriptions.Item label="Slug">
                                    <Tag color="blue">{category.slug}</Tag>
                                </Descriptions.Item>

                                <Descriptions.Item label="Danh mục cha">
                                    {category.parentId ? (
                                        <Tag color="purple">ID: {category.parentId}</Tag>
                                    ) : (
                                        <Text className="text-gray-400">Danh mục gốc</Text>
                                    )}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                        {/* Category Hierarchy */}
                        <Card title="Cấu trúc danh mục" className="shadow-sm">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center space-x-2">
                                    <FolderOutlined className="text-gray-500" />
                                    {category.parentId ? (
                                        <>
                                            <Text className="text-gray-500">Danh mục cha</Text>
                                            <Text className="text-gray-400">/</Text>
                                        </>
                                    ) : null}
                                    <Text strong className="text-blue-600">{category.name}</Text>
                                </div>
                                <Text className="text-sm text-gray-500 mt-2">
                                    {category.parentId
                                        ? "Đây là danh mục con, thuộc về một danh mục cha khác"
                                        : "Đây là danh mục gốc, không có danh mục cha"
                                    }
                                </Text>
                            </div>
                        </Card>
                    </Space>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Space direction="vertical" size="middle">
                        <Card title="Trạng thái" className="shadow-sm">
                            <Space direction="vertical" className="w-full">
                                <div className="flex justify-between items-center">
                                    <Text>Trạng thái:</Text>
                                    <Tag color={category.isDeleted ? "red" : "green"} className="ml-2">
                                        {category.isDeleted ? "Đã xóa" : "Hoạt động"}
                                    </Tag>
                                </div>
                                <div className="flex justify-between items-center">
                                    <Text>ID:</Text>
                                    <Text code className="text-sm">{category._id}</Text>
                                </div>
                            </Space>
                        </Card>

                        {/* Timestamps */}
                        <Card title="Thời gian" className="shadow-sm">
                            <Space direction="vertical" className="w-full">
                                <div>
                                    <Text className="text-gray-600 text-sm">Ngày tạo:</Text>
                                    <br />
                                    <Text strong>{formatDate(category.createdAt)}</Text>
                                </div>
                                <div className="border-t pt-3">
                                    <Text className="text-gray-600 text-sm">Cập nhật lần cuối:</Text>
                                    <br />
                                    <Text strong>{formatDate(category.updatedAt)}</Text>
                                </div>
                            </Space>
                        </Card>

                        {/* Statistics */}
                        <Card title="Thống kê" className="shadow-sm">
                            <Space direction="vertical" className="w-full">
                                <div className="flex justify-between items-center">
                                    <Text>Số sản phẩm:</Text>
                                    <Text strong className="text-blue-600">0</Text>
                                </div>
                                <div className="flex justify-between items-center">
                                    <Text>Danh mục con:</Text>
                                    <Text strong className="text-green-600">0</Text>
                                </div>
                            </Space>
                            <div className="mt-4 pt-4 border-t">
                                <Text className="text-xs text-gray-500">
                                    * Dữ liệu thống kê sẽ được cập nhật trong phiên bản tương lai
                                </Text>
                            </div>
                        </Card>
                    </Space>
                </div>
            </div>
        </div>
    );
};