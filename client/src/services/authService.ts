import axios from 'axios'
import { useAuthStore } from '../stores/authStore'
import { useLoadingStore } from '../stores/loadingStore'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4040/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Flag to prevent multiple token refresh requests
let isRefreshing = false
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: any) => void }> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token || '')
    }
  })
  failedQueue = []
}

// Add request interceptor to include token and show loading
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // Show loading indicator
    const loadingStore = useLoadingStore()
    loadingStore.startLoading()
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle token refresh and hide loading
apiClient.interceptors.response.use(
  (response) => {
    const loadingStore = useLoadingStore()
    loadingStore.stopLoading()
    return response
  },
  async (error) => {
    const originalRequest = error.config
    const loadingStore = useLoadingStore()

    // Don't try to refresh token if this is a login request or if no refresh token exists
    const isLoginRequest = originalRequest.url?.includes('/auth/login')
    
    if (error.response?.status === 401 && !originalRequest._retry && !isLoginRequest) {
      if (isRefreshing) {
        // Queue the request if refresh is already in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return apiClient(originalRequest)
        }).catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        // Use axios directly to avoid infinite loops
        const response = await axios.post(`${API_BASE_URL}/v1/auth/refresh`, {
          refreshToken,
        })

        const newToken = response.data.data?.accessToken || response.data.accessToken
        if (!newToken) {
          throw new Error('No access token in refresh response')
        }

        localStorage.setItem('access_token', newToken)
        
        // Update auth store token
        const authStore = useAuthStore()
        authStore.setToken(newToken)

        // Process queued requests
        processQueue(null, newToken)

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return apiClient(originalRequest)
      } catch (err) {
        // Clear tokens and redirect to login
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        
        // Update auth store
        const authStore = useAuthStore()
        authStore.logout()

        // Process failed queue
        processQueue(err, null)

        // Redirect to login
        window.location.href = '/login'
        return Promise.reject(err)
      } finally {
        isRefreshing = false
        loadingStore.stopLoading()
      }
    }

    loadingStore.stopLoading()
    return Promise.reject(error)
  }
)

export const authService = {
  login: (email: string, password: string) =>
    apiClient.post('/v1/auth/login', { email, password }),

  logout: () => apiClient.post('/v1/auth/logout'),

  refreshToken: (refreshToken: string) =>
    apiClient.post('/v1/auth/refresh', { refreshToken }),

  getProfile: () => apiClient.get('/v1/users/me'),

  updateProfile: (data: any) => apiClient.patch('/v1/users/profile', data),
  
  // Check password strength
  checkPasswordStrength: (password: string) =>
    apiClient.post('/v1/auth/password-strength', { password }),
}

export default apiClient
