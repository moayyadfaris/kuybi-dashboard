<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import type { FieldDefinition } from '../../types/postTypes';

interface Props {
  field: FieldDefinition;
  modelValue: any;
  error?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: any];
}>();

// Map field types to components
const fieldComponents: Record<string, any> = {
  text: defineAsyncComponent(() => import('./TextField.vue')),
  textarea: defineAsyncComponent(() => import('./TextareaField.vue')),
  number: defineAsyncComponent(() => import('./NumberField.vue')),
  select: defineAsyncComponent(() => import('./SelectField.vue')),
  date: defineAsyncComponent(() => import('./DateField.vue')),
  // Add more field types as they're implemented
  // email: defineAsyncComponent(() => import('./EmailField.vue')),
  // url: defineAsyncComponent(() => import('./UrlField.vue')),
  // checkbox: defineAsyncComponent(() => import('./CheckboxField.vue')),
  // radio: defineAsyncComponent(() => import('./RadioField.vue')),
  // ... etc
};

const fieldComponent = computed(() => {
  const component = fieldComponents[props.field.fieldType];
  if (!component) {
    console.warn(`No component found for field type: ${props.field.fieldType}. Using TextField as fallback.`);
    return fieldComponents.text;
  }
  return component;
});

const value = computed({
  get: () => props.modelValue,
  set: (newValue: any) => emit('update:modelValue', newValue),
});
</script>

<template>
  <component
    :is="fieldComponent"
    :field="field"
    v-model="value"
    :error="error"
  />
</template>
