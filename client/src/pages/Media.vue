<template>
  <DashboardLayout>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">Media Library</h1>
        <button
          @click="showUploadModal = true"
          class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition font-medium text-sm"
        >
          Upload Media
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Search and Filter -->
      <div class="mb-6 flex gap-4">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search media files..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <select
          v-model="selectedFileType"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">All Files</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="document">Documents</option>
          <option value="audio">Audio</option>
        </select>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-4">
        <div class="flex justify-center items-center py-8">
          <div class="text-center">
            <div class="inline-flex items-center justify-center">
              <div class="relative w-16 h-16">
                <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-spin"></div>
                <div class="absolute inset-2 bg-white rounded-full"></div>
              </div>
            </div>
            <p class="mt-4 text-gray-600 font-medium">Loading media files...</p>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="bg-white rounded-lg shadow overflow-hidden">
            <div class="h-48 bg-gradient-to-r from-gray-200 to-gray-100 animate-pulse"></div>
            <div class="p-4 space-y-3">
              <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div class="h-3 bg-gray-100 rounded animate-pulse w-2/3"></div>
              <div class="flex gap-2 mt-4">
                <div class="flex-1 h-8 bg-gray-100 rounded animate-pulse"></div>
                <div class="flex-1 h-8 bg-gray-100 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p class="text-red-800 font-medium">{{ error }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredAttachments.length === 0" class="text-center py-12">
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900">No media files</h3>
        <p class="text-gray-600 mt-1">Upload your first media file to get started</p>
      </div>

      <!-- Media Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="attachment in filteredAttachments"
          :key="attachment.id"
          class="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition"
        >
          <!-- Preview -->
          <div class="bg-gray-100 h-48 flex items-center justify-center overflow-hidden">
            <img
              v-if="isImage(attachment)"
              :src="attachment.previewUrl || attachment.url"
              :alt="attachment.originalName"
              class="w-full h-full object-cover"
            />
            <div v-else class="text-center">
              <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  v-if="isVideo(attachment)"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <circle v-if="isVideo(attachment)" cx="12" cy="12" r="9" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                <path
                  v-else-if="isDocument(attachment)"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
                <path
                  v-else
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19V6a2 2 0 012-2h6a2 2 0 012 2v13m-6 0H7a2 2 0 01-2-2v-2.586a1 1 0 00-.293-.707l-2.414-2.414A1 1 0 004.586 8H3a2 2 0 00-2 2v7a2 2 0 002 2h1m8-4l2 2m0 0l2-2m-2 2v-6m-6 6H7m6 0h1"
                />
              </svg>
              <p class="text-xs text-gray-600 mt-2">{{ getFileType(attachment) }}</p>
            </div>
          </div>

          <!-- Info -->
          <div class="p-4">
            <h3 class="font-medium text-gray-900 truncate" :title="attachment.originalName">
              {{ attachment.originalName }}
            </h3>
            <p class="text-xs text-gray-600 mt-1">{{ formatFileSize(attachment.size) }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ formatDate(attachment.createdAt) }}</p>

            <!-- Actions -->
            <div class="flex gap-2 mt-4">
              <a
                :href="attachment.url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center justify-center gap-1 flex-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-medium transition"
                title="View file"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View
              </a>
              <button
                @click="deleteAttachment(attachment.id)"
                class="inline-flex items-center justify-center gap-1 flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-medium transition"
                title="Delete file"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8 flex justify-center items-center gap-2">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>
        <span class="text-gray-600">Page {{ currentPage }} of {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Upload Modal -->
    <div v-if="showUploadModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-xl font-semibold text-gray-900">Upload Media</h3>
        </div>

        <form @submit.prevent="uploadFiles" class="px-6 py-6 space-y-4">
          <!-- File Input -->
          <div>
            <label for="fileInput" class="block text-sm font-medium text-gray-700 mb-2">
              Select Files
            </label>
            <div
              @click="fileInput?.click()"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
              :class="[
                'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition',
                isDragging ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-gray-400'
              ]"
            >
              <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p class="text-sm text-gray-600">
                <span class="font-medium text-orange-600">Click to upload</span> or drag and drop
              </p>
              <p class="text-xs text-gray-500 mt-1">PNG, JPG, PDF, MP4, etc.</p>
            </div>
            <input
              ref="fileInput"
              type="file"
              multiple
              class="hidden"
              @change="handleFileSelect"
            />
          </div>

          <!-- Selected Files List -->
          <div v-if="selectedFiles.length > 0" class="bg-gray-50 rounded-lg p-4">
            <p class="text-sm font-medium text-gray-700 mb-2">Selected Files ({{ selectedFiles.length }})</p>
            <ul class="space-y-1">
              <li v-for="(file, index) in selectedFiles" :key="index" class="text-xs text-gray-600 flex justify-between">
                <span class="truncate">{{ file.name }}</span>
                <button
                  type="button"
                  @click="removeFile(index)"
                  class="text-red-600 hover:text-red-700"
                >
                  ×
                </button>
              </li>
            </ul>
          </div>

          <!-- Error Message -->
          <div v-if="uploadError" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-red-800 text-sm">{{ uploadError }}</p>
          </div>

          <!-- Upload Progress -->
          <div v-if="uploadProgress > 0 && uploadProgress < 100" class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-orange-600 h-2 rounded-full transition-all"
              :style="{ width: uploadProgress + '%' }"
            />
          </div>

          <!-- Modal Actions -->
          <div class="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              :disabled="selectedFiles.length === 0 || uploading"
              class="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-lg transition font-medium"
            >
              {{ uploading ? `Uploading... ${uploadProgress}%` : 'Upload' }}
            </button>
            <button
              type="button"
              @click="closeUploadModal"
              class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition font-medium"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { mediaService } from '../services/mediaService'
import DashboardLayout from '../components/DashboardLayout.vue'

interface Attachment {
  id: string
  userId: string
  path: string
  mimeType: string
  size: number
  originalName: string
  category?: string
  isPublic: boolean
  isEncrypted: boolean
  encryptionKey?: string
  securityStatus: string
  checksum: string
  downloadCount: number
  lastAccessedAt?: string
  folder?: string
  description?: string
  tags: string[]
  metadata?: any
  scanResults?: any
  containsPII: boolean
  retentionPeriod?: string
  expiresAt?: string
  deletionScheduledAt?: string
  thumbnailPath?: string
  version: number
  createdAt: string
  updatedAt: string
  deletedAt?: string
  user?: any
  url: string
  downloadUrl: string
  previewUrl?: string
}

// Data
const attachments = ref<Attachment[]>([])
const loading = ref(true)
const error = ref('')

// Search and filter
const searchQuery = ref('')
const selectedFileType = ref('')
const selectedCategory = ref('')
const isPublicFilter = ref<boolean | null>(null)
const minSize = ref<number | null>(null)
const maxSize = ref<number | null>(null)
const sortBy = ref('createdAt')
const sortOrder = ref('DESC')
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = 20

// Upload
const showUploadModal = ref(false)
const selectedFiles = ref<File[]>([])
const uploading = ref(false)
const uploadProgress = ref(0)
const uploadError = ref('')
const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

// Helper functions
const isImage = (attachment: Attachment) => {
  return attachment?.mimeType?.startsWith('image/') || false
}

const isVideo = (attachment: Attachment) => {
  return attachment?.mimeType?.startsWith('video/') || false
}

const isDocument = (attachment: Attachment) => {
  const docTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  return docTypes.includes(attachment?.mimeType || '') || false
}

const getFileType = (attachment: Attachment) => {
  if (isImage(attachment)) return 'Image'
  if (isVideo(attachment)) return 'Video'
  if (isDocument(attachment)) return 'Document'
  return 'File'
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const filteredAttachments = computed(() => {
  return attachments.value.filter((attachment) => {
    const fileName = attachment.originalName || attachment.path || ''
    const matchesSearch = fileName.toLowerCase().includes(searchQuery.value.toLowerCase())
    const fileType = getFileType(attachment) || ''
    const matchesType = !selectedFileType.value || fileType.toLowerCase() === selectedFileType.value.toLowerCase()
    return matchesSearch && matchesType
  })
})

// Load attachments
const loadAttachments = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const filters: any = {}
    if (selectedCategory.value) filters.category = selectedCategory.value
    if (selectedFileType.value) filters.mimeType = selectedFileType.value
    if (isPublicFilter.value !== null) filters.isPublic = isPublicFilter.value
    if (minSize.value) filters.minSize = minSize.value
    if (maxSize.value) filters.maxSize = maxSize.value
    if (sortBy.value) filters.sortBy = sortBy.value
    if (sortOrder.value) filters.sortOrder = sortOrder.value
    
    const response = await mediaService.getAttachments(currentPage.value, pageSize, filters)
    console.log('Media API Response:', response.data)
    
    // Handle nested response structure: response.data.data.data
    const payload = response.data?.data?.data || response.data?.data || response.data
    
    if (Array.isArray(payload)) {
      attachments.value = payload
      // Get pagination info from response.data.data if available
      const paginationData = response.data?.data
      totalPages.value = paginationData?.totalPages || Math.ceil((paginationData?.total || payload.length) / pageSize)
      console.log('Loaded attachments:', payload.length, 'Total pages:', totalPages.value)
    } else {
      error.value = 'Unexpected response format'
      console.error('Unexpected response format:', response.data)
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load media files'
    console.error('Media load error:', err)
  } finally {
    loading.value = false
  }
}

// Handle file selection
const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    selectedFiles.value = Array.from(input.files)
  }
}

// Handle drag and drop
const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files) {
    selectedFiles.value = Array.from(event.dataTransfer.files)
  }
}

// Remove file from selection
const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1)
}

// Upload files
const uploadFiles = async () => {
  try {
    uploadError.value = ''
    uploading.value = true
    uploadProgress.value = 0

    // Simulate progress
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += Math.random() * 30
      }
    }, 200)

    await mediaService.uploadAttachments(selectedFiles.value)

    clearInterval(progressInterval)
    uploadProgress.value = 100

    // Reload attachments
    selectedFiles.value = []
    closeUploadModal()
    await loadAttachments()
  } catch (err: any) {
    uploadError.value = err.response?.data?.message || 'Failed to upload files'
    console.error('Upload error:', err)
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

// Delete attachment
const deleteAttachment = async (id: string) => {
  if (!confirm('Are you sure you want to delete this file?')) return

  try {
    await mediaService.deleteAttachment(id)
    await loadAttachments()
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to delete file'
    console.error('Delete error:', err)
  }
}

// Pagination
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadAttachments()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadAttachments()
  }
}

// Close upload modal
const closeUploadModal = () => {
  showUploadModal.value = false
  selectedFiles.value = []
  uploadError.value = ''
  uploadProgress.value = 0
}

// Load attachments on mount
onMounted(() => {
  loadAttachments()
})
</script>

<style scoped>
</style>
