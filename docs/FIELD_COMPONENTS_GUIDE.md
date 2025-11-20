# Dynamic Field Components - Developer Guide

## Overview

The Dynamic Field Components system provides a flexible, reusable way to render form fields based on field definitions. This guide explains how to use existing field components and how to create new ones.

## Architecture

```
client/src/components/fields/
├── DynamicField.vue          # Main field renderer (smart component)
├── TextField.vue             # Text input field
├── NumberField.vue           # Number input field
├── TextareaField.vue         # Multi-line text field
├── DateField.vue             # Date picker field
├── SelectField.vue           # Dropdown select field
└── [25 total field types]    # Add more as needed
```

## Using Field Components

### 1. Single Field Usage

```vue
<script setup>
import TextField from '@/components/fields/TextField.vue';
import { ref } from 'vue';

const fieldDefinition = {
  name: 'post_title',
  label: 'Post Title',
  fieldType: 'text',
  placeholder: 'Enter title...',
  isRequired: true,
  helpText: 'The main title of your post'
};

const value = ref('');
const error = ref('');
</script>

<template>
  <TextField
    :field="fieldDefinition"
    v-model="value"
    :error="error"
  />
</template>
```

### 2. Dynamic Field Rendering

The `DynamicField` component automatically selects the correct field component:

```vue
<script setup>
import DynamicField from '@/components/fields/DynamicField.vue';
import { ref } from 'vue';

const fields = [
  { name: 'title', label: 'Title', fieldType: 'text', isRequired: true },
  { name: 'age', label: 'Age', fieldType: 'number', isRequired: false },
  { name: 'bio', label: 'Bio', fieldType: 'textarea', isRequired: false },
];

const formData = ref({});
const errors = ref({});
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <DynamicField
      v-for="field in fields"
      :key="field.name"
      :field="field"
      v-model="formData[field.name]"
      :error="errors[field.name]"
    />
    <button type="submit">Submit</button>
  </form>
</template>
```

### 3. Integration with Post Types Store

```vue
<script setup>
import { usePostTypesStore } from '@/stores/postTypesStore';
import DynamicField from '@/components/fields/DynamicField.vue';
import { ref, onMounted } from 'vue';

const store = usePostTypesStore();
const fields = computed(() => store.sortedFields);
const formData = ref({});

onMounted(async () => {
  await store.fetchFields('blog-post');
});
</script>

<template>
  <div class="space-y-4">
    <DynamicField
      v-for="field in fields"
      :key="field.id"
      :field="field"
      v-model="formData[field.name]"
    />
  </div>
</template>
```

## Field Component Interface

All field components follow the same interface:

### Props

```typescript
interface Props {
  field: FieldDefinition;      // Complete field definition
  modelValue: any;             // Current value (v-model)
  error?: string;              // Validation error message
}
```

### Emits

```typescript
const emit = defineEmits<{
  'update:modelValue': [value: any];  // v-model update
}>();
```

### Field Definition Structure

```typescript
interface FieldDefinition {
  id: string;
  name: string;                 // Unique field name (e.g., 'post_title')
  label: string;                // Display label (e.g., 'Post Title')
  fieldType: FieldType;         // Type of field
  description?: string;         // Admin description
  isRequired: boolean;          // Required validation
  defaultValue?: any;           // Default value
  placeholder?: string;         // Input placeholder
  helpText?: string;            // User-facing help text
  validationRules?: {           // Validation constraints
    min?: number;
    max?: number;
    pattern?: string;
    [key: string]: any;
  };
  fieldOptions?: {              // Field-specific options
    options?: string[];         // For select/radio/checkbox
    allowedTypes?: string;      // For file uploads
    maxSize?: number;           // For file uploads
    [key: string]: any;
  };
}
```

## Creating New Field Components

### Template for New Field Component

```vue
<script setup lang="ts">
import { computed } from 'vue';
import type { FieldDefinition } from '../../types/postTypes';

interface Props {
  field: FieldDefinition;
  modelValue: any;              // Adjust type as needed
  error?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: any];
}>();

const inputValue = computed({
  get: () => props.modelValue || '',
  set: (value: any) => emit('update:modelValue', value),
});

const hasError = computed(() => !!props.error);

// Add field-specific computed properties
// e.g., const options = computed(() => props.field.fieldOptions?.options);
</script>

<template>
  <div class="space-y-2">
    <!-- Label -->
    <label :for="field.name" class="block text-sm font-medium text-gray-700">
      {{ field.label }}
      <span v-if="field.isRequired" class="text-red-500">*</span>
    </label>

    <!-- Your Input Component Here -->
    <input
      :id="field.name"
      v-model="inputValue"
      :required="field.isRequired"
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
    </p>

    <!-- Error Message -->
    <p v-if="error" class="text-xs text-red-600">
      {{ error }}
    </p>
  </div>
</template>
```

### Steps to Add New Field Component

1. **Create Component File**
   ```bash
   touch client/src/components/fields/YourFieldType.vue
   ```

2. **Implement Component**
   - Follow the template above
   - Adjust `modelValue` type for your data type
   - Add field-specific logic

3. **Register in DynamicField.vue**
   ```typescript
   const fieldComponents: Record<string, any> = {
     // ... existing fields
     yourFieldType: defineAsyncComponent(() => import('./YourFieldType.vue')),
   };
   ```

4. **Update Field Type Registry** (if needed)
   ```typescript
   // client/src/types/fieldTypes.ts
   export const FIELD_TYPE_REGISTRY: Record<FieldType, FieldTypeMetadata> = {
     // ... existing types
     yourFieldType: {
       icon: '🎯',
       label: 'Your Field Type',
       category: 'Advanced',
       description: 'Description of your field type',
       validation: ['required', 'custom'],
     },
   };
   ```

## Available Field Components

### Basic Fields
- ✅ **TextField** - Single-line text input
- ✅ **TextareaField** - Multi-line text input
- ✅ **NumberField** - Number input with min/max
- ✅ **DateField** - Date picker

### Selection Fields
- ✅ **SelectField** - Dropdown select

### To Be Implemented (23 more)
- ⏳ EmailField
- ⏳ UrlField
- ⏳ TelField
- ⏳ CodeField
- ⏳ WysiwygField
- ⏳ CurrencyField
- ⏳ DateTimeField
- ⏳ TimeField
- ⏳ CheckboxField
- ⏳ RadioField
- ⏳ MultiSelectField
- ⏳ ToggleField
- ⏳ FileField
- ⏳ ImageField
- ⏳ GalleryField
- ⏳ VideoField
- ⏳ RelationField
- ⏳ UserField
- ⏳ TaxonomyField
- ⏳ ColorField
- ⏳ JsonField
- ⏳ RepeaterField
- ⏳ GroupField

## Validation

### Client-Side Validation

Field components respect validation rules from `field.validationRules`:

```typescript
const validationRules = {
  min: 0,              // Minimum value (number) or length (text)
  max: 100,            // Maximum value (number) or length (text)
  pattern: '^[A-Z]',   // Regex pattern
  minLength: 5,        // Minimum length (text)
  maxLength: 50,       // Maximum length (text)
};
```

### Example Validation Implementation

```vue
<script setup>
import { computed } from 'vue';

const props = defineProps<Props>();

const validate = () => {
  const rules = props.field.validationRules || {};
  const value = props.modelValue;

  if (props.field.isRequired && !value) {
    return 'This field is required';
  }

  if (rules.min !== undefined && value < rules.min) {
    return `Value must be at least ${rules.min}`;
  }

  if (rules.max !== undefined && value > rules.max) {
    return `Value must be at most ${rules.max}`;
  }

  if (rules.pattern) {
    const regex = new RegExp(rules.pattern);
    if (!regex.test(value)) {
      return 'Value does not match required pattern';
    }
  }

  return null;
};
</script>
```

## Styling Guidelines

All field components follow consistent styling:

- **Border**: `border-gray-300` (normal) / `border-red-500` (error)
- **Focus**: `focus:ring-2 focus:ring-orange-500 focus:border-orange-500`
- **Padding**: `px-4 py-2`
- **Border Radius**: `rounded-lg`
- **Label**: `text-sm font-medium text-gray-700`
- **Help Text**: `text-xs text-gray-500`
- **Error Text**: `text-xs text-red-600`

## Best Practices

1. **Always use v-model**: All components support two-way binding
2. **Type safety**: Use TypeScript interfaces for props
3. **Accessibility**: Include proper labels and ARIA attributes
4. **Error handling**: Display errors consistently
5. **Loading states**: Handle async operations gracefully
6. **Validation**: Implement both client and server-side validation
7. **Performance**: Use `defineAsyncComponent` for code splitting
8. **Testing**: Test with various field configurations

## Example: Complete Form with Validation

```vue
<script setup>
import { ref, computed } from 'vue';
import { usePostTypesStore } from '@/stores/postTypesStore';
import { usePostContentService } from '@/services/postContentService';
import DynamicField from '@/components/fields/DynamicField.vue';
import { validateField } from '@/types/fieldTypes';

const store = usePostTypesStore();
const contentService = usePostContentService();

const postTypeSlug = 'blog-post';
const fields = computed(() => store.sortedFields);
const formData = ref<Record<string, any>>({});
const errors = ref<Record<string, string>>({});
const loading = ref(false);

// Initialize form with default values
const initForm = () => {
  fields.value.forEach(field => {
    if (field.defaultValue) {
      formData.value[field.name] = field.defaultValue;
    }
  });
};

// Validate single field
const validateFieldValue = (field: FieldDefinition) => {
  const value = formData.value[field.name];
  const error = validateField(field, value);
  
  if (error) {
    errors.value[field.name] = error;
  } else {
    delete errors.value[field.name];
  }
  
  return !error;
};

// Validate all fields
const validateForm = () => {
  let isValid = true;
  
  fields.value.forEach(field => {
    if (!validateFieldValue(field)) {
      isValid = false;
    }
  });
  
  return isValid;
};

// Submit form
const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  
  try {
    await contentService.create({
      postTypeSlug,
      title: formData.value.title,
      slug: generateSlug(formData.value.title),
      status: 'draft',
      fieldData: formData.value,
    });
    
    // Success - redirect or show message
  } catch (err) {
    console.error('Failed to save:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await store.fetchFields(postTypeSlug);
  initForm();
});
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <DynamicField
      v-for="field in fields"
      :key="field.id"
      :field="field"
      v-model="formData[field.name]"
      :error="errors[field.name]"
      @blur="validateFieldValue(field)"
    />
    
    <button
      type="submit"
      :disabled="loading"
      class="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
    >
      {{ loading ? 'Saving...' : 'Save' }}
    </button>
  </form>
</template>
```

## Future Enhancements

- [ ] Add field group support
- [ ] Implement repeater fields
- [ ] Add conditional logic
- [ ] Support for custom validation functions
- [ ] Real-time validation
- [ ] Field dependencies
- [ ] Advanced file uploads with preview
- [ ] Rich text editor integration
- [ ] Accessibility improvements (WCAG 2.1 AA)
- [ ] Keyboard navigation
- [ ] Dark mode support

## Resources

- [Field Types Reference](../types/fieldTypes.ts)
- [Post Types Store](../stores/postTypesStore.ts)
- [Validation Utilities](../utils/postTypeUtils.ts)
- [Backend API Documentation](../../docs/POST_TYPES_FOUNDATION.md)
