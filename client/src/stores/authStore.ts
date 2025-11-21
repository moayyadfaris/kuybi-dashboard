import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '../services/authService'

interface Role {
  id: number
  name: string
  displayName: string
  priority: number
}

interface User {
  id: string
  email: string
  name: string
  role?: string // Legacy field
  roleInfo?: Role
  additionalRoles?: Role[]
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
        
        // Load user permissions after successful login
        const { useAclStore } = await import('./aclStore')
        const aclStore = useAclStore()
        if (userData.id) {
          try {
            await aclStore.loadUserPermissions(userData.id)
          } catch (err) {
            console.error('Failed to load user permissions:', err)
          }
        }
      }
      
      return true
    } catch (err: any) {
      // Handle the error response structure from the API
      // Error format: { success: false, error: { message: "..." } } or { message: "..." }
      if (err.response?.data?.error?.message) {
        error.value = err.response.data.error.message
      } else if (err.response?.data?.message) {
        error.value = err.response.data.message
      } else {
        error.value = 'Invalid credentials. Please check your email and password.'
      }
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

  const logout = async () => {
    try {
      const refreshTokenValue = localStorage.getItem('refresh_token')
      if (refreshTokenValue) {
        // Call logout API with refresh token
        await authService.logout(refreshTokenValue)
      }
    } catch (err: any) {
      console.error('Logout API error:', err)
      // Continue with local logout even if API call fails
    } finally {
      // Clear local state and storage
      user.value = null
      setToken(null)
      localStorage.removeItem('refresh_token')
      
      // Clear ACL permissions cache
      const { useAclStore } = await import('./aclStore')
      const aclStore = useAclStore()
      aclStore.clearPermissionsCache()
    }
  }

  const checkAuth = async () => {
    if (token.value && !user.value) {
      await fetchUserProfile()
    }
    
    // Load cached permissions on app init
    if (token.value) {
      const { useAclStore } = await import('./aclStore')
      const aclStore = useAclStore()
      aclStore.loadCachedPermissions()
      
      // Refresh permissions if user is loaded
      if (user.value?.id) {
        try {
          await aclStore.loadUserPermissions(user.value.id)
        } catch (err) {
          console.error('Failed to refresh user permissions:', err)
        }
      }
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
