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
  Badge,
  Progress,
  Avatar,
  Divider
} from 'antd';
import {
  SaveOutlined,
  SecurityScanOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  LockOutlined,
  TeamOutlined,
  SettingOutlined,
  KeyOutlined
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

// Color scheme for different modules
const moduleColors = [
  'blue', 'green', 'purple', 'orange', 'red', 'cyan', 'magenta', 'gold'
];

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
  const maxPossibleAssignments = totalRoles * totalPermissions;
  const assignmentPercentage = maxPossibleAssignments > 0 ? (totalAssignments / maxPossibleAssignments) * 100 : 0;

  // Get module icon based on module name
  const getModuleIcon = (moduleName: string) => {
    const name = moduleName.toLowerCase();
    if (name.includes('user') || name.includes('người dùng')) return <UserOutlined />;
    if (name.includes('security') || name.includes('bảo mật')) return <LockOutlined />;
    if (name.includes('setting') || name.includes('cài đặt')) return <SettingOutlined />;
    if (name.includes('team') || name.includes('nhóm')) return <TeamOutlined />;
    return <KeyOutlined />;
  };

  const columns: ColumnsType<MatrixRow> = [
    {
      title: (
        <div className="flex items-center justify-center space-x-2 py-2">
          <SecurityScanOutlined className="text-lg text-blue-600" />
          <Text strong className="text-base">Module hệ thống</Text>
        </div>
      ),
      dataIndex: 'module',
      key: 'module',
      fixed: 'left',
      width: 220,
      render: (module: string, record: MatrixRow, index: number) => {
        const color = moduleColors[index % moduleColors.length];
        return (
          <div className="py-3">
            <div className="flex items-center space-x-3">
              {getModuleIcon(module)}
              <div className="flex-1">
                <Badge
                  count={record.permissions.length}
                  size="small"
                  className={`[&_.ant-badge-count]:bg-${color}-500 [&_.ant-badge-count]:text-white`}
                >
                  <Tag
                    color={color}
                    className="m-0 px-4 py-2 rounded-lg font-semibold text-sm border-0 shadow-sm"
                    style={{ minWidth: '120px', textAlign: 'center' }}
                  >
                    {module}
                  </Tag>
                </Badge>
                <div className="mt-2">
                  <Text type="secondary" className="text-xs">
                    {record.permissions.length} quyền hạn
                  </Text>
                </div>
              </div>
            </div>
          </div>
        );
      },
    },
    ...roles.map((role, roleIndex) => {
      const rolePermissions = rolePermissionsMap[role._id] || [];
      const totalRolePerms = rolePermissions.length;
      const completionPercentage = totalPermissions > 0 ? (totalRolePerms / totalPermissions) * 100 : 0;

      return {
        title: (
          <div className="text-center py-3 px-2">
            <div className="flex flex-col items-center space-y-2">
              <Avatar
                size={40}
                style={{
                  backgroundColor: moduleColors[roleIndex % moduleColors.length] === 'blue' ? '#1890ff' :
                                  moduleColors[roleIndex % moduleColors.length] === 'green' ? '#52c41a' :
                                  moduleColors[roleIndex % moduleColors.length] === 'purple' ? '#722ed1' :
                                  moduleColors[roleIndex % moduleColors.length] === 'orange' ? '#fa8c16' : '#eb2f96'
                }}
                icon={<UserOutlined />}
              />
              <div>
                <Text strong className="text-sm block">{role.name}</Text>
                <Text type="secondary" className="text-xs">
                  {totalRolePerms} quyền
                </Text>
                <Progress
                  percent={Math.round(completionPercentage)}
                  size="small"
                  className="mt-1 [&_.ant-progress-bg]:bg-gradient-to-r [&_.ant-progress-bg]:from-blue-400 [&_.ant-progress-bg]:to-blue-600"
                  strokeWidth={4}
                />
              </div>
            </div>
          </div>
        ),
        dataIndex: role._id,
        key: role._id,
        width: 200,
        align: 'center' as const,
        render: (_: unknown, record: MatrixRow) => {
          const rolePermissions = rolePermissionsMap[role._id] || [];
          const checkedCount = record.permissions.filter(perm =>
            rolePermissions.includes(perm._id)
          ).length;
          const moduleCompletion = record.permissions.length > 0 ? (checkedCount / record.permissions.length) * 100 : 0;

          return (
            <div className="py-4 px-3">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex flex-col space-y-3">
                  {record.permissions.map((perm) => {
                    const checked = rolePermissions.includes(perm._id);
                    const label = perm.name.split('_')[1] || perm.name;
                    const formattedLabel = label.charAt(0).toUpperCase() + label.slice(1);

                    return (
                      <Tooltip
                        key={perm._id}
                        title={
                          <div>
                            <div className="font-medium">{perm.name}</div>
                            <div className="text-xs opacity-75">{perm.description || 'Không có mô tả'}</div>
                          </div>
                        }
                        placement="topLeft"
                      >
                        <div className={`
                          ${checked
                            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-sm'
                            : 'bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-200'
                          }
                          border rounded-lg p-3 transition-all duration-300 cursor-pointer group
                          hover:shadow-md hover:scale-[1.02] transform
                        `}>
                          <Checkbox
                            checked={checked}
                            onChange={(e) =>
                              handleToggle(role._id, perm._id, e.target.checked)
                            }
                            className="w-full"
                          >
                            <Text className={`
                              text-sm font-medium
                              ${checked ? 'text-green-700' : 'text-gray-700 group-hover:text-blue-700'}
                              transition-colors duration-200
                            `}>
                              {formattedLabel}
                            </Text>
                          </Checkbox>
                          {checked && (
                            <CheckCircleOutlined className="float-right text-green-500 mt-1" />
                          )}
                        </div>
                      </Tooltip>
                    );
                  })}

                  {record.permissions.length > 0 && (
                    <>
                      <Divider className="my-2" />
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Text type="secondary" className="text-xs font-medium">
                            Hoàn thành: {checkedCount}/{record.permissions.length}
                          </Text>
                          {checkedCount === record.permissions.length && checkedCount > 0 && (
                            <Badge status="success" />
                          )}
                        </div>
                        <Progress
                          percent={Math.round(moduleCompletion)}
                          size="small"
                          className="mt-2"
                          strokeColor={{
                            '0%': '#52c41a',
                            '100%': '#73d13d',
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        },
      };
    }),
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <Card className="shadow-lg border-0 rounded-2xl">
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
            <div className="animate-pulse">
              <SecurityScanOutlined className="text-6xl text-blue-500" />
            </div>
            <Spin size="large" />
            <div className="text-center">
              <Title level={4} className="!mb-2 text-gray-700">Đang tải dữ liệu</Title>
              <Text type="secondary">Vui lòng đợi trong giây lát...</Text>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className=" p-6">
      <Space size="large" direction='vertical' className='w-full'>

        {/* Header Card */}
        <Card className="rounded-2xl border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          <div className="relative z-10">
            <Row align="middle" justify="space-between">
              <Col>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                    <SecurityScanOutlined className="text-3xl text-white" />
                  </div>
                  <div>
                    <Title level={1} className="!m-0 !text-white font-bold">
                      Ma trận phân quyền
                    </Title>
                    <Text className="text-blue-100 text-base">
                      Quản lý quyền truy cập toàn diện cho hệ thống
                    </Text>
                  </div>
                </div>
              </Col>
              <Col>
                <div className="flex space-x-8">
                  <div className="text-center p-4 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
                    <div className="text-3xl font-bold text-white">
                      {totalRoles}
                    </div>
                    <Text className="text-blue-100 text-sm font-medium">Vai trò</Text>
                  </div>
                  <div className="text-center p-4 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
                    <div className="text-3xl font-bold text-white">
                      {totalPermissions}
                    </div>
                    <Text className="text-blue-100 text-sm font-medium">Quyền hạn</Text>
                  </div>
                  <div className="text-center p-4 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
                    <div className="text-3xl font-bold text-white">
                      {Math.round(assignmentPercentage)}%
                    </div>
                    <Text className="text-blue-100 text-sm font-medium">Hoàn thành</Text>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Card>

        {/* Main Content Card */}
        <Card className="rounded-2xl shadow-lg border-0 overflow-hidden">

          {/* Action Bar */}
          <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
            <Row justify="space-between" align="middle">
              <Col>
                <div className="flex items-center space-x-3">
                  <ExclamationCircleOutlined className="text-xl text-amber-500" />
                  <div>
                    <Text className="text-base font-medium text-gray-800">
                      Cấu hình ma trận phân quyền
                    </Text>
                    <br />
                    <Text className="text-sm text-gray-600">
                      Chọn các quyền phù hợp cho từng vai trò. Thay đổi sẽ được lưu khi bấm "Lưu thay đổi".
                    </Text>
                  </div>
                </div>
              </Col>
              <Col>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSubmit}
                  loading={saving}
                  size="large"
                  className="rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600 border-0 px-8 py-2 h-auto"
                  style={{ minHeight: '48px' }}
                >
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </Col>
            </Row>
          </div>

          {/* Progress Overview */}
          <div className="px-8 py-4 bg-white border-b border-gray-50">
            <div className="flex items-center justify-between">
              <Text className="text-sm font-medium text-gray-600">Tiến độ tổng thể:</Text>
              <Text className="text-sm font-medium text-blue-600">
                {totalAssignments} / {maxPossibleAssignments} phân quyền
              </Text>
            </div>
            <Progress
              percent={Math.round(assignmentPercentage)}
              className="mt-2"
              strokeColor={{
                '0%': '#3b82f6',
                '50%': '#8b5cf6',
                '100%': '#06b6d4',
              }}
              trailColor="#f1f5f9"
            />
          </div>

          {/* Matrix Table */}
          <div>
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={false}
              rowKey="key"
              scroll={{ x: 'max-content' }}
              size="middle"
              className="
                border-0 rounded-xl overflow-hidden shadow-sm
                [&_.ant-table-thead>tr>th]:bg-gradient-to-r [&_.ant-table-thead>tr>th]:from-slate-50 [&_.ant-table-thead>tr>th]:to-blue-50
                [&_.ant-table-thead>tr>th]:border-b-2 [&_.ant-table-thead>tr>th]:border-blue-100
                [&_.ant-table-thead>tr>th]:font-bold [&_.ant-table-thead>tr>th]:text-gray-800
                [&_.ant-table-tbody>tr:hover>td]:bg-blue-50
                [&_.ant-table-tbody>tr:nth-child(even)]:bg-gray-25
                [&_.ant-table-tbody>tr:nth-child(odd)]:bg-white
                [&_.ant-table-tbody>tr>td]:border-b [&_.ant-table-tbody>tr>td]:border-gray-100
                [&_.ant-table-tbody>tr>td]:py-0
              "
            />
          </div>
        </Card>
      </Space>
    </div>
  );
};