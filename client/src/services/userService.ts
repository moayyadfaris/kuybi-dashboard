import apiClient from './authService'

export const userService = {
  // Get current user profile
  getProfile: () => apiClient.get('/v1/users/me'),

  // Get current user profile (alias)
  getCurrentUser: () => apiClient.get('/v1/users/me'),

  // Update user profile
  updateProfile: (data: any) => apiClient.patch('/v1/users/me', data),

  // Change password
  changePassword: (oldPassword: string, newPassword: string) => apiClient.post('/v1/users/change-password', {
    oldPassword,
    newPassword,
  }),

  // Update profile image
  updateProfileImage: (attachmentId: string) => apiClient.put('/v1/users/me/profile-image', {
    attachmentId,
  }),

  // Get all users (admin only)
  getUsers: (page: number = 1, limit: number = 10, filters?: any) => apiClient.get('/v1/users', {
    params: {
      page,
      limit,
      ...filters,
    },
  }),

  // Get a single user by ID (admin only)
  getUser: (id: string) => apiClient.get(`/v1/users/${id}`),

  // Update a user (admin only)
  updateUser: (id: string, data: any) =>
    apiClient.patch(`/v1/users/${id}`, data),

  // Delete a user (admin only)
  deleteUser: (id: string) => apiClient.delete(`/v1/users/${id}`),

  // Get user statistics
  getUserStats: () => apiClient.get('/v1/users/stats'),

  // Get user activity log
  getUserActivityLog: (page: number = 1, limit: number = 20) => apiClient.get('/v1/users/activity-log', {
    params: { page, limit },
  }),
}

export default userService
