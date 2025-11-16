<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
      <!-- Header -->
      <div class="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 class="text-2xl font-bold text-white flex items-center gap-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Version Comparison
          </h2>
          <p class="text-orange-100 text-sm mt-1">
            Comparing v{{ versionA }} with v{{ versionB }}
          </p>
        </div>
        <button
          @click="$emit('close')"
          class="text-white hover:bg-orange-700 p-2 rounded-lg transition"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- Loading State -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-16">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p class="mt-4 text-gray-600">Comparing versions...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-16">
          <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-red-600 font-medium">{{ error }}</p>
        </div>

        <!-- Comparison Results -->
        <div v-else-if="comparison">
          <!-- Summary -->
          <div class="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-semibold text-orange-900 text-lg">
                  {{ comparison.changesCount }} change{{ comparison.changesCount !== 1 ? 's' : '' }} detected
                </p>
                <p class="text-sm text-orange-700 mt-1">
                  Changed fields: {{ comparison.changedFields.join(', ') }}
                </p>
              </div>
              <button
                v-if="comparison.changesCount > 0"
                @click="showRollbackConfirmation"
                class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition"
              >
                Rollback to v{{ versionA }}
              </button>
            </div>
          </div>

          <!-- No Changes -->
          <div v-if="comparison.changesCount === 0" class="text-center py-16">
            <svg class="w-20 h-20 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">No Differences Found</h3>
            <p class="text-gray-600">These versions are identical.</p>
          </div>

          <!-- Side-by-Side Changes -->
          <div v-else class="space-y-4">
            <!-- Added Fields -->
            <div v-if="comparison.diff.added && Object.keys(comparison.diff.added).length > 0" class="border border-green-200 rounded-lg overflow-hidden">
              <div class="bg-green-100 px-4 py-2 border-b border-green-200">
                <h4 class="font-semibold text-green-900 flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Added Fields ({{ Object.keys(comparison.diff.added).length }})
                </h4>
              </div>
              <div class="divide-y divide-green-200">
                <div
                  v-for="(value, field) in comparison.diff.added"
                  :key="field"
                  class="p-4 bg-green-50"
                >
                  <p class="font-medium text-gray-900 mb-2 capitalize">{{ field }}</p>
                  <pre class="text-sm text-gray-700 whitespace-pre-wrap bg-white p-3 rounded border border-green-200">{{ formatValue(value) }}</pre>
                </div>
              </div>
            </div>

            <!-- Modified Fields -->
            <div v-if="comparison.diff.modified && Object.keys(comparison.diff.modified).length > 0">
              <div
                v-for="(fieldDiff, field) in comparison.diff.modified"
                :key="field"
                class="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div class="bg-gray-100 px-4 py-2 border-b border-gray-200">
                  <h4 class="font-semibold text-gray-900 capitalize flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {{ field }}
                  </h4>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                  <!-- Old Value (Version A) -->
                  <div class="p-4 bg-red-50">
                    <div class="flex items-center gap-2 mb-3">
                      <span class="px-3 py-1 bg-red-100 text-red-800 rounded text-xs font-bold">
                        v{{ versionA }}
                      </span>
                      <span class="text-xs text-red-700 font-medium uppercase">Previous</span>
                    </div>
                    <pre class="text-sm text-gray-900 whitespace-pre-wrap bg-white p-3 rounded border border-red-200 font-mono">{{ formatValue(fieldDiff.old) }}</pre>
                  </div>
                  <!-- New Value (Version B) -->
                  <div class="p-4 bg-green-50">
                    <div class="flex items-center gap-2 mb-3">
                      <span class="px-3 py-1 bg-green-100 text-green-800 rounded text-xs font-bold">
                        v{{ versionB }}
                      </span>
                      <span class="text-xs text-green-700 font-medium uppercase">Current</span>
                    </div>
                    <pre class="text-sm text-gray-900 whitespace-pre-wrap bg-white p-3 rounded border border-green-200 font-mono">{{ formatValue(fieldDiff.new) }}</pre>
                  </div>
                </div>
              </div>
            </div>

            <!-- Removed Fields -->
            <div v-if="comparison.diff.removed && Object.keys(comparison.diff.removed).length > 0" class="border border-red-200 rounded-lg overflow-hidden">
              <div class="bg-red-100 px-4 py-2 border-b border-red-200">
                <h4 class="font-semibold text-red-900 flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Removed Fields ({{ Object.keys(comparison.diff.removed).length }})
                </h4>
              </div>
              <div class="divide-y divide-red-200">
                <div
                  v-for="(value, field) in comparison.diff.removed"
                  :key="field"
                  class="p-4 bg-red-50"
                >
                  <p class="font-medium text-gray-900 mb-2 capitalize">{{ field }}</p>
                  <pre class="text-sm text-gray-700 whitespace-pre-wrap bg-white p-3 rounded border border-red-200">{{ formatValue(value) }}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="border-t border-gray-200 px-6 py-4 bg-gray-50 flex-shrink-0">
        <div class="flex items-center justify-end gap-3">
          <button
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useVersionStore } from '../../stores/versionStore'
import type { VersionComparison } from '../../types/version'

interface Props {
  storyId: number
  versionA: number
  versionB: number
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'rollback'])

const versionStore = useVersionStore()
const loading = ref(false)
const error = ref('')
const comparison = ref<VersionComparison | null>(null)

const loadComparison = async () => {
  loading.value = true
  error.value = ''

  try {
    const result = await versionStore.compareVersions(props.storyId, {
      versionA: props.versionA,
      versionB: props.versionB
    })

    if (result) {
      comparison.value = result
    } else {
      error.value = versionStore.error || 'Failed to compare versions'
    }
  } catch (err: any) {
    error.value = err.message || 'An error occurred while comparing versions'
  } finally {
    loading.value = false
  }
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

const showRollbackConfirmation = () => {
  // Emit rollback event with version number
  emit('rollback', props.versionA)
  emit('close')
}

onMounted(() => {
  loadComparison()
})
</script>
