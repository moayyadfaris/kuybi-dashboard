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

const minLength = computed(() => props.field.validationRules?.min);
const maxLength = computed(() => props.field.validationRules?.max);
</script>

<template>
  <div class="space-y-2">
    <!-- Label -->
    <label :for="field.name" class="block text-sm font-medium text-gray-700">
      {{ field.label }}
      <span v-if="field.isRequired" class="text-red-500">*</span>
    </label>

    <!-- Textarea -->
    <textarea
      :id="field.name"
      v-model="inputValue"
      :placeholder="field.placeholder"
      :required="field.isRequired"
      :minlength="minLength"
      :maxlength="maxLength"
      rows="4"
      :class="[
        'w-full px-4 py-2 border rounded-lg outline-none transition resize-none',
        hasError
          ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'
          : 'border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
      ]"
    />

    <!-- Character count -->
    <div class="flex justify-between items-start">
      <div class="flex-1">
        <!-- Help Text -->
        <p v-if="field.helpText && !error" class="text-xs text-gray-500">
          {{ field.helpText }}
        </p>
        <!-- Error Message -->
        <p v-if="error" class="text-xs text-red-600">
          {{ error }}
        </p>
      </div>
      
      <!-- Character counter -->
      <p v-if="maxLength" class="text-xs text-gray-500 ml-2 flex-shrink-0">
        {{ inputValue.length }} / {{ maxLength }}
      </p>
    </div>
  </div>
</template>
