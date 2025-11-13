import apiClient from './authService'

export const sessionService = {
  // Get current user's sessions
  getMySessions: (page: number = 1, limit: number = 10) =>
    apiClient.get('/v1/sessions/me', {
      params: { page, limit },
    }),

  // Get sessions for a specific user (admin only)
  getUserSessions: (userId: string) =>
    apiClient.get(`/v1/sessions/users/${userId}/`),

  // Revoke a specific session
  revokeSession: (sessionId: string) =>
    apiClient.delete(`/v1/sessions/${sessionId}`),

  // Revoke all sessions except current
  revokeAllOtherSessions: () =>
    apiClient.delete('/v1/sessions/revoke-others'),
}

export default sessionService
