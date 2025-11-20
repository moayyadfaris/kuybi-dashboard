/**
 * Field Types Utilities and Helpers
 * Based on: Dynamic Post Types - Frontend Integration Guide v1.0.0
 */

import { FieldType, type FieldDefinition, type ValidationRules } from './postTypes'

/**
 * Field Type Metadata
 * Describes each field type with icon, category, and description
 */
export interface FieldTypeMetadata {
  type: FieldType
  label: string
  icon: string
  category: 'text' | 'number' | 'date' | 'choice' | 'media' | 'relation' | 'advanced'
  description: string
  supportsValidation: boolean
  supportsOptions: boolean
}

/**
 * Field Type Registry
 * Complete metadata for all 25 field types
 */
export const FIELD_TYPE_REGISTRY: Record<FieldType, FieldTypeMetadata> = {
  // Text Fields
  [FieldType.TEXT]: {
    type: FieldType.TEXT,
    label: 'Text',
    icon: 'text',
    category: 'text',
    description: 'Short text input (single line)',
    supportsValidation: true,
    supportsOptions: true
  },
  [FieldType.TEXTAREA]: {
    type: FieldType.TEXTAREA,
    label: 'Textarea',
    icon: 'align-left',
    category: 'text',
    description: 'Multi-line text input',
    supportsValidation: true,
    supportsOptions: true
  },
  [FieldType.WYSIWYG]: {
    type: FieldType.WYSIWYG,
    label: 'WYSIWYG Editor',
    icon: 'file-text',
    category: 'text',
    description: 'Rich text editor with formatting',
    supportsValidation: false,
    supportsOptions: true
  },
  [FieldType.EMAIL]: {
    type: FieldType.EMAIL,
    label: 'Email',
    icon: 'mail',
    category: 'text',
    description: 'Email address with validation',
    supportsValidation: true,
    supportsOptions: true
  },
  [FieldType.URL]: {
    type: FieldType.URL,
    label: 'URL',
    icon: 'link',
    category: 'text',
    description: 'Web address with validation',
    supportsValidation: true,
    supportsOptions: true
  },
  [FieldType.TEL]: {
    type: FieldType.TEL,
    label: 'Phone',
    icon: 'phone',
    category: 'text',
    description: 'Phone number with validation',
    supportsValidation: true,
    supportsOptions: true
  },
  [FieldType.CODE]: {
    type: FieldType.CODE,
    label: 'Code',
    icon: 'code',
    category: 'text',
    description: 'Code editor with syntax highlighting',
    supportsValidation: false,
    supportsOptions: true
  },
  
  // Number Fields
  [FieldType.NUMBER]: {
    type: FieldType.NUMBER,
    label: 'Number',
    icon: 'hash',
    category: 'number',
    description: 'Integer or decimal number',
    supportsValidation: true,
    supportsOptions: true
  },
  [FieldType.CURRENCY]: {
    type: FieldType.CURRENCY,
    label: 'Currency',
    icon: 'dollar-sign',
    category: 'number',
    description: 'Money with currency symbol',
    supportsValidation: true,
    supportsOptions: true
  },
  
  // Date/Time Fields
  [FieldType.DATE]: {
    type: FieldType.DATE,
    label: 'Date',
    icon: 'calendar',
    category: 'date',
    description: 'Date picker',
    supportsValidation: true,
    supportsOptions: true
  },
  [FieldType.DATETIME]: {
    type: FieldType.DATETIME,
    label: 'Date & Time',
    icon: 'clock',
    category: 'date',
    description: 'Date and time picker',
    supportsValidation: true,
    supportsOptions: true
  },
  [FieldType.TIME]: {
    type: FieldType.TIME,
    label: 'Time',
    icon: 'watch',
    category: 'date',
    description: 'Time picker',
    supportsValidation: true,
    supportsOptions: true
  },
  
  // Choice Fields
  [FieldType.CHECKBOX]: {
    type: FieldType.CHECKBOX,
    label: 'Checkbox',
    icon: 'check-square',
    category: 'choice',
    description: 'True/false checkbox',
    supportsValidation: false,
    supportsOptions: false
  },
  [FieldType.RADIO]: {
    type: FieldType.RADIO,
    label: 'Radio',
    icon: 'circle',
    category: 'choice',
    description: 'Single choice from options',
    supportsValidation: false,
    supportsOptions: true
  },
  [FieldType.SELECT]: {
    type: FieldType.SELECT,
    label: 'Select',
    icon: 'chevron-down',
    category: 'choice',
    description: 'Dropdown selection',
    supportsValidation: false,
    supportsOptions: true
  },
  [FieldType.MULTISELECT]: {
    type: FieldType.MULTISELECT,
    label: 'Multi-Select',
    icon: 'list',
    category: 'choice',
    description: 'Multiple choice selection',
    supportsValidation: false,
    supportsOptions: true
  },
  [FieldType.TOGGLE]: {
    type: FieldType.TOGGLE,
    label: 'Toggle',
    icon: 'toggle-right',
    category: 'choice',
    description: 'On/off switch',
    supportsValidation: false,
    supportsOptions: false
  },
  
  // Media Fields
  [FieldType.FILE]: {
    type: FieldType.FILE,
    label: 'File Upload',
    icon: 'file',
    category: 'media',
    description: 'Upload any file type',
    supportsValidation: true,
    supportsOptions: true
  },
  [FieldType.IMAGE]: {
    type: FieldType.IMAGE,
    label: 'Image',
    icon: 'image',
    category: 'media',
    description: 'Image upload with preview',
    supportsValidation: true,
    supportsOptions: true
  },
  [FieldType.GALLERY]: {
    type: FieldType.GALLERY,
    label: 'Gallery',
    icon: 'images',
    category: 'media',
    description: 'Multiple image uploads',
    supportsValidation: true,
    supportsOptions: true
  },
  [FieldType.VIDEO]: {
    type: FieldType.VIDEO,
    label: 'Video',
    icon: 'video',
    category: 'media',
    description: 'Video upload or embed',
    supportsValidation: true,
    supportsOptions: true
  },
  
  // Relational Fields
  [FieldType.RELATION]: {
    type: FieldType.RELATION,
    label: 'Relation',
    icon: 'link-2',
    category: 'relation',
    description: 'Link to other content',
    supportsValidation: false,
    supportsOptions: true
  },
  [FieldType.USER]: {
    type: FieldType.USER,
    label: 'User',
    icon: 'user',
    category: 'relation',
    description: 'Link to users',
    supportsValidation: false,
    supportsOptions: true
  },
  [FieldType.TAXONOMY]: {
    type: FieldType.TAXONOMY,
    label: 'Taxonomy',
    icon: 'tag',
    category: 'relation',
    description: 'Link to categories/tags',
    supportsValidation: false,
    supportsOptions: true
  },
  
  // Advanced Fields
  [FieldType.COLOR]: {
    type: FieldType.COLOR,
    label: 'Color',
    icon: 'droplet',
    category: 'advanced',
    description: 'Color picker',
    supportsValidation: false,
    supportsOptions: true
  },
  [FieldType.JSON]: {
    type: FieldType.JSON,
    label: 'JSON',
    icon: 'braces',
    category: 'advanced',
    description: 'Raw JSON data editor',
    supportsValidation: false,
    supportsOptions: false
  },
  [FieldType.REPEATER]: {
    type: FieldType.REPEATER,
    label: 'Repeater',
    icon: 'repeat',
    category: 'advanced',
    description: 'Repeating sub-fields (Phase 2)',
    supportsValidation: false,
    supportsOptions: true
  },
  [FieldType.GROUP]: {
    type: FieldType.GROUP,
    label: 'Group',
    icon: 'folder',
    category: 'advanced',
    description: 'Field group (Phase 2)',
    supportsValidation: false,
    supportsOptions: true
  }
}

/**
 * Get field types by category
 */
export const getFieldTypesByCategory = (category: string): FieldTypeMetadata[] => {
  return Object.values(FIELD_TYPE_REGISTRY).filter(field => field.category === category)
}

/**
 * Get all field type categories
 */
export const FIELD_CATEGORIES = [
  { value: 'text', label: 'Text Fields' },
  { value: 'number', label: 'Number Fields' },
  { value: 'date', label: 'Date/Time Fields' },
  { value: 'choice', label: 'Choice Fields' },
  { value: 'media', label: 'Media Fields' },
  { value: 'relation', label: 'Relational Fields' },
  { value: 'advanced', label: 'Advanced Fields' }
]

/**
 * Field Component Mapping
 * Maps field types to Vue component names
 */
export const FIELD_COMPONENT_MAP: Record<FieldType, string> = {
  [FieldType.TEXT]: 'TextField',
  [FieldType.TEXTAREA]: 'TextareaField',
  [FieldType.WYSIWYG]: 'WysiwygField',
  [FieldType.EMAIL]: 'EmailField',
  [FieldType.URL]: 'UrlField',
  [FieldType.TEL]: 'TelField',
  [FieldType.CODE]: 'CodeField',
  [FieldType.NUMBER]: 'NumberField',
  [FieldType.CURRENCY]: 'CurrencyField',
  [FieldType.DATE]: 'DateField',
  [FieldType.DATETIME]: 'DateTimeField',
  [FieldType.TIME]: 'TimeField',
  [FieldType.CHECKBOX]: 'CheckboxField',
  [FieldType.RADIO]: 'RadioField',
  [FieldType.SELECT]: 'SelectField',
  [FieldType.MULTISELECT]: 'MultiSelectField',
  [FieldType.TOGGLE]: 'ToggleField',
  [FieldType.FILE]: 'FileField',
  [FieldType.IMAGE]: 'ImageField',
  [FieldType.GALLERY]: 'GalleryField',
  [FieldType.VIDEO]: 'VideoField',
  [FieldType.RELATION]: 'RelationField',
  [FieldType.USER]: 'UserField',
  [FieldType.TAXONOMY]: 'TaxonomyField',
  [FieldType.COLOR]: 'ColorField',
  [FieldType.JSON]: 'JsonField',
  [FieldType.REPEATER]: 'RepeaterField',
  [FieldType.GROUP]: 'GroupField'
}

/**
 * Validation Function
 * Client-side validation matching backend rules
 */
export const validateField = (field: FieldDefinition, value: any): string | null => {
  // Required validation
  if (field.isRequired && !value) {
    return `${field.label} is required`
  }

  // Skip validation if no value and not required
  if (!value) return null

  const rules = field.validationRules || {}

  // Text field validation
  if (field.fieldType === FieldType.TEXT || field.fieldType === FieldType.TEXTAREA) {
    const strValue = String(value)
    
    if (rules.minLength && strValue.length < rules.minLength) {
      return `${field.label} must be at least ${rules.minLength} characters`
    }
    if (rules.maxLength && strValue.length > rules.maxLength) {
      return `${field.label} must not exceed ${rules.maxLength} characters`
    }
    if (rules.pattern && !new RegExp(rules.pattern).test(strValue)) {
      return `${field.label} format is invalid`
    }
  }

  // Email validation
  if (field.fieldType === FieldType.EMAIL) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(String(value))) {
      return `${field.label} must be a valid email address`
    }
  }

  // URL validation
  if (field.fieldType === FieldType.URL) {
    try {
      new URL(String(value))
    } catch {
      return `${field.label} must be a valid URL`
    }
  }

  // Number validation
  if (field.fieldType === FieldType.NUMBER || field.fieldType === FieldType.CURRENCY) {
    const numValue = Number(value)
    
    if (isNaN(numValue)) {
      return `${field.label} must be a valid number`
    }
    if (rules.min !== undefined && numValue < rules.min) {
      return `${field.label} must be at least ${rules.min}`
    }
    if (rules.max !== undefined && numValue > rules.max) {
      return `${field.label} must not exceed ${rules.max}`
    }
  }

  // Date validation
  if (field.fieldType === FieldType.DATE || field.fieldType === FieldType.DATETIME) {
    const dateValue = new Date(value)
    
    if (isNaN(dateValue.getTime())) {
      return `${field.label} must be a valid date`
    }
    if (rules.min && dateValue < new Date(rules.min)) {
      return `${field.label} must be after ${rules.min}`
    }
    if (rules.max && dateValue > new Date(rules.max)) {
      return `${field.label} must be before ${rules.max}`
    }
  }

  // File size validation
  if (field.fieldType === FieldType.FILE || field.fieldType === FieldType.IMAGE) {
    const options = field.fieldOptions || {}
    if (options.maxSize && value.size && value.size > options.maxSize) {
      const maxSizeMB = Math.round(options.maxSize / 1024 / 1024)
      return `${field.label} must not exceed ${maxSizeMB}MB`
    }
  }

  return null
}

/**
 * Format field value for display
 */
export const formatFieldValue = (field: FieldDefinition, value: any): string => {
  if (value === null || value === undefined) return 'N/A'

  switch (field.fieldType) {
    case FieldType.DATE:
      return new Date(value).toLocaleDateString()
    
    case FieldType.DATETIME:
      return new Date(value).toLocaleString()
    
    case FieldType.TIME:
      return value
    
    case FieldType.CHECKBOX:
    case FieldType.TOGGLE:
      return value ? 'Yes' : 'No'
    
    case FieldType.CURRENCY:
      const options = field.fieldOptions || {}
      const prefix = options.prefix || '$'
      const decimals = options.decimals || 2
      return `${prefix}${Number(value).toFixed(decimals)}`
    
    case FieldType.MULTISELECT:
      return Array.isArray(value) ? value.join(', ') : String(value)
    
    case FieldType.JSON:
      return JSON.stringify(value, null, 2)
    
    default:
      return String(value)
  }
}

/**
 * Get default value for field type
 */
export const getDefaultFieldValue = (field: FieldDefinition): any => {
  if (field.defaultValue !== undefined) {
    return field.defaultValue
  }

  switch (field.fieldType) {
    case FieldType.CHECKBOX:
    case FieldType.TOGGLE:
      return false
    
    case FieldType.MULTISELECT:
    case FieldType.GALLERY:
      return []
    
    case FieldType.NUMBER:
    case FieldType.CURRENCY:
      return 0
    
    case FieldType.JSON:
      return {}
    
    default:
      return ''
  }
}
