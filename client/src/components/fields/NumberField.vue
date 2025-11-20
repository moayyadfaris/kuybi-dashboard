<script setup lang="ts">
import { computed } from 'vue';
import type { FieldDefinition } from '../../types/postTypes';

interface Props {
  field: FieldDefinition;
  modelValue: number | string;
  error?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: number | string];
}>();

const inputValue = computed({
  get: () => props.modelValue ?? '',
  set: (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    emit('update:modelValue', isNaN(numValue) ? '' : numValue);
  },
});

const hasError = computed(() => !!props.error);

const min = computed(() => props.field.validationRules?.min);
const max = computed(() => props.field.validationRules?.max);
</script>

<template>
  <div class="space-y-2">
    <!-- Label -->
    <label :for="field.name" class="block text-sm font-medium text-gray-700">
      {{ field.label }}
      <span v-if="field.isRequired" class="text-red-500">*</span>
    </label>

    <!-- Input -->
    <input
      :id="field.name"
      v-model="inputValue"
      type="number"
      :placeholder="field.placeholder"
      :required="field.isRequired"
      :min="min"
      :max="max"
      :class="[
        'w-full px-4 py-2 border rounded-lg outline-none transition',
        hasError
          ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'
          : 'border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
      ]"
    />

    <!-- Help Text -->
    <p v-if="field.helpText && !error" class="text-xs text-gray-500">
      {{ field.helpText }}
      <span v-if="min !== undefined || max !== undefined" class="ml-1">
        ({{ min !== undefined ? `Min: ${min}` : '' }}{{ min !== undefined && max !== undefined ? ', ' : '' }}{{ max !== undefined ? `Max: ${max}` : '' }})
      </span>
    </p>

    <!-- Error Message -->
    <p v-if="error" class="text-xs text-red-600">
      {{ error }}
    </p>
  </div>
</template>
