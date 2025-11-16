<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <h3 class="text-lg font-semibold text-gray-900">Rollback to Version {{ version?.versionNumber }}</h3>
      </div>

      <!-- Body -->
      <div class="px-6 py-4 space-y-4 overflow-y-auto flex-1">
        <!-- Warning -->
        <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <div>
              <p class="text-sm font-medium text-orange-800">⚠️ Rollback Warning</p>
              <p class="text-sm text-orange-700 mt-1">
                This will revert the story to its state at version {{ version?.versionNumber }}. A new ROLLBACK version will be created to preserve history.
              </p>
            </div>
          </div>
        </div>

        <!-- Version Info -->
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-sm text-gray-600 mb-2">Rolling back to:</p>
          <div class="flex items-center gap-2 mb-2">
            <span class="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-bold rounded">
              Version {{ version?.versionNumber }}
            </span>
            <span v-if="version?.versionLabel" class="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
              {{ version?.versionLabel }}
            </span>
          </div>
          <p class="font-medium text-gray-900">{{ version?.commitMessage || 'Version ' + version?.versionNumber }}</p>
          <p class="text-sm text-gray-500 mt-1">
            Created {{ formatDate(version?.createdAt || '') }} by {{ version?.createdBy.firstName }} {{ version?.createdBy.lastName }}
          </p>
        </div>

        <!-- Change Preview -->
        <div v-if="loadingComparison" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-center gap-3">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <p class="text-sm text-blue-700">Loading change preview...</p>
          </div>
        </div>

        <div v-else-if="comparison && comparison.changesCount > 0" class="border border-gray-200 rounded-lg overflow-hidden">
          <div class="bg-gray-100 px-4 py-2 border-b border-gray-200">
            <p class="text-sm font-semibold text-gray-900">Changes that will be reverted:</p>
            <p class="text-xs text-gray-600 mt-1">{{ comparison.changesCount }} field{{ comparison.changesCount !== 1 ? 's' : '' }} will be changed</p>
          </div>
          <div class="p-4 max-h-64 overflow-y-auto bg-white">
            <ul class="space-y-2 text-sm">
              <li v-for="field in comparison.changedFields" :key="field" class="flex items-start gap-2">
                <svg class="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
                <span class="text-gray-700">
                  <span class="font-medium capitalize">{{ field }}</span> will change
                </span>
              </li>
            </ul>
          </div>
          <button
            @click="showFullComparison = !showFullComparison"
            class="w-full px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 transition border-t border-gray-200"
          >
            {{ showFullComparison ? 'Hide' : 'Show' }} detailed changes
          </button>
          
          <!-- Detailed Comparison -->
          <div v-if="showFullComparison" class="border-t border-gray-200 p-4 bg-gray-50 space-y-3 max-h-80 overflow-y-auto">
            <div v-if="comparison.diff.modified" v-for="(fieldDiff, field) in comparison.diff.modified" :key="field" class="bg-white border border-gray-200 rounded p-3">
              <p class="font-semibold text-gray-900 capitalize text-sm mb-2">{{ field }}</p>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="bg-red-50 p-2 rounded border border-red-200">
                  <p class="text-red-700 font-medium mb-1">Current (will be removed):</p>
                  <pre class="text-gray-800 whitespace-pre-wrap">{{ formatValue(fieldDiff.new) }}</pre>
                </div>
                <div class="bg-green-50 p-2 rounded border border-green-200">
                  <p class="text-green-700 font-medium mb-1">After rollback:</p>
                  <pre class="text-gray-800 whitespace-pre-wrap">{{ formatValue(fieldDiff.old) }}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="comparison && comparison.changesCount === 0" class="bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <p class="text-sm text-green-700">This version is identical to the current version.</p>
          </div>
        </div>

        <!-- Commit Message -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Rollback Reason <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="commitMessage"
            rows="3"
            placeholder="Explain why you're rolling back... (e.g., 'Emergency rollback - production issue')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            :class="{ 'border-red-500': !commitMessage && attempted }"
          ></textarea>
          <p v-if="!commitMessage && attempted" class="mt-1 text-sm text-red-600">
            Commit message is required
          </p>
        </div>

        <!-- Create Branch Option -->
        <div class="border border-gray-200 rounded-lg p-4 space-y-3">
          <div class="flex items-start">
            <input
              v-model="createBranch"
              type="checkbox"
              id="createBranch"
              class="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-2 focus:ring-orange-500 mt-0.5"
            />
            <label for="createBranch" class="ml-2 text-sm text-gray-700">
              <span class="font-medium">Create new branch (recommended)</span>
              <p class="text-xs text-gray-500 mt-1">Preserve current work by creating a branch instead of affecting main branch</p>
            </label>
          </div>

          <div v-if="createBranch">
            <input
              v-model="branchName"
              type="text"
              placeholder="Branch name (e.g., rollback-emergency-fix)"
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
      <div class="border-t border-gray-200 px-6 py-4 flex justify-end gap-3 flex-shrink-0">
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
          {{ loading ? 'Rolling back...' : 'Confirm Rollback' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useVersionStore } from '../../stores/versionStore'
import type { Version, VersionComparison } from '../../types/version'

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
const loadingComparison = ref(false)
const comparison = ref<VersionComparison | null>(null)
const showFullComparison = ref(false)

// Load comparison when dialog opens
onMounted(async () => {
  if (props.version) {
    await loadComparison()
  }
})

// Watch for version changes
watch(() => props.version, async (newVersion) => {
  if (newVersion) {
    await loadComparison()
  }
})

const loadComparison = async () => {
  if (!props.version) return
  
  loadingComparison.value = true
  
  try {
    // Get the current (latest) version number
    await versionStore.fetchVersionHistory(props.storyId, { limit: 1 })
    const latestVersion = versionStore.versions[0]
    
    if (latestVersion && latestVersion.versionNumber !== props.version.versionNumber) {
      const result = await versionStore.compareVersions(props.storyId, {
        versionA: props.version.versionNumber,
        versionB: latestVersion.versionNumber
      })
      
      comparison.value = result
    }
  } catch (err) {
    console.error('Failed to load comparison:', err)
  } finally {
    loadingComparison.value = false
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatValue = (value: any): string => {
  if (value === null || value === undefined) {
    return '(empty)'
  }
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2)
  }
  return String(value)
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
