<template>
  <div class="flex flex-col items-center">
    <div class="relative group w-24 h-24 mx-auto">
      <div
        class="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center text-4xl font-bold"
      >
        <img
          v-if="profileImageUrl"
          :src="profileImageUrl"
          alt="Profile image"
          class="w-full h-full object-cover"
        />
        <span v-else>{{ initials }}</span>
      </div>

      <div
        class="absolute inset-0 rounded-full bg-black bg-opacity-0 opacity-0 group-hover:opacity-100 group-hover:bg-opacity-50 transition flex flex-col items-center justify-center gap-2"
      >
        <button
          type="button"
          @click.stop="triggerFileDialog"
          class="w-16 px-2 py-1 bg-white/90 text-gray-900 text-xs font-medium rounded-full hover:bg-white"
        >
          Upload
        </button>
        <button
          type="button"
          @click.stop="openImagePicker"
          class="w-16 px-2 py-1 bg-white/90 text-gray-900 text-xs font-medium rounded-full hover:bg-white"
        >
          Library
        </button>
      </div>

      <div
        v-if="uploading"
        class="absolute inset-0 rounded-full bg-white/80 flex items-center justify-center text-orange-600"
      >
        <svg class="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
          />
        </svg>
      </div>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileChange"
    />

    <p v-if="uploadError" class="mt-3 text-sm text-red-600 text-center max-w-xs">{{ uploadError }}</p>

    <!-- Image Picker Modal -->
    <div
      v-if="showImagePicker"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-96 overflow-hidden flex flex-col">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-xl font-semibold text-gray-900">Select Profile Image</h3>
        </div>

        <div class="flex-1 overflow-y-auto p-6">
          <!-- Loading State -->
          <div v-if="loadingImages" class="flex justify-center items-center h-64">
            <div class="animate-spin">
              <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="imagePickerError" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-red-800 font-medium">{{ imagePickerError }}</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="mediaLibrary.length === 0" class="text-center py-12">
            <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <h3 class="text-lg font-medium text-gray-900">No media files</h3>
            <p class="text-gray-600 mt-1">Upload media files first to select as profile image</p>
          </div>

          <!-- Image Grid -->
          <div v-else class="grid grid-cols-3 gap-4">
            <div
              v-for="(attachment, index) in mediaLibrary"
              :key="attachment.id"
              @click="selectImage(attachment.id)"
              @dragstart="startDrag(index, $event)"
              @dragover.prevent="dragOverIndex = index"
              @dragleave="dragOverIndex = null"
              @drop.prevent="dropImage(index)"
              draggable="true"
              :class="[
                'relative cursor-move rounded-lg overflow-hidden border-2 transition',
                selectedImageId === attachment.id
                  ? 'border-orange-600 bg-orange-50'
                  : dragOverIndex === index
                  ? 'border-orange-400 bg-orange-100'
                  : 'border-gray-200 hover:border-orange-400'
              ]"
            >
              <img
                v-if="isImageType(attachment.mimeType)"
                :src="attachment.previewUrl || attachment.path"
                :alt="attachment.originalName"
                class="w-full h-24 object-cover"
              />
              <div v-else class="w-full h-24 bg-gray-100 flex items-center justify-center">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div
                v-if="selectedImageId === attachment.id"
                class="absolute inset-0 bg-orange-600 bg-opacity-20 flex items-center justify-center"
              >
                <svg class="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="px-6 py-4 border-t border-gray-200 flex gap-4">
          <button
            @click="confirmImageSelection"
            :disabled="!selectedImageId || selectingImage"
            class="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-lg transition font-medium"
          >
            {{ selectingImage ? 'Selecting...' : 'Select' }}
          </button>
          <button
            @click="closeImagePicker"
            class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { mediaService } from '../services/mediaService'
import { userService } from '../services/userService'

interface Attachment {
  id: string
  originalName: string
  path: string
  previewUrl?: string
  mimeType?: string
}

const props = defineProps<{
  user: Record<string, any> | null
}>()

const emit = defineEmits<{
  (event: 'updated'): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const uploadError = ref('')

const showImagePicker = ref(false)
const mediaLibrary = ref<Attachment[]>([])
const selectedImageId = ref<string | null>(null)
const loadingImages = ref(false)
const imagePickerError = ref('')
const selectingImage = ref(false)
const dragOverIndex = ref<number | null>(null)
const draggedIndex = ref<number | null>(null)

const initials = computed(() => {
  const name = props.user?.name as string | undefined
  if (!name) return 'U'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const profileImageUrl = computed(() => {
  const profile = props.user
  if (!profile) return ''

  const directUrl =
    profile.profileImageUrl ||
    profile.profileImagePath ||
    profile.avatarUrl ||
    profile.avatar ||
    profile.photoUrl
  if (directUrl) return directUrl

  const profileImage = profile.profileImage
  if (!profileImage) return ''
  if (typeof profileImage === 'string') return profileImage
  return profileImage.previewUrl || profileImage.url || profileImage.path || ''
})

const triggerFileDialog = () => {
  uploadError.value = ''
  if (uploading.value) return
  fileInput.value?.click()
}

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return
  const file = input.files[0]
  input.value = ''

  if (!file.type.startsWith('image/')) {
    uploadError.value = 'Please select an image file.'
    return
  }

  await uploadProfileImage(file)
}

const uploadProfileImage = async (file: File) => {
  try {
    uploading.value = true
    uploadError.value = ''

    const response = await mediaService.uploadAttachment(file)
    const payload = response.data?.data ?? response.data ?? response
    const attachmentId = resolveAttachmentId(payload)

    if (!attachmentId) {
      uploadError.value = 'Upload succeeded, but the attachment ID was not returned.'
      return
    }

    await userService.updateProfileImage(attachmentId)
    emit('updated')
  } catch (err: any) {
    uploadError.value = err.response?.data?.message || 'Failed to upload profile image.'
    console.error('Profile image upload error:', err)
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

const openImagePicker = () => {
  showImagePicker.value = true
  loadMediaLibrary()
}

const loadMediaLibrary = async () => {
  try {
    loadingImages.value = true
    imagePickerError.value = ''
    const response = await mediaService.getAttachments()
    // API response is nested: response.data.data.data
    const payload = response.data?.data?.data ?? response.data?.data ?? response.data ?? response
    mediaLibrary.value = payload.results || payload || []
    selectedImageId.value = null
  } catch (err: any) {
    imagePickerError.value = err.response?.data?.message || 'Failed to load media library'
    console.error('Media library load error:', err)
  } finally {
    loadingImages.value = false
  }
}

const selectImage = (attachmentId: string) => {
  selectedImageId.value = attachmentId
}

const confirmImageSelection = async () => {
  if (!selectedImageId.value) return
  try {
    selectingImage.value = true
    await userService.updateProfileImage(selectedImageId.value)
    emit('updated')
    closeImagePicker()
  } catch (err: any) {
    imagePickerError.value = err.response?.data?.message || 'Failed to update profile image'
    console.error('Profile image update error:', err)
  } finally {
    selectingImage.value = false
  }
}

const closeImagePicker = () => {
  showImagePicker.value = false
  selectedImageId.value = null
  mediaLibrary.value = []
  imagePickerError.value = ''
}

const isImageType = (mimeType?: string) => {
  if (!mimeType) return false
  return mimeType.startsWith('image/')
}

const startDrag = (index: number, event: DragEvent) => {
  draggedIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
  }
}

const dropImage = (dropIndex: number) => {
  if (draggedIndex.value === null || draggedIndex.value === dropIndex) {
    dragOverIndex.value = null
    draggedIndex.value = null
    return
  }
  const draggedItem = mediaLibrary.value[draggedIndex.value]
  mediaLibrary.value.splice(draggedIndex.value, 1)
  mediaLibrary.value.splice(dropIndex, 0, draggedItem)
  dragOverIndex.value = null
  draggedIndex.value = null
}
</script>

<style scoped>
</style>
