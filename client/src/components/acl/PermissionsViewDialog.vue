<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-gray-900">{{ role.displayName }} Permissions</h2>
          <p class="text-sm text-gray-600 mt-0.5">{{ role.permissions?.length || 0 }} permissions assigned</p>
        </div>
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
        <div v-if="role.permissions && role.permissions.length > 0" class="space-y-2">
          <div
            v-for="permission in role.permissions"
            :key="permission.id"
            class="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span
                  :class="getActionColor(permission.action)"
                  class="px-2 py-1 text-xs font-medium rounded"
                >
                  {{ permission.action }}
                </span>
                <span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                  {{ permission.subject }}
                </span>
              </div>
              <p v-if="permission.reason" class="text-sm text-gray-700">
                {{ permission.reason }}
              </p>
              <div v-if="permission.conditions" class="mt-2">
                <span class="text-xs text-gray-500">Conditions:</span>
                <pre class="text-xs bg-gray-50 p-2 rounded mt-1">{{ JSON.stringify(permission.conditions, null, 2) }}</pre>
              </div>
              <div v-if="permission.fields && permission.fields.length > 0" class="mt-2">
                <span class="text-xs text-gray-500">Fields:</span>
                <div class="flex flex-wrap gap-1 mt-1">
                  <span
                    v-for="field in permission.fields"
                    :key="field"
                    class="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded"
                  >
                    {{ field }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12 text-gray-500">
          No permissions assigned to this role
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t flex justify-end">
        <button
          @click="$emit('close')"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Role } from '../../types/acl';

defineProps<{
  role: Role;
}>();

defineEmits<{
  (e: 'close'): void;
}>();

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
</script>
