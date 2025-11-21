/**
 * Permissions Composable
 * Provides permission checking utilities for components
 */

import { computed } from 'vue';
import { useAclStore } from '../stores/aclStore';
import { useAuthStore } from '../stores/authStore';

export function usePermissions() {
  const aclStore = useAclStore();
  const authStore = useAuthStore();

  /**
   * Check if user can perform action on subject
   */
  const can = (action: string, subject: string): boolean => {
    return aclStore.can(action, subject);
  };

  /**
   * Check if user can perform any of the actions on subject
   */
  const canAny = (actions: string[], subject: string): boolean => {
    return aclStore.canAny(actions, subject);
  };

  /**
   * Check if user can perform all actions on subject
   */
  const canAll = (actions: string[], subject: string): boolean => {
    return aclStore.canAll(actions, subject);
  };

  /**
   * Check if user has specific role
   */
  const hasRole = (roleName: string): boolean => {
    const user = authStore.user;
    if (!user) return false;

    return (
      user.roleInfo?.name === roleName ||
      user.additionalRoles?.some((r: any) => r.name === roleName) ||
      false
    );
  };

  /**
   * Check if user has minimum role level
   * Priority-based: 100=super-admin, 90=admin, 70=moderator, 50=user, 10=guest
   */
  const hasMinLevel = (priority: number): boolean => {
    const user = authStore.user;
    return (user?.roleInfo?.priority ?? 0) >= priority;
  };

  /**
   * Check if user is super admin
   */
  const isSuperAdmin = computed(() => {
    return aclStore.isSuperAdmin;
  });

  /**
   * Check if user is admin or above (priority >= 90)
   */
  const isAdmin = computed(() => {
    return hasMinLevel(90); // Admin priority is 90
  });

  /**
   * Check if user is editor or above (priority >= 70)
   */
  const isEditor = computed(() => {
    return hasMinLevel(70); // Moderator priority is 70
  });

  /**
   * Get current user's role priority
   */
  const userLevel = computed(() => {
    const user = authStore.user;
    return user?.roleInfo?.priority || 0;
  });

  /**
   * Get current user's role name
   */
  const userRole = computed(() => {
    const user = authStore.user;
    return user?.roleInfo?.name || '';
  });

  /**
   * Get current user's role display name
   */
  const userRoleDisplay = computed(() => {
    const user = authStore.user;
    return user?.roleInfo?.displayName || '';
  });

  return {
    can,
    canAny,
    canAll,
    hasRole,
    hasMinLevel,
    isSuperAdmin,
    isAdmin,
    isEditor,
    userLevel,
    userRole,
    userRoleDisplay,
  };
}
