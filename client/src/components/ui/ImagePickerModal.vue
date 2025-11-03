<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 class="text-xl font-semibold text-gray-900">{{ title }}</h3>
            <p v-if="subtitle" class="text-sm text-gray-600 mt-1">{{ subtitle }}</p>
          </div>
          <button
            type="button"
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 transition"
            aria-label="Close"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Current Selection Preview -->
        <div v-if="showCurrentImage" class="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div class="flex items-center gap-4">
            <div class="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center shrink-0">
              <img
                v-if="currentImageUrl"
                :src="currentImageUrl"
                alt="Current selection"
                class="w-full h-full object-cover"
              />
              <svg v-else class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">
                {{ currentImageUrl ? 'Current image' : 'No image selected' }}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                {{ currentImageUrl ? 'Select a new image below to replace' : 'Choose an image from the library' }}
              </p>
            </div>
            <button
              v-if="allowUpload"
              type="button"
              @click="$emit('upload')"
              :disabled="uploading"
              class="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-blue-400 text-white rounded-lg transition font-medium text-sm"
            >
              {{ uploading ? 'Uploading...' : 'Upload New' }}
            </button>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="px-6 pt-4">
          <div class="bg-red-50 border border-red-200 rounded-lg p-3">
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 overflow-y-auto p-6">
          <!-- Loading State -->
          <div v-if="loading" class="flex flex-col items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            <p class="mt-4 text-gray-600">Loading images...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="images.length === 0" class="text-center py-12">
            <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <h3 class="text-lg font-medium text-gray-900">No images available</h3>
            <p class="text-gray-600 mt-2">{{ emptyMessage }}</p>
            <button
              v-if="allowUpload"
              type="button"
              @click="$emit('upload')"
              class="mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition font-medium"
            >
              Upload First Image
            </button>
          </div>

          <!-- Image Grid -->
          <div v-else>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <div
                v-for="image in images"
                :key="image.id"
                @click="selectImage(image)"
                :class="[
                  'relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200',
                  isSelected(image.id) 
                    ? 'border-orange-600 ring-2 ring-blue-200 shadow-lg' 
                    : 'border-gray-200 hover:border-orange-400 hover:shadow-md'
                ]"
              >
                <!-- Image -->
                <div class="aspect-square bg-gray-100">
                  <img
                    v-if="image.url"
                    :src="image.url"
                    :alt="image.name || 'Image'"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                <!-- Selected Overlay -->
                <div
                  v-if="isSelected(image.id)"
                  class="absolute inset-0 bg-orange-600 bg-opacity-20 flex items-center justify-center"
                >
                  <div class="bg-orange-600 rounded-full p-2">
                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>

                <!-- Image Name -->
                <div v-if="image.name" class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                  <p class="text-white text-xs truncate">{{ image.name }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-3">
          <button
            type="button"
            @click="confirmSelection"
            :disabled="!selectedImage || submitting"
            class="flex-1 px-6 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition font-medium flex items-center justify-center gap-2"
          >
            <span v-if="submitting" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            {{ submitting ? 'Selecting...' : confirmButtonText }}
          </button>
          <button
            type="button"
            @click="closeModal"
            :disabled="submitting"
            class="px-6 py-2.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

export interface ImageItem {
  id: string
  url?: string
  name?: string
  [key: string]: any
}

interface Props {
  show: boolean
  title?: string
  subtitle?: string
  images: ImageItem[]
  currentImageUrl?: string | null
  loading?: boolean
  uploading?: boolean
  submitting?: boolean
  error?: string | null
  emptyMessage?: string
  confirmButtonText?: string
  allowUpload?: boolean
  showCurrentImage?: boolean
  modelValue?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Select Image',
  subtitle: '',
  currentImageUrl: null,
  loading: false,
  uploading: false,
  submitting: false,
  error: null,
  emptyMessage: 'Upload images to get started',
  confirmButtonText: 'Select Image',
  allowUpload: true,
  showCurrentImage: true,
  modelValue: null,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
  'close': []
  'confirm': [image: ImageItem]
  'upload': []
}>()

const selectedImage = ref<ImageItem | null>(null)

const isSelected = (imageId: string) => {
  return selectedImage.value?.id === imageId
}

const selectImage = (image: ImageItem) => {
  selectedImage.value = image
  emit('update:modelValue', image.id)
}

const confirmSelection = () => {
  if (selectedImage.value) {
    emit('confirm', selectedImage.value)
  }
}

const closeModal = () => {
  selectedImage.value = null
  emit('close')
}
</script>
