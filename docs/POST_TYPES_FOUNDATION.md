# Dynamic Post Types - Frontend Foundation

**Status:** ✅ Phase 1 Foundation Complete  
**Created:** November 19, 2025  
**API Integration:** Ready for Phase 2 (December 1, 2025)

---

## 📋 Overview

This foundation provides a complete TypeScript infrastructure for the Dynamic Post Types system, ready for API integration when Phase 2 backend APIs become available on December 1, 2025.

## 🎯 What's Included

### 1. Type Definitions (`client/src/types/postTypes.ts`)

Complete TypeScript interfaces matching the backend schema:

- **PostType** - Custom content type definitions (25 properties)
- **FieldDefinition** - Custom field schemas (22 properties)
- **PostContent** - Content instances with JSONB field_data (24 properties)
- **FieldType** - Enum with 25 field types
- **ContentStatus** - Enum with 6 statuses
- **DTOs** - Create/Update data transfer objects
- **Query Params** - API query parameter types
- **API Responses** - Structured response types

### 2. Field Type Utilities (`client/src/types/fieldTypes.ts`)

- **FIELD_TYPE_REGISTRY** - Complete metadata for all 25 field types with icons, categories, descriptions
- **FIELD_COMPONENT_MAP** - Maps field types to Vue component names
- **FIELD_CATEGORIES** - Organized field categories (text, number, date, choice, media, relation, advanced)
- **validateField()** - Client-side validation matching backend rules
- **formatFieldValue()** - Display formatting for different field types
- **getDefaultFieldValue()** - Default values per field type

### 3. Post Type Service (`client/src/services/postTypeService.ts`)

Complete CRUD operations ready for API integration:

#### Post Types:
- `getAll(params)` - Get all post types
- `getById(id)` - Get single post type by ID
- `getBySlug(slug)` - Get single post type by slug
- `create(data, token)` - Create new post type
- `update(id, data, token)` - Update post type
- `delete(id, token)` - Delete post type

#### Field Definitions:
- `getFields(postTypeId)` - Get fields for post type
- `createField(postTypeId, data, token)` - Create field
- `updateField(postTypeId, fieldId, data, token)` - Update field
- `reorderFields(postTypeId, data, token)` - Reorder fields
- `deleteField(postTypeId, fieldId, token)` - Delete field

### 4. Content Service (`client/src/services/postContentService.ts`)

Dynamic content management ready for API integration:

- `getAll(postTypeSlug, params)` - List content with filters
- `getById(postTypeSlug, id)` - Get single content
- `getBySlug(postTypeSlug, slug)` - Get by slug
- `create(postTypeSlug, data, token)` - Create content with field_data
- `update(postTypeSlug, id, data, token)` - Update content (partial)
- `publish(postTypeSlug, id, token)` - Publish content
- `schedule(postTypeSlug, id, scheduledFor, token)` - Schedule content
- `archive(postTypeSlug, id, token)` - Archive content
- `delete(postTypeSlug, id, token)` - Soft delete
- `incrementViewCount(postTypeSlug, id)` - Track views
- `search(query, params)` - Global search

### 5. Pinia Store (`client/src/stores/postTypesStore.ts`)

State management with caching strategy:

#### State:
- `postTypes` - Array of all post types
- `currentPostType` - Selected post type
- `currentFields` - Fields for current post type
- `loading` - Loading state
- `error` - Error state
- `cache` - In-memory cache with TTL

#### Getters:
- `activePostTypes` - Active post types only
- `systemPostTypes` - System (protected) post types
- `customPostTypes` - User-created post types
- `getPostTypeBySlug(slug)` - Find by slug
- `getPostTypeById(id)` - Find by ID
- `sortedFields` - Fields sorted by displayOrder
- `requiredFields` - Required fields only
- `searchableFields` - Searchable fields only
- `groupedFields` - Fields grouped by fieldGroup

#### Actions:
- All CRUD operations for post types and fields
- Automatic caching (30 min for types, 15 min for fields)
- Cache management with pattern matching

### 6. Utility Functions (`client/src/utils/postTypeUtils.ts`)

Helper functions for common operations:

#### Slug Generation:
- `generateSlug(text)` - URL-friendly slug from text
- `generateFieldName(label)` - snake_case from label
- `formatFieldName(name)` - Title Case from snake_case
- `isValidSlug(slug)` - Validate slug format
- `isValidFieldName(name)` - Validate field name format

#### Caching:
- `cacheData(key, data, ttl)` - localStorage caching
- `getCachedData(key)` - Retrieve with TTL check
- `clearCachedData(pattern)` - Clear cache by pattern

#### Formatting:
- `formatDate(dateString)` - Human-readable date
- `formatDateTime(dateString)` - Date with time
- `formatRelativeTime(dateString)` - "2 hours ago"
- `formatFileSize(bytes)` - "1.5 MB"
- `truncate(text, maxLength)` - Text truncation

#### Status Helpers:
- `getStatusBadgeClass(status)` - Tailwind classes
- `getStatusLabel(status)` - Human-readable label

#### Form Helpers:
- `extractFieldData(formData, fields)` - Separate standard/custom
- `mergeFieldData(field_data, fields)` - Merge with defaults
- `validateFormData(formData, fields)` - Validate all fields

#### General:
- `debounce(func, wait)` - Debounce function
- `deepClone(obj)` - Deep object cloning
- `countWords(text)` - Word counter

---

## 🚀 Quick Start

### 1. Import Types

```typescript
import type { PostType, FieldDefinition, PostContent } from '@/types/postTypes'
import { FieldType, ContentStatus } from '@/types/postTypes'
```

### 2. Use Services

```typescript
import { postTypeService } from '@/services/postTypeService'
import { postContentService } from '@/services/postContentService'

// Get all post types
const postTypes = await postTypeService.getAll()

// Get content for a post type
const response = await postContentService.getAll('events', {
  status: 'published',
  limit: 10
})
```

### 3. Use Store

```typescript
import { usePostTypesStore } from '@/stores/postTypesStore'

const store = usePostTypesStore()

// Fetch post types (with caching)
await store.fetchPostTypes()

// Access via getters
const activeTypes = store.activePostTypes
const eventType = store.getPostTypeBySlug('event')

// Create new post type
await store.createPostType({
  name: 'Recipe',
  singularLabel: 'Recipe',
  pluralLabel: 'Recipes',
  // ... other fields
}, token)
```

### 4. Use Utilities

```typescript
import { 
  generateSlug, 
  formatFieldValue, 
  validateFormData 
} from '@/utils/postTypeUtils'

// Generate slug
const slug = generateSlug('My Event Title') // "my-event-title"

// Validate form
const errors = validateFormData(formData, fields)
if (Object.keys(errors).length > 0) {
  // Show validation errors
}
```

---

## 📊 Field Types Reference

### Text Fields (7 types)
- **text** - Short text input
- **textarea** - Multi-line text
- **wysiwyg** - Rich text editor
- **email** - Email with validation
- **url** - URL with validation
- **tel** - Phone number
- **code** - Code editor

### Number Fields (2 types)
- **number** - Integer or decimal
- **currency** - Money with formatting

### Date/Time Fields (3 types)
- **date** - Date picker
- **datetime** - Date + time picker
- **time** - Time picker

### Choice Fields (5 types)
- **checkbox** - True/false
- **radio** - Single choice
- **select** - Dropdown
- **multiselect** - Multiple choices
- **toggle** - On/off switch

### Media Fields (4 types)
- **file** - File upload
- **image** - Image upload
- **gallery** - Multiple images
- **video** - Video upload/embed

### Relational Fields (3 types)
- **relation** - Link to other content
- **user** - Link to users
- **taxonomy** - Link to categories/tags

### Advanced Fields (4 types)
- **color** - Color picker
- **json** - JSON editor
- **repeater** - Repeating fields (Phase 2)
- **group** - Field grouping (Phase 2)

---

## 🔄 API Integration (December 1, 2025)

### When APIs Become Available:

1. **Services are ready** - No code changes needed, just update the API base URL
2. **Store will work** - All actions already use the services
3. **Types match exactly** - Backend and frontend use same schema
4. **Caching configured** - 30 min for types, 15 min for fields, 10 min for content

### Configuration:

Update `.env`:
```bash
VITE_API_BASE_URL=http://localhost:4040/api
```

Or in service files:
```typescript
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4040/api'
```

---

## 🎨 Next Steps (UI Components)

### Phase 2: Build UI Components

1. **Post Type Management**
   - `PostTypes.vue` - List all post types
   - `PostTypeBuilder.vue` - Create/edit post type
   - `FieldBuilder.vue` - Drag-drop field builder

2. **Dynamic Field Components** (25 components)
   - `TextField.vue`, `NumberField.vue`, etc.
   - Each component handles its own validation
   - Consistent props interface

3. **Dynamic Forms**
   - `DynamicForm.vue` - Generic form builder
   - `FieldRenderer.vue` - Render any field type
   - `FormValidator.vue` - Real-time validation

4. **Content Management**
   - `ContentList.vue` - Generic content list
   - `ContentCreate.vue` - Dynamic create form
   - `ContentEdit.vue` - Dynamic edit form

---

## ✅ Best Practices

### 1. Always Use field_data for Custom Fields

```typescript
// ✅ Correct
const contentData = {
  title: "My Event",
  excerpt: "Description",
  status: "draft",
  field_data: {
    event_date: "2025-12-15",
    location: "New York"
  }
}

// ❌ Wrong
const contentData = {
  title: "My Event",
  event_date: "2025-12-15", // Don't mix
  location: "New York"      // Don't mix
}
```

### 2. Use Validation Before Submit

```typescript
const errors = validateFormData(formData, fields)
if (Object.keys(errors).length > 0) {
  // Show errors, don't submit
  return
}
```

### 3. Leverage Caching

```typescript
// Store automatically caches
await store.fetchPostTypes() // First call hits API
await store.fetchPostTypes() // Second call uses cache

// Manually clear cache when data changes
store.clearCache('postTypes_')
```

### 4. Handle Errors Consistently

```typescript
try {
  await postTypeService.create(data, token)
} catch (error) {
  if (error instanceof PostTypeApiError) {
    if (error.statusCode === 409) {
      // Handle duplicate slug
    } else if (error.details) {
      // Show validation errors
      error.details.forEach(({ field, message }) => {
        // Display field error
      })
    }
  }
}
```

---

## 📚 Resources

- [Dynamic Post Types Guide](../../../docs/frontend/DYNAMIC_POST_TYPES_GUIDE.md)
- [Backend API Reference](../../../docs/API_REFERENCE.md)
- [Architecture Overview](../../../docs/architecture/ARCHITECTURE_STANDARDIZATION.md)

---

## 🎯 Summary

✅ **Complete TypeScript Infrastructure**  
✅ **25 Field Types Supported**  
✅ **Services Ready for API Integration**  
✅ **Pinia Store with Caching**  
✅ **Comprehensive Utilities**  
✅ **Best Practices Documented**  

**Status:** Foundation complete, ready for Phase 2 API integration on December 1, 2025.

**Next:** Build UI components for post type management and dynamic forms.
