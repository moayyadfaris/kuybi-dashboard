/**
 * ACL (Access Control List) Service
 * Handles API calls for roles, permissions, and user role assignments
 */

import axios from 'axios';
import type {
  Role,
  RoleApiResponse,
  Permission,
  UserPermissions,
  UserRolesResponse,
  CreateRoleDto,
  UpdateRoleDto,
  CreatePermissionDto,
  UpdatePermissionDto,
  AssignRoleDto,
  ApiResponse,
  RoleQueryParams,
  PermissionQueryParams,
} from '../types/acl';

const API_BASE_URL = 'http://localhost:4040/api/v1';

/**
 * Get authorization header
 */
const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Transform API role response to UI format
 */
const transformRole = (apiRole: RoleApiResponse): Role => {
  const permissions = apiRole.rolePermissions?.map((rp) => rp.permission) || [];
  
  return {
    id: apiRole.id,
    name: apiRole.name,
    displayName: apiRole.name
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    description: apiRole.description,
    level: apiRole.priority ? Math.floor(apiRole.priority / 10) : 1,
    isSystem: apiRole.isSystem,
    isActive: apiRole.isActive,
    priority: apiRole.priority,
    createdAt: apiRole.createdAt,
    updatedAt: apiRole.updatedAt,
    deletedAt: apiRole.deletedAt,
    permissions,
  };
};

/**
 * Role Management APIs
 */

/**
 * Get all roles
 */
export const getRoles = async (params?: RoleQueryParams): Promise<Role[]> => {
  const response = await axios.get<ApiResponse<RoleApiResponse[]>>(`${API_BASE_URL}/roles`, {
    headers: getAuthHeader(),
    params,
  });
  return response.data.data.map(transformRole);
};

/**
 * Get single role by ID
 */
export const getRoleById = async (id: number): Promise<Role> => {
  const response = await axios.get<ApiResponse<RoleApiResponse>>(
    `${API_BASE_URL}/roles/${id}`,
    {
      headers: getAuthHeader(),
    }
  );
  return transformRole(response.data.data);
};

/**
 * Create new role (Super Admin only)
 */
export const createRole = async (data: CreateRoleDto): Promise<Role> => {
  const response = await axios.post<ApiResponse<RoleApiResponse>>(
    `${API_BASE_URL}/roles`,
    data,
    {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    }
  );
  return transformRole(response.data.data);
};

/**
 * Update role (Super Admin only)
 */
export const updateRole = async (id: number, data: UpdateRoleDto): Promise<Role> => {
  const response = await axios.put<ApiResponse<RoleApiResponse>>(
    `${API_BASE_URL}/roles/${id}`,
    data,
    {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    }
  );
  return transformRole(response.data.data);
};

/**
 * Get role permissions
 */
export const getRolePermissions = async (id: number): Promise<Permission[]> => {
  const response = await axios.get<ApiResponse<Permission[]>>(
    `${API_BASE_URL}/roles/${id}/permissions`,
    {
      headers: getAuthHeader(),
    }
  );
  return response.data.data;
};

/**
 * Assign permissions to role (Super Admin only)
 */
export const assignPermissionsToRole = async (
  roleId: number,
  permissionIds: number[]
): Promise<void> => {
  await axios.post(
    `${API_BASE_URL}/roles/${roleId}/permissions`,
    { permissionIds },
    {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    }
  );
};

/**
 * Remove permissions from role (Super Admin only)
 */
export const removePermissionsFromRole = async (
  roleId: number,
  permissionIds: number[]
): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/roles/${roleId}/permissions`, {
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'application/json',
    },
    data: { permissionIds },
  });
};

/**
 * Delete role (Super Admin only)
 */
export const deleteRole = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/roles/${id}`, {
    headers: getAuthHeader(),
  });
};

/**
 * Permission Management APIs
 */

/**
 * Get all permissions
 */
export const getPermissions = async (
  params?: PermissionQueryParams
): Promise<Permission[]> => {
  const response = await axios.get<ApiResponse<Permission[]>>(
    `${API_BASE_URL}/permissions`,
    {
      headers: getAuthHeader(),
      params,
    }
  );
  return response.data.data;
};

/**
 * Get single permission by ID
 */
export const getPermissionById = async (id: number): Promise<Permission> => {
  const response = await axios.get<ApiResponse<Permission>>(
    `${API_BASE_URL}/permissions/${id}`,
    {
      headers: getAuthHeader(),
    }
  );
  return response.data.data;
};

/**
 * Create new permission (Super Admin only)
 */
export const createPermission = async (
  data: CreatePermissionDto
): Promise<Permission> => {
  const response = await axios.post<ApiResponse<Permission>>(
    `${API_BASE_URL}/permissions`,
    data,
    {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data.data;
};

/**
 * Update permission (Super Admin only)
 */
export const updatePermission = async (
  id: number,
  data: UpdatePermissionDto
): Promise<Permission> => {
  const response = await axios.put<ApiResponse<Permission>>(
    `${API_BASE_URL}/permissions/${id}`,
    data,
    {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data.data;
};

/**
 * Delete permission (Super Admin only)
 */
export const deletePermission = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/permissions/${id}`, {
    headers: getAuthHeader(),
  });
};

/**
 * User Role Assignment APIs
 */

/**
 * Get user's roles
 */
export const getUserRoles = async (userId: string): Promise<UserRolesResponse> => {
  const response = await axios.get<ApiResponse<UserRolesResponse>>(
    `${API_BASE_URL}/users/${userId}/roles`,
    {
      headers: getAuthHeader(),
    }
  );
  return response.data.data;
};

/**
 * Assign role to user (Admin+)
 */
export const assignRoleToUser = async (
  userId: string,
  data: AssignRoleDto
): Promise<void> => {
  await axios.post(`${API_BASE_URL}/users/${userId}/roles`, data, {
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Remove role from user (Admin+)
 */
export const removeRoleFromUser = async (
  userId: string,
  roleId: number
): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/users/${userId}/roles/${roleId}`, {
    headers: getAuthHeader(),
  });
};

/**
 * Activate user role
 */
export const activateUserRole = async (
  userId: string,
  roleId: number
): Promise<void> => {
  await axios.post(
    `${API_BASE_URL}/users/${userId}/roles/${roleId}/activate`,
    {},
    {
      headers: getAuthHeader(),
    }
  );
};

/**
 * Deactivate user role
 */
export const deactivateUserRole = async (
  userId: string,
  roleId: number
): Promise<void> => {
  await axios.post(
    `${API_BASE_URL}/users/${userId}/roles/${roleId}/deactivate`,
    {},
    {
      headers: getAuthHeader(),
    }
  );
};

/**
 * Get user's roles and permissions (legacy support)
 * @deprecated Use getUserRoles instead
 */
export const getUserPermissions = async (userId: string): Promise<UserPermissions> => {
  const rolesData = await getUserRoles(userId);
  
  // Extract all permissions from primary and additional roles
  const allPermissions: Permission[] = [];
  
  if (rolesData.primaryRole?.permissions) {
    allPermissions.push(...rolesData.primaryRole.permissions);
  }
  
  if (rolesData.additionalRoles) {
    rolesData.additionalRoles.forEach((role) => {
      if (role.permissions && role.isActive) {
        allPermissions.push(...role.permissions);
      }
    });
  }
  
  return {
    userId,
    primaryRole: {
      id: rolesData.primaryRole.id,
      name: rolesData.primaryRole.name,
      level: rolesData.primaryRole.level,
    },
    additionalRoles: rolesData.additionalRoles?.map((r) => ({
      id: r.id,
      name: r.name,
      level: r.level,
    })),
    effectivePermissions: allPermissions,
  };
};

/**
 * Update user's primary role
 */
export const updateUserPrimaryRole = async (
  userId: string,
  roleId: number
): Promise<void> => {
  await axios.patch(
    `${API_BASE_URL}/users/${userId}`,
    { primaryRoleId: roleId },
    {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    }
  );
};
