<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-900">Permission Details</h2>
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
        <!-- Permission ID -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-500 mb-1">ID</label>
          <p class="text-lg font-semibold text-gray-900">#{{ permission.id }}</p>
        </div>

        <!-- Action & Subject -->
        <div class="mb-4 flex gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-500 mb-1">Action</label>
            <span
              :class="getActionColor(permission.action)"
              class="inline-block px-3 py-1 text-sm font-medium rounded"
            >
              {{ permission.action }}
            </span>
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-500 mb-1">Subject</label>
            <span class="inline-block px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded">
              {{ permission.subject }}
            </span>
          </div>
        </div>

        <!-- Reason -->
        <div v-if="permission.reason" class="mb-4">
          <label class="block text-sm font-medium text-gray-500 mb-1">Reason</label>
          <p class="text-gray-900">{{ permission.reason }}</p>
        </div>

        <!-- Conditions -->
        <div v-if="permission.conditions" class="mb-4">
          <label class="block text-sm font-medium text-gray-500 mb-1">Conditions</label>
          <pre class="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">{{ JSON.stringify(permission.conditions, null, 2) }}</pre>
        </div>

        <!-- Fields -->
        <div v-if="permission.fields && permission.fields.length > 0" class="mb-4">
          <label class="block text-sm font-medium text-gray-500 mb-1">Accessible Fields</label>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="field in permission.fields"
              :key="field"
              class="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-lg"
            >
              {{ field }}
            </span>
          </div>
        </div>

        <!-- Timestamps -->
        <div class="grid grid-cols-2 gap-4 pt-4 border-t">
          <div v-if="permission.createdAt">
            <label class="block text-xs text-gray-500 mb-1">Created</label>
            <p class="text-sm text-gray-700">{{ formatDate(permission.createdAt) }}</p>
          </div>
          <div v-if="permission.updatedAt">
            <label class="block text-xs text-gray-500 mb-1">Updated</label>
            <p class="text-sm text-gray-700">{{ formatDate(permission.updatedAt) }}</p>
          </div>
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
import type { Permission } from '../../types/acl';

defineProps<{
  permission: Permission;
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

const formatDate = (date: string) => {
  return new Date(date).toLocaleString();
};
</script>
