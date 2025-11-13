import apiClient from './authService'

export const userService = {
  // Get current user profile
  getProfile: () => apiClient.get('/v1/users/me'),

  // Get current user profile (alias)
  getCurrentUser: () => apiClient.get('/v1/users/me'),

  // Update user profile
  updateProfile: (data: any) => apiClient.patch('/v1/users/me', data),

  // Change password
  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string, invalidateAllSessions: boolean = false) => 
    apiClient.post('/v1/auth/change-password', {
      currentPassword,
      newPassword,
      confirmPassword,
      invalidateAllSessions,
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

  // Admin: Update user (with reason)
  adminUpdateUser: (userId: string, data: any) =>
    apiClient.patch(`/admin/users/${userId}`, data),

  // Delete a user (admin only)
  deleteUser: (id: string) => apiClient.delete(`/v1/users/${id}`),

  // Get user statistics
  getUserStats: () => apiClient.get('/v1/users/stats'),

  // Get all roles
  getRoles: () => apiClient.get('/v1/roles'),

  // Get user activity log
  getUserActivityLog: (page: number = 1, limit: number = 20) => apiClient.get('/v1/users/activity-log', {
    params: { page, limit },
  }),

  // Admin: Set user password
  setUserPassword: (userId: string, newPassword: string, forcePasswordChange: boolean = true, reason?: string, sendNotification: boolean = false) =>
    apiClient.post('/admin/users/set-password', {
      userId,
      newPassword,
      forcePasswordChange,
      reason,
      sendNotification,
    }),

  // Admin: Reset user password
  resetUserPassword: (userId: string, forcePasswordChange: boolean = true, reason?: string) =>
    apiClient.post('/admin/users/reset-password', {
      userId,
      forcePasswordChange,
      reason,
    }),
}

export default userService
