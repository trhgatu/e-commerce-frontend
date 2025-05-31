import React, { useEffect, useState } from 'react';
import { Table, Checkbox, Spin, Typography, message, Space } from 'antd';
import axios from 'axios';
import type { ColumnsType } from 'antd/es/table';
import { IRole, IPermission } from '@/types';
import { getAllRoles } from '@/features/admin/roles-management/services/roleService';
import { getAllPermissions } from '@/features/admin/permissions-management/services/permissionService';

interface MatrixRow {
  key: string;
  module: string;
  permissions: IPermission[];
}

const RolePermissionMatrix: React.FC = () => {
  const [roles, setRoles] = useState<IRole[]>([]);
  const [permissions, setPermissions] = useState<IPermission[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [roleRes, permRes] = await Promise.all([
          getAllRoles(1, 100),
          getAllPermissions(1, 100),
        ]);
        setRoles(roleRes.data.map((r: IRole) => ({ ...r, permissions: r.permissions ?? [] })));
        setPermissions(permRes.data);
      } catch (error) {
        console.error('Error fetching roles or permissions:', error);
        message.error('Không thể tải dữ liệu từ máy chủ.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  const handleToggle = async (
    roleId: string,
    permissionId: string,
    isChecked: boolean
  ) => {
    const role = roles.find((r) => r._id === roleId);
    if (!role) return;

    const updatedPermissions = isChecked
      ? [...role.permissions, permissions.find((p) => p._id === permissionId)!]
      : role.permissions.filter((p) => p._id !== permissionId);

    try {
      await axios.patch(`/api/roles/${roleId}`, {
        permissions: updatedPermissions.map((p) => p._id),
      });

      setRoles((prev) =>
        prev.map((r) =>
          r._id === roleId ? { ...r, permissions: updatedPermissions } : r
        )
      );

      message.success('Cập nhật quyền thành công');
    } catch (err) {
        console.error('Error updating role permissions:', err);
      message.error('Cập nhật quyền thất bại');
    }
  };

  const columns: ColumnsType<MatrixRow> = [
    {
      title: 'Module',
      dataIndex: 'module',
      key: 'module',
      fixed: 'left',
    },
    ...roles.map((role) => ({
      title: role.name,
      dataIndex: role._id,
      key: role._id,
      render: (_: unknown, record: MatrixRow) => {
        return (
          <Space wrap>
            {record.permissions.map((perm) => {
              const checked = role.permissions?.some((p) => p._id === perm._id);
              const label = perm.name.split('_')[1];
              return (
                <Checkbox
                  key={perm._id}
                  checked={checked}
                  onChange={(e) =>
                    handleToggle(role._id, perm._id, e.target.checked)
                  }
                >
                  {label.charAt(0).toUpperCase() + label.slice(1)}
                </Checkbox>
              );
            })}
          </Space>
        );
      },
    })),
  ];

  return (
    <div>
      <Typography.Title level={3}>Ma trận phân quyền</Typography.Title>
      {loading ? (
        <Spin />
      ) : (
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          rowKey="key"
          scroll={{ x: 'max-content' }}
        />
      )}
    </div>
  );
};

export default RolePermissionMatrix;
