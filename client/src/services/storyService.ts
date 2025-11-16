import apiClient from './authService'

export const storyService = {
  // Get all stories with pagination
  getStories: (page: number = 1, limit: number = 10, filters?: any) =>
    apiClient.get('/v1/stories', {
      params: {
        page,
        limit,
        ...filters,
      },
    }),

  // Get a single story by ID
  getStory: (id: string) => apiClient.get(`/v1/stories/${id}`),

  // Get a single story by ID (alias)
  getStoryById: (id: string) => apiClient.get(`/v1/stories/${id}`),

  // Create a new story
  createStory: (data: any) => apiClient.post('/v1/stories', data),

  // Update a story
  updateStory: (id: string, data: any) => apiClient.patch(`/v1/stories/${id}`, data),

  // Delete a story
  deleteStory: (id: string) => apiClient.delete(`/v1/stories/${id}`),

  // Search stories
  searchStories: (query: string) => apiClient.get('/v1/stories/search', {
    params: { q: query },
  }),

  // Get stories by category
  getStoriesByCategory: (categoryId: string, page: number = 1, limit: number = 10) => apiClient.get(`/v1/stories/category/${categoryId}`, {
    params: { page, limit },
  }),

  // Get stories by tag
  getStoriesByTag: (tagId: string, page: number = 1, limit: number = 10) => apiClient.get(`/v1/stories/tag/${tagId}`, {
    params: { page, limit },
  }),

  // Get story statistics
  getStoryStats: () => apiClient.get('/v1/stories/stats'),

  // Set story main image
  setMainImage: (id: string, attachmentId: string) => apiClient.put(`/v1/stories/${id}/main-image`, {
    attachmentId,
  }),

  // Remove story main image
  removeMainImage: (id: string) => apiClient.delete(`/v1/stories/${id}/main-image`),

  // Get story versions
  getStoryVersions: (id: string) => apiClient.get(`/v1/stories/${id}/versions`),

  // Compare story versions
  compareVersions: (id: string, versionA: number, versionB: number) =>
    apiClient.post(`/v1/stories/${id}/versions/compare`, {
      versionA,
      versionB,
    }),
}

export default storyService
