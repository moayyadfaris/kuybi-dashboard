<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-900">
          {{ isEditing ? 'Edit Role' : 'Create New Role' }}
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="px-6 py-4 overflow-y-auto max-h-[calc(90vh-140px)]">
        <!-- Role Name -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Role Name *
          </label>
          <input
            v-model="formData.name"
            type="text"
            placeholder="e.g., content_manager"
            :disabled="isEditing"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <p class="text-xs text-gray-500 mt-1">Lowercase, snake_case format</p>
        </div>

        <!-- Display Name -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Display Name *
          </label>
          <input
            v-model="formData.displayName"
            type="text"
            placeholder="e.g., Content Manager"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <!-- Description -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            v-model="formData.description"
            rows="3"
            placeholder="Describe this role's responsibilities..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          ></textarea>
        </div>

        <!-- Level -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Level * (1-5)
          </label>
          <input
            v-model.number="formData.level"
            type="number"
            min="1"
            max="5"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <p class="text-xs text-gray-500 mt-1">
            Higher level = more authority (1=User, 2=Moderator, 3=Editor, 4=Admin, 5=Super Admin)
          </p>
        </div>

        <!-- Permissions Selection -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Permissions
          </label>
          <div v-if="permissionsLoading" class="text-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
          </div>
          <div v-else-if="availablePermissions.length > 0" class="border border-gray-300 rounded-lg max-h-64 overflow-y-auto">
            <div
              v-for="permission in availablePermissions"
              :key="permission.id"
              class="flex items-center px-4 py-2 hover:bg-gray-50 border-b last:border-b-0"
            >
              <input
                type="checkbox"
                :id="`perm-${permission.id}`"
                :value="permission.id"
                v-model="formData.permissionIds"
                class="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
              />
              <label :for="`perm-${permission.id}`" class="ml-3 flex-1 cursor-pointer">
                <div class="flex items-center gap-2">
                  <span
                    :class="getActionColor(permission.action)"
                    class="px-2 py-0.5 text-xs font-medium rounded"
                  >
                    {{ permission.action }}
                  </span>
                  <span class="text-sm font-medium text-gray-700">
                    {{ permission.subject }}
                  </span>
                </div>
                <p v-if="permission.reason" class="text-xs text-gray-500 mt-0.5">
                  {{ permission.reason }}
                </p>
              </label>
            </div>
          </div>
          <p class="text-sm text-gray-600 mt-2">
            Selected: {{ formData.permissionIds.length }} permissions
          </p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {{ error }}
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t flex items-center justify-end gap-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          @click="handleSave"
          :disabled="!isValid || saving"
          class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ saving ? 'Saving...' : isEditing ? 'Update Role' : 'Create Role' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAclStore } from '../../stores/aclStore';
import type { Role, Permission } from '../../types/acl';

const props = defineProps<{
  role?: Role | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'saved'): void;
}>();

const aclStore = useAclStore();

const formData = ref({
  name: '',
  displayName: '',
  description: '',
  level: 1,
  permissionIds: [] as number[],
});

const availablePermissions = ref<Permission[]>([]);
const permissionsLoading = ref(false);
const saving = ref(false);
const error = ref<string | null>(null);

const isEditing = computed(() => !!props.role);

const isValid = computed(() => {
  return formData.value.name.trim() !== '' &&
    formData.value.displayName.trim() !== '' &&
    formData.value.level >= 1 &&
    formData.value.level <= 5;
});

onMounted(async () => {
  // Load available permissions
  try {
    permissionsLoading.value = true;
    await aclStore.fetchPermissions();
    availablePermissions.value = aclStore.permissions;
  } catch (err: any) {
    error.value = 'Failed to load permissions';
  } finally {
    permissionsLoading.value = false;
  }

  // Pre-fill form if editing
  if (props.role) {
    formData.value = {
      name: props.role.name,
      displayName: props.role.displayName || props.role.name,
      description: props.role.description || '',
      level: props.role.level ?? 1,
      permissionIds: props.role.permissions?.map((p) => p.id) || [],
    };
  }
});

const getActionColor = (action: string) => {
  const colors: Record<string, string> = {
    manage: 'bg-purple-100 text-purple-700',
    create: 'bg-green-100 text-green-700',
    read: 'bg-blue-100 text-blue-700',
    update: 'bg-orange-100 text-orange-700',
    delete: 'bg-red-100 text-red-700',
  };
  return colors[action] || 'bg-gray-100 text-gray-700';
};

const handleSave = async () => {
  if (!isValid.value) return;

  try {
    saving.value = true;
    error.value = null;

    if (isEditing.value && props.role) {
      await aclStore.updateRole(props.role.id, {
        displayName: formData.value.displayName,
        description: formData.value.description || undefined,
        level: formData.value.level,
        permissionIds: formData.value.permissionIds,
      });
    } else {
      await aclStore.createRole(formData.value);
    }

    emit('saved');
  } catch (err: any) {
    error.value = err.message || 'Failed to save role';
  } finally {
    saving.value = false;
  }
};
</script>
