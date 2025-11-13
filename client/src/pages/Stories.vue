<template>
  <DashboardLayout>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-900">Stories</h1>
          <button
            @click="openCreateModal"
            class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition"
          >
            + Create Story
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Search and Filter Bar -->
      <div class="mb-6 flex gap-4">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Search stories by title or content..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div class="relative group">
          <button
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white hover:bg-gray-50 flex items-center gap-2"
          >
            <span>Categories</span>
            <span v-if="selectedCategories.length > 0" class="bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {{ selectedCategories.length }}
            </span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </button>
          <div class="hidden group-hover:block absolute left-0 mt-0 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-2">
            <div class="mb-2 pb-2 border-b border-gray-200">
              <button
                @click="clearCategoryFilter"
                class="w-full text-left px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                Clear All
              </button>
            </div>
            <div class="space-y-1 max-h-48 overflow-y-auto">
              <label v-for="category in categories" :key="category.id" class="flex items-center px-3 py-1 hover:bg-gray-100 rounded cursor-pointer">
                <input
                  type="checkbox"
                  :value="category.id"
                  v-model="selectedCategories"
                  @change="handleFilterChange"
                  class="rounded border-gray-300"
                />
                <span class="ml-2 text-sm text-gray-700">{{ category.name }}</span>
              </label>
            </div>
          </div>
        </div>
        <select
          v-model="selectedStatus"
          @change="handleFilterChange"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      <!-- Sort Bar -->
      <div class="mb-6 flex gap-4">
        <select
          v-model="sortBy"
          @change="handleSortChange"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="createdAt">Sort by Creation Date</option>
          <option value="title">Sort by Title</option>
          <option value="priority">Sort by Priority</option>
        </select>
        <select
          v-model="sortOrder"
          @change="handleSortChange"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="desc" v-if="sortBy !== 'priority'">Newest First</option>
          <option value="asc" v-if="sortBy !== 'priority'">Oldest First</option>
          <option value="desc" v-if="sortBy === 'priority'">Highest Priority First</option>
          <option value="asc" v-if="sortBy === 'priority'">Lowest Priority First</option>
        </select>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p class="text-red-800">{{ error }}</p>
      </div>

      <!-- Stories Table -->
      <div v-if="!loading && stories.length > 0" class="bg-white shadow rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="story in stories" :key="story.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ story.title }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="story.categories && story.categories.length > 0" class="flex flex-wrap gap-1">
                  <span
                    v-for="category in story.categories"
                    :key="category.id"
                    class="inline-block px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium"
                  >
                    {{ category.name }}
                  </span>
                </div>
                <span v-else class="text-sm text-gray-400">-</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-600">{{ formatDate(story.createdAt) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="{
                    'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full': true,
                    'bg-green-100 text-green-800': story.status === 'PUBLISHED',
                    'bg-yellow-100 text-yellow-800': story.status === 'DRAFT',
                    'bg-gray-100 text-gray-800': !story.status,
                  }"
                >
                  {{ story.status || 'DRAFT' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center gap-2">
                  <button
                    @click="viewStory(story.id)"
                    class="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition text-xs font-medium"
                    title="View story details"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View
                  </button>
                  <button
                    @click="editStory(story.id)"
                    class="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg transition text-xs font-medium"
                    title="Edit story"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    @click="deleteStory(story.id)"
                    class="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition text-xs font-medium"
                    title="Delete story"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && stories.length === 0" class="bg-white shadow rounded-lg p-12 text-center">
        <p class="text-gray-500 text-lg mb-4">No stories found</p>
        <button
          @click="openCreateModal"
          class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition"
        >
          Create Your First Story
        </button>
      </div>

      <!-- Pagination -->
      <div v-if="pagination && pagination.totalPages > 1" class="mt-6 flex justify-center gap-2">
        <button
          @click="previousPage"
          :disabled="pagination.page === 1"
          class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600">
            Page {{ pagination.page }} of {{ pagination.totalPages }}
          </span>
        </div>
        <button
          @click="nextPage"
          :disabled="pagination.page === pagination.totalPages"
          class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storyService } from '../services/storyService'
import { categoryService } from '../services/categoryService'
import DashboardLayout from '../components/DashboardLayout.vue'

interface Story {
  id: number | string
  title: string
  details?: string
  content?: string
  status: string
  createdAt: string
  updatedAt: string
  categories?: Array<{
    id: string
    name: string
  }>
  tags?: Array<{
    id: number | string
    name: string
  }>
}

interface Category {
  id: string
  name: string
}

interface Pagination {
  page: number
  limit: number
  totalPages: number
}

const router = useRouter()

const stories = ref<Story[]>([])
const categories = ref<Category[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const selectedCategories = ref<string[]>([])
const selectedStatus = ref('')

const clearCategoryFilter = () => {
  selectedCategories.value = []
  handleFilterChange()
}
const sortBy = ref('createdAt')
const sortOrder = ref('desc')
const pagination = ref<Pagination | null>(null)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const fetchStories = async () => {
  loading.value = true
  error.value = null
  try {
    const filters: any = {}
    if (selectedCategories.value.length > 0) {
      filters.categoryIds = selectedCategories.value.join(',')
    }
    if (searchQuery.value) {
      filters.search = searchQuery.value
    }
    if (selectedStatus.value) {
      filters.status = selectedStatus.value
    }
    if (sortBy.value) {
      filters.sortBy = sortBy.value
    }
    if (sortOrder.value) {
      filters.sortOrder = sortOrder.value
    }

    const currentPage = pagination.value?.page || 1
    const response = await storyService.getStories(currentPage, 10, filters)
    
    // Handle the API response structure: { success, data: { results, total, pagination } }
    const data = response.data.data
    
    if (data.results) {
      stories.value = data.results
    } else if (Array.isArray(data)) {
      stories.value = data
    } else {
      stories.value = []
    }
    
    if (data.pagination) {
      pagination.value = data.pagination
    } else {
      pagination.value = {
        page: currentPage,
        limit: 10,
        totalPages: Math.ceil((data.total || stories.value.length) / 10),
      }
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to fetch stories'
    console.error('Error fetching stories:', err)
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  try {
    const response = await categoryService.getCategories(1, 100)
    const data = response.data.data
    
    if (data.categories) {
      categories.value = data.categories
    } else if (data.results) {
      categories.value = data.results
    } else if (Array.isArray(data)) {
      categories.value = data
    }
  } catch (err) {
    console.error('Error fetching categories:', err)
  }
}

const handleSearch = () => {
  if (pagination.value) {
    pagination.value.page = 1
  }
  fetchStories()
}

const handleFilterChange = () => {
  if (pagination.value) {
    pagination.value.page = 1
  }
  fetchStories()
}

const handleSortChange = () => {
  if (pagination.value) {
    pagination.value.page = 1
  }
  fetchStories()
}

const nextPage = () => {
  if (pagination.value && pagination.value.page < pagination.value.totalPages) {
    pagination.value.page++
    fetchStories()
  }
}

const previousPage = () => {
  if (pagination.value && pagination.value.page > 1) {
    pagination.value.page--
    fetchStories()
  }
}

const viewStory = (id: number | string) => {
  router.push(`/stories/${id}`)
}

const editStory = (id: number | string) => {
  router.push(`/stories/${id}/edit`)
}

const deleteStory = async (id: number | string) => {
  if (confirm('Are you sure you want to delete this story?')) {
    try {
      await storyService.deleteStory(String(id))
      fetchStories()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete story'
    }
  }
}

const openCreateModal = () => {
  router.push('/stories/create')
}

onMounted(() => {
  pagination.value = { page: 1, limit: 10, totalPages: 1 }
  fetchStories()
  fetchCategories()
})
</script>

<style scoped>
</style>
