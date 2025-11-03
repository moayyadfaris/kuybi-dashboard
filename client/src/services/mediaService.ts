import apiClient from './authService'

export const mediaService = {
  // Get all attachments
  getAttachments: (page: number = 1, limit: number = 20, filters?: any) =>
    apiClient.get('/v1/attachments', {
      params: {
        page,
        limit,
        ...filters,
      },
    }),

  // Get a single attachment by ID
  getAttachment: (id: string) => apiClient.get(`/v1/attachments/${id}`),

  // Upload a new attachment
  uploadAttachment: (file: File, metadata?: any) => {
    const formData = new FormData()
    formData.append('file', file)
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata))
    }
    return apiClient.post('/v1/attachments', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Upload multiple attachments
  uploadAttachments: (files: File[], metadata?: any) => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata))
    }
    return apiClient.post('/v1/attachments/bulk', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Delete an attachment
  deleteAttachment: (id: string) => apiClient.delete(`/v1/attachments/${id}`),

  // Delete multiple attachments
  deleteAttachments: (ids: string[]) =>
    apiClient.post('/v1/attachments/bulk-delete', { ids }),

  // Update attachment metadata
  updateAttachment: (id: string, data: any) =>
    apiClient.patch(`/v1/attachments/${id}`, data),

  // Get attachment download URL
  getDownloadUrl: (id: string) => `/v1/attachments/${id}/download`,

  // Search attachments
  searchAttachments: (query: string, page: number = 1, limit: number = 20) =>
    apiClient.get('/v1/attachments/search', {
      params: {
        q: query,
        page,
        limit,
      },
    }),
}

export default mediaService
