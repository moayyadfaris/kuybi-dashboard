<template>
  <DashboardLayout>
    <div class="p-6 max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Roles Management</h1>
          <p class="text-gray-600 mt-1">Manage user roles and permissions</p>
        </div>
        <button
          v-if="can('create', 'Role')"
          @click="showCreateDialog = true"
          class="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition shadow-md hover:shadow-lg"
        >
          + Create Role
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="text-red-600 mb-4">{{ error }}</div>
        <button
          @click="fetchRoles"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Retry
        </button>
      </div>

      <!-- Roles Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="role in sortedRoles"
          :key="role.id"
          class="bg-white rounded-lg border-2 border-gray-200 p-6 hover:border-orange-300 transition"
        >
          <!-- Role Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="text-xl font-bold text-gray-900">{{ role.displayName }}</h3>
                <span
                  v-if="role.isSystem"
                  class="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded"
                >
                  System
                </span>
              </div>
              <p class="text-sm text-gray-600 font-mono">{{ role.name }}</p>
            </div>
            <div class="flex items-center gap-1 ml-2">
              <span
                :class="getLevelColor(role.priority ?? 0)"
                class="px-2 py-1 text-xs font-bold rounded"
              >
                Level {{ role.priority ?? 0 }}
              </span>
            </div>
          </div>

          <!-- Description -->
          <p v-if="role.description" class="text-sm text-gray-700 mb-4">
            {{ role.description }}
          </p>

          <!-- Permissions Count -->
          <div class="flex items-center gap-2 mb-4 text-sm text-gray-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>{{ role.permissions?.length || 0 }} permissions</span>
          </div>

          <!-- Actions -->
          <div class="flex gap-2 pt-4 border-t">
            <button
              @click="viewPermissions(role)"
              class="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              View Permissions
            </button>
            <button
              v-if="can('update', 'Role') && !role.isSystem"
              @click="editRole(role)"
              class="px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
            >
              Edit
            </button>
            <button
              v-if="can('delete', 'Role') && !role.isSystem"
              @click="handleDeleteRole(role)"
              class="px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Create/Edit Role Dialog -->
      <CreateRoleDialog
        v-if="showCreateDialog"
        :role="editingRole"
        @close="closeDialog"
        @saved="handleRoleSaved"
      />

      <!-- Permissions View Dialog -->
      <PermissionsViewDialog
        v-if="showPermissionsDialog && selectedRole"
        :role="selectedRole"
        @close="showPermissionsDialog = false"
      />

      <!-- Delete Confirmation -->
      <ConfirmDialog
        v-if="showDeleteConfirm"
        title="Delete Role"
        :message="`Are you sure you want to delete the role '${roleToDelete?.displayName}'? This action cannot be undone.`"
        confirmText="Delete"
        cancelText="Cancel"
        confirmClass="bg-red-600 hover:bg-red-700"
        @confirm="confirmDelete"
        @cancel="showDeleteConfirm = false"
      />
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAclStore } from '../stores/aclStore';
import { usePermissions } from '../composables/usePermissions';
import DashboardLayout from '../components/DashboardLayout.vue';
import CreateRoleDialog from '../components/acl/CreateRoleDialog.vue';
import PermissionsViewDialog from '../components/acl/PermissionsViewDialog.vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import type { Role } from '../types/acl';

const aclStore = useAclStore();
const { can } = usePermissions();

const loading = ref(false);
const error = ref<string | null>(null);
const showCreateDialog = ref(false);
const showPermissionsDialog = ref(false);
const showDeleteConfirm = ref(false);
const editingRole = ref<Role | null>(null);
const selectedRole = ref<Role | null>(null);
const roleToDelete = ref<Role | null>(null);

const sortedRoles = computed(() => aclStore.sortedRoles);

onMounted(() => {
  fetchRoles();
});

const fetchRoles = async () => {
  try {
    loading.value = true;
    error.value = null;
    await aclStore.fetchRoles(true);
  } catch (err: any) {
    error.value = err.message || 'Failed to load roles';
  } finally {
    loading.value = false;
  }
};

const getLevelColor = (level: number) => {
  if (level >= 5) return 'bg-purple-100 text-purple-700';
  if (level >= 4) return 'bg-orange-100 text-orange-700';
  if (level >= 3) return 'bg-blue-100 text-blue-700';
  if (level >= 2) return 'bg-green-100 text-green-700';
  return 'bg-gray-100 text-gray-700';
};

const editRole = (role: Role) => {
  editingRole.value = role;
  showCreateDialog.value = true;
};

const viewPermissions = (role: Role) => {
  selectedRole.value = role;
  showPermissionsDialog.value = true;
};

const handleDeleteRole = (role: Role) => {
  roleToDelete.value = role;
  showDeleteConfirm.value = true;
};

const confirmDelete = async () => {
  if (!roleToDelete.value) return;

  try {
    await aclStore.deleteRole(roleToDelete.value.id);
    showDeleteConfirm.value = false;
    roleToDelete.value = null;
  } catch (err: any) {
    error.value = err.message || 'Failed to delete role';
  }
};

const closeDialog = () => {
  showCreateDialog.value = false;
  editingRole.value = null;
};

const handleRoleSaved = () => {
  closeDialog();
  fetchRoles();
};
</script>
