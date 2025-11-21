<template>
  <DashboardLayout>
    <div class="p-6 max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Permissions Management</h1>
          <p class="text-gray-600 mt-1">View and manage system permissions</p>
        </div>
        <button
          v-if="can('create', 'Permission')"
          @click="showCreateDialog = true"
          class="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition shadow-md hover:shadow-lg"
        >
          + Create Permission
        </button>
      </div>

      <!-- Filters -->
      <div class="mb-6 flex gap-4">
        <select
          v-model="filterSubject"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">All Subjects</option>
          <option v-for="subject in uniqueSubjects" :key="subject" :value="subject">
            {{ subject }}
          </option>
        </select>

        <select
          v-model="filterAction"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">All Actions</option>
          <option v-for="action in uniqueActions" :key="action" :value="action">
            {{ action }}
          </option>
        </select>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="text-red-600 mb-4">{{ error }}</div>
        <button
          @click="fetchPermissions"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Retry
        </button>
      </div>

      <!-- Permissions Table -->
      <div v-else class="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reason
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Conditions
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="permission in filteredPermissions" :key="permission.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                #{{ permission.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="getActionColor(permission.action)"
                  class="px-2 py-1 text-xs font-medium rounded"
                >
                  {{ permission.action }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                  {{ permission.subject }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-700">
                {{ permission.reason || '-' }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                <span v-if="permission.conditions">
                  {{ Object.keys(permission.conditions).length }} condition(s)
                </span>
                <span v-else>-</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="viewPermission(permission)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  View
                </button>
                <button
                  v-if="can('update', 'Permission')"
                  @click="editPermission(permission)"
                  class="text-orange-600 hover:text-orange-900 mr-3"
                >
                  Edit
                </button>
                <button
                  v-if="can('delete', 'Permission')"
                  @click="handleDeletePermission(permission)"
                  class="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div
          v-if="filteredPermissions.length === 0"
          class="text-center py-12 text-gray-500"
        >
          No permissions found
        </div>
      </div>

      <!-- Create/Edit Permission Dialog -->
      <CreatePermissionDialog
        v-if="showCreateDialog"
        :permission="editingPermission"
        @close="closeDialog"
        @saved="handlePermissionSaved"
      />

      <!-- View Permission Dialog -->
      <PermissionDetailDialog
        v-if="showDetailDialog && selectedPermission"
        :permission="selectedPermission"
        @close="showDetailDialog = false"
      />

      <!-- Delete Confirmation -->
      <ConfirmDialog
        v-if="showDeleteConfirm"
        title="Delete Permission"
        :message="`Are you sure you want to delete the permission '${permissionToDelete?.action} ${permissionToDelete?.subject}'?`"
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
import CreatePermissionDialog from '../components/acl/CreatePermissionDialog.vue';
import PermissionDetailDialog from '../components/acl/PermissionDetailDialog.vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import type { Permission } from '../types/acl';

const aclStore = useAclStore();
const { can } = usePermissions();

const loading = ref(false);
const error = ref<string | null>(null);
const showCreateDialog = ref(false);
const showDetailDialog = ref(false);
const showDeleteConfirm = ref(false);
const editingPermission = ref<Permission | null>(null);
const selectedPermission = ref<Permission | null>(null);
const permissionToDelete = ref<Permission | null>(null);
const filterSubject = ref('');
const filterAction = ref('');

const permissions = computed(() => aclStore.permissions);

const uniqueSubjects = computed(() => {
  return Array.from(new Set(permissions.value.map((p) => p.subject))).sort();
});

const uniqueActions = computed(() => {
  return Array.from(new Set(permissions.value.map((p) => p.action))).sort();
});

const filteredPermissions = computed(() => {
  return permissions.value.filter((p) => {
    const matchesSubject = !filterSubject.value || p.subject === filterSubject.value;
    const matchesAction = !filterAction.value || p.action === filterAction.value;
    return matchesSubject && matchesAction;
  });
});

onMounted(() => {
  fetchPermissions();
});

const fetchPermissions = async () => {
  try {
    loading.value = true;
    error.value = null;
    await aclStore.fetchPermissions();
  } catch (err: any) {
    error.value = err.message || 'Failed to load permissions';
  } finally {
    loading.value = false;
  }
};

const getActionColor = (action: string) => {
  const colors: Record<string, string> = {
    manage: 'bg-purple-100 text-purple-700',
    create: 'bg-green-100 text-green-700',
    read: 'bg-blue-100 text-blue-700',
    update: 'bg-orange-100 text-orange-700',
    delete: 'bg-red-100 text-red-700',
    publish: 'bg-indigo-100 text-indigo-700',
    archive: 'bg-gray-100 text-gray-700',
  };
  return colors[action] || 'bg-gray-100 text-gray-700';
};

const editPermission = (permission: Permission) => {
  editingPermission.value = permission;
  showCreateDialog.value = true;
};

const viewPermission = (permission: Permission) => {
  selectedPermission.value = permission;
  showDetailDialog.value = true;
};

const handleDeletePermission = (permission: Permission) => {
  permissionToDelete.value = permission;
  showDeleteConfirm.value = true;
};

const confirmDelete = async () => {
  if (!permissionToDelete.value) return;

  try {
    await aclStore.deletePermission(permissionToDelete.value.id);
    showDeleteConfirm.value = false;
    permissionToDelete.value = null;
  } catch (err: any) {
    error.value = err.message || 'Failed to delete permission';
  }
};

const closeDialog = () => {
  showCreateDialog.value = false;
  editingPermission.value = null;
};

const handlePermissionSaved = () => {
  closeDialog();
  fetchPermissions();
};
</script>
