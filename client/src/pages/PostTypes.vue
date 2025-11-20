<template>
  <DashboardLayout>
    <div class="min-h-screen bg-gray-50 p-8">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">📦 Post Types</h1>
              <p class="text-gray-600 mt-2">Manage custom content types for your application</p>
            </div>
            <button
              @click="showCreateDialog = true"
              class="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition font-medium shadow-sm"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Create Post Type
            </button>
          </div>
        </div>

        <!-- Filters -->
        <div class="mb-6 flex items-center gap-4">
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Search post types..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <select
            v-model="filterType"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="system">System Types</option>
            <option value="custom">Custom Types</option>
            <option value="active">Active Only</option>
          </select>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div class="text-6xl mb-4">❌</div>
          <p class="text-red-600 font-medium">{{ error }}</p>
          <button
            @click="loadPostTypes"
            class="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            Retry
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredPostTypes.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
          <div class="text-6xl mb-4">📦</div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No Post Types Found</h3>
          <p class="text-gray-600 mb-6">
            {{ searchQuery ? 'No post types match your search.' : 'Get started by creating your first post type.' }}
          </p>
          <button
            v-if="!searchQuery"
            @click="showCreateDialog = true"
            class="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition font-medium"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Your First Post Type
          </button>
        </div>

        <!-- Post Types Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PostTypeCard
            v-for="postType in filteredPostTypes"
            :key="postType.id"
            :post-type="postType"
            @edit="editPostType"
            @view-content="viewContent"
            @view-fields="viewFields"
            @delete="confirmDelete"
          />
        </div>
      </div>
    </div>

    <!-- Create/Edit Dialog -->
    <CreatePostTypeDialog
      v-if="showCreateDialog"
      :post-type="selectedPostType"
      @close="closeCreateDialog"
      @created="onPostTypeCreated"
      @updated="onPostTypeUpdated"
    />

    <!-- Delete Confirmation -->
    <ConfirmDialog
      v-if="showDeleteConfirm"
      title="Delete Post Type"
      :message="`Are you sure you want to delete '${postTypeToDelete?.name}'? This action cannot be undone.`"
      confirm-text="Delete"
      confirm-class="bg-red-600 hover:bg-red-700"
      @confirm="deletePostType"
      @cancel="showDeleteConfirm = false"
    />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { usePostTypesStore } from '../stores/postTypesStore'
import type { PostType } from '../types/postTypes'
import DashboardLayout from '../components/DashboardLayout.vue'
import PostTypeCard from '../components/postTypes/PostTypeCard.vue'
import CreatePostTypeDialog from '../components/postTypes/CreatePostTypeDialog.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'

const router = useRouter()
const store = usePostTypesStore()

// State
const searchQuery = ref('')
const filterType = ref('all')
const showCreateDialog = ref(false)
const showDeleteConfirm = ref(false)
const selectedPostType = ref<PostType | null>(null)
const postTypeToDelete = ref<PostType | null>(null)
const loading = ref(false)
const error = ref('')

// Computed
const filteredPostTypes = computed(() => {
  let types = store.postTypes

  // Apply type filter
  if (filterType.value === 'system') {
    types = store.systemPostTypes
  } else if (filterType.value === 'custom') {
    types = store.customPostTypes
  } else if (filterType.value === 'active') {
    types = store.activePostTypes
  }

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    types = types.filter(pt => 
      pt.name.toLowerCase().includes(query) ||
      pt.slug.toLowerCase().includes(query) ||
      pt.description?.toLowerCase().includes(query)
    )
  }

  return types
})

// Methods
const loadPostTypes = async (forceRefresh = false) => {
  loading.value = true
  error.value = ''
  
  try {
    // Clear cache if force refresh
    if (forceRefresh) {
      store.clearCache('postTypes_')
    }
    await store.fetchPostTypes()
  } catch (err: any) {
    error.value = err.message || 'Failed to load post types'
  } finally {
    loading.value = false
  }
}

const editPostType = (postType: PostType) => {
  selectedPostType.value = postType
  showCreateDialog.value = true
}

const viewContent = (postType: PostType) => {
  router.push(`/post-types/${postType.slug}/content`)
}

const viewFields = (postType: PostType) => {
  router.push(`/post-types/${postType.slug}/fields`)
}

const confirmDelete = (postType: PostType) => {
  if (postType.isSystem) {
    alert('System post types cannot be deleted')
    return
  }
  postTypeToDelete.value = postType
  showDeleteConfirm.value = true
}

const deletePostType = async () => {
  if (!postTypeToDelete.value) return

  loading.value = true
  try {
    await store.deletePostType(postTypeToDelete.value.id)
    showDeleteConfirm.value = false
    postTypeToDelete.value = null
  } catch (err: any) {
    error.value = err.message || 'Failed to delete post type'
  } finally {
    loading.value = false
  }
}

const closeCreateDialog = () => {
  showCreateDialog.value = false
  selectedPostType.value = null
}

const onPostTypeCreated = (postType: PostType) => {
  closeCreateDialog()
  // Optionally navigate to field builder
  router.push(`/post-types/${postType.slug}/fields`)
}

const onPostTypeUpdated = () => {
  closeCreateDialog()
}

// Lifecycle
onMounted(() => {
  loadPostTypes(true) // Force refresh on mount
})

// Also refresh when component is activated (navigated back to)
onActivated(() => {
  loadPostTypes(true) // Force refresh on activation
})
</script>
