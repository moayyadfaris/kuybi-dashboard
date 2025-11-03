<template>
  <div class="bg-white rounded-lg shadow">
    <!-- Header -->
    <div class="border-b border-gray-200 px-6 py-4">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-900">Version History</h2>
        <div class="flex gap-2">
          <!-- Branch Filter -->
          <select
            v-model="selectedBranch"
            @change="fetchVersions"
            class="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Branches</option>
            <option v-for="branch in versionStore.branches" :key="branch.name" :value="branch.name">
              {{ branch.name }} ({{ branch.versionCount }})
            </option>
          </select>

          <!-- Create Version Button -->
          <button
            @click="showCreateDialog = true"
            class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition"
          >
            + Create Version
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="versionStore.loading" class="p-8 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      <p class="mt-2 text-gray-600">Loading versions...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="versionStore.error" class="p-6">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-700">{{ versionStore.error }}</p>
      </div>
    </div>

    <!-- Version List -->
    <div v-else-if="versionStore.versions.length > 0" class="divide-y divide-gray-200">
      <div
        v-for="version in versionStore.versions"
        :key="version.id"
        class="p-6 hover:bg-gray-50 transition"
      >
        <div class="flex items-start justify-between">
          <!-- Version Info -->
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <!-- Version Number -->
              <span class="text-lg font-semibold text-gray-900">
                v{{ version.versionNumber }}
              </span>

              <!-- Version Label -->
              <span v-if="version.versionLabel" class="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                {{ version.versionLabel }}
              </span>

              <!-- Version Type Badge -->
              <span
                :class="getVersionTypeBadgeClass(version.versionType)"
                class="px-2 py-1 text-xs font-medium rounded"
              >
                {{ version.versionType }}
              </span>

              <!-- Branch Name -->
              <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                {{ version.branchName }}
              </span>

              <!-- Tag -->
              <span v-if="version.tag" class="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded flex items-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 010 10V4a1 1 0 011-1h6c.256 0 .512.098.707.293l7 7zM4 6a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                </svg>
                {{ version.tag }}
              </span>

              <!-- Pinned -->
              <span v-if="version.isPinned" class="text-yellow-500">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
                </svg>
              </span>
            </div>

            <!-- Commit Message -->
            <p v-if="version.commitMessage" class="text-gray-700 mb-2">
              {{ version.commitMessage }}
            </p>

            <!-- Change Summary -->
            <p v-if="version.changeSummary" class="text-sm text-gray-500 mb-2">
              {{ version.changeSummary }}
            </p>

            <!-- Meta Info -->
            <div class="flex items-center gap-4 text-sm text-gray-500">
              <span>
                {{ version.createdBy.firstName }} {{ version.createdBy.lastName }}
              </span>
              <span>•</span>
              <span>{{ formatDate(version.createdAt) }}</span>
              <span>•</span>
              <span>{{ version.changesCount }} changes</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 ml-4">
            <button
              @click="viewVersion(version)"
              class="px-3 py-1 text-sm text-orange-600 hover:bg-orange-50 rounded transition"
              title="View Details"
            >
              View
            </button>
            <button
              @click="compareVersion(version)"
              class="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded transition"
              title="Compare"
            >
              Compare
            </button>
            <button
              @click="rollbackToVersion(version)"
              class="px-3 py-1 text-sm text-orange-600 hover:bg-orange-50 rounded transition"
              title="Rollback"
            >
              Rollback
            </button>
            <button
              @click="tagVersion(version)"
              class="px-3 py-1 text-sm text-purple-600 hover:bg-purple-50 rounded transition"
              title="Tag Version"
            >
              Tag
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="p-12 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="mt-2 text-gray-600">No versions found</p>
      <button
        @click="showCreateDialog = true"
        class="mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition"
      >
        Create First Version
      </button>
    </div>

    <!-- Pagination -->
    <div v-if="versionStore.versions.length > 0" class="border-t border-gray-200 px-6 py-4">
      <div class="flex items-center justify-between">
        <button
          @click="loadMore"
          :disabled="versionStore.loading"
          class="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Load More
        </button>
        <span class="text-sm text-gray-600">
          Showing {{ versionStore.versions.length }} versions
        </span>
      </div>
    </div>

    <!-- Create Version Dialog -->
    <CreateVersionDialog
      v-if="showCreateDialog"
      :story-id="storyId"
      @close="showCreateDialog = false"
      @created="handleVersionCreated"
    />

    <!-- Rollback Dialog -->
    <RollbackDialog
      v-if="showRollbackDialog"
      :story-id="storyId"
      :version="selectedVersion"
      @close="showRollbackDialog = false"
      @rollback="handleRollback"
    />

    <!-- Tag Dialog -->
    <TagDialog
      v-if="showTagDialog"
      :story-id="storyId"
      :version="selectedVersion"
      @close="showTagDialog = false"
      @tagged="handleTagged"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useVersionStore } from '../../stores/versionStore'
import type { Version } from '../../types/version'
import CreateVersionDialog from './CreateVersionDialog.vue'
import RollbackDialog from './RollbackDialog.vue'
import TagDialog from './TagDialog.vue'

interface Props {
  storyId: number
}

const props = defineProps<Props>()
const versionStore = useVersionStore()

const selectedBranch = ref('')
const offset = ref(0)
const limit = ref(20)
const showCreateDialog = ref(false)
const showRollbackDialog = ref(false)
const showTagDialog = ref(false)
const selectedVersion = ref<Version | null>(null)

onMounted(async () => {
  await fetchVersions()
  await versionStore.fetchBranchInfo(props.storyId)
})

const fetchVersions = async () => {
  await versionStore.fetchVersionHistory(props.storyId, {
    limit: limit.value,
    offset: offset.value,
    branchName: selectedBranch.value || undefined,
  })
}

const loadMore = () => {
  offset.value += limit.value
  fetchVersions()
}

const getVersionTypeBadgeClass = (type: string) => {
  const classes: Record<string, string> = {
    AUTO: 'bg-orange-100 text-orange-700',
    MANUAL: 'bg-green-100 text-green-700',
    ROLLBACK: 'bg-orange-100 text-orange-700',
    BRANCH: 'bg-purple-100 text-purple-700',
    MERGE: 'bg-indigo-100 text-indigo-700',
  }
  return classes[type] || 'bg-gray-100 text-gray-700'
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

const viewVersion = (version: Version) => {
  // Navigate to version view or show details modal
  console.log('View version:', version)
}

const compareVersion = (version: Version) => {
  // Show comparison dialog
  console.log('Compare version:', version)
}

const rollbackToVersion = (version: Version) => {
  selectedVersion.value = version
  showRollbackDialog.value = true
}

const tagVersion = (version: Version) => {
  selectedVersion.value = version
  showTagDialog.value = true
}

const handleVersionCreated = () => {
  showCreateDialog.value = false
  fetchVersions()
}

const handleRollback = () => {
  showRollbackDialog.value = false
  fetchVersions()
}

const handleTagged = () => {
  showTagDialog.value = false
  fetchVersions()
}
</script>
