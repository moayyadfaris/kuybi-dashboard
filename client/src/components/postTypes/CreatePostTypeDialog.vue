<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">
          {{ isEditing ? 'Edit Post Type' : 'Create Post Type' }}
        </h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <form @submit.prevent="handleSubmit" class="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        <!-- Name -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Name <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Event, Product, Recipe"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
            :disabled="isEditing && postType?.isSystem"
          />
          <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
        </div>

        <!-- Slug (auto-generated) -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Slug <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.slug"
            type="text"
            placeholder="event, product, recipe"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50"
            required
            :readonly="slugAutoGenerate"
          />
          <div class="mt-1 flex items-center justify-between">
            <p class="text-xs text-gray-500">URL-friendly identifier</p>
            <label class="flex items-center gap-2 text-xs text-gray-600">
              <input
                v-model="slugAutoGenerate"
                type="checkbox"
                class="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              Auto-generate
            </label>
          </div>
          <p v-if="errors.slug" class="mt-1 text-sm text-red-600">{{ errors.slug }}</p>
        </div>

        <!-- Singular & Plural Labels -->
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Singular Label <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.singularLabel"
              type="text"
              placeholder="Event"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Plural Label <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.pluralLabel"
              type="text"
              placeholder="Events"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <!-- Description -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            v-model="form.description"
            rows="3"
            placeholder="Describe what this post type is used for..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          ></textarea>
        </div>

        <!-- Icon -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Icon (Emoji)
          </label>
          <input
            v-model="form.icon"
            type="text"
            placeholder="📦 🎉 📝"
            maxlength="2"
            class="w-20 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center text-2xl"
          />
        </div>

        <!-- Settings -->
        <div class="border-t border-gray-200 pt-4 mb-4">
          <h4 class="text-sm font-semibold text-gray-900 mb-3">Settings</h4>
          
          <div class="space-y-3">
            <label class="flex items-center gap-3">
              <input
                v-model="form.isHierarchical"
                type="checkbox"
                class="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <div>
                <div class="text-sm font-medium text-gray-900">Hierarchical</div>
                <div class="text-xs text-gray-500">Supports parent-child relationships</div>
              </div>
            </label>

            <label class="flex items-center gap-3">
              <input
                v-model="form.supportsComments"
                type="checkbox"
                class="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <div>
                <div class="text-sm font-medium text-gray-900">Comments</div>
                <div class="text-xs text-gray-500">Enable comments on content</div>
              </div>
            </label>

            <label class="flex items-center gap-3">
              <input
                v-model="form.supportsRevisions"
                type="checkbox"
                class="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <div>
                <div class="text-sm font-medium text-gray-900">Revisions</div>
                <div class="text-xs text-gray-500">Track content changes history</div>
              </div>
            </label>

            <label class="flex items-center gap-3">
              <input
                v-model="form.showInRest"
                type="checkbox"
                class="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <div>
                <div class="text-sm font-medium text-gray-900">REST API</div>
                <div class="text-xs text-gray-500">Expose in REST API</div>
              </div>
            </label>
          </div>
        </div>

        <!-- REST Base (if API enabled) -->
        <div v-if="form.showInRest" class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            REST API Base
          </label>
          <input
            v-model="form.restBase"
            type="text"
            placeholder="events"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <p class="mt-1 text-xs text-gray-500">API endpoint: /api/content/{restBase}</p>
        </div>
      </form>

      <!-- Actions -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
        <button
          @click="$emit('close')"
          type="button"
          class="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition font-medium"
        >
          Cancel
        </button>
        <button
          @click="handleSubmit"
          :disabled="submitting"
          class="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-lg transition font-medium"
        >
          {{ submitting ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { usePostTypesStore } from '../../stores/postTypesStore'
import { generateSlug } from '../../utils/postTypeUtils'
import type { PostType } from '../../types/postTypes'

interface Props {
  postType?: PostType | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  created: [postType: PostType]
  updated: [postType: PostType]
}>()

const store = usePostTypesStore()

const isEditing = computed(() => !!props.postType)

// Form state
const form = ref({
  name: props.postType?.name || '',
  slug: props.postType?.slug || '',
  singularLabel: props.postType?.singularLabel || '',
  pluralLabel: props.postType?.pluralLabel || '',
  description: props.postType?.description || '',
  icon: props.postType?.icon || '',
  isHierarchical: props.postType?.isHierarchical || false,
  supportsComments: props.postType?.supportsComments || false,
  supportsRevisions: props.postType?.supportsRevisions || true,
  showInRest: props.postType?.showInRest ?? true,
  restBase: props.postType?.restBase || '',
  settings: props.postType?.settings || {
    hasExcerpt: true,
    hasFeaturedImage: true,
    taxonomies: ['tags', 'categories'],
    menuPosition: 5,
    showInMenu: true,
    publiclyQueryable: true
  }
})

const slugAutoGenerate = ref(!isEditing.value)
const submitting = ref(false)
const errors = ref<Record<string, string>>({})

// Auto-generate slug from name
watch(() => form.value.name, (newName) => {
  if (slugAutoGenerate.value) {
    form.value.slug = generateSlug(newName)
  }
  if (!form.value.singularLabel) {
    form.value.singularLabel = newName
  }
  if (!form.value.pluralLabel && newName) {
    form.value.pluralLabel = newName + 's'
  }
})

// Auto-set REST base from slug
watch(() => form.value.slug, (newSlug) => {
  if (!form.value.restBase || form.value.restBase === props.postType?.slug) {
    form.value.restBase = newSlug
  }
})

// Validation
const validate = (): boolean => {
  errors.value = {}

  if (!form.value.name.trim()) {
    errors.value.name = 'Name is required'
  }
  if (!form.value.slug.trim()) {
    errors.value.slug = 'Slug is required'
  } else if (!/^[a-z0-9-]+$/.test(form.value.slug)) {
    errors.value.slug = 'Slug must be lowercase letters, numbers, and hyphens only'
  }
  if (!form.value.singularLabel.trim()) {
    errors.value.singularLabel = 'Singular label is required'
  }
  if (!form.value.pluralLabel.trim()) {
    errors.value.pluralLabel = 'Plural label is required'
  }

  return Object.keys(errors.value).length === 0
}

// Submit
const handleSubmit = async () => {
  if (!validate()) return

  submitting.value = true

  try {
    const token = localStorage.getItem('access_token') || undefined
    
    console.log('Token from localStorage:', token ? 'EXISTS' : 'MISSING')
    console.log('Token length:', token?.length || 0)

    if (isEditing.value && props.postType) {
      const updated = await store.updatePostType(
        props.postType.id,
        {
          name: form.value.name,
          singularLabel: form.value.singularLabel,
          pluralLabel: form.value.pluralLabel,
          description: form.value.description || undefined,
          icon: form.value.icon || undefined,
          isHierarchical: form.value.isHierarchical,
          supportsComments: form.value.supportsComments,
          supportsRevisions: form.value.supportsRevisions,
          showInRest: form.value.showInRest
        },
        token
      )
      emit('updated', updated)
    } else {
      const created = await store.createPostType(
        {
          name: form.value.name,
          slug: form.value.slug,
          singularLabel: form.value.singularLabel,
          pluralLabel: form.value.pluralLabel,
          description: form.value.description || undefined,
          icon: form.value.icon || undefined,
          menuIcon: form.value.icon || undefined,
          isHierarchical: form.value.isHierarchical,
          supportsComments: form.value.supportsComments,
          supportsRevisions: form.value.supportsRevisions,
          showInRest: form.value.showInRest,
          restBase: form.value.restBase,
          settings: form.value.settings
        },
        token
      )
      emit('created', created)
    }
  } catch (err: any) {
    errors.value.submit = err.message || 'Failed to save post type'
  } finally {
    submitting.value = false
  }
}
</script>
