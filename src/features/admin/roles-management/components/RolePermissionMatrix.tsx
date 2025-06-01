import React, { useEffect, useState } from 'react';
import {
  Table,
  Checkbox,
  Spin,
  Typography,
  message,
  Space,
  Button,
  Card,
  Tag,
  Row,
  Col,
  Tooltip,
  Badge
} from 'antd';
import {
  SaveOutlined,
  SecurityScanOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { IRole, IPermission } from '@/types';
import { getAllRoles, assignPermissionsToRole } from '@/features/admin/roles-management/services/roleService';
import { getAllPermissions } from '@/features/admin/permissions-management/services/permissionService';
import { toast } from 'sonner';

const { Title, Text } = Typography;

interface MatrixRow {
  key: string;
  module: string;
  permissions: IPermission[];
}

export const RolePermissionMatrix: React.FC = () => {
  const [roles, setRoles] = useState<IRole[]>([]);
  const [permissions, setPermissions] = useState<IPermission[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rolePermissionsMap, setRolePermissionsMap] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [roleRes, permRes] = await Promise.all([
          getAllRoles(1, 100),
          getAllPermissions(1, 100),
        ]);
        const rolesData = roleRes.data;
        const roleMap: Record<string, string[]> = {};
        rolesData.forEach((role: IRole) => {
          roleMap[role._id] = role.permissions?.map(p => p._id) ?? [];
        });
        setRoles(rolesData);
        setPermissions(permRes.data);
        setRolePermissionsMap(roleMap);
      } catch (error) {
        console.error('Error fetching roles or permissions:', error);
        message.error('Không thể tải dữ liệu từ máy chủ.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggle = (roleId: string, permissionId: string, isChecked: boolean) => {
    setRolePermissionsMap((prev) => {
      const prevPermissions = prev[roleId] ?? [];
      const updated = isChecked
        ? [...new Set([...prevPermissions, permissionId])]
        : prevPermissions.filter((id) => id !== permissionId);

      return {
        ...prev,
        [roleId]: updated,
      };
    });
  };

  const handleSubmit = async () => {
    setSaving(true);
    const toastId = toast.loading("Đang lưu phân quyền...");

    try {
      await Promise.all(
        Object.entries(rolePermissionsMap).map(([roleId, permissionIds]) =>
          assignPermissionsToRole(roleId, permissionIds)
        )
      );
      toast.success("Phân quyền đã được cập nhật!", { id: toastId });
    } catch (err) {
      console.error('Error updating role permissions:', err);
      toast.error("Cập nhật thất bại!", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const groupedPermissions: Record<string, IPermission[]> = permissions.reduce((acc, perm) => {
    const group = perm.group || 'Khác';
    if (!acc[group]) acc[group] = [];
    acc[group].push(perm);
    return acc;
  }, {} as Record<string, IPermission[]>);

  const dataSource: MatrixRow[] = Object.entries(groupedPermissions).map(([group, perms]) => ({
    key: group,
    module: group,
    permissions: perms,
  }));

  // Calculate stats
  const totalPermissions = permissions.length;
  const totalRoles = roles.length;
  const totalAssignments = Object.values(rolePermissionsMap).reduce(
    (sum, perms) => sum + perms.length, 0
  );

  const columns: ColumnsType<MatrixRow> = [
    {
      title: (
        <div className="flex items-center space-x-2">
          <SecurityScanOutlined className="text-blue-500" />
          <Text strong>Module</Text>
        </div>
      ),
      dataIndex: 'module',
      key: 'module',
      fixed: 'left',
      width: 200,
      render: (module: string, record: MatrixRow) => (
        <div className="py-2">
          <Badge
            count={record.permissions.length}
            size="small"
            className="[&_.ant-badge-count]:bg-blue-500"
          >
            <Tag
              color="blue"
              className="m-0 px-3 py-1 rounded-md font-medium"
            >
              {module}
            </Tag>
          </Badge>
        </div>
      ),
    },
    ...roles.map((role) => ({
      title: (
        <div className="text-center">
          <UserOutlined className="mb-1 text-blue-500" />
          <div>
            <Text strong className="text-xs">{role.name}</Text>
          </div>
          <Text type="secondary" className="text-xs">
            {rolePermissionsMap[role._id]?.length || 0} quyền
          </Text>
        </div>
      ),
      dataIndex: role._id,
      key: role._id,
      width: 180,
      align: 'center' as const,
      render: (_: unknown, record: MatrixRow) => {
        const rolePermissions = rolePermissionsMap[role._id] || [];
        const checkedCount = record.permissions.filter(perm =>
          rolePermissions.includes(perm._id)
        ).length;

        return (
          <div className="py-3 px-2">
            <div className="flex flex-col space-y-2 w-full">
              {record.permissions.map((perm) => {
                const checked = rolePermissions.includes(perm._id);
                const label = perm.name.split('_')[1] || perm.name;
                const formattedLabel = label.charAt(0).toUpperCase() + label.slice(1);

                return (
                  <Tooltip key={perm._id} title={perm.description || perm.name}>
                    <div className={`
                      ${checked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}
                      border rounded-md p-2 transition-all duration-200 hover:shadow-sm
                    `}>
                      <Checkbox
                        checked={checked}
                        onChange={(e) =>
                          handleToggle(role._id, perm._id, e.target.checked)
                        }
                        className="text-xs"
                      >
                        <Text className={`
                          text-xs
                          ${checked ? 'font-medium text-green-600' : 'font-normal'}
                        `}>
                          {formattedLabel}
                        </Text>
                      </Checkbox>
                    </div>
                  </Tooltip>
                );
              })}
              {record.permissions.length > 0 && (
                <div className="text-center mt-2 pt-2 border-t border-gray-100">
                  <Text
                    type="secondary"
                    className="text-xs flex items-center justify-center space-x-1"
                  >
                    <span>{checkedCount}/{record.permissions.length}</span>
                    {checkedCount === record.permissions.length && checkedCount > 0 && (
                      <CheckCircleOutlined className="text-green-500" />
                    )}
                  </Text>
                </div>
              )}
            </div>
          </div>
        );
      },
    })),
  ];

  if (loading) {
    return (
      <Card className="shadow-sm">
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
          <Spin size="large" />
          <Text type="secondary">Đang tải dữ liệu phân quyền...</Text>
        </div>
      </Card>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Space size="middle" direction='vertical' className='w-full'>
        <Card className="mb-6 rounded-xl shadow-sm border-0">
        <Row align="middle" justify="space-between">
          <Col>
            <div className="flex items-center space-x-4">
              <SecurityScanOutlined className="text-2xl text-blue-500" />
              <div>
                <Title level={2} className="!m-0 text-gray-900">
                  Ma trận phân quyền
                </Title>
                <Text type="secondary" className="text-sm">
                  Quản lý quyền truy cập cho từng vai trò trong hệ thống
                </Text>
              </div>
            </div>
          </Col>
          <Col>
            <div className="flex space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {totalRoles}
                </div>
                <Text type="secondary" className="text-xs">Vai trò</Text>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  {totalPermissions}
                </div>
                <Text type="secondary" className="text-xs">Quyền hạn</Text>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">
                  {totalAssignments}
                </div>
                <Text type="secondary" className="text-xs">Phân quyền</Text>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      <Card className="rounded-xl shadow-sm border-0 overflow-hidden">
        <div className="px-6 py-5 bg-gray-50 border-b border-gray-100">
          <Row justify="space-between" align="middle">
            <Col>
              <div className="flex items-center space-x-2">
                <ExclamationCircleOutlined className="text-yellow-500" />
                <Text className="text-sm text-gray-600">
                  Chọn các quyền phù hợp cho từng vai trò. Thay đổi sẽ được lưu khi bấm nút "Lưu thay đổi".
                </Text>
              </div>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSubmit}
                loading={saving}
                size="large"
                className="rounded-lg font-medium shadow-md hover:shadow-lg transition-shadow"
              >
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </Col>
          </Row>
        </div>

        <div className='mt-6'>
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            rowKey="key"
            scroll={{ x: 'max-content' }}
            size="middle"
            className="border border-gray-200 rounded-lg overflow-hidden [&_.ant-table-thead>tr>th]:bg-gray-50 [&_.ant-table-thead>tr>th]:border-b-2 [&_.ant-table-thead>tr>th]:border-gray-200 [&_.ant-table-thead>tr>th]:font-semibold [&_.ant-table-thead>tr>th]:text-gray-700 [&_.ant-table-tbody>tr:hover>td]:bg-blue-50 [&_.ant-table-tbody>tr:nth-child(even)]:bg-gray-25 [&_.ant-table-tbody>tr:nth-child(odd)]:bg-white"
          />
        </div>
      </Card>
      </Space>
    </div>
  );
};