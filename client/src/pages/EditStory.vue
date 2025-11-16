<template>
  <DashboardLayout>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center gap-4">
          <button
            @click="goBack"
            class="text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
          <h1 class="text-3xl font-bold text-gray-900">Edit Story</h1>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading && !form.title" class="bg-white shadow rounded-lg p-8">
        <div class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      </div>

      <!-- Error Alert -->
      <div v-if="error" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-800">{{ error }}</p>
      </div>

      <!-- Success Alert -->
      <div v-if="successMessage" class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <p class="text-green-800">{{ successMessage }}</p>
      </div>

      <!-- Version Badge -->
      <div v-if="form.title && currentVersion" class="mb-6 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 2a2 2 0 00-2 2v11a2 2 0 002 2h4a1 1 0 010 2h4a1 1 0 010-2h4a2 2 0 002-2V4a2 2 0 00-2-2H4zm3 7a1 1 0 000 2h6a1 1 0 100-2H7zm0 4a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
              </svg>
              <span class="font-semibold text-orange-900">Version {{ currentVersion.versionNumber }}</span>
              <span :class="getVersionTypeBadgeClass(currentVersion.versionType)" class="px-2 py-1 text-xs font-semibold rounded">
                {{ currentVersion.versionType }}
              </span>
              <span v-if="currentVersion.versionLabel" class="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                {{ currentVersion.versionLabel }}
              </span>
            </div>
            <div class="text-sm text-orange-700">
              Last updated {{ formatRelativeTime(currentVersion.createdAt) }}
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="navigateToVersionHistory"
              class="inline-flex items-center gap-2 px-3 py-2 bg-white border border-orange-300 text-orange-700 hover:bg-orange-50 rounded-lg text-sm font-medium transition"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View History
            </button>
            <button
              @click="showCreateVersionDialog = true"
              class="inline-flex items-center gap-2 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Snapshot
            </button>
          </div>
        </div>
      </div>

      <!-- Preview/Edit Toggle -->
      <div v-if="form.title" class="mb-6 flex gap-4">
        <button
          type="button"
          @click="showPreview = false"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition',
            !showPreview
              ? 'bg-orange-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          Edit
        </button>
        <button
          type="button"
          @click="showPreview = true"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition',
            showPreview
              ? 'bg-orange-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          Preview
        </button>
      </div>

      <!-- Edit Form -->
      <form v-if="!showPreview && form.title" @submit.prevent="submitForm" class="bg-white shadow rounded-lg p-8">
        <!-- Title Field -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Story Title *
          </label>
          <input
            v-model="form.title"
            type="text"
            placeholder="Enter story title"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          />
          <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
        </div>

        <!-- Details Field -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Story Details *
          </label>
          <textarea
            v-model="form.details"
            placeholder="Enter story details"
            rows="10"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          ></textarea>
          <p v-if="errors.details" class="mt-1 text-sm text-red-600">{{ errors.details }}</p>
        </div>

        <!-- Categories Selection -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Categories
          </label>
          <div class="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-4">
            <div v-for="category in categories" :key="category.id" class="flex items-center">
              <input
                :id="`category-${category.id}`"
                type="checkbox"
                :value="category.id"
                v-model="form.categoryIds"
                class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label :for="`category-${category.id}`" class="ml-2 block text-sm text-gray-700">
                {{ category.name }}
              </label>
            </div>
          </div>
          <p v-if="categories.length === 0" class="mt-2 text-sm text-gray-500">No categories available</p>
        </div>

        <!-- Tags Selection -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div class="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-4">
            <div v-for="tag in tags" :key="tag.id" class="flex items-center">
              <input
                :id="`tag-${tag.id}`"
                type="checkbox"
                :value="tag.name"
                v-model="form.tags"
                class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label :for="`tag-${tag.id}`" class="ml-2 block text-sm text-gray-700">
                {{ tag.name }}
              </label>
            </div>
          </div>
          <p v-if="tags.length === 0" class="mt-2 text-sm text-gray-500">No tags available</p>
        </div>

        <!-- Type Selection -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Type *
          </label>
          <select
            v-model="form.type"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          >
            <option value="">Select a type</option>
            <option value="TIP_OFF">Tip Off</option>
            <option value="STORY">Story</option>
            <option value="REPORT">Report</option>
          </select>
          <p v-if="errors.type" class="mt-1 text-sm text-red-600">{{ errors.type }}</p>
        </div>

        <!-- Priority Selection -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Priority *
          </label>
          <select
            v-model="form.priority"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          >
            <option value="">Select a priority</option>
            <option value="LOW">Low</option>
            <option value="NORMAL">Normal</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
          <p v-if="errors.priority" class="mt-1 text-sm text-red-600">{{ errors.priority }}</p>
        </div>

        <!-- Status Selection -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            v-model="form.status"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>

        <!-- Main Image Management -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Main Image
          </label>
          <div class="border border-gray-300 rounded-lg p-4">
            <!-- Current Image Preview -->
            <div v-if="currentImage" class="mb-4">
              <p class="text-xs text-gray-600 mb-2">Current Image:</p>
              <div class="relative w-full max-w-md">
                <img
                  :src="currentImageUrl"
                  alt="Story main image"
                  class="w-full h-48 object-cover rounded-lg"
                />
              </div>
            </div>
            <div v-else class="mb-4 text-sm text-gray-500">
              No main image set
            </div>
            
            <!-- Image Manager Component -->
            <StoryImageManager
              :story-id="storyId"
              :story-title="form.title"
              :image="currentImage"
              @updated="handleImageUpdated"
              @error="handleImageError"
            />
          </div>
          <p v-if="imageError" class="mt-2 text-sm text-red-600">{{ imageError }}</p>
        </div>

        <!-- Form Actions -->
        <div class="flex gap-4">
          <button
            type="submit"
            :disabled="loading"
            class="px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-lg transition font-medium"
          >
            <span v-if="!loading">Update Story</span>
            <span v-else>Updating...</span>
          </button>
          <button
            type="button"
            @click="goBack"
            class="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition font-medium"
          >
            Cancel
          </button>
        </div>
      </form>

      <!-- Preview Section -->
      <div v-if="showPreview && form.title" class="bg-white shadow rounded-lg p-8">
        <div class="space-y-6">
          <!-- Preview Title -->
          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ form.title || 'Untitled Story' }}</h2>
            <div class="flex flex-wrap gap-2 mb-4">
              <span class="inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                {{ form.type || 'No Type' }}
              </span>
              <span class="inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                {{ form.priority || 'No Priority' }}
              </span>
              <span class="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {{ form.status }}
              </span>
            </div>
          </div>

          <!-- Preview Details -->
          <div>
            <h3 class="text-sm font-medium text-gray-700 mb-2">Details</h3>
            <div class="prose prose-sm max-w-none bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-gray-700">
              {{ form.details || 'No details provided' }}
            </div>
          </div>

          <!-- Preview Categories -->
          <div v-if="form.categoryIds.length > 0">
            <h3 class="text-sm font-medium text-gray-700 mb-2">Categories</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="categoryId in form.categoryIds"
                :key="categoryId"
                class="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
              >
                {{ getCategoryName(categoryId) }}
              </span>
            </div>
          </div>

          <!-- Preview Tags -->
          <div v-if="form.tags.length > 0">
            <h3 class="text-sm font-medium text-gray-700 mb-2">Tags</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in form.tags"
                :key="tag"
                class="inline-block px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Preview Actions -->
          <div class="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              @click="submitForm"
              :disabled="loading"
              class="px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-lg transition font-medium"
            >
              <span v-if="!loading">Update Story</span>
              <span v-else>Updating...</span>
            </button>
            <button
              type="button"
              @click="showPreview = false"
              class="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition font-medium"
            >
              Back to Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Create Version Dialog -->
  <CreateVersionDialog
    v-if="showCreateVersionDialog"
    :story-id="Number(storyId)"
    @close="showCreateVersionDialog = false"
    @created="onVersionCreated"
  />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storyService } from '../services/storyService'
import { categoryService } from '../services/categoryService'
import { tagService } from '../services/tagService'
import { useVersionStore } from '../stores/versionStore'
import { resolveAttachmentUrl } from '../utils/attachment'
import DashboardLayout from '../components/DashboardLayout.vue'
import CreateVersionDialog from '../components/versions/CreateVersionDialog.vue'
import StoryImageManager from '../components/StoryImageManager.vue'
import type { Version } from '../types/version'

interface Category {
  id: string
  name: string
}

interface Tag {
  id: number | string
  name: string
}

interface FormData {
  title: string
  details: string
  categoryIds: string[]
  tags: string[]
  type: string
  priority: string
  status: string
}

const router = useRouter()
const route = useRoute()
const versionStore = useVersionStore()

const form = ref<FormData>({
  title: '',
  details: '',
  categoryIds: [],
  tags: [],
  type: '',
  priority: '',
  status: 'DRAFT',
})

const categories = ref<Category[]>([])
const tags = ref<Tag[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const errors = ref<Record<string, string>>({})
const showPreview = ref(false)
const storyId = ref<string>('')
const currentImage = ref<any>(null)
const currentImageUrl = ref<string>('')
const imageError = ref<string | null>(null)

// Version-related state
const currentVersion = ref<Version | null>(null)
const showCreateVersionDialog = ref(false)

const getCategoryName = (categoryId: string) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category?.name || 'Unknown Category'
}

const fetchStory = async (id: string) => {
  try {
    loading.value = true
    const response = await storyService.getStoryById(id)
    const story = response.data.data || response.data

    form.value = {
      title: story.title || '',
      details: story.details || story.content || '',
      categoryIds: story.categoryIds || (story.categories ? story.categories.map((c: any) => c.id) : []),
      tags: story.tags || [],
      type: story.type || '',
      priority: story.priority || '',
      status: story.status || 'DRAFT',
    }

    // Store the current image
    currentImage.value = story.image || story.mainImage || null
    if (currentImage.value) {
      // Use the resolveAttachmentUrl utility to get the correct URL
      currentImageUrl.value = resolveAttachmentUrl(currentImage.value)
    } else {
      currentImageUrl.value = ''
    }
  } catch (err) {
    console.error('Error fetching story:', err)
    error.value = 'Failed to load story'
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  try {
    const response = await categoryService.getCategories(1, 100)
    let data = response.data
    
    if (data.data) {
      data = data.data
    }
    
    if (Array.isArray(data)) {
      categories.value = data
    } else if (data.categories) {
      categories.value = data.categories
    } else if (data.results) {
      categories.value = data.results
    } else if (data.items) {
      categories.value = data.items
    }
  } catch (err) {
    console.error('Error fetching categories:', err)
  }
}

const fetchTags = async () => {
  try {
    const response = await tagService.getTags(1, 100)
    let data = response.data
    
    if (data.data) {
      data = data.data
    }
    
    if (Array.isArray(data)) {
      tags.value = data
    } else if (data.tags) {
      tags.value = data.tags
    } else if (data.results) {
      tags.value = data.results
    } else if (data.items) {
      tags.value = data.items
    }
  } catch (err) {
    console.error('Error fetching tags:', err)
  }
}

const validateForm = () => {
  errors.value = {}
  
  if (!form.value.title.trim()) {
    errors.value.title = 'Title is required'
  }
  if (!form.value.details.trim()) {
    errors.value.details = 'Details are required'
  }
  if (!form.value.type) {
    errors.value.type = 'Type is required'
  }
  if (!form.value.priority) {
    errors.value.priority = 'Priority is required'
  }
  
  return Object.keys(errors.value).length === 0
}

const submitForm = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true
  error.value = null
  successMessage.value = null

  try {
    const storyData = {
      title: form.value.title,
      details: form.value.details,
      type: form.value.type,
      priority: form.value.priority,
      status: form.value.status,
      ...(form.value.categoryIds.length > 0 && { categoryIds: form.value.categoryIds }),
      ...(form.value.tags.length > 0 && { tags: form.value.tags }),
    }

    await storyService.updateStory(storyId.value, storyData)
    
    successMessage.value = 'Story updated successfully!'
    
    // Redirect to stories list after 1.5 seconds
    setTimeout(() => {
      router.push('/stories')
    }, 1500)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to update story'
    console.error('Error updating story:', err)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/stories')
}

const handleImageUpdated = async () => {
  // Reload the story to get the updated image
  imageError.value = null
  await fetchStory(storyId.value)
}

const handleImageError = (message: string | null) => {
  imageError.value = message
}

// Version-related methods
const loadCurrentVersion = async () => {
  if (!storyId.value) return
  
  await versionStore.fetchVersionHistory(Number(storyId.value), { limit: 1 })
  if (versionStore.versions.length > 0) {
    currentVersion.value = versionStore.versions[0]
  }
}

const navigateToVersionHistory = () => {
  router.push(`/stories/${storyId.value}/versions`)
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
  return date.toLocaleDateString()
}

const onVersionCreated = () => {
  showCreateVersionDialog.value = false
  loadCurrentVersion()
}

onMounted(() => {
  storyId.value = route.params.id as string
  if (storyId.value) {
    fetchStory(storyId.value)
    loadCurrentVersion()
  }
  fetchCategories()
  fetchTags()
})
</script>

<style scoped>
</style>
