/**
 * ACL (Access Control List) Types
 * Based on: ACL Dashboard Guide v1.0.0
 */

/**
 * Permission Actions
 */
export enum PermissionAction {
  MANAGE = 'manage',
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  RESTORE = 'restore',
  EXPORT = 'export',
  IMPORT = 'import',
  PUBLISH = 'publish',
  ARCHIVE = 'archive',
  MODERATE = 'moderate',
  ASSIGN = 'assign',
}

/**
 * Permission Subjects (Resources)
 */
export enum PermissionSubject {
  ALL = 'all',
  USER = 'User',
  STORY = 'Story',
  STORY_VERSION = 'StoryVersion',
  ATTACHMENT = 'Attachment',
  CATEGORY = 'Category',
  TAG = 'Tag',
  SESSION = 'Session',
  ROLE = 'Role',
  PERMISSION = 'Permission',
  COUNTRY = 'Country',
  SETTING = 'Setting',
  AUDIT_LOG = 'AuditLog',
  POST_TYPE = 'PostType',
  FIELD_DEFINITION = 'FieldDefinition',
  CONTENT = 'Content',
}

/**
 * Role Permission Join
 */
export interface RolePermission {
  id: number;
  roleId: number;
  permissionId: number;
  createdAt: string;
  permission: Permission;
}

/**
 * Role with permissions (API response format)
 */
export interface RoleApiResponse {
  id: number;
  name: string;
  description?: string;
  isSystem: boolean;
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  rolePermissions?: RolePermission[];
}

/**
 * Role with permissions (normalized format for UI)
 */
export interface Role {
  id: number;
  name: string;
  displayName?: string;
  description?: string;
  level?: number;
  isSystem: boolean;
  isActive?: boolean;
  priority?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  permissions?: Permission[];
}

/**
 * Permission definition
 */
export interface Permission {
  id: number;
  action: string;
  subject: string;
  reason?: string;
  conditions?: Record<string, any>;
  fields?: string[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * User's effective permissions
 */
export interface UserPermissions {
  userId: string;
  primaryRole: {
    id: number;
    name: string;
    level: number;
  };
  additionalRoles?: Array<{
    id: number;
    name: string;
    level: number;
  }>;
  effectivePermissions: Permission[];
}

/**
 * User Roles Response
 */
export interface UserRolesResponse {
  primaryRole: {
    id: number;
    name: string;
    displayName: string;
    level: number;
    permissions?: Permission[];
  };
  additionalRoles?: Array<{
    id: number;
    name: string;
    displayName: string;
    level: number;
    isActive: boolean;
    assignedAt: string;
    permissions?: Permission[];
  }>;
}

/**
 * Create Role DTO
 */
export interface CreateRoleDto {
  name: string;
  displayName: string;
  description?: string;
  level: number;
  permissionIds: number[];
}

/**
 * Update Role DTO
 */
export interface UpdateRoleDto {
  displayName?: string;
  description?: string;
  level?: number;
  permissionIds?: number[];
}

/**
 * Create Permission DTO
 */
export interface CreatePermissionDto {
  action: string;
  subject: string;
  reason?: string;
  conditions?: Record<string, any>;
  fields?: string[];
}

/**
 * Update Permission DTO
 */
export interface UpdatePermissionDto {
  reason?: string;
  conditions?: Record<string, any>;
  fields?: string[];
}

/**
 * Assign Role to User DTO
 */
export interface AssignRoleDto {
  roleId: number;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  requestId?: string;
}

/**
 * Role query parameters
 */
export interface RoleQueryParams {
  includePermissions?: boolean;
  level?: number;
}

/**
 * Permission query parameters
 */
export interface PermissionQueryParams {
  action?: string;
  subject?: string;
}
