import apiClient from './authService'

export const tagService = {
  // Get all tags
  getTags: (page: number = 1, limit: number = 100) =>
    apiClient.get('/v1/tags', {
      params: { page, limit },
    }),

  // Get a single tag by ID
  getTag: (id: string) => apiClient.get(`/v1/tags/${id}`),

  // Create a new tag
  createTag: (data: {
    name: string
    description?: string
    slug?: string
    color?: string
  }) => apiClient.post('/v1/tags', data),

  // Update a tag
  updateTag: (id: string, data: any) =>
    apiClient.patch(`/v1/tags/${id}`, data),

  // Delete a tag
  deleteTag: (id: string) => apiClient.delete(`/v1/tags/${id}`),

  // Search tags
  searchTags: (query: string) =>
    apiClient.get('/v1/tags/search', {
      params: { q: query },
    }),

  // Get tag statistics
  getTagStats: (id: string) =>
    apiClient.get(`/v1/tags/${id}/stats`),

  // Get popular tags
  getPopularTags: (limit: number = 10) =>
    apiClient.get('/v1/tags/popular', {
      params: { limit },
    }),
}

export default tagService
