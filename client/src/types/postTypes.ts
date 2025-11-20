/**
 * Dynamic Post Types - TypeScript Type Definitions
 * Based on: Dynamic Post Types - Frontend Integration Guide v1.0.0
 * Last Updated: November 19, 2025
 */

/**
 * Field Types Enum (25 Types)
 * Matches backend FieldType enum exactly
 */
export enum FieldType {
  // Text Fields
  TEXT = 'text',
  TEXTAREA = 'textarea',
  WYSIWYG = 'wysiwyg',
  EMAIL = 'email',
  URL = 'url',
  TEL = 'tel',
  CODE = 'code',
  
  // Number Fields
  NUMBER = 'number',
  CURRENCY = 'currency',
  
  // Date/Time Fields
  DATE = 'date',
  DATETIME = 'datetime',
  TIME = 'time',
  
  // Choice Fields
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  SELECT = 'select',
  MULTISELECT = 'multiselect',
  TOGGLE = 'toggle',
  
  // Media Fields
  FILE = 'file',
  IMAGE = 'image',
  GALLERY = 'gallery',
  VIDEO = 'video',
  
  // Relational Fields
  RELATION = 'relation',
  USER = 'user',
  TAXONOMY = 'taxonomy',
  
  // Advanced Fields
  COLOR = 'color',
  JSON = 'json',
  REPEATER = 'repeater',
  GROUP = 'group'
}

/**
 * Content Status Enum (6 Statuses)
 * Matches backend ContentStatus enum exactly
 */
export enum ContentStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  PUBLISHED = 'published',
  SCHEDULED = 'scheduled',
  ARCHIVED = 'archived',
  DELETED = 'deleted'
}

/**
 * Validation Rules
 * Stored in JSONB field_definitions.validationRules
 */
export interface ValidationRules {
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: string
  step?: number
  required?: boolean
  unique?: boolean
  [key: string]: any
}

/**
 * Field Options
 * Stored in JSONB field_definitions.fieldOptions
 * Type-specific configuration
 */
export interface FieldOptions {
  // Text/Textarea
  placeholder?: string
  rows?: number
  
  // Number/Currency
  step?: number
  prefix?: string
  suffix?: string
  currency?: string
  decimals?: number
  
  // Date/DateTime/Time
  format?: string
  
  // Choice Fields (Radio, Select, MultiSelect)
  choices?: string[]
  allowOther?: boolean
  
  // File/Image/Gallery
  allowedTypes?: string[]
  maxSize?: number
  dimensions?: {
    width?: number
    height?: number
    minWidth?: number
    minHeight?: number
    maxWidth?: number
    maxHeight?: number
  }
  crop?: boolean
  
  // Image/Gallery
  minImages?: number
  maxImages?: number
  
  // Relation
  postTypeId?: string
  multiple?: boolean
  
  // User
  roles?: string[]
  
  // WYSIWYG
  toolbar?: string[]
  
  // Code
  language?: string
  theme?: string
  
  // Color
  colorFormat?: 'hex' | 'rgb' | 'hsl'
  
  [key: string]: any
}

/**
 * Conditional Logic (Phase 2)
 * Stored in JSONB field_definitions.conditionalLogic
 */
export interface ConditionalLogic {
  show?: boolean
  rules?: Array<{
    field: string
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than'
    value: any
  }>
  logic?: 'AND' | 'OR'
}

/**
 * Field Definition
 * Represents a custom field schema for a post type
 */
export interface FieldDefinition {
  id: string
  postTypeId: string
  name: string
  label: string
  fieldType: FieldType
  description?: string
  defaultValue?: string
  placeholder?: string
  isRequired: boolean
  isUnique: boolean
  isSearchable: boolean
  isFilterable: boolean
  isSortable: boolean
  displayOrder: number
  fieldGroup?: string
  helpText?: string
  validationRules?: ValidationRules
  fieldOptions?: FieldOptions
  conditionalLogic?: ConditionalLogic
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

/**
 * Post Type Settings
 * Stored in JSONB post_types.settings
 */
export interface PostTypeSettings {
  supports?: string[]
  public?: boolean
  hasArchive?: boolean
  rewrite?: {
    slug?: string
    withFront?: boolean
  }
  taxonomies?: string[]
  [key: string]: any
}

/**
 * Post Type
 * Represents a custom content type definition
 */
export interface PostType {
  id: string
  name: string
  slug: string
  singularLabel: string
  pluralLabel: string
  description?: string
  icon?: string
  menuIcon?: string
  menuPosition: number
  isHierarchical: boolean
  supportsComments: boolean
  supportsRevisions: boolean
  showInRest: boolean
  restBase: string
  capabilityType: string
  isActive: boolean
  isSystem: boolean
  settings?: PostTypeSettings
  createdBy?: string
  updatedBy?: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
  version: number
  fieldDefinitions?: FieldDefinition[]
}

/**
 * Post Content Metadata
 * Stored in JSONB post_content.metadata
 */
export interface PostContentMetadata {
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  twitterCard?: string
  canonical?: string
  noindex?: boolean
  nofollow?: boolean
  [key: string]: any
}

/**
 * Post Content Author
 * Related user information
 */
export interface PostContentAuthor {
  id: string
  name: string
  email: string
  avatar?: string
}

/**
 * Post Content
 * Represents an instance of content for a post type
 */
export interface PostContent {
  id: string
  postTypeId: string
  authorId: string
  parentId?: string
  title: string
  slug: string
  excerpt?: string
  status: ContentStatus
  publishedAt?: string
  scheduledFor?: string
  field_data: Record<string, any>
  metadata?: PostContentMetadata
  viewCount: number
  likeCount: number
  commentCount: number
  shareCount: number
  hierarchyPath?: string
  createdBy?: string
  updatedBy?: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
  version: number
  
  // Relations (populated when requested)
  postType?: PostType
  author?: PostContentAuthor
  parent?: PostContent
  attachments?: any[]
  tags?: any[]
  categories?: any[]
}

/**
 * API Query Parameters
 */
export interface PostTypeQueryParams {
  includeInactive?: boolean
}

export interface ContentQueryParams {
  status?: ContentStatus | string
  limit?: number
  offset?: number
  search?: string
  fields?: Record<string, any>
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
}

/**
 * API Response Types
 */
export interface PostTypeListResponse {
  data: PostType[]
  total: number
}

export interface ContentListResponse {
  data: PostContent[]
  total: number
  limit: number
  offset: number
}

export interface ApiError {
  statusCode: number
  message: string
  error: string
  details?: Array<{
    field: string
    message: string
  }>
}

/**
 * Form Data Types for Creating/Updating
 */
export interface CreatePostTypeDto {
  name: string
  slug: string
  singularLabel: string
  pluralLabel: string
  description?: string
  icon?: string
  menuIcon?: string
  menuPosition?: number
  isHierarchical?: boolean
  supportsComments?: boolean
  supportsRevisions?: boolean
  showInRest?: boolean
  restBase?: string
  settings?: PostTypeSettings
}

export interface UpdatePostTypeDto {
  name?: string
  singularLabel?: string
  pluralLabel?: string
  description?: string
  icon?: string
  menuIcon?: string
  menuPosition?: number
  isHierarchical?: boolean
  supportsComments?: boolean
  supportsRevisions?: boolean
  showInRest?: boolean
  isActive?: boolean
  settings?: PostTypeSettings
}

export interface CreateFieldDefinitionDto {
  name: string
  label: string
  fieldType: FieldType
  description?: string
  defaultValue?: string
  placeholder?: string
  isRequired?: boolean
  isUnique?: boolean
  isSearchable?: boolean
  isFilterable?: boolean
  isSortable?: boolean
  displayOrder?: number
  fieldGroup?: string
  helpText?: string
  validationRules?: ValidationRules
  fieldOptions?: FieldOptions
  conditionalLogic?: ConditionalLogic
}

export interface UpdateFieldDefinitionDto {
  label?: string
  description?: string
  defaultValue?: string
  placeholder?: string
  isRequired?: boolean
  isUnique?: boolean
  isSearchable?: boolean
  isFilterable?: boolean
  isSortable?: boolean
  displayOrder?: number
  fieldGroup?: string
  helpText?: string
  validationRules?: ValidationRules
  fieldOptions?: FieldOptions
  conditionalLogic?: ConditionalLogic
}

export interface CreateContentDto {
  title: string
  excerpt?: string
  status?: ContentStatus
  parentId?: string
  field_data: Record<string, any>
  metadata?: PostContentMetadata
  attachmentIds?: string[]
  tagIds?: string[]
  categoryIds?: string[]
  scheduledFor?: string
}

export interface UpdateContentDto {
  title?: string
  excerpt?: string
  status?: ContentStatus
  parentId?: string
  field_data?: Record<string, any>
  metadata?: PostContentMetadata
  attachmentIds?: string[]
  tagIds?: string[]
  categoryIds?: string[]
  scheduledFor?: string
}

export interface ReorderFieldsDto {
  fieldOrders: Array<{
    id: string
    displayOrder: number
  }>
}
