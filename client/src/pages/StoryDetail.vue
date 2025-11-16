<template>
  <DashboardLayout>
    <div class="min-h-screen bg-gray-50 p-8">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <div>
              <button
                @click="$router.back()"
                class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Stories
              </button>
              <h1 class="text-3xl font-bold text-gray-900">📖 Story Details</h1>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="$router.push(`/stories/${storyId}/edit`)"
                class="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition font-medium"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Story
              </button>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div class="text-6xl mb-4">❌</div>
          <p class="text-red-600 font-medium">{{ error }}</p>
        </div>

        <!-- Content -->
        <div v-else-if="story" class="space-y-6">
          <!-- Story Details Card -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ story.title }}</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p class="text-sm text-gray-500">Status</p>
                <span
                  :class="{
                    'px-3 py-1 inline-flex text-sm font-semibold rounded-full': true,
                    'bg-green-100 text-green-800': story.status === 'PUBLISHED',
                    'bg-yellow-100 text-yellow-800': story.status === 'DRAFT',
                    'bg-gray-100 text-gray-800': !story.status,
                  }"
                >
                  {{ story.status || 'DRAFT' }}
                </span>
              </div>
              <div>
                <p class="text-sm text-gray-500">Created</p>
                <p class="text-gray-900">{{ formatDate(story.createdAt) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Last Updated</p>
                <p class="text-gray-900">{{ formatDate(story.updatedAt) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Version</p>
                <p class="text-gray-900 font-semibold">{{ story.version || 1 }}</p>
              </div>
            </div>

            <div v-if="story.categories && story.categories.length > 0" class="mb-4">
              <p class="text-sm text-gray-500 mb-2">Categories</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="category in story.categories"
                  :key="category.id"
                  class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                >
                  {{ category.name }}
                </span>
              </div>
            </div>

            <div v-if="story.tags && story.tags.length > 0" class="mb-4">
              <p class="text-sm text-gray-500 mb-2">Tags</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in story.tags"
                  :key="tag.id"
                  class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {{ tag.name }}
                </span>
              </div>
            </div>

            <div class="border-t pt-4">
              <p class="text-sm text-gray-500 mb-2">Details</p>
              <div class="prose max-w-none text-gray-900">{{ story.details || 'No details available' }}</div>
            </div>
          </div>

          <!-- Version History CTA Card -->
          <div class="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg shadow border border-orange-200 p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-1">Version History</h3>
                  <p class="text-sm text-gray-600">
                    View complete timeline, compare versions, and manage story history
                  </p>
                </div>
              </div>
              <button
                @click="$router.push(`/stories/${storyId}/versions`)"
                class="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition font-medium shadow-sm"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Full History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storyService } from '../services/storyService'
import DashboardLayout from '../components/DashboardLayout.vue'

const route = useRoute()
const storyId = ref(route.params.id as string)

// Story State
const story = ref<any>(null)
const loading = ref(false)
const error = ref('')

// Load Story
const loadStory = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await storyService.getStory(storyId.value)
    story.value = response.data.data
  } catch (err: any) {
    console.error('Error loading story:', err)
    error.value = err.response?.data?.message || 'Failed to load story'
  } finally {
    loading.value = false
  }
}

// Format Date
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Lifecycle
onMounted(() => {
  loadStory()
})
</script>
