<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
      <!-- Header -->
      <div class="border-b border-gray-200 px-6 py-4">
        <h3 class="text-lg font-semibold text-gray-900">Rollback to Version {{ version?.versionNumber }}</h3>
      </div>

      <!-- Body -->
      <div class="px-6 py-4 space-y-4">
        <!-- Warning -->
        <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-orange-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <div>
              <p class="text-sm font-medium text-orange-800">Rollback Warning</p>
              <p class="text-sm text-orange-700 mt-1">
                This will restore your story to version {{ version?.versionNumber }}. Current changes will be preserved in the version history.
              </p>
            </div>
          </div>
        </div>

        <!-- Version Info -->
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-sm text-gray-600 mb-2">Rolling back to:</p>
          <p class="font-medium text-gray-900">{{ version?.commitMessage || 'Version ' + version?.versionNumber }}</p>
          <p class="text-sm text-gray-500 mt-1">
            Created {{ formatDate(version?.createdAt || '') }} by {{ version?.createdBy.firstName }} {{ version?.createdBy.lastName }}
          </p>
        </div>

        <!-- Commit Message -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Rollback Reason <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="commitMessage"
            rows="3"
            placeholder="Explain why you're rolling back..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            :class="{ 'border-red-500': !commitMessage && attempted }"
          ></textarea>
          <p v-if="!commitMessage && attempted" class="mt-1 text-sm text-red-600">
            Commit message is required
          </p>
        </div>

        <!-- Create Branch Option -->
        <div class="border border-gray-200 rounded-lg p-4 space-y-3">
          <div class="flex items-center">
            <input
              v-model="createBranch"
              type="checkbox"
              id="createBranch"
              class="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
            />
            <label for="createBranch" class="ml-2 text-sm text-gray-700">
              Create new branch instead of affecting main branch
            </label>
          </div>

          <div v-if="createBranch">
            <input
              v-model="branchName"
              type="text"
              placeholder="Branch name (e.g., rollback-emergency)"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            />
          </div>
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
          @click="handleRollback"
          :disabled="loading"
          class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg disabled:opacity-50 transition flex items-center gap-2"
        >
          <span v-if="loading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
          {{ loading ? 'Rolling back...' : 'Rollback' }}
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
  rollback: []
}>()

const versionStore = useVersionStore()
const loading = ref(false)
const error = ref('')
const attempted = ref(false)
const commitMessage = ref('')
const createBranch = ref(false)
const branchName = ref('')

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const handleRollback = async () => {
  attempted.value = true

  if (!commitMessage.value) {
    error.value = 'Please provide a reason for rolling back'
    return
  }

  if (!props.version) {
    error.value = 'No version selected'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const result = await versionStore.rollbackVersion(props.storyId, {
      versionNumber: props.version.versionNumber,
      commitMessage: commitMessage.value,
      createBranch: createBranch.value,
      branchName: branchName.value || undefined,
    })

    if (result) {
      emit('rollback')
    } else {
      error.value = versionStore.error || 'Failed to rollback'
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to rollback'
  } finally {
    loading.value = false
  }
}
</script>
