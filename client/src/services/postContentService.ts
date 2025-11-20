/**
 * Post Content Service
 * API service layer for Dynamic Content Management
 * Based on: Dynamic Post Types - Frontend Integration Guide v1.0.0
 * 
 * Note: APIs will be available December 1, 2025 (Phase 2)
 * This service is prepared and ready for API integration
 */

import axios, { type AxiosResponse } from 'axios'
import type {
  PostContent,
  ContentQueryParams,
  ContentListResponse,
  CreateContentDto,
  UpdateContentDto
} from '../types/postTypes'
import { PostTypeApiError } from './postTypeService'

// API Configuration
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4040/api'
const CONTENT_ENDPOINT = '/v1/content'

/**
 * Handle API errors consistently
 */
function handleApiError(error: any): never {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const { status, data } = error.response
      throw new PostTypeApiError(
        data.message || 'An error occurred',
        status,
        data.details
      )
    } else if (error.request) {
      throw new PostTypeApiError('No response from server', 0)
    }
  }
  throw new PostTypeApiError(error.message || 'Unknown error', 0)
}

/**
 * Get authorization header with JWT token
 */
const getAuthHeader = (token?: string): Record<string, string> => {
  const authToken = token || localStorage.getItem('access_token')
  return authToken ? { Authorization: `Bearer ${authToken}` } : {}
}

/**
 * Post Content Service
 * All methods ready for Phase 2 API integration
 */
export const postContentService = {
  /**
   * Get content list for a post type
   * GET /api/content/:postTypeSlug
   * 
   * Examples:
   * - /api/content/events?status=published&limit=10
   * - /api/content/events?search=conference
   * - /api/content/events?fields={"location":"New York"}
   */
  async getAll(
    postTypeSlug: string,
    params?: ContentQueryParams
  ): Promise<ContentListResponse> {
    try {
      const response: AxiosResponse<{ success: boolean; data: ContentListResponse }> = await axios.get(
        `${API_BASE}${CONTENT_ENDPOINT}/${postTypeSlug}`,
        { 
          params: {
            ...params,
            // Convert fields object to JSON string if present
            fields: params?.fields ? JSON.stringify(params.fields) : undefined
          }
        }
      )
      return response.data.data
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Get single content by ID
   * GET /api/content/:postTypeSlug/:id
   */
  async getById(postTypeSlug: string, id: string): Promise<PostContent> {
    try {
      const response: AxiosResponse<{ success: boolean; data: PostContent }> = await axios.get(
        `${API_BASE}${CONTENT_ENDPOINT}/${postTypeSlug}/${id}`
      )
      return response.data.data
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Get single content by slug
   * GET /api/content/:postTypeSlug/slug/:slug
   */
  async getBySlug(postTypeSlug: string, slug: string): Promise<PostContent> {
    try {
      const response: AxiosResponse<{ success: boolean; data: PostContent }> = await axios.get(
        `${API_BASE}${CONTENT_ENDPOINT}/${postTypeSlug}/slug/${slug}`
      )
      return response.data.data
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Create new content
   * POST /api/content/:postTypeSlug
   * 
   * Example:
   * {
   *   "title": "Tech Conference 2025",
   *   "excerpt": "Annual technology conference",
   *   "status": "draft",
   *   "field_data": {
   *     "event_date": "2025-12-15",
   *     "location": "New York",
   *     "price": "299.00"
   *   }
   * }
   */
  async create(
    postTypeSlug: string,
    data: CreateContentDto,
    token?: string
  ): Promise<PostContent> {
    try {
      const response: AxiosResponse<{ success: boolean; data: PostContent }> = await axios.post(
        `${API_BASE}${CONTENT_ENDPOINT}/${postTypeSlug}`,
        data,
        { headers: getAuthHeader(token) }
      )
      return response.data.data
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Update content
   * PATCH /api/content/:postTypeSlug/:id
   * 
   * Supports partial updates including partial field_data updates
   */
  async update(
    postTypeSlug: string,
    id: string,
    data: UpdateContentDto,
    token?: string
  ): Promise<PostContent> {
    try {
      const response: AxiosResponse<{ success: boolean; data: PostContent }> = await axios.patch(
        `${API_BASE}${CONTENT_ENDPOINT}/${postTypeSlug}/${id}`,
        data,
        { headers: getAuthHeader(token) }
      )
      return response.data.data
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Publish content
   * POST /api/content/:postTypeSlug/:id/publish
   * 
   * Sets status to 'published' and publishedAt to current timestamp
   */
  async publish(
    postTypeSlug: string,
    id: string,
    token?: string
  ): Promise<PostContent> {
    try {
      const response: AxiosResponse<{ success: boolean; data: PostContent }> = await axios.post(
        `${API_BASE}${CONTENT_ENDPOINT}/${postTypeSlug}/${id}/publish`,
        {},
        { headers: getAuthHeader(token) }
      )
      return response.data.data
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Schedule content
   * POST /api/content/:postTypeSlug/:id/schedule
   * 
   * Sets status to 'scheduled' and scheduledFor timestamp
   */
  async schedule(
    postTypeSlug: string,
    id: string,
    scheduledFor: string,
    token?: string
  ): Promise<PostContent> {
    try {
      const response: AxiosResponse<{ success: boolean; data: PostContent }> = await axios.post(
        `${API_BASE}${CONTENT_ENDPOINT}/${postTypeSlug}/${id}/schedule`,
        { scheduledFor },
        { headers: getAuthHeader(token) }
      )
      return response.data.data
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Archive content
   * Sets status to 'archived'
   */
  async archive(
    postTypeSlug: string,
    id: string,
    token?: string
  ): Promise<PostContent> {
    try {
      return await postContentService.update(
        postTypeSlug,
        id,
        { status: 'archived' as any },
        token
      )
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Delete content
   * DELETE /api/content/:postTypeSlug/:id
   * 
   * Performs soft delete (sets deletedAt timestamp)
   */
  async delete(
    postTypeSlug: string,
    id: string,
    token?: string
  ): Promise<void> {
    try {
      await axios.delete(
        `${API_BASE}${CONTENT_ENDPOINT}/${postTypeSlug}/${id}`,
        { headers: getAuthHeader(token) }
      )
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Increment view count
   * Useful for tracking content engagement
   */
  async incrementViewCount(
    postTypeSlug: string,
    id: string
  ): Promise<void> {
    try {
      // This will be a custom endpoint in Phase 2
      await axios.post(
        `${API_BASE}${CONTENT_ENDPOINT}/${postTypeSlug}/${id}/view`
      )
    } catch (error) {
      // Silently fail for view count tracking
      console.error('Failed to increment view count:', error)
    }
  },

  /**
   * Search content across all post types
   * GET /api/content/search
   */
  async search(
    query: string,
    params?: Omit<ContentQueryParams, 'search'>
  ): Promise<ContentListResponse> {
    try {
      const response: AxiosResponse<{ success: boolean; data: ContentListResponse }> = await axios.get(
        `${API_BASE}${CONTENT_ENDPOINT}/search`,
        { 
          params: {
            ...params,
            search: query
          }
        }
      )
      return response.data.data
    } catch (error) {
      handleApiError(error)
    }
  }
}

export default postContentService
