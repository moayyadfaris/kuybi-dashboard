<template>
  <DashboardLayout>
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <button
                @click="goBack"
                class="text-gray-600 hover:text-gray-900 transition"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 class="text-2xl font-bold text-gray-900">Version History</h1>
                <p class="text-sm text-gray-500 mt-1">{{ storyTitle }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <!-- Branch Filter -->
              <select
                v-model="selectedBranch"
                @change="loadVersions"
                class="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 bg-white"
              >
                <option value="">All Branches</option>
                <option v-for="branch in versionStore.branches" :key="branch.name" :value="branch.name">
                  {{ branch.name }} ({{ branch.versionCount }})
                </option>
              </select>

              <!-- Create Snapshot Button -->
              <button
                @click="showCreateDialog = true"
                class="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition shadow-sm"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Snapshot
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Loading State -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-16">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p class="mt-4 text-gray-600">Loading version history...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="versionStore.error" class="max-w-2xl mx-auto">
          <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <svg class="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-red-700 font-medium">{{ versionStore.error }}</p>
            <button
              @click="loadVersions"
              class="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition"
            >
              Try Again
            </button>
          </div>
        </div>

        <!-- Timeline View -->
        <div v-else-if="versionStore.versions.length > 0" class="max-w-5xl mx-auto">
          <!-- Timeline Container -->
          <div class="relative">
            <!-- Timeline Line -->
            <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            <!-- Version Items -->
            <div class="space-y-6">
              <div
                v-for="(version, index) in versionStore.versions"
                :key="version.id"
                class="relative pl-20"
              >
                <!-- Timeline Node -->
                <div
                  :class="[
                    'absolute left-5 w-6 h-6 rounded-full border-4 border-white',
                    getVersionNodeColor(version.versionType)
                  ]"
                  :title="version.versionType"
                ></div>

                <!-- Version Card -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
                  <div class="p-6">
                    <!-- Version Header -->
                    <div class="flex items-start justify-between mb-4">
                      <div class="flex items-center gap-3 flex-wrap">
                        <!-- Version Number -->
                        <span class="text-lg font-bold text-gray-900">
                          v{{ version.versionNumber }}
                        </span>

                        <!-- Current Badge -->
                        <span v-if="isCurrentVersion(version)" class="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full flex items-center gap-1">
                          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                          </svg>
                          Current
                        </span>

                        <!-- Version Type Badge -->
                        <span
                          :class="getVersionTypeBadgeClass(version.versionType)"
                          class="px-3 py-1 text-xs font-semibold rounded-full"
                        >
                          {{ version.versionType }}
                        </span>

                        <!-- Branch Badge -->
                        <span class="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full flex items-center gap-1">
                          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clip-rule="evenodd" />
                          </svg>
                          {{ version.branchName }}
                        </span>

                        <!-- Label -->
                        <span v-if="version.versionLabel" class="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                          {{ version.versionLabel }}
                        </span>

                        <!-- Tag -->
                        <span v-if="version.tag" class="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full flex items-center gap-1">
                          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 010 10V4a1 1 0 011-1h6c.256 0 .512.098.707.293l7 7zM4 6a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                          </svg>
                          {{ version.tag }}
                        </span>

                        <!-- Pinned -->
                        <span v-if="version.isPinned" class="text-yellow-500" title="Pinned">
                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
                          </svg>
                        </span>
                      </div>

                      <!-- Actions Dropdown -->
                      <div class="relative">
                        <button
                          @click="toggleActionsMenu(version.id)"
                          class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
                        >
                          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>

                        <!-- Actions Menu -->
                        <div
                          v-if="activeActionsMenu === version.id"
                          v-click-outside="() => activeActionsMenu = null"
                          class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
                        >
                          <button
                            @click="viewVersion(version)"
                            class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View Details
                          </button>
                          <button
                            @click="selectForComparison(version)"
                            class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                            Compare
                            <span v-if="selectedForComparison.includes(version.versionNumber)" class="ml-auto text-orange-600">✓</span>
                          </button>
                          <button
                            v-if="!isCurrentVersion(version)"
                            @click="initiateRollback(version)"
                            class="w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 flex items-center gap-2"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                            Rollback
                          </button>
                          <button
                            @click="openTagDialog(version)"
                            class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            {{ version.tag ? 'Edit Tag' : 'Add Tag' }}
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Commit Message -->
                    <p v-if="version.commitMessage" class="text-gray-900 mb-3 font-medium">
                      {{ version.commitMessage }}
                    </p>

                    <!-- Change Summary -->
                    <p v-if="version.changeSummary" class="text-sm text-gray-600 mb-3">
                      {{ version.changeSummary }}
                    </p>

                    <!-- Meta Information -->
                    <div class="flex items-center gap-4 text-sm text-gray-500">
                      <span class="flex items-center gap-2">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                        </svg>
                        {{ version.createdBy.firstName }} {{ version.createdBy.lastName }}
                      </span>
                      <span>•</span>
                      <span class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                        </svg>
                        {{ formatRelativeTime(version.createdAt) }}
                      </span>
                      <span>•</span>
                      <span class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                        </svg>
                        {{ version.changesCount }} change{{ version.changesCount !== 1 ? 's' : '' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Compare Bar (Sticky at bottom when 2 selected) -->
          <transition name="slide-up">
            <div v-if="selectedForComparison.length === 2" class="fixed bottom-0 left-0 right-0 bg-orange-600 shadow-2xl z-50">
              <div class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
                <div class="flex items-center gap-4 text-white">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <span class="font-semibold">
                    2 versions selected: v{{ Math.min(...selectedForComparison) }} ↔ v{{ Math.max(...selectedForComparison) }}
                  </span>
                </div>
                <div class="flex items-center gap-3">
                  <button
                    @click="compareVersions"
                    class="px-6 py-2 bg-white text-orange-600 hover:bg-gray-100 rounded-lg font-semibold transition"
                  >
                    Compare Now
                  </button>
                  <button
                    @click="selectedForComparison = []"
                    class="px-4 py-2 bg-orange-700 hover:bg-orange-800 text-white rounded-lg transition"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <!-- Empty State -->
        <div v-else class="max-w-2xl mx-auto text-center py-16">
          <svg class="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No Version History</h3>
          <p class="text-gray-600 mb-6">This story doesn't have any version history yet.</p>
          <button
            @click="showCreateDialog = true"
            class="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create First Snapshot
          </button>
        </div>
      </div>
    </div>

    <!-- Create Version Dialog -->
    <CreateVersionDialog
      v-if="showCreateDialog"
      :story-id="storyId"
      @close="showCreateDialog = false"
      @created="onVersionCreated"
    />

    <!-- Rollback Dialog -->
    <RollbackDialog
      v-if="showRollbackDialog"
      :story-id="storyId"
      :version="rollbackVersion"
      @close="showRollbackDialog = false"
      @rollback="onRollback"
    />

    <!-- Tag Dialog -->
    <TagDialog
      v-if="showTagDialog"
      :story-id="storyId"
      :version="tagVersion"
      @close="showTagDialog = false"
      @tagged="onVersionTagged"
    />

    <!-- Comparison Modal -->
    <ComparisonModal
      v-if="showComparisonModal"
      :story-id="storyId"
      :version-a="selectedForComparison[0]"
      :version-b="selectedForComparison[1]"
      @close="closeComparisonModal"
    />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVersionStore } from '../stores/versionStore'
import DashboardLayout from '../components/DashboardLayout.vue'
import CreateVersionDialog from '../components/versions/CreateVersionDialog.vue'
import RollbackDialog from '../components/versions/RollbackDialog.vue'
import TagDialog from '../components/versions/TagDialog.vue'
import ComparisonModal from '../components/versions/ComparisonModal.vue'
import type { Version } from '../types/version'

const route = useRoute()
const router = useRouter()
const versionStore = useVersionStore()

// Reactive State
const storyId = ref(Number(route.params.id))
const storyTitle = ref('') // TODO: Fetch from story service
const loading = ref(false)
const selectedBranch = ref('')
const activeActionsMenu = ref<string | null>(null)
const selectedForComparison = ref<number[]>([])
const currentVersionNumber = ref<number | null>(null)

// Dialogs
const showCreateDialog = ref(false)
const showRollbackDialog = ref(false)
const showTagDialog = ref(false)
const showComparisonModal = ref(false)
const rollbackVersion = ref<Version | null>(null)
const tagVersion = ref<Version | null>(null)

// Methods
const goBack = () => {
  router.push(`/stories/${storyId.value}/edit`)
}

const loadVersions = async () => {
  loading.value = true
  await versionStore.fetchVersionHistory(storyId.value, {
    branchName: selectedBranch.value || undefined
  })
  await versionStore.fetchBranchInfo(storyId.value)
  
  // Get current version number (latest version is current)
  if (versionStore.versions.length > 0) {
    currentVersionNumber.value = versionStore.versions[0].versionNumber
  }
  
  loading.value = false
}

const isCurrentVersion = (version: Version) => {
  return version.versionNumber === currentVersionNumber.value
}

const getVersionNodeColor = (versionType: string) => {
  const colors = {
    AUTO: 'bg-gray-400',
    MANUAL: 'bg-green-500',
    ROLLBACK: 'bg-orange-500',
    BRANCH: 'bg-purple-500',
    MERGE: 'bg-blue-500'
  }
  return colors[versionType as keyof typeof colors] || 'bg-gray-400'
}

const getVersionTypeBadgeClass = (versionType: string) => {
  const classes = {
    AUTO: 'bg-gray-100 text-gray-800',
    MANUAL: 'bg-green-100 text-green-800',
    ROLLBACK: 'bg-orange-100 text-orange-800',
    BRANCH: 'bg-purple-100 text-purple-800',
    MERGE: 'bg-blue-100 text-blue-800'
  }
  return classes[versionType as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`
  return date.toLocaleDateString()
}

const toggleActionsMenu = (versionId: string) => {
  activeActionsMenu.value = activeActionsMenu.value === versionId ? null : versionId
}

const viewVersion = (version: Version) => {
  // TODO: Implement view version details
  console.log('View version:', version)
  activeActionsMenu.value = null
}

const selectForComparison = (version: Version) => {
  const index = selectedForComparison.value.indexOf(version.versionNumber)
  
  if (index > -1) {
    selectedForComparison.value.splice(index, 1)
  } else if (selectedForComparison.value.length < 2) {
    selectedForComparison.value.push(version.versionNumber)
  } else {
    // Replace oldest selection
    selectedForComparison.value.shift()
    selectedForComparison.value.push(version.versionNumber)
  }
  
  activeActionsMenu.value = null
}

const compareVersions = () => {
  if (selectedForComparison.value.length === 2) {
    showComparisonModal.value = true
  }
}

const closeComparisonModal = () => {
  showComparisonModal.value = false
  selectedForComparison.value = []
}

const initiateRollback = (version: Version) => {
  rollbackVersion.value = version
  showRollbackDialog.value = true
  activeActionsMenu.value = null
}

const openTagDialog = (version: Version) => {
  tagVersion.value = version
  showTagDialog.value = true
  activeActionsMenu.value = null
}

// Event Handlers
const onVersionCreated = () => {
  showCreateDialog.value = false
  loadVersions()
}

const onRollback = () => {
  showRollbackDialog.value = false
  rollbackVersion.value = null
  loadVersions()
}

const onVersionTagged = () => {
  showTagDialog.value = false
  tagVersion.value = null
  loadVersions()
}

// Click outside directive
const vClickOutside = {
  mounted(el: any, binding: any) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: any) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

// Lifecycle
onMounted(() => {
  loadVersions()
})
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
