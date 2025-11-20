<template>
  <div class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden">
    <!-- Header -->
    <div class="p-6">
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center gap-3">
          <!-- Icon -->
          <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white text-2xl flex-shrink-0">
            {{ postType.icon || '📦' }}
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ postType.name }}</h3>
            <p class="text-sm text-gray-500">{{ postType.slug }}</p>
          </div>
        </div>

        <!-- System Badge -->
        <span
          v-if="postType.isSystem"
          class="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded"
        >
          System
        </span>
      </div>

      <!-- Description -->
      <p class="text-sm text-gray-600 mb-4 line-clamp-2">
        {{ postType.description || 'No description provided' }}
      </p>

      <!-- Stats -->
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="bg-gray-50 rounded-lg p-3">
          <div class="text-xs text-gray-500 mb-1">Type</div>
          <div class="text-sm font-semibold text-gray-900">
            {{ postType.isSystem ? 'System' : 'Custom' }}
          </div>
        </div>
        <div class="bg-gray-50 rounded-lg p-3">
          <div class="text-xs text-gray-500 mb-1">Status</div>
          <div class="text-sm font-semibold" :class="postType.isActive ? 'text-green-600' : 'text-gray-400'">
            {{ postType.isActive ? 'Active' : 'Inactive' }}
          </div>
        </div>
      </div>

      <!-- Features -->
      <div class="flex flex-wrap gap-2 mb-4">
        <span
          v-if="postType.supportsComments"
          class="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded"
        >
          💬 Comments
        </span>
        <span
          v-if="postType.supportsRevisions"
          class="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
        >
          📝 Revisions
        </span>
        <span
          v-if="postType.isHierarchical"
          class="px-2 py-1 bg-green-50 text-green-700 text-xs rounded"
        >
          🌳 Hierarchical
        </span>
        <span
          v-if="postType.showInRest"
          class="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded"
        >
          🔌 REST API
        </span>
      </div>

      <!-- Meta Info -->
      <div class="text-xs text-gray-500">
        Created {{ formatRelativeTime(postType.createdAt) }}
      </div>
    </div>

    <!-- Actions -->
    <div class="border-t border-gray-200 px-6 py-3 bg-gray-50 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button
          @click="$emit('view-content', postType)"
          class="text-sm font-medium text-blue-600 hover:text-blue-700 transition"
        >
          View Content
        </button>
        <button
          @click="$emit('view-fields', postType)"
          class="text-sm font-medium text-orange-600 hover:text-orange-700 transition"
        >
          Manage Fields
        </button>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="$emit('edit', postType)"
          class="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded transition"
          title="Edit"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>

        <button
          v-if="!postType.isSystem"
          @click="$emit('delete', postType)"
          class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition"
          title="Delete"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PostType } from '../../types/postTypes'
import { formatRelativeTime } from '../../utils/postTypeUtils'

interface Props {
  postType: PostType
}

defineProps<Props>()

defineEmits<{
  edit: [postType: PostType]
  'view-content': [postType: PostType]
  'view-fields': [postType: PostType]
  delete: [postType: PostType]
}>()
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
