/**
 * Post Type Service
 * API service layer for Dynamic Post Types
 * Based on: Dynamic Post Types - Frontend Integration Guide v1.0.0
 * 
 * Note: APIs will be available December 1, 2025 (Phase 2)
 * This service is prepared and ready for API integration
 */

import axios, { type AxiosResponse } from 'axios'
import type {
  PostType,
  FieldDefinition,
  PostTypeQueryParams,
  CreatePostTypeDto,
  UpdatePostTypeDto,
  CreateFieldDefinitionDto,
  UpdateFieldDefinitionDto,
  ReorderFieldsDto,
  ApiError
} from '../types/postTypes'

// API Configuration
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4040/api'
const POST_TYPES_ENDPOINT = '/v1/post-types'

/**
 * Custom API Error Class
 */
export class PostTypeApiError extends Error {
  statusCode: number
  details?: Array<{ field: string; message: string }>

  constructor(message: string, statusCode: number, details?: any[]) {
    super(message)
    this.name = 'PostTypeApiError'
    this.statusCode = statusCode
    this.details = details
  }
}

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
  console.log('getAuthHeader - token passed:', token ? 'YES' : 'NO')
  console.log('getAuthHeader - token from localStorage:', localStorage.getItem('access_token') ? 'EXISTS' : 'MISSING')
  console.log('getAuthHeader - final authToken:', authToken ? 'EXISTS' : 'MISSING')
  const headers: Record<string, string> = authToken ? { Authorization: `Bearer ${authToken}` } : {}
  console.log('getAuthHeader - headers:', headers)
  return headers
}

/**
 * Post Type Service
 * All methods ready for Phase 2 API integration
 */
export const postTypeService = {
  /**
   * Get all post types
   * GET /api/post-types
   */
  async getAll(params?: PostTypeQueryParams): Promise<PostType[]> {
    try {
      const response: AxiosResponse<{ success: boolean; data: PostType[] }> = await axios.get(
        `${API_BASE}${POST_TYPES_ENDPOINT}`,
        { 
          params,
          headers: getAuthHeader()
        }
      )
      return response.data.data
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Get post type by ID
   * GET /api/post-types/:id
   */
  async getById(id: string): Promise<PostType> {
    try {
      const response: AxiosResponse<{ success: boolean; data: PostType }> = await axios.get(
        `${API_BASE}${POST_TYPES_ENDPOINT}/${id}`,
        { headers: getAuthHeader() }
      )
      return response.data.data
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Get post type by slug
   * GET /api/post-types/slug/:slug
   */
  async getBySlug(slug: string): Promise<PostType> {
    try {
      const response: AxiosResponse<{ success: boolean; data: PostType }> = await axios.get(
        `${API_BASE}${POST_TYPES_ENDPOINT}/slug/${slug}`,
        { headers: getAuthHeader() }
      )
      return response.data.data
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Create post type
   * POST /api/post-types
   */
  async create(data: CreatePostTypeDto, token?: string): Promise<PostType> {
    try {
      const response: AxiosResponse<{ success: boolean; data: PostType }> = await axios.post(
        `${API_BASE}${POST_TYPES_ENDPOINT}`,
        data,
        { headers: getAuthHeader(token) }
      )
      return response.data.data
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Update post type
   * PATCH /api/post-types/:id
   */
  async update(id: string, data: UpdatePostTypeDto, token?: string): Promise<PostType> {
    try {
      const response: AxiosResponse<{ success: boolean; data: PostType }> = await axios.patch(
        `${API_BASE}${POST_TYPES_ENDPOINT}/${id}`,
        data,
        { headers: getAuthHeader(token) }
      )
      return response.data.data
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Delete post type
   * DELETE /api/post-types/:id
   * Note: Cannot delete system post types (isSystem: true)
   */
  async delete(id: string, token?: string): Promise<void> {
    try {
      await axios.delete(
        `${API_BASE}${POST_TYPES_ENDPOINT}/${id}`,
        { headers: getAuthHeader(token) }
      )
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Get field definitions for a post type
   * GET /api/post-types/:postTypeId/fields
   */
  async getFields(postTypeId: string): Promise<FieldDefinition[]> {
    try {
      const response: AxiosResponse<{ success: boolean; data: FieldDefinition[] }> = await axios.get(
        `${API_BASE}${POST_TYPES_ENDPOINT}/${postTypeId}/fields`,
        { headers: getAuthHeader() }
      )
      return response.data.data
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Create field definition
   * POST /api/post-types/:postTypeId/fields
   */
  async createField(
    postTypeId: string,
    data: CreateFieldDefinitionDto,
    token?: string
  ): Promise<FieldDefinition> {
    try {
      const response: AxiosResponse<{ success: boolean; data: FieldDefinition }> = await axios.post(
        `${API_BASE}${POST_TYPES_ENDPOINT}/${postTypeId}/fields`,
        data,
        { headers: getAuthHeader(token) }
      )
      return response.data.data
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Update field definition
   * PATCH /api/post-types/:postTypeId/fields/:fieldId
   */
  async updateField(
    postTypeId: string,
    fieldId: string,
    data: UpdateFieldDefinitionDto,
    token?: string
  ): Promise<FieldDefinition> {
    try {
      const response: AxiosResponse<{ success: boolean; data: FieldDefinition }> = await axios.patch(
        `${API_BASE}${POST_TYPES_ENDPOINT}/${postTypeId}/fields/${fieldId}`,
        data,
        { headers: getAuthHeader(token) }
      )
      return response.data.data
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Reorder field definitions
   * POST /api/post-types/:postTypeId/fields/reorder
   */
  async reorderFields(
    postTypeId: string,
    data: ReorderFieldsDto,
    token?: string
  ): Promise<FieldDefinition[]> {
    try {
      const response: AxiosResponse<{ success: boolean; data: FieldDefinition[] }> = await axios.post(
        `${API_BASE}${POST_TYPES_ENDPOINT}/${postTypeId}/fields/reorder`,
        data,
        { headers: getAuthHeader(token) }
      )
      return response.data.data
    } catch (error) {
      handleApiError(error)
    }
  },

  /**
   * Delete field definition
   * DELETE /api/post-types/:postTypeId/fields/:fieldId
   */
  async deleteField(
    postTypeId: string,
    fieldId: string,
    token?: string
  ): Promise<void> {
    try {
      await axios.delete(
        `${API_BASE}${POST_TYPES_ENDPOINT}/${postTypeId}/fields/${fieldId}`,
        { headers: getAuthHeader(token) }
      )
    } catch (error) {
      handleApiError(error)
    }
  }
}

export default postTypeService
