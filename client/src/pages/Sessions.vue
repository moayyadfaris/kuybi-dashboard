<template>
  <DashboardLayout>
    <div class="min-h-screen bg-gray-50 p-8">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">🔒 Active Sessions</h1>
          <p class="text-gray-600">Manage your active sessions across all devices</p>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Total Sessions</p>
                <p class="text-2xl font-bold text-gray-900">{{ pagination.total }}</p>
              </div>
              <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span class="text-2xl">📱</span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Active Now</p>
                <p class="text-2xl font-bold text-green-600">{{ activeSessionsCount }}</p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span class="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Desktop Sessions</p>
                <p class="text-2xl font-bold text-blue-600">{{ desktopSessionsCount }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span class="text-2xl">💻</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions Bar -->
        <div class="bg-white rounded-lg shadow mb-6 p-4 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <button
              @click="loadSessions"
              class="px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition font-medium text-sm flex items-center gap-2"
            >
              🔄 Refresh
            </button>
          </div>
          <button
            @click="confirmRevokeAllOthers"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium text-sm"
          >
            🚫 Revoke All Other Sessions
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="bg-white rounded-lg shadow p-12 text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          <p class="text-gray-600 mt-4">Loading sessions...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-white rounded-lg shadow p-12 text-center">
          <div class="text-6xl mb-4">❌</div>
          <p class="text-red-600 font-medium mb-2">Error Loading Sessions</p>
          <p class="text-gray-600 mb-4">{{ error }}</p>
          <button
            @click="loadSessions"
            class="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition font-medium"
          >
            Try Again
          </button>
        </div>

        <!-- Sessions List -->
        <div v-else-if="sessions.length > 0" class="space-y-4">
          <div
            v-for="session in sessions"
            :key="session.id"
            class="bg-white rounded-lg shadow hover:shadow-md transition p-6"
          >
            <div class="flex items-start justify-between">
              <!-- Session Info -->
              <div class="flex items-start gap-4 flex-1">
                <!-- Device Icon -->
                <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  {{ getDeviceIcon(session.deviceType) }}
                </div>

                <!-- Details -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-3 mb-2">
                    <h3 class="text-lg font-semibold text-gray-900">
                      {{ getDeviceLabel(session.deviceType) }}
                    </h3>
                    <span
                      v-if="isCurrentSession(session)"
                      class="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full"
                    >
                      ✓ Current Session
                    </span>
                    <span
                      :class="session.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                      class="px-3 py-1 text-xs font-medium rounded-full"
                    >
                      {{ session.isActive ? '● Active' : '○ Inactive' }}
                    </span>
                    <span
                      :class="getSecurityBadgeClass(session.securityLevel)"
                      class="px-3 py-1 text-xs font-medium rounded-full"
                    >
                      {{ session.securityLevel.toUpperCase() }}
                    </span>
                  </div>

                  <div class="space-y-1 text-sm text-gray-600">
                    <p class="flex items-center gap-2">
                      <span class="font-medium">Browser:</span>
                      <span class="truncate">{{ getBrowserInfo(session.userAgent) }}</span>
                    </p>
                    <p class="flex items-center gap-2">
                      <span class="font-medium">IP Address:</span>
                      <span>{{ session.ipAddress }}</span>
                    </p>
                    <p class="flex items-center gap-2">
                      <span class="font-medium">Last Active:</span>
                      <span>{{ formatRelativeTime(session.lastActivityAt) }}</span>
                      <span class="text-gray-400">•</span>
                      <span class="text-gray-500">{{ formatDate(session.lastActivityAt) }}</span>
                    </p>
                    <p class="flex items-center gap-2">
                      <span class="font-medium">Expires:</span>
                      <span>{{ formatDate(session.expiresAt) }}</span>
                    </p>
                    <p class="flex items-center gap-2 text-xs text-gray-500">
                      <span class="font-medium">Session ID:</span>
                      <span class="font-mono">{{ session.id }}</span>
                    </p>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div v-if="!isCurrentSession(session)" class="ml-4">
                <button
                  @click="confirmRevokeSession(session)"
                  class="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition font-medium text-sm"
                >
                  🗑️ Revoke
                </button>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="pagination.totalPages > 1" class="bg-white rounded-lg shadow p-4 flex items-center justify-between">
            <div class="text-sm text-gray-600">
              Showing {{ (pagination.page - 1) * pagination.limit + 1 }} to {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of {{ pagination.total }} sessions
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="previousPage"
                :disabled="pagination.page === 1"
                class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm"
              >
                ← Previous
              </button>
              <span class="text-sm text-gray-600">Page {{ pagination.page }} of {{ pagination.totalPages }}</span>
              <button
                @click="nextPage"
                :disabled="pagination.page >= pagination.totalPages"
                class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm"
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="bg-white rounded-lg shadow p-12 text-center">
          <div class="text-6xl mb-4">🔒</div>
          <p class="text-gray-600 font-medium mb-2">No Sessions Found</p>
          <p class="text-gray-500 text-sm">You don't have any active sessions</p>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { sessionService } from '../services/sessionService'
import DashboardLayout from '../components/DashboardLayout.vue'

interface Session {
  id: string
  userId: string
  deviceType: string
  userAgent: string
  ipAddress: string
  securityLevel: string
  sessionType: string
  isActive: boolean
  lastActivityAt: string
  expiresAt: string
  createdAt: string
  metadata?: any
}

// State
const sessions = ref<Session[]>([])
const loading = ref(false)
const error = ref('')
const currentSessionId = ref('')

const pagination = ref({
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
})

// Computed
const activeSessionsCount = computed(() => sessions.value.filter(s => s.isActive).length)
const desktopSessionsCount = computed(() => sessions.value.filter(s => s.deviceType === 'desktop').length)

// Methods
const loadSessions = async () => {
  try {
    loading.value = true
    error.value = ''

    const response = await sessionService.getMySessions(pagination.value.page, pagination.value.limit)
    const data = response.data?.data || response.data

    sessions.value = data.sessions || []
    
    if (data.pagination) {
      pagination.value = data.pagination
    }

    // Try to identify current session (simplified - in real app you'd get this from token)
    if (sessions.value.length > 0) {
      currentSessionId.value = sessions.value[0].id
    }
  } catch (err: any) {
    error.value = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to load sessions'
    console.error('Load sessions error:', err)
  } finally {
    loading.value = false
  }
}

const confirmRevokeSession = (session: Session) => {
  if (confirm(`Are you sure you want to revoke this session?\n\nDevice: ${getDeviceLabel(session.deviceType)}\nIP: ${session.ipAddress}\n\nThis will immediately log out this device.`)) {
    revokeSession(session.id)
  }
}

const revokeSession = async (sessionId: string) => {
  try {
    await sessionService.revokeSession(sessionId)
    await loadSessions()
  } catch (err: any) {
    alert(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to revoke session')
  }
}

const confirmRevokeAllOthers = () => {
  if (confirm('Are you sure you want to revoke all other sessions?\n\nThis will log you out from all devices except this one.')) {
    revokeAllOtherSessions()
  }
}

const revokeAllOtherSessions = async () => {
  try {
    await sessionService.revokeAllOtherSessions()
    await loadSessions()
  } catch (err: any) {
    alert(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to revoke sessions')
  }
}

const previousPage = () => {
  if (pagination.value.page > 1) {
    pagination.value.page--
    loadSessions()
  }
}

const nextPage = () => {
  if (pagination.value.page < pagination.value.totalPages) {
    pagination.value.page++
    loadSessions()
  }
}

// Utility Functions
const isCurrentSession = (session: Session) => {
  // This is a simplified check - ideally you'd compare with actual current session ID from auth
  return session.id === currentSessionId.value
}

const getDeviceIcon = (deviceType: string) => {
  const icons: Record<string, string> = {
    'desktop': '💻',
    'mobile': '📱',
    'tablet': '📱',
    'api-client': '🔧',
    'bot': '🤖',
    'unknown': '❓',
  }
  return icons[deviceType] || '💻'
}

const getDeviceLabel = (deviceType: string) => {
  const labels: Record<string, string> = {
    'desktop': 'Desktop Browser',
    'mobile': 'Mobile Device',
    'tablet': 'Tablet',
    'api-client': 'API Client',
    'bot': 'Bot',
    'unknown': 'Unknown Device',
  }
  return labels[deviceType] || 'Unknown Device'
}

const getBrowserInfo = (userAgent: string) => {
  // Simple browser detection
  if (userAgent.includes('Chrome')) return 'Chrome'
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('Safari')) return 'Safari'
  if (userAgent.includes('Edge')) return 'Edge'
  if (userAgent.includes('Postman')) return 'Postman'
  return userAgent.substring(0, 50)
}

const getSecurityBadgeClass = (level: string) => {
  const classes: Record<string, string> = {
    'low': 'bg-red-100 text-red-800',
    'medium': 'bg-amber-100 text-amber-800',
    'high': 'bg-green-100 text-green-800',
  }
  return classes[level] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  return formatDate(dateString)
}

// Lifecycle
onMounted(() => {
  loadSessions()
})
</script>
