import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '../services/authService'

interface User {
  id: string
  email: string
  name: string
  role: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('access_token'))
  const loading = ref(false)
  const error = ref<string | null>(null)

  // User is authenticated if they have a valid token
  const isAuthenticated = computed(() => !!token.value)

  // Watch token changes and persist to localStorage
  const setToken = (newToken: string | null) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('access_token', newToken)
    } else {
      localStorage.removeItem('access_token')
    }
  }

  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await authService.login(email, password)
      // Handle the API response structure: { success, data: { accessToken, refreshToken, user } }
      const { accessToken, refreshToken, user: userData } = response.data.data
      
      setToken(accessToken)
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken)
      }
      
      // Set user data from login response
      if (userData) {
        user.value = userData
      }
      
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed'
      return false
    } finally {
      loading.value = false
    }
  }

  const fetchUserProfile = async () => {
    if (!token.value) return
    try {
      const response = await authService.getProfile()
      // Handle both response structures
      user.value = response.data.data || response.data
    } catch (err: any) {
      error.value = 'Failed to fetch user profile'
      logout()
    }
  }

  const logout = () => {
    user.value = null
    setToken(null)
    localStorage.removeItem('refresh_token')
  }

  const checkAuth = async () => {
    if (token.value && !user.value) {
      await fetchUserProfile()
    }
  }

  const refreshToken = async () => {
    try {
      const refreshTokenValue = localStorage.getItem('refresh_token')
      if (!refreshTokenValue) {
        logout()
        return false
      }
      const response = await authService.refreshToken(refreshTokenValue)
      // Handle the API response structure
      const newToken = response.data.data?.accessToken || response.data.accessToken
      setToken(newToken)
      return true
    } catch (err) {
      logout()
      return false
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    fetchUserProfile,
    refreshToken,
    setToken,
  }
})
