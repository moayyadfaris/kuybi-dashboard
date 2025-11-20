<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { usePostTypesStore } from '../../stores/postTypesStore';
import type { FieldDefinition, FieldType } from '../../types/postTypes';
import { FIELD_TYPE_REGISTRY } from '../../types/fieldTypes';
import { generateSlug } from '../../utils/postTypeUtils';

interface Props {
  field?: FieldDefinition | null;
  postTypeId: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  saved: [];
}>();

const store = usePostTypesStore();

// Form state
const formData = ref({
  name: '',
  label: '',
  fieldType: 'text' as FieldType,
  description: '',
  isRequired: false,
  defaultValue: '',
  placeholder: '',
  helpText: '',
  validationRules: {} as Record<string, any>,
  fieldOptions: {} as Record<string, any>,
});

const loading = ref(false);
const error = ref('');

// Field type options grouped by category
const fieldTypesByCategory = computed(() => {
  const categories: Record<string, Array<{ value: FieldType; label: string; icon: string }>> = {};
  
  Object.entries(FIELD_TYPE_REGISTRY).forEach(([type, meta]) => {
    if (!categories[meta.category]) {
      categories[meta.category] = [];
    }
    categories[meta.category].push({
      value: type as FieldType,
      label: meta.label,
      icon: meta.icon,
    });
  });
  
  return categories;
});

const currentFieldMeta = computed(() => {
  return FIELD_TYPE_REGISTRY[formData.value.fieldType];
});

// Initialize form with existing field data
if (props.field) {
  formData.value = {
    name: props.field.name,
    label: props.field.label,
    fieldType: props.field.fieldType,
    description: props.field.description || '',
    isRequired: props.field.isRequired,
    defaultValue: props.field.defaultValue || '',
    placeholder: props.field.placeholder || '',
    helpText: props.field.helpText || '',
    validationRules: props.field.validationRules ? { ...props.field.validationRules } : {},
    fieldOptions: props.field.fieldOptions ? { ...props.field.fieldOptions } : {},
  };
}

// Auto-generate name from label
watch(() => formData.value.label, (newLabel) => {
  if (!props.field && newLabel) {
    formData.value.name = generateSlug(newLabel);
  }
});

// Validation
const validate = (): boolean => {
  if (!formData.value.label.trim()) {
    error.value = 'Label is required';
    return false;
  }
  if (!formData.value.name.trim()) {
    error.value = 'Name is required';
    return false;
  }
  if (!/^[a-z0-9_]+$/.test(formData.value.name)) {
    error.value = 'Name must contain only lowercase letters, numbers, and underscores';
    return false;
  }
  error.value = '';
  return true;
};

// Submit
const handleSubmit = async () => {
  if (!validate()) return;

  loading.value = true;
  error.value = '';

  try {
    const fieldData = {
      name: formData.value.name,
      label: formData.value.label,
      fieldType: formData.value.fieldType,
      description: formData.value.description || undefined,
      isRequired: formData.value.isRequired,
      defaultValue: formData.value.defaultValue || undefined,
      placeholder: formData.value.placeholder || undefined,
      helpText: formData.value.helpText || undefined,
      validationRules: Object.keys(formData.value.validationRules).length > 0 ? formData.value.validationRules : undefined,
      fieldOptions: Object.keys(formData.value.fieldOptions).length > 0 ? formData.value.fieldOptions : undefined,
    };

    if (props.field) {
      await store.updateField(props.postTypeId, props.field.id, fieldData);
    } else {
      await store.createField(props.postTypeId, fieldData);
    }

    emit('saved');
  } catch (err: any) {
    error.value = err.message || 'Failed to save field';
  } finally {
    loading.value = false;
  }
};

// Field type specific options
const showMinMaxOptions = computed(() => {
  return ['number', 'currency', 'textarea'].includes(formData.value.fieldType);
});

const showPatternOption = computed(() => {
  return ['text', 'email', 'url', 'tel'].includes(formData.value.fieldType);
});

const showOptionsField = computed(() => {
  return ['select', 'radio', 'checkbox', 'multiselect'].includes(formData.value.fieldType);
});

const showFileOptions = computed(() => {
  return ['file', 'image', 'gallery', 'video'].includes(formData.value.fieldType);
});

// Options management for select/radio/checkbox fields
const optionsList = ref<string[]>(['']);

const addOption = () => {
  optionsList.value.push('');
};

const removeOption = (index: number) => {
  optionsList.value.splice(index, 1);
};

watch(optionsList, (newOptions) => {
  const filtered = newOptions.filter(opt => opt.trim() !== '');
  if (filtered.length > 0) {
    formData.value.fieldOptions.options = filtered;
  } else {
    delete formData.value.fieldOptions.options;
  }
}, { deep: true });

// Initialize options if editing
if (props.field?.fieldOptions?.options) {
  optionsList.value = [...props.field.fieldOptions.options as string[]];
  if (optionsList.value.length === 0) {
    optionsList.value = [''];
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-900">
          {{ field ? 'Edit Field' : 'Add New Field' }}
        </h2>
        <button
          @click="emit('close')"
          class="text-gray-400 hover:text-gray-600 transition"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {{ error }}
        </div>

        <!-- Basic Info -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Label <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.label"
              type="text"
              placeholder="e.g., Post Title"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Field Name <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.name"
              type="text"
              placeholder="e.g., post_title"
              :disabled="!!field"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            />
            <p class="text-xs text-gray-500 mt-1">
              {{ field ? 'Field name cannot be changed after creation' : 'Auto-generated from label. Use lowercase letters, numbers, and underscores only.' }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Field Type <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.fieldType"
              :disabled="!!field"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <optgroup v-for="(fields, category) in fieldTypesByCategory" :key="category" :label="category">
                <option v-for="fieldType in fields" :key="fieldType.value" :value="fieldType.value">
                  {{ fieldType.icon }} {{ fieldType.label }}
                </option>
              </optgroup>
            </select>
            <p class="text-xs text-gray-500 mt-1">
              {{ field ? 'Field type cannot be changed after creation' : 'Choose the appropriate field type for your data' }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              v-model="formData.description"
              rows="2"
              placeholder="Brief description of this field"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition resize-none"
            />
          </div>
        </div>

        <!-- Field Configuration -->
        <div class="border-t pt-6 space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span class="text-2xl">{{ currentFieldMeta.icon }}</span>
            {{ currentFieldMeta.label }} Configuration
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Placeholder</label>
              <input
                v-model="formData.placeholder"
                type="text"
                placeholder="e.g., Enter your text here..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Default Value</label>
              <input
                v-model="formData.defaultValue"
                type="text"
                placeholder="Default value"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Help Text</label>
            <input
              v-model="formData.helpText"
              type="text"
              placeholder="Additional guidance for users"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
            />
          </div>

          <!-- Options for select/radio/checkbox -->
          <div v-if="showOptionsField" class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Options <span class="text-red-500">*</span></label>
            <div v-for="(option, index) in optionsList" :key="index" class="flex gap-2">
              <input
                v-model="optionsList[index]"
                type="text"
                :placeholder="`Option ${index + 1}`"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
              />
              <button
                v-if="optionsList.length > 1"
                type="button"
                @click="removeOption(index)"
                class="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <button
              type="button"
              @click="addOption"
              class="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              + Add Option
            </button>
          </div>

          <!-- Min/Max for number fields -->
          <div v-if="showMinMaxOptions" class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Minimum</label>
              <input
                v-model.number="formData.validationRules.min"
                type="number"
                placeholder="Min value"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Maximum</label>
              <input
                v-model.number="formData.validationRules.max"
                type="number"
                placeholder="Max value"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
              />
            </div>
          </div>

          <!-- Pattern for text fields -->
          <div v-if="showPatternOption">
            <label class="block text-sm font-medium text-gray-700 mb-2">Validation Pattern (Regex)</label>
            <input
              v-model="formData.validationRules.pattern"
              type="text"
              placeholder="e.g., ^[A-Za-z]+$"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
            />
          </div>

          <!-- File type options -->
          <div v-if="showFileOptions" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Allowed File Types</label>
              <input
                v-model="formData.fieldOptions.allowedTypes"
                type="text"
                placeholder="e.g., image/jpeg,image/png,application/pdf"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
              />
              <p class="text-xs text-gray-500 mt-1">Comma-separated MIME types</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Max File Size (MB)</label>
              <input
                v-model.number="formData.fieldOptions.maxSize"
                type="number"
                placeholder="e.g., 5"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
              />
            </div>
          </div>

          <!-- Required checkbox -->
          <div class="flex items-center">
            <input
              id="required"
              v-model="formData.isRequired"
              type="checkbox"
              class="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <label for="required" class="ml-2 text-sm text-gray-700">
              This field is required
            </label>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 border-t pt-6">
          <button
            type="button"
            @click="emit('close')"
            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {{ loading ? 'Saving...' : field ? 'Update Field' : 'Create Field' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
