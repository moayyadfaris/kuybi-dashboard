<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePostTypesStore } from '../stores/postTypesStore';
import type { FieldDefinition } from '../types/postTypes';
import { FIELD_TYPE_REGISTRY } from '../types/fieldTypes';
import CreateFieldDialog from '../components/postTypes/CreateFieldDialog.vue';
import * as LucideIcons from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const store = usePostTypesStore();

const slug = computed(() => route.params.slug as string);
const postType = computed(() => store.currentPostType);
const postTypeId = computed(() => postType.value?.id || '');
const fields = computed(() => store.sortedFields);
const loading = ref(true);
const error = ref<string | null>(null);

// Dialog state
const showCreateDialog = ref(false);
const editingField = ref<FieldDefinition | null>(null);

// Drag and drop state
const draggedIndex = ref<number | null>(null);

onMounted(async () => {
  try {
    loading.value = true;
    error.value = null;
    await store.fetchPostTypeBySlug(slug.value);
    if (postTypeId.value) {
      await store.fetchFields(postTypeId.value);
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load post type';
  } finally {
    loading.value = false;
  }
});

// Drag handlers
const handleDragStart = (index: number) => {
  draggedIndex.value = index;
};

const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
};

const handleDrop = async (dropIndex: number) => {
  if (draggedIndex.value === null || draggedIndex.value === dropIndex) {
    draggedIndex.value = null;
    return;
  }

  const reorderedFields = [...fields.value];
  const [draggedField] = reorderedFields.splice(draggedIndex.value, 1);
  reorderedFields.splice(dropIndex, 0, draggedField);

  // Update order values
  const fieldOrders = reorderedFields.map((field, index) => ({
    id: field.id,
    displayOrder: index,
  }));

  try {
    if (postTypeId.value) {
      await store.reorderFields(postTypeId.value, { fieldOrders });
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to reorder fields';
  }

  draggedIndex.value = null;
};

const handleDragEnd = () => {
  draggedIndex.value = null;
};

// Field actions
const createField = () => {
  editingField.value = null;
  showCreateDialog.value = true;
};

const editField = (field: FieldDefinition) => {
  editingField.value = field;
  showCreateDialog.value = true;
};

const deleteField = async (fieldId: string) => {
  if (!confirm('Are you sure you want to delete this field? This action cannot be undone.')) {
    return;
  }

  try {
    if (postTypeId.value) {
      await store.deleteField(postTypeId.value, fieldId);
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to delete field';
  }
};

const goBack = () => {
  router.push('/post-types');
};

const getFieldTypeInfo = (type: string) => {
  return FIELD_TYPE_REGISTRY[type as keyof typeof FIELD_TYPE_REGISTRY] || { icon: '📝', label: type, category: 'Basic' };
};

// Convert icon name to PascalCase for Lucide component
const getIconComponent = (iconName: string) => {
  // Convert kebab-case to PascalCase (e.g., 'align-left' -> 'AlignLeft')
  const pascalCase = iconName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  
  return (LucideIcons as any)[pascalCase] || LucideIcons.FileText;
};
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <button
        @click="goBack"
        class="flex items-center text-gray-600 hover:text-orange-600 mb-4 transition"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Post Types
      </button>

      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">
            {{ postType?.singularLabel || 'Post Type' }} Fields
          </h1>
          <p class="text-gray-600 mt-1">
            Manage custom fields for {{ postType?.name || 'this post type' }}
          </p>
        </div>
        <button
          @click="createField"
          class="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition shadow-md hover:shadow-lg"
        >
          + Add Field
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-600 mb-4">{{ error }}</div>
      <button
        @click="router.push('/post-types')"
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
      >
        Go Back
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="fields.length === 0" class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No Fields Yet</h3>
      <p class="text-gray-600 mb-4">
        Get started by creating your first custom field.
      </p>
      <button
        @click="createField"
        class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
      >
        Add First Field
      </button>
    </div>

    <!-- Fields List -->
    <div v-else class="space-y-3">
      <div
        v-for="(field, index) in fields"
        :key="field.id"
        draggable="true"
        @dragstart="handleDragStart(index)"
        @dragover="handleDragOver"
        @drop="handleDrop(index)"
        @dragend="handleDragEnd"
        :class="[
          'bg-white rounded-lg border-2 p-4 transition cursor-move',
          draggedIndex === index ? 'opacity-50 border-orange-400' : 'border-gray-200 hover:border-orange-300'
        ]"
      >
        <div class="flex items-start">
          <!-- Drag Handle -->
          <div class="mr-4 text-gray-400 mt-1">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 2a2 2 0 10.001 4.001A2 2 0 007 2zm0 6a2 2 0 10.001 4.001A2 2 0 007 8zm0 6a2 2 0 10.001 4.001A2 2 0 007 14zm6-8a2 2 0 10-.001-4.001A2 2 0 0013 6zm0 2a2 2 0 10.001 4.001A2 2 0 0013 8zm0 6a2 2 0 10.001 4.001A2 2 0 0013 14z" />
            </svg>
          </div>

          <!-- Field Info -->
          <div class="flex-1">
            <div class="flex items-center mb-2">
              <component 
                :is="getIconComponent(getFieldTypeInfo(field.fieldType).icon)" 
                class="w-6 h-6 mr-3 text-orange-600"
              />
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ field.label }}
                  <span v-if="field.isRequired" class="text-red-500 ml-1">*</span>
                </h3>
                <p class="text-sm text-gray-600">{{ field.name }}</p>
              </div>
            </div>

            <div v-if="field.description" class="text-sm text-gray-600 mb-3">
              {{ field.description }}
            </div>

            <div class="flex flex-wrap gap-2">
              <span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {{ getFieldTypeInfo(field.fieldType).label }}
              </span>
              <span v-if="field.isRequired" class="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                Required
              </span>
              <span v-if="field.defaultValue" class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                Has Default
              </span>
              <span v-if="field.validationRules && Object.keys(field.validationRules).length > 0" class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                Validated
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2 ml-4">
            <button
              @click="editField(field)"
              class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
              title="Edit field"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="deleteField(field.id)"
              class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              title="Delete field"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Info Box -->
    <div v-if="fields.length > 0" class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div class="flex">
        <svg class="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        <div class="text-sm text-blue-800">
          <strong>Tip:</strong> Drag and drop fields to reorder them. The order here determines how they appear in the editor.
        </div>
      </div>
    </div>

    <!-- Create/Edit Field Dialog -->
    <CreateFieldDialog
      v-if="showCreateDialog && postTypeId"
      :field="editingField"
      :post-type-id="postTypeId"
      @close="showCreateDialog = false"
      @saved="showCreateDialog = false"
    />
  </div>
</template>
