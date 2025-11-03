import apiClient from './authService'

export const categoryService = {
  // Get all categories
  getCategories: (page: number = 1, limit: number = 100, includeCounts: boolean = false) =>
    apiClient.get('/v1/categories', {
      params: { page, limit, includeCounts },
    }),

  // Get a single category by ID
  getCategory: (id: string) => apiClient.get(`/v1/categories/${id}`),

  // Create a new category
  createCategory: (data: {
    name: string
    description?: string
    slug?: string
    color?: string
  }) => apiClient.post('/v1/categories', data),

  // Update a category
  updateCategory: (id: string, data: any) =>
    apiClient.patch(`/v1/categories/${id}`, data),

  // Delete a category
  deleteCategory: (id: string) => apiClient.delete(`/v1/categories/${id}`),

  // Search categories
  searchCategories: (query: string) =>
    apiClient.get('/v1/categories/search', {
      params: { q: query },
    }),

  // Get category statistics
  getCategoryStats: (id: string) =>
    apiClient.get(`/v1/categories/${id}/stats`),
}

export default categoryService
