<template>
  <DashboardLayout>
    <div class="p-6 max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <router-link to="/post-types" class="hover:text-orange-600">Post Types</router-link>
          <span>/</span>
          <router-link :to="`/post-types/${slug}/content`" class="hover:text-orange-600">
            {{ postType?.name || 'Content' }}
          </router-link>
          <span>/</span>
          <span class="text-gray-900 font-medium">Edit</span>
        </div>
        
        <h1 class="text-3xl font-bold text-gray-900">Edit {{ postType?.singularLabel || 'Content' }}</h1>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>

    <!-- Form -->
    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Basic Fields -->
      <div class="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
        
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Title <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.title"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Enter title"
          />
        </div>

        <!-- Excerpt -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
          <textarea
            v-model="formData.excerpt"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Brief description..."
          ></textarea>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            v-model="formData.status"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option :value="ContentStatus.DRAFT">Draft</option>
            <option :value="ContentStatus.PUBLISHED">Published</option>
            <option :value="ContentStatus.SCHEDULED">Scheduled</option>
            <option :value="ContentStatus.PENDING_REVIEW">Pending Review</option>
            <option :value="ContentStatus.ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      <!-- Dynamic Fields -->
      <div v-if="fields.length > 0" class="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ postType?.name }} Fields</h2>
        
        <div v-for="field in fields" :key="field.id" class="space-y-2">
          <!-- Dynamic Field Component -->
          <DynamicField
            :field="field"
            :model-value="formData.fieldData[field.name]"
            @update:model-value="formData.fieldData[field.name] = $event"
          />
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3">
        <button
          type="button"
          @click="router.back()"
          class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="submitting"
          class="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ submitting ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </form>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostContentStore } from '../stores/postContentStore'
import { usePostTypesStore } from '../stores/postTypesStore'
import type { FieldDefinition, UpdateContentDto } from '../types/postTypes'
import { ContentStatus } from '../types/postTypes'
import DynamicField from '../components/fields/DynamicField.vue'
import DashboardLayout from '../components/DashboardLayout.vue'

const route = useRoute()
const router = useRouter()
const contentStore = usePostContentStore()
const postTypesStore = usePostTypesStore()

// Route params
const slug = computed(() => route.params.slug as string)
const contentId = computed(() => route.params.id as string)

// State
const postType = ref<any>(null)
const fields = ref<FieldDefinition[]>([])
const loading = ref(true)
const submitting = ref(false)
const formData = ref<{
  title: string
  excerpt?: string
  status: ContentStatus
  fieldData: Record<string, any>
}>({
  title: '',
  excerpt: '',
  status: ContentStatus.DRAFT,
  fieldData: {}
})

/**
 * Fetch data
 */
const fetchData = async () => {
  try {
    loading.value = true
    
    // Fetch post type
    postType.value = await postTypesStore.fetchPostTypeBySlug(slug.value)
    
    // Fetch fields
    if (postType.value?.id) {
      await postTypesStore.fetchFields(postType.value.id)
      fields.value = postTypesStore.sortedFields
    }
    
    // Fetch content
    const content = await contentStore.getById(slug.value, contentId.value)
    
    // Populate form
    formData.value = {
      title: content.title,
      excerpt: content.excerpt || '',
      status: content.status,
      fieldData: content.field_data || {}
    }
  } catch (error) {
    console.error('Failed to fetch data:', error)
    alert('Failed to load content')
    router.back()
  } finally {
    loading.value = false
  }
}

/**
 * Handle form submission
 */
const handleSubmit = async () => {
  try {
    submitting.value = true

    const dto: UpdateContentDto = {
      title: formData.value.title,
      excerpt: formData.value.excerpt || undefined,
      status: formData.value.status,
      field_data: formData.value.fieldData
    }

    await contentStore.update(slug.value, contentId.value, dto)
    
    // Navigate back to content list
    router.push(`/post-types/${slug.value}/content`)
  } catch (error: any) {
    console.error('Failed to update content:', error)
    alert(error.message || 'Failed to update content')
  } finally {
    submitting.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchData()
})
</script>
