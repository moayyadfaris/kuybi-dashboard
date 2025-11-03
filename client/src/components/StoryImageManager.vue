<template>
  <div class="inline-flex items-center gap-2">
    <button
      type="button"
      @click="openModal"
      class="text-purple-600 hover:text-purple-800 font-medium"
      title="Manage main image"
    >
      Image
    </button>
    <button
      type="button"
      @click="clearImage"
      :disabled="clearing || !hasImage"
      class="text-orange-600 hover:text-orange-900 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      title="Clear main image"
    >
      Clear
    </button>

    <!-- Hidden File Input -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileChange"
    />

    <!-- Image Picker Modal -->
    <ImagePickerModal
      :show="showModal"
      :title="`Manage Main Image${storyTitle ? ' – ' + storyTitle : ''}`"
      subtitle="Select or upload an image to set as the story's main image"
      :images="formattedImages"
      :current-image-url="imageUrl"
      :loading="loadingImages"
      :uploading="uploading"
      :submitting="selectingImage"
      :error="error"
      empty-message="Upload images to your media library to select as story image"
      confirm-button-text="Set as Main Image"
      :allow-upload="true"
      :show-current-image="true"
      @close="closeModal"
      @confirm="handleImageConfirm"
      @upload="triggerFileDialog"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { mediaService } from '../services/mediaService'
import { storyService } from '../services/storyService'
import { resolveAttachmentUrl } from '../utils/attachment'
import ImagePickerModal, { type ImageItem } from './ui/ImagePickerModal.vue'

interface Attachment {
  id: string
  originalName: string
  path: string
  previewUrl?: string
  mimeType?: string
}

const props = defineProps<{
  storyId: string | number
  storyTitle?: string
  image?: Record<string, any> | string | null
}>()

const emit = defineEmits<{
  (event: 'updated'): void
  (event: 'error', message: string | null): void
}>()

const showModal = ref(false)
const uploading = ref(false)
const clearing = ref(false)
const error = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const mediaLibrary = ref<Attachment[]>([])
const loadingImages = ref(false)
const selectingImage = ref(false)

const imageUrl = computed(() => {
  const img = props.image
  if (typeof img === 'string') return img
  return resolveAttachmentUrl(img)
})

const hasImage = computed(() => !!imageUrl.value)

const storyTitle = computed(() => props.storyTitle || '')

const formattedImages = computed<ImageItem[]>(() => {
  return mediaLibrary.value
    .filter(item => isImageType(item.mimeType))
    .map(item => ({
      id: item.id,
      url: resolveAttachmentUrl(item),
      name: item.originalName,
    }))
})

const triggerFileDialog = () => {
  error.value = null
  if (uploading.value) return
  fileInput.value?.click()
}

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return
  const file = input.files[0]
  input.value = ''

  if (!file.type.startsWith('image/')) {
    error.value = 'Please select an image file.'
    return
  }

  await uploadImage(file)
}

const uploadImage = async (file: File) => {
  try {
    uploading.value = true
    error.value = null

    const response = await mediaService.uploadAttachment(file)
    const payload = response.data?.data ?? response.data ?? response
    const attachmentId = resolveAttachmentId(payload)

    if (!attachmentId) {
      error.value = 'Upload succeeded, but the attachment ID was not returned.'
      return
    }

    await storyService.setMainImage(String(props.storyId), attachmentId)
    await finishWithRefresh()
  } catch (err: any) {
    const message = err.response?.data?.message || 'Failed to upload and set main image.'
    error.value = message
    emit('error', message)
    console.error('Story image upload error:', err)
  } finally {
    uploading.value = false
  }
}

const resolveAttachmentId = (payload: any): string | null => {
  if (!payload) return null
  if (typeof payload === 'string') return payload
  if (payload.id) return payload.id
  if (payload.attachmentId) return payload.attachmentId
  if (payload.attachment?.id) return payload.attachment.id
  if (payload.data) return resolveAttachmentId(payload.data)
  if (Array.isArray(payload)) return resolveAttachmentId(payload[0])
  return null
}

const openModal = () => {
  showModal.value = true
  loadMediaLibrary()
}

const closeModal = () => {
  showModal.value = false
  error.value = null
  mediaLibrary.value = []
}

const loadMediaLibrary = async () => {
  try {
    loadingImages.value = true
    error.value = null
    
    // Fetch all attachments with a higher limit to show more images
    const response = await mediaService.getAttachments(1, 100)
    console.log('Media library response:', response.data)
    
    // Handle nested response structure: response.data.data.data
    const payload = response.data?.data?.data || response.data?.data || response.data
    const attachments = Array.isArray(payload) ? payload : []
    
    // Filter to only show image attachments
    mediaLibrary.value = attachments.filter((item: Attachment) => 
      isImageType(item.mimeType)
    )
    
    console.log('Loaded images:', mediaLibrary.value.length, 'out of', attachments.length, 'total attachments')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load media library'
    console.error('Media library load error:', err)
  } finally {
    loadingImages.value = false
  }
}

const handleImageConfirm = async (image: ImageItem) => {
  try {
    selectingImage.value = true
    error.value = null
    await storyService.setMainImage(String(props.storyId), image.id)
    await finishWithRefresh()
  } catch (err: any) {
    const message = err.response?.data?.message || 'Failed to set story image'
    error.value = message
    emit('error', message)
    console.error('Set story image error:', err)
  } finally {
    selectingImage.value = false
  }
}

const finishWithRefresh = async () => {
  emit('error', null)
  emit('updated')
  closeModal()
}

const clearImage = async () => {
  if (!hasImage.value) return
  if (!confirm('Are you sure you want to remove the main image from this story?')) {
    return
  }
  try {
    clearing.value = true
    await storyService.removeMainImage(String(props.storyId))
    emit('error', null)
    emit('updated')
    closeModal()
  } catch (err: any) {
    const message = err.response?.data?.message || 'Failed to remove story image.'
    error.value = message
    emit('error', message)
    console.error('Remove story image error:', err)
  } finally {
    clearing.value = false
  }
}

const isImageType = (mimeType?: string) => {
  if (!mimeType) return false
  return mimeType.startsWith('image/')
}
</script>
