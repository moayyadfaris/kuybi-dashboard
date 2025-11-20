<script setup lang="ts">
import { computed } from 'vue';
import type { FieldDefinition } from '../../types/postTypes';

interface Props {
  field: FieldDefinition;
  modelValue: string;
  error?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const inputValue = computed({
  get: () => props.modelValue || '',
  set: (value: string) => emit('update:modelValue', value),
});

const hasError = computed(() => !!props.error);

const options = computed(() => {
  return (props.field.fieldOptions?.options as string[]) || [];
});
</script>

<template>
  <div class="space-y-2">
    <!-- Label -->
    <label :for="field.name" class="block text-sm font-medium text-gray-700">
      {{ field.label }}
      <span v-if="field.isRequired" class="text-red-500">*</span>
    </label>

    <!-- Select -->
    <select
      :id="field.name"
      v-model="inputValue"
      :required="field.isRequired"
      :class="[
        'w-full px-4 py-2 border rounded-lg outline-none transition',
        hasError
          ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'
          : 'border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
      ]"
    >
      <option value="" disabled>{{ field.placeholder || 'Select an option' }}</option>
      <option v-for="option in options" :key="option" :value="option">
        {{ option }}
      </option>
    </select>

    <!-- Help Text -->
    <p v-if="field.helpText && !error" class="text-xs text-gray-500">
      {{ field.helpText }}
    </p>

    <!-- Error Message -->
    <p v-if="error" class="text-xs text-red-600">
      {{ error }}
    </p>
  </div>
</template>
