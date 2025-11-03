<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
      <!-- Header -->
      <div class="border-b border-gray-200 px-6 py-4">
        <h3 class="text-lg font-semibold text-gray-900">Tag Version {{ version?.versionNumber }}</h3>
      </div>

      <!-- Body -->
      <div class="px-6 py-4 space-y-4">
        <!-- Version Info -->
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="font-medium text-gray-900">{{ version?.commitMessage || 'Version ' + version?.versionNumber }}</p>
          <p class="text-sm text-gray-500 mt-1">
            {{ formatDate(version?.createdAt || '') }}
          </p>
        </div>

        <!-- Tag Input -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Tag Name <span class="text-red-500">*</span>
          </label>
          <input
            v-model="tag"
            type="text"
            placeholder="e.g., production-ready, release-2024-11"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            :class="{ 'border-red-500': !tag && attempted }"
          />
          <p v-if="!tag && attempted" class="mt-1 text-sm text-red-600">
            Tag name is required
          </p>
          <p class="mt-1 text-sm text-gray-500">
            Tags help you identify important versions quickly
          </p>
        </div>

        <!-- Current Tag -->
        <div v-if="version?.tag" class="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <p class="text-sm text-orange-700">
            Current tag: <span class="font-medium">{{ version.tag }}</span>
          </p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
        <button
          @click="$emit('close')"
          :disabled="loading"
          class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
        >
          Cancel
        </button>
        <button
          @click="handleTag"
          :disabled="loading"
          class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 transition flex items-center gap-2"
        >
          <span v-if="loading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
          {{ loading ? 'Tagging...' : 'Tag Version' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useVersionStore } from '../../stores/versionStore'
import type { Version } from '../../types/version'

interface Props {
  storyId: number
  version: Version | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  tagged: []
}>()

const versionStore = useVersionStore()
const loading = ref(false)
const error = ref('')
const attempted = ref(false)
const tag = ref(props.version?.tag || '')

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const handleTag = async () => {
  attempted.value = true

  if (!tag.value) {
    error.value = 'Please provide a tag name'
    return
  }

  if (!props.version) {
    error.value = 'No version selected'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const result = await versionStore.tagVersion(
      props.storyId,
      props.version.versionNumber,
      { tag: tag.value }
    )

    if (result) {
      emit('tagged')
    } else {
      error.value = versionStore.error || 'Failed to tag version'
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to tag version'
  } finally {
    loading.value = false
  }
}
</script>
