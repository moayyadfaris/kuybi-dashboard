/**
 * Post Content Store
 * Pinia store for Dynamic Content Management
 * Handles CRUD operations, caching, and state management for dynamic content
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  PostContent,
  ContentQueryParams,
  ContentListResponse,
  CreateContentDto,
  UpdateContentDto
} from '../types/postTypes'
import { postContentService } from '../services/postContentService'

/**
 * Cache entry structure
 */
interface CacheEntry<T> {
  data: T
  timestamp: number
  params?: string // Serialized query params for list caches
}

/**
 * Cache configuration
 */
const CACHE_TTL = {
  LIST: 5 * 60 * 1000,      // 5 minutes for content lists
  DETAIL: 10 * 60 * 1000,   // 10 minutes for single content
}

export const usePostContentStore = defineStore('postContent', () => {
  // State
  const contents = ref<Map<string, PostContent>>(new Map())
  const contentLists = ref<Map<string, CacheEntry<ContentListResponse>>>(new Map())
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)

  /**
   * Get cached list if valid
   */
  const getCachedList = (postTypeSlug: string, params?: ContentQueryParams): ContentListResponse | null => {
    const cacheKey = `${postTypeSlug}:${JSON.stringify(params || {})}`
    const cached = contentLists.value.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL.LIST) {
      return cached.data
    }
    
    return null
  }

  /**
   * Set list cache
   */
  const setCachedList = (postTypeSlug: string, params: ContentQueryParams | undefined, data: ContentListResponse) => {
    const cacheKey = `${postTypeSlug}:${JSON.stringify(params || {})}`
    contentLists.value.set(cacheKey, {
      data,
      timestamp: Date.now(),
      params: JSON.stringify(params || {})
    })
  }

  /**
   * Get cached content if valid
   */
  const getCachedContent = (id: string): PostContent | null => {
    const cached = contents.value.get(id)
    return cached || null
  }

  /**
   * Set content cache
   */
  const setCachedContent = (content: PostContent) => {
    contents.value.set(content.id, content)
  }

  /**
   * Invalidate all list caches for a post type
   */
  const invalidateListCache = (postTypeSlug: string) => {
    const keysToDelete: string[] = []
    contentLists.value.forEach((_, key) => {
      if (key.startsWith(`${postTypeSlug}:`)) {
        keysToDelete.push(key)
      }
    })
    keysToDelete.forEach(key => contentLists.value.delete(key))
  }

  /**
   * Get content list for a post type
   */
  const getAll = async (
    postTypeSlug: string,
    params?: ContentQueryParams,
    forceRefresh = false
  ): Promise<ContentListResponse> => {
    try {
      // Check cache first
      if (!forceRefresh) {
        const cached = getCachedList(postTypeSlug, params)
        if (cached) {
          return cached
        }
      }

      loading.value = true
      error.value = null

      const response = await postContentService.getAll(postTypeSlug, params)
      
      // Cache the list
      setCachedList(postTypeSlug, params, response)
      
      // Cache individual contents
      response.data.forEach(content => setCachedContent(content))

      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch content list'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Get single content by ID
   */
  const getById = async (
    postTypeSlug: string,
    id: string,
    forceRefresh = false
  ): Promise<PostContent> => {
    try {
      // Check cache first
      if (!forceRefresh) {
        const cached = getCachedContent(id)
        if (cached) {
          return cached
        }
      }

      loading.value = true
      error.value = null

      const content = await postContentService.getById(postTypeSlug, id)
      
      // Cache the content
      setCachedContent(content)

      return content
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch content'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Get single content by slug
   */
  const getBySlug = async (
    postTypeSlug: string,
    slug: string
  ): Promise<PostContent> => {
    try {
      loading.value = true
      error.value = null

      const content = await postContentService.getBySlug(postTypeSlug, slug)
      
      // Cache the content
      setCachedContent(content)

      return content
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch content'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Create new content
   */
  const create = async (
    postTypeSlug: string,
    data: CreateContentDto
  ): Promise<PostContent> => {
    try {
      loading.value = true
      error.value = null

      const content = await postContentService.create(postTypeSlug, data)
      
      // Cache the new content
      setCachedContent(content)
      
      // Invalidate list caches
      invalidateListCache(postTypeSlug)

      return content
    } catch (err: any) {
      error.value = err.message || 'Failed to create content'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Update content
   */
  const update = async (
    postTypeSlug: string,
    id: string,
    data: UpdateContentDto
  ): Promise<PostContent> => {
    try {
      loading.value = true
      error.value = null

      const content = await postContentService.update(postTypeSlug, id, data)
      
      // Update cache
      setCachedContent(content)
      
      // Invalidate list caches
      invalidateListCache(postTypeSlug)

      return content
    } catch (err: any) {
      error.value = err.message || 'Failed to update content'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Publish content
   */
  const publish = async (
    postTypeSlug: string,
    id: string
  ): Promise<PostContent> => {
    try {
      loading.value = true
      error.value = null

      const content = await postContentService.publish(postTypeSlug, id)
      
      // Update cache
      setCachedContent(content)
      
      // Invalidate list caches
      invalidateListCache(postTypeSlug)

      return content
    } catch (err: any) {
      error.value = err.message || 'Failed to publish content'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Schedule content
   */
  const schedule = async (
    postTypeSlug: string,
    id: string,
    scheduledFor: string
  ): Promise<PostContent> => {
    try {
      loading.value = true
      error.value = null

      const content = await postContentService.schedule(postTypeSlug, id, scheduledFor)
      
      // Update cache
      setCachedContent(content)
      
      // Invalidate list caches
      invalidateListCache(postTypeSlug)

      return content
    } catch (err: any) {
      error.value = err.message || 'Failed to schedule content'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Archive content
   */
  const archive = async (
    postTypeSlug: string,
    id: string
  ): Promise<PostContent> => {
    try {
      loading.value = true
      error.value = null

      const content = await postContentService.archive(postTypeSlug, id)
      
      // Update cache
      setCachedContent(content)
      
      // Invalidate list caches
      invalidateListCache(postTypeSlug)

      return content
    } catch (err: any) {
      error.value = err.message || 'Failed to archive content'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete content
   */
  const deleteContent = async (
    postTypeSlug: string,
    id: string
  ): Promise<void> => {
    try {
      loading.value = true
      error.value = null

      await postContentService.delete(postTypeSlug, id)
      
      // Remove from cache
      contents.value.delete(id)
      
      // Invalidate list caches
      invalidateListCache(postTypeSlug)
    } catch (err: any) {
      error.value = err.message || 'Failed to delete content'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Search content
   */
  const search = async (
    query: string,
    params?: Omit<ContentQueryParams, 'search'>
  ): Promise<ContentListResponse> => {
    try {
      loading.value = true
      error.value = null

      const response = await postContentService.search(query, params)
      
      // Cache individual contents
      response.data.forEach(content => setCachedContent(content))

      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to search content'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Clear error
   */
  const clearError = () => {
    error.value = null
  }

  /**
   * Clear all caches
   */
  const clearCache = () => {
    contents.value.clear()
    contentLists.value.clear()
  }

  return {
    // State
    contents,
    loading,
    error,

    // Computed
    isLoading,
    hasError,

    // Actions
    getAll,
    getById,
    getBySlug,
    create,
    update,
    publish,
    schedule,
    archive,
    deleteContent,
    search,
    clearError,
    clearCache
  }
})
