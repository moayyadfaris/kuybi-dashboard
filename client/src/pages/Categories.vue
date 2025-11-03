<template>
  <DashboardLayout>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-900">Categories</h1>
          <button
            @click="openCreateModal"
            class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition"
          >
            + Create Category
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
          placeholder="Search categories..."
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

      <!-- Categories Table -->
      <div v-if="!loading && categories.length > 0" class="bg-white shadow rounded-lg overflow-hidden">
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
            <tr v-for="category in categories" :key="category.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ category.name }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-600">{{ category.description || '-' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                  {{ category.storyCount || 0 }} 
                  {{ (category.storyCount || 0) === 1 ? 'story' : 'stories' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-600">{{ formatDate(category.createdAt) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="editCategory(category)"
                  class="text-green-600 hover:text-green-900 mr-4"
                >
                  Edit
                </button>
                <button
                  @click="deleteCategory(category.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && categories.length === 0" class="bg-white shadow rounded-lg p-12 text-center">
        <p class="text-gray-500 text-lg mb-4">No categories found</p>
        <button
          @click="openCreateModal"
          class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition"
        >
          Create First Category
        </button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
        <h2 class="text-2xl font-bold mb-4">{{ isEditing ? 'Edit Category' : 'Create Category' }}</h2>

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
              placeholder="Category name"
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
              placeholder="Category description"
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
import { categoryService } from '../services/categoryService'
import DashboardLayout from '../components/DashboardLayout.vue'

interface Category {
  id: string
  name: string
  description?: string
  storyCount?: number
  createdAt: string
}

interface FormData {
  name: string
  description: string
}

const categories = ref<Category[]>([])
const loading = ref(false)
const formLoading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<string | null>(null)
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

const fetchCategories = async () => {
  loading.value = true
  error.value = null
  try {
    // Request categories with story counts
    const response = await categoryService.getCategories(1, 100, true)
    console.log('Categories API Response:', response.data)
    
    let data = response.data

    // Handle nested response structure
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
    
    console.log('Loaded categories:', categories.value.length)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load categories'
    console.error('Error fetching categories:', err)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  // Filter categories based on search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    categories.value = categories.value.filter(
      c => c.name.toLowerCase().includes(query) || 
           (c.description && c.description.toLowerCase().includes(query))
    )
  } else {
    // Reload all categories if search is cleared
    fetchCategories()
  }
}

const openCreateModal = () => {
  isEditing.value = false
  editingId.value = null
  formData.value = { name: '', description: '' }
  formErrors.value = {}
  showModal.value = true
}

const editCategory = (category: Category) => {
  isEditing.value = true
  editingId.value = category.id
  formData.value = {
    name: category.name,
    description: category.description || '',
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
      await categoryService.updateCategory(editingId.value, payload)
    } else {
      await categoryService.createCategory(payload)
    }

    closeModal()
    await fetchCategories()
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to save category'
    console.error('Error saving category:', err)
  } finally {
    formLoading.value = false
  }
}

const deleteCategory = async (id: string) => {
  if (!confirm('Are you sure you want to delete this category?')) {
    return
  }

  loading.value = true
  error.value = null

  try {
    await categoryService.deleteCategory(id)
    await fetchCategories()
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to delete category'
    console.error('Error deleting category:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
</style>
