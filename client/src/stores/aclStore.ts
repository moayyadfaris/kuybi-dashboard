/**
 * ACL Store
 * Manages roles, permissions, and permission checking logic
 */

import { defineStore } from 'pinia';
import type { Role, Permission, UserPermissions } from '../types/acl';
import * as aclService from '../services/aclService';

interface AclState {
  roles: Role[];
  permissions: Permission[];
  userPermissions: Permission[];
  loading: boolean;
  error: string | null;
}

export const useAclStore = defineStore('acl', {
  state: (): AclState => ({
    roles: [],
    permissions: [],
    userPermissions: [],
    loading: false,
    error: null,
  }),

  getters: {
    /**
     * Get role by ID
     */
    getRoleById: (state) => (id: number) => {
      return state.roles.find((role) => role.id === id);
    },

    /**
     * Get role by name
     */
    getRoleByName: (state) => (name: string) => {
      return state.roles.find((role) => role.name === name);
    },

    /**
     * Get permission by ID
     */
    getPermissionById: (state) => (id: number) => {
      return state.permissions.find((perm) => perm.id === id);
    },

    /**
     * Get permissions by subject
     */
    getPermissionsBySubject: (state) => (subject: string) => {
      return state.permissions.filter((perm) => perm.subject === subject);
    },

    /**
     * Get permissions by action
     */
    getPermissionsByAction: (state) => (action: string) => {
      return state.permissions.filter((perm) => perm.action === action);
    },

    /**
     * Check if user has super admin permission
     */
    isSuperAdmin: (state) => {
      return state.userPermissions.some(
        (p) => p.action === 'manage' && p.subject === 'all'
      );
    },

    /**
     * Get roles sorted by level (descending)
     */
    sortedRoles: (state) => {
      return [...state.roles].sort((a, b) => (b.level ?? 0) - (a.level ?? 0));
    },
  },

  actions: {
    /**
     * Fetch all roles
     */
    async fetchRoles(includePermissions = true): Promise<void> {
      try {
        this.loading = true;
        this.error = null;
        this.roles = await aclService.getRoles({ includePermissions });
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch roles';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Fetch single role by ID
     */
    async fetchRoleById(id: number): Promise<Role> {
      try {
        this.loading = true;
        this.error = null;
        const role = await aclService.getRoleById(id);
        
        // Update in cache if exists
        const index = this.roles.findIndex((r) => r.id === id);
        if (index !== -1) {
          this.roles[index] = role;
        } else {
          this.roles.push(role);
        }
        
        return role;
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch role';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Create new role
     */
    async createRole(data: any): Promise<Role> {
      try {
        this.loading = true;
        this.error = null;
        const role = await aclService.createRole(data);
        this.roles.push(role);
        return role;
      } catch (err: any) {
        this.error = err.message || 'Failed to create role';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Update role
     */
    async updateRole(id: number, data: any): Promise<Role> {
      try {
        this.loading = true;
        this.error = null;
        const role = await aclService.updateRole(id, data);
        
        // Update in cache
        const index = this.roles.findIndex((r) => r.id === id);
        if (index !== -1) {
          this.roles[index] = role;
        }
        
        return role;
      } catch (err: any) {
        this.error = err.message || 'Failed to update role';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Delete role
     */
    async deleteRole(id: number): Promise<void> {
      try {
        this.loading = true;
        this.error = null;
        await aclService.deleteRole(id);
        
        // Remove from cache
        this.roles = this.roles.filter((r) => r.id !== id);
      } catch (err: any) {
        this.error = err.message || 'Failed to delete role';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Fetch all permissions
     */
    async fetchPermissions(): Promise<void> {
      try {
        this.loading = true;
        this.error = null;
        this.permissions = await aclService.getPermissions();
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch permissions';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Fetch single permission by ID
     */
    async fetchPermissionById(id: number): Promise<Permission> {
      try {
        this.loading = true;
        this.error = null;
        const permission = await aclService.getPermissionById(id);
        
        // Update in cache if exists
        const index = this.permissions.findIndex((p) => p.id === id);
        if (index !== -1) {
          this.permissions[index] = permission;
        } else {
          this.permissions.push(permission);
        }
        
        return permission;
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch permission';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Create new permission
     */
    async createPermission(data: any): Promise<Permission> {
      try {
        this.loading = true;
        this.error = null;
        const permission = await aclService.createPermission(data);
        this.permissions.push(permission);
        return permission;
      } catch (err: any) {
        this.error = err.message || 'Failed to create permission';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Update permission
     */
    async updatePermission(id: number, data: any): Promise<Permission> {
      try {
        this.loading = true;
        this.error = null;
        const permission = await aclService.updatePermission(id, data);
        
        // Update in cache
        const index = this.permissions.findIndex((p) => p.id === id);
        if (index !== -1) {
          this.permissions[index] = permission;
        }
        
        return permission;
      } catch (err: any) {
        this.error = err.message || 'Failed to update permission';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Delete permission
     */
    async deletePermission(id: number): Promise<void> {
      try {
        this.loading = true;
        this.error = null;
        await aclService.deletePermission(id);
        
        // Remove from cache
        this.permissions = this.permissions.filter((p) => p.id !== id);
      } catch (err: any) {
        this.error = err.message || 'Failed to delete permission';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Load user's permissions
     */
    async loadUserPermissions(userId: string): Promise<void> {
      try {
        this.loading = true;
        this.error = null;
        const data = await aclService.getUserPermissions(userId);
        this.userPermissions = data.effectivePermissions;
        
        // Cache in localStorage
        localStorage.setItem('userPermissions', JSON.stringify(this.userPermissions));
      } catch (err: any) {
        this.error = err.message || 'Failed to load user permissions';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Load cached permissions from localStorage
     */
    loadCachedPermissions(): void {
      const cached = localStorage.getItem('userPermissions');
      if (cached) {
        this.userPermissions = JSON.parse(cached);
      }
    },

    /**
     * Clear permissions cache
     */
    clearPermissionsCache(): void {
      this.userPermissions = [];
      localStorage.removeItem('userPermissions');
    },

    /**
     * Check if user can perform action on subject
     */
    can(action: string, subject: string): boolean {
      // Check for super admin (manage all)
      if (
        this.userPermissions.some(
          (p) => p.action === 'manage' && p.subject === 'all'
        )
      ) {
        return true;
      }

      // Check specific permission
      return this.userPermissions.some(
        (p) => p.action === action && p.subject === subject
      );
    },

    /**
     * Check if user can perform any of the actions
     */
    canAny(actions: string[], subject: string): boolean {
      return actions.some((action) => this.can(action, subject));
    },

    /**
     * Check if user can perform all actions
     */
    canAll(actions: string[], subject: string): boolean {
      return actions.every((action) => this.can(action, subject));
    },

    /**
     * Assign role to user
     */
    async assignRole(userId: string, roleId: number): Promise<void> {
      try {
        this.loading = true;
        this.error = null;
        await aclService.assignRoleToUser(userId, { roleId });
      } catch (err: any) {
        this.error = err.message || 'Failed to assign role';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Remove role from user
     */
    async removeRole(userId: string, roleId: number): Promise<void> {
      try {
        this.loading = true;
        this.error = null;
        await aclService.removeRoleFromUser(userId, roleId);
      } catch (err: any) {
        this.error = err.message || 'Failed to remove role';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Update user's primary role
     */
    async updateUserPrimaryRole(userId: string, roleId: number): Promise<void> {
      try {
        this.loading = true;
        this.error = null;
        await aclService.updateUserPrimaryRole(userId, roleId);
      } catch (err: any) {
        this.error = err.message || 'Failed to update user role';
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
