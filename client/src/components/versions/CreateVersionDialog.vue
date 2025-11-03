<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
      <!-- Header -->
      <div class="border-b border-gray-200 px-6 py-4">
        <h3 class="text-lg font-semibold text-gray-900">Create Version Snapshot</h3>
      </div>

      <!-- Body -->
      <div class="px-6 py-4 space-y-4">
        <!-- Version Label -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Version Label <span class="text-gray-400">(optional)</span>
          </label>
          <input
            v-model="formData.versionLabel"
            type="text"
            placeholder="e.g., v1.0, beta-1"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <!-- Commit Message -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Commit Message <span class="text-gray-400">(optional)</span>
          </label>
          <textarea
            v-model="formData.commitMessage"
            rows="3"
            placeholder="Describe what changed in this version..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          ></textarea>
        </div>

        <!-- Tag -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Tag <span class="text-gray-400">(optional)</span>
          </label>
          <input
            v-model="formData.tag"
            type="text"
            placeholder="e.g., release-2024-11"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <!-- Pin Version -->
        <div class="flex items-center">
          <input
            v-model="formData.isPinned"
            type="checkbox"
            id="isPinned"
            class="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
          />
          <label for="isPinned" class="ml-2 text-sm text-gray-700">
            Pin this version (prevent auto-cleanup)
          </label>
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
          @click="handleCreate"
          :disabled="loading"
          class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg disabled:opacity-50 transition flex items-center gap-2"
        >
          <span v-if="loading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
          {{ loading ? 'Creating...' : 'Create Version' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useVersionStore } from '../../stores/versionStore'
import { VersionType } from '../../types/version'

interface Props {
  storyId: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  created: []
}>()

const versionStore = useVersionStore()
const loading = ref(false)
const error = ref('')

const formData = reactive({
  versionLabel: '',
  commitMessage: '',
  tag: '',
  isPinned: false,
})

const handleCreate = async () => {
  loading.value = true
  error.value = ''

  try {
    const result = await versionStore.createVersion(props.storyId, {
      versionLabel: formData.versionLabel || undefined,
      versionType: VersionType.MANUAL,
      commitMessage: formData.commitMessage || undefined,
      tag: formData.tag || undefined,
      isPinned: formData.isPinned,
    })

    if (result) {
      emit('created')
    } else {
      error.value = versionStore.error || 'Failed to create version'
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to create version'
  } finally {
    loading.value = false
  }
}
</script>
