/**
 * Post Types Store
 * Pinia store for managing post types and field definitions
 * Based on: Dynamic Post Types - Frontend Integration Guide v1.0.0
 */

import { defineStore } from 'pinia'
import { postTypeService } from '../services/postTypeService'
import type {
  PostType,
  FieldDefinition,
  PostTypeQueryParams,
  CreatePostTypeDto,
  UpdatePostTypeDto,
  CreateFieldDefinitionDto,
  UpdateFieldDefinitionDto,
  ReorderFieldsDto
} from '../types/postTypes'

/**
 * Cache Entry Interface
 */
interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

/**
 * Store State Interface
 */
interface PostTypesState {
  postTypes: PostType[]
  currentPostType: PostType | null
  currentFields: FieldDefinition[]
  loading: boolean
  error: string | null
  cache: Map<string, CacheEntry<any>>
}

/**
 * Post Types Store
 */
export const usePostTypesStore = defineStore('postTypes', {
  state: (): PostTypesState => ({
    postTypes: [],
    currentPostType: null,
    currentFields: [],
    loading: false,
    error: null,
    cache: new Map()
  }),

  getters: {
    /**
     * Get active post types only
     */
    activePostTypes: (state): PostType[] => {
      return state.postTypes.filter(pt => pt.isActive)
    },

    /**
     * Get system post types (protected, cannot delete)
     */
    systemPostTypes: (state): PostType[] => {
      return state.postTypes.filter(pt => pt.isSystem)
    },

    /**
     * Get custom post types (user-created, can modify/delete)
     */
    customPostTypes: (state): PostType[] => {
      return state.postTypes.filter(pt => !pt.isSystem)
    },

    /**
     * Get post type by slug
     */
    getPostTypeBySlug: (state) => {
      return (slug: string): PostType | undefined => {
        return state.postTypes.find(pt => pt.slug === slug)
      }
    },

    /**
     * Get post type by ID
     */
    getPostTypeById: (state) => {
      return (id: string): PostType | undefined => {
        return state.postTypes.find(pt => pt.id === id)
      }
    },

    /**
     * Get sorted fields by display order
     */
    sortedFields: (state): FieldDefinition[] => {
      return [...state.currentFields].sort((a, b) => a.displayOrder - b.displayOrder)
    },

    /**
     * Get required fields
     */
    requiredFields: (state): FieldDefinition[] => {
      return state.currentFields.filter(f => f.isRequired)
    },

    /**
     * Get searchable fields
     */
    searchableFields: (state): FieldDefinition[] => {
      return state.currentFields.filter(f => f.isSearchable)
    },

    /**
     * Get fields grouped by fieldGroup
     */
    groupedFields: (state): Record<string, FieldDefinition[]> => {
      const groups: Record<string, FieldDefinition[]> = {}
      
      state.currentFields.forEach(field => {
        const group = field.fieldGroup || 'default'
        if (!groups[group]) {
          groups[group] = []
        }
        groups[group].push(field)
      })

      return groups
    }
  },

  actions: {
    /**
     * Cache Management
     */
    setCache<T>(key: string, data: T, ttl: number = 30 * 60 * 1000): void {
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        ttl
      })
    },

    getCache<T>(key: string): T | null {
      const entry = this.cache.get(key)
      if (!entry) return null

      const isExpired = Date.now() - entry.timestamp > entry.ttl
      if (isExpired) {
        this.cache.delete(key)
        return null
      }

      return entry.data as T
    },

    clearCache(pattern?: string): void {
      if (pattern) {
        // Clear cache entries matching pattern
        const keysToDelete: string[] = []
        this.cache.forEach((_, key) => {
          if (key.includes(pattern)) {
            keysToDelete.push(key)
          }
        })
        keysToDelete.forEach(key => this.cache.delete(key))
      } else {
        // Clear all cache
        this.cache.clear()
      }
    },

    /**
     * Fetch all post types
     * Caches for 30 minutes
     */
    async fetchPostTypes(params?: PostTypeQueryParams): Promise<void> {
      const cacheKey = `postTypes_${JSON.stringify(params || {})}`
      const cached = this.getCache<PostType[]>(cacheKey)

      if (cached) {
        this.postTypes = cached
        return
      }

      this.loading = true
      this.error = null

      try {
        this.postTypes = await postTypeService.getAll(params)
        this.setCache(cacheKey, this.postTypes, 30 * 60 * 1000) // 30 min
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch single post type by slug
     * Caches for 30 minutes
     */
    async fetchPostTypeBySlug(slug: string): Promise<PostType> {
      const cacheKey = `postType_${slug}`
      const cached = this.getCache<PostType>(cacheKey)

      if (cached) {
        this.currentPostType = cached
        return cached
      }

      this.loading = true
      this.error = null

      try {
        const postType = await postTypeService.getBySlug(slug)
        this.currentPostType = postType
        this.setCache(cacheKey, postType, 30 * 60 * 1000) // 30 min
        
        // Update in list if exists
        const index = this.postTypes.findIndex(pt => pt.slug === slug)
        if (index !== -1) {
          this.postTypes[index] = postType
        } else {
          this.postTypes.push(postType)
        }

        return postType
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Create new post type
     */
    async createPostType(data: CreatePostTypeDto, token?: string): Promise<PostType> {
      this.loading = true
      this.error = null

      try {
        const newPostType = await postTypeService.create(data, token)
        this.postTypes.push(newPostType)
        this.clearCache('postTypes_')
        return newPostType
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Update post type
     */
    async updatePostType(
      id: string,
      data: UpdatePostTypeDto,
      token?: string
    ): Promise<PostType> {
      this.loading = true
      this.error = null

      try {
        const updated = await postTypeService.update(id, data, token)
        
        // Update in list
        const index = this.postTypes.findIndex(pt => pt.id === id)
        if (index !== -1) {
          this.postTypes[index] = updated
        }

        // Update current if matching
        if (this.currentPostType?.id === id) {
          this.currentPostType = updated
        }

        this.clearCache()
        return updated
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Delete post type
     */
    async deletePostType(id: string, token?: string): Promise<void> {
      this.loading = true
      this.error = null

      try {
        await postTypeService.delete(id, token)
        
        // Remove from list
        this.postTypes = this.postTypes.filter(pt => pt.id !== id)

        // Clear current if matching
        if (this.currentPostType?.id === id) {
          this.currentPostType = null
        }

        this.clearCache()
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch field definitions for a post type
     * Caches for 15 minutes
     */
    async fetchFields(postTypeId: string): Promise<void> {
      const cacheKey = `fields_${postTypeId}`
      const cached = this.getCache<FieldDefinition[]>(cacheKey)

      if (cached) {
        this.currentFields = cached
        return
      }

      this.loading = true
      this.error = null

      try {
        this.currentFields = await postTypeService.getFields(postTypeId)
        this.setCache(cacheKey, this.currentFields, 15 * 60 * 1000) // 15 min
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Create field definition
     */
    async createField(
      postTypeId: string,
      data: CreateFieldDefinitionDto,
      token?: string
    ): Promise<FieldDefinition> {
      this.loading = true
      this.error = null

      try {
        const newField = await postTypeService.createField(postTypeId, data, token)
        this.currentFields.push(newField)
        this.clearCache(`fields_${postTypeId}`)
        return newField
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Update field definition
     */
    async updateField(
      postTypeId: string,
      fieldId: string,
      data: UpdateFieldDefinitionDto,
      token?: string
    ): Promise<FieldDefinition> {
      this.loading = true
      this.error = null

      try {
        const updated = await postTypeService.updateField(postTypeId, fieldId, data, token)
        
        // Update in list
        const index = this.currentFields.findIndex(f => f.id === fieldId)
        if (index !== -1) {
          this.currentFields[index] = updated
        }

        this.clearCache(`fields_${postTypeId}`)
        return updated
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Reorder field definitions
     */
    async reorderFields(
      postTypeId: string,
      fieldOrders: ReorderFieldsDto,
      token?: string
    ): Promise<void> {
      this.loading = true
      this.error = null

      try {
        this.currentFields = await postTypeService.reorderFields(postTypeId, fieldOrders, token)
        this.clearCache(`fields_${postTypeId}`)
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Delete field definition
     */
    async deleteField(
      postTypeId: string,
      fieldId: string,
      token?: string
    ): Promise<void> {
      this.loading = true
      this.error = null

      try {
        await postTypeService.deleteField(postTypeId, fieldId, token)
        
        // Remove from list
        this.currentFields = this.currentFields.filter(f => f.id !== fieldId)
        this.clearCache(`fields_${postTypeId}`)
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Reset store state
     */
    reset(): void {
      this.postTypes = []
      this.currentPostType = null
      this.currentFields = []
      this.loading = false
      this.error = null
      this.cache.clear()
    }
  }
})
