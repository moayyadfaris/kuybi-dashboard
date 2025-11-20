<template>
  <DashboardLayout>
    <div class="p-6 max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <router-link to="/post-types" class="hover:text-orange-600">Post Types</router-link>
          <span>/</span>
          <span class="text-gray-900 font-medium">{{ postType?.name || 'Content' }}</span>
        </div>
        
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ postType?.name || 'Content' }}</h1>
            <p class="text-gray-600 mt-1">{{ postType?.description || 'Manage your content' }}</p>
          </div>
          
          <router-link
            :to="`/post-types/${slug}/content/create`"
            class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add {{ postType?.name || 'Content' }}
          </router-link>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            @input="debouncedSearch"
          />
        </div>
        
        <div>
          <select
            v-model="filters.status"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            @change="fetchContent"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        
        <div>
          <select
            v-model="filters.sortBy"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            @change="fetchContent"
          >
            <option value="createdAt">Created Date</option>
            <option value="updatedAt">Updated Date</option>
            <option value="title">Title</option>
            <option value="publishedAt">Published Date</option>
          </select>
        </div>
        
        <div>
          <select
            v-model="filters.order"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            @change="fetchContent"
          >
            <option value="DESC">Newest First</option>
            <option value="ASC">Oldest First</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="store.isLoading && !contents.length" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!contents.length && !store.isLoading" class="bg-white rounded-lg shadow-sm p-12 text-center">
      <div class="text-gray-400 mb-4">
        <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">No content yet</h3>
      <p class="text-gray-600 mb-4">Get started by creating your first {{ postType?.name?.toLowerCase() || 'content' }}</p>
      <router-link
        :to="`/post-types/${slug}/content/create`"
        class="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add {{ postType?.name || 'Content' }}
      </router-link>
    </div>

    <!-- Content List -->
    <div v-else class="space-y-4">
      <div
        v-for="content in contents"
        :key="content.id"
        class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-lg font-semibold text-gray-900">{{ content.title }}</h3>
              <span
                :class="getStatusColor(content.status)"
                class="px-2 py-1 text-xs font-medium rounded-full"
              >
                {{ content.status }}
              </span>
            </div>
            
            <p v-if="content.excerpt" class="text-gray-600 mb-3">{{ content.excerpt }}</p>
            
            <div class="flex items-center gap-4 text-sm text-gray-500">
              <span>Created: {{ formatDate(content.createdAt) }}</span>
              <span v-if="content.publishedAt">Published: {{ formatDate(content.publishedAt) }}</span>
              <span v-if="content.viewCount">Views: {{ content.viewCount }}</span>
            </div>
          </div>
          
          <div class="flex items-center gap-2 ml-4">
            <router-link
              :to="`/post-types/${slug}/content/${content.id}/edit`"
              class="px-3 py-1.5 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              Edit
            </router-link>
            
            <button
              v-if="content.status === 'draft'"
              @click="handlePublish(content.id)"
              class="px-3 py-1.5 text-sm text-white bg-green-600 hover:bg-green-700 rounded-lg transition"
            >
              Publish
            </button>
            
            <button
              @click="handleDelete(content)"
              class="px-3 py-1.5 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.total > pagination.limit" class="flex justify-center gap-2 mt-6">
        <button
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'px-4 py-2 rounded-lg transition',
            page === pagination.page
              ? 'bg-orange-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          ]"
        >
          {{ page }}
        </button>
      </div>
    </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog
      v-if="showDeleteConfirm"
      title="Delete Content"
      :message="`Are you sure you want to delete '${contentToDelete?.title}'? This action cannot be undone.`"
      confirm-text="Delete"
      cancel-text="Cancel"
      confirm-class="bg-red-600 hover:bg-red-700"
      @confirm="confirmDelete"
      @cancel="showDeleteConfirm = false"
    />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onActivated, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostContentStore } from '../stores/postContentStore'
import { usePostTypesStore } from '../stores/postTypesStore'
import type { PostContent, ContentQueryParams } from '../types/postTypes'
import DashboardLayout from '../components/DashboardLayout.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'

const route = useRoute()
const router = useRouter()
const store = usePostContentStore()
const postTypesStore = usePostTypesStore()

// Route params
const slug = computed(() => route.params.slug as string)

// State
const postType = ref<any>(null)
const contents = ref<PostContent[]>([])
const searchQuery = ref('')
const filters = ref({
  status: '',
  sortBy: 'createdAt',
  order: 'DESC' as 'ASC' | 'DESC'
})
const pagination = ref({
  page: 1,
  limit: 20,
  total: 0
})
const showDeleteConfirm = ref(false)
const contentToDelete = ref<PostContent | null>(null)

// Computed
const totalPages = computed(() => Math.ceil(pagination.value.total / pagination.value.limit))

/**
 * Fetch post type details
 */
const fetchPostType = async () => {
  try {
    postType.value = await postTypesStore.fetchPostTypeBySlug(slug.value)
  } catch (error) {
    console.error('Failed to fetch post type:', error)
  }
}

/**
 * Fetch content list
 */
const fetchContent = async (forceRefresh = false) => {
  try {
    const params: ContentQueryParams = {
      offset: (pagination.value.page - 1) * pagination.value.limit,
      limit: pagination.value.limit,
      sortBy: filters.value.sortBy,
      sortOrder: filters.value.order
    }

    if (searchQuery.value) {
      params.search = searchQuery.value
    }

    if (filters.value.status) {
      params.status = filters.value.status as any
    }

    const response = await store.getAll(slug.value, params, forceRefresh)
    contents.value = response.data
    pagination.value.total = response.total
  } catch (error) {
    console.error('Failed to fetch content:', error)
  }
}

/**
 * Debounced search
 */
let searchTimeout: NodeJS.Timeout
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.page = 1
    fetchContent()
  }, 500)
}

/**
 * Go to page
 */
const goToPage = (page: number) => {
  pagination.value.page = page
  fetchContent()
}

/**
 * Get status color
 */
const getStatusColor = (status: string) => {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-800'
    case 'draft':
      return 'bg-gray-100 text-gray-800'
    case 'scheduled':
      return 'bg-blue-100 text-blue-800'
    case 'archived':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

/**
 * Format date
 */
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Handle publish
 */
const handlePublish = async (id: string) => {
  if (!confirm('Publish this content?')) return

  try {
    await store.publish(slug.value, id)
    await fetchContent()
  } catch (error) {
    console.error('Failed to publish:', error)
    alert('Failed to publish content')
  }
}

/**
 * Handle delete - show confirmation dialog
 */
const handleDelete = (content: PostContent) => {
  contentToDelete.value = content
  showDeleteConfirm.value = true
}

/**
 * Confirm delete - actually delete the content
 */
const confirmDelete = async () => {
  if (!contentToDelete.value) return

  try {
    await store.deleteContent(slug.value, contentToDelete.value.id)
    showDeleteConfirm.value = false
    contentToDelete.value = null
    // Force refresh from API after delete
    await fetchContent(true)
  } catch (error: any) {
    console.error('Failed to delete:', error)
    showDeleteConfirm.value = false
    contentToDelete.value = null
    // Show error message
    alert(error.message || 'Failed to delete content. Please try again.')
  }
}

// Lifecycle
onMounted(async () => {
  await fetchPostType()
  await fetchContent(true) // Force refresh on mount
})

// Also refresh when component is activated (navigated back to)
onActivated(async () => {
  await fetchPostType()
  await fetchContent(true) // Force refresh on activation
})

// Watch slug changes
watch(slug, () => {
  fetchPostType()
  fetchContent(true) // Force refresh when slug changes
})
</script>
