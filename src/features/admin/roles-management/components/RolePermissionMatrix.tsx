import React, { useEffect, useState } from 'react';
import { Table, Checkbox, Spin, Typography, message, Space, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { IRole, IPermission } from '@/types';
import { getAllRoles, assignPermissionsToRole } from '@/features/admin/roles-management/services/roleService';
import { getAllPermissions } from '@/features/admin/permissions-management/services/permissionService';
import { toast } from 'sonner';

interface MatrixRow {
  key: string;
  module: string;
  permissions: IPermission[];
}

export const RolePermissionMatrix: React.FC = () => {
  const [roles, setRoles] = useState<IRole[]>([]);
  const [permissions, setPermissions] = useState<IPermission[]>([]);
  const [loading, setLoading] = useState(false);
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
              const checked = rolePermissionsMap[role._id]?.includes(perm._id);
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
        <div>
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            rowKey="key"
            scroll={{ x: 'max-content' }}
          />
          <Button type='primary' onClick={handleSubmit}>
            Lưu
          </Button>
        </div>
      )}
    </div>
  );
};
