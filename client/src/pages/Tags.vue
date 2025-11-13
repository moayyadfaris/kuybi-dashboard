<template>
  <DashboardLayout>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-900">Tags</h1>
          <button
            @click="openCreateModal"
            class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition"
          >
            + Create Tag
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Search Bar -->
      <div class="mb-6">
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="Search tags..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p class="text-red-800">{{ error }}</p>
      </div>

      <!-- Tags Table -->
      <div v-if="!loading && tags.length > 0" class="bg-white shadow rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stories Count
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="tag in tags" :key="tag.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ tag.name }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-600">{{ tag.description || '-' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-600">{{ tag.storiesCount || 0 }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-600">{{ formatDate(tag.createdAt) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center gap-2">
                  <button
                    @click="editTag(tag)"
                    class="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg transition text-xs font-medium"
                    title="Edit tag"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    @click="deleteTag(tag.id)"
                    class="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition text-xs font-medium"
                    title="Delete tag"
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
      <div v-if="!loading && tags.length === 0" class="bg-white shadow rounded-lg p-12 text-center">
        <p class="text-gray-500 text-lg mb-4">No tags found</p>
        <button
          @click="openCreateModal"
          class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition"
        >
          Create First Tag
        </button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
        <h2 class="text-2xl font-bold mb-4">{{ isEditing ? 'Edit Tag' : 'Create Tag' }}</h2>

        <!-- Form -->
        <form @submit.prevent="submitForm">
          <!-- Name Field -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              v-model="formData.name"
              type="text"
              placeholder="Tag name"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
            <p v-if="formErrors.name" class="mt-1 text-sm text-red-600">{{ formErrors.name }}</p>
          </div>

          <!-- Description Field -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              v-model="formData.description"
              placeholder="Tag description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            ></textarea>
          </div>

          <!-- Form Actions -->
          <div class="flex gap-3">
            <button
              type="submit"
              :disabled="formLoading"
              class="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-lg transition"
            >
              {{ isEditing ? 'Update' : 'Create' }}
            </button>
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { tagService } from '../services/tagService'
import DashboardLayout from '../components/DashboardLayout.vue'

interface Tag {
  id: string | number
  name: string
  description?: string
  storiesCount?: number
  createdAt: string
}

interface FormData {
  name: string
  description: string
}

const tags = ref<Tag[]>([])
const loading = ref(false)
const formLoading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<string | number | null>(null)
const formErrors = ref<Record<string, string>>({})

const formData = ref<FormData>({
  name: '',
  description: '',
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const fetchTags = async () => {
  loading.value = true
  error.value = null
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
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load tags'
    console.error('Error fetching tags:', err)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  // Filter tags based on search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    tags.value = tags.value.filter(
      t => t.name.toLowerCase().includes(query) || 
           (t.description && t.description.toLowerCase().includes(query))
    )
  } else {
    // Reload all tags if search is cleared
    fetchTags()
  }
}

const openCreateModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.value = { name: '', description: '' }
  formErrors.value = {}
  showModal.value = true
}

const editTag = (tag: Tag) => {
  isEditing.value = true
  editingId.value = tag.id
  formData.value = {
    name: tag.name,
    description: tag.description || '',
  }
  formErrors.value = {}
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  formData.value = { name: '', description: '' }
  formErrors.value = {}
}

const validateForm = () => {
  formErrors.value = {}
  
  if (!formData.value.name.trim()) {
    formErrors.value.name = 'Name is required'
  }
  
  return Object.keys(formErrors.value).length === 0
}

const submitForm = async () => {
  if (!validateForm()) {
    return
  }

  formLoading.value = true
  error.value = null

  try {
    const payload = {
      name: formData.value.name,
      ...(formData.value.description && { description: formData.value.description }),
    }

    if (isEditing.value && editingId.value) {
      await tagService.updateTag(editingId.value as string, payload)
    } else {
      await tagService.createTag(payload)
    }

    closeModal()
    await fetchTags()
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to save tag'
    console.error('Error saving tag:', err)
  } finally {
    formLoading.value = false
  }
}

const deleteTag = async (id: string | number) => {
  if (!confirm('Are you sure you want to delete this tag?')) {
    return
  }

  loading.value = true
  error.value = null

  try {
    await tagService.deleteTag(id as string)
    await fetchTags()
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to delete tag'
    console.error('Error deleting tag:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTags()
})
</script>

<style scoped>
</style>
