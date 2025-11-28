<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <div
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'md:relative md:translate-x-0'
      ]"
    >
      <!-- Sidebar Header -->
      <div class="h-16 bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-between px-6 shadow-lg">
        <router-link to="/" class="text-white font-bold text-xl flex items-center gap-2">
          <span class="text-2xl">🍥</span>
          Kuybi
        </router-link>
        <button
          @click="sidebarOpen = false"
          class="md:hidden text-white hover:bg-orange-700 p-1 rounded"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Sidebar Navigation -->
      <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <!-- Dashboard -->
        <router-link
          to="/"
          class="flex items-center px-4 py-3 rounded-lg transition"
          :class="isActive('/') ? 'bg-orange-100 text-orange-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-orange-50'"
          @click="sidebarOpen = false"
        >
          <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          Dashboard
        </router-link>

        <!-- Stories -->
        <router-link
          to="/stories"
          class="flex items-center px-4 py-3 rounded-lg transition"
          :class="isActive('/stories') ? 'bg-orange-100 text-orange-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-orange-50'"
          @click="sidebarOpen = false"
        >
          <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000-2H6a4 4 0 014 4v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3 1h6v6H7V6z" clip-rule="evenodd" />
          </svg>
          Stories
        </router-link>

        <!-- Categories -->
        <router-link
          to="/categories"
          class="flex items-center px-4 py-3 rounded-lg transition"
          :class="isActive('/categories') ? 'bg-orange-100 text-orange-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-orange-50'"
          @click="sidebarOpen = false"
        >
          <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h1a1 1 0 001-1v-6a1 1 0 00-1-1h-1z" />
          </svg>
          Categories
        </router-link>

        <!-- Tags -->
        <router-link
          to="/tags"
          class="flex items-center px-4 py-3 rounded-lg transition"
          :class="isActive('/tags') ? 'bg-orange-100 text-orange-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-orange-50'"
          @click="sidebarOpen = false"
        >
          <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.999.999 0 010 10V4a1 1 0 011-1h6a.999.999 0 01.707.293l7 7zM4 6a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
          </svg>
          Tags
        </router-link>

        <!-- Media -->
        <router-link
          to="/media"
          class="flex items-center px-4 py-3 rounded-lg transition"
          :class="isActive('/media') ? 'bg-orange-100 text-orange-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-orange-50'"
          @click="sidebarOpen = false"
        >
          <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7l-2.5-2.5a1 1 0 00-1.415 0L9 10.414l-2.5-2.5a1 1 0 00-1.415 0L5 10V5z" />
            <circle cx="8" cy="9" r="1.5" />
          </svg>
          Media
        </router-link>

        <!-- Post Types -->
        <router-link
          to="/post-types"
          class="flex items-center px-4 py-3 rounded-lg transition"
          :class="isActive('/post-types') ? 'bg-orange-100 text-orange-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-orange-50'"
          @click="sidebarOpen = false"
        >
          <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
          Post Types
        </router-link>

        <!-- Users -->
        <router-link
          to="/users"
          class="flex items-center px-4 py-3 rounded-lg transition"
          :class="isActive('/users') ? 'bg-orange-100 text-orange-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-orange-50'"
          @click="sidebarOpen = false"
        >
          <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          Users
        </router-link>

        <!-- Sessions -->
        <router-link
          to="/sessions"
          class="flex items-center px-4 py-3 rounded-lg transition"
          :class="isActive('/sessions') ? 'bg-orange-100 text-orange-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-orange-50'"
          @click="sidebarOpen = false"
        >
          <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
          </svg>
          Sessions
        </router-link>

        <!-- ACL Section (Admin+) -->
        <template v-if="canViewACL">
          <!-- Divider -->
          <div class="my-4 border-t border-gray-200" />
          
          <div class="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Access Control
          </div>

          <!-- Roles -->
          <router-link
            to="/acl/roles"
            class="flex items-center px-4 py-3 rounded-lg transition"
            :class="isActive('/acl/roles') ? 'bg-orange-100 text-orange-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-orange-50'"
            @click="sidebarOpen = false"
          >
            <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            Roles
          </router-link>

          <!-- Permissions -->
          <router-link
            to="/acl/permissions"
            class="flex items-center px-4 py-3 rounded-lg transition"
            :class="isActive('/acl/permissions') ? 'bg-orange-100 text-orange-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-orange-50'"
            @click="sidebarOpen = false"
          >
            <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
            </svg>
            Permissions
          </router-link>

          <!-- System Status -->
          <router-link
            to="/system-status"
            class="flex items-center px-4 py-3 rounded-lg transition"
            :class="isActive('/system-status') ? 'bg-orange-100 text-orange-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-orange-50'"
            @click="sidebarOpen = false"
          >
            <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
            </svg>
            System Status
          </router-link>
        </template>

        <!-- Divider -->
        <div class="my-4 border-t border-gray-200" />

        <!-- Settings -->
        <router-link
          to="/settings"
          class="flex items-center px-4 py-3 rounded-lg transition"
          :class="isActive('/settings') ? 'bg-orange-100 text-orange-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-orange-50'"
          @click="sidebarOpen = false"
        >
          <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
          </svg>
          Settings
        </router-link>

        <!-- Profile -->
        <router-link
          to="/profile"
          class="flex items-center px-4 py-3 rounded-lg transition"
          :class="isActive('/profile') ? 'bg-orange-100 text-orange-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-orange-50'"
          @click="sidebarOpen = false"
        >
          <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
          Profile
        </router-link>
      </nav>

      <!-- Sidebar Footer -->
      <div class="p-4 border-t border-gray-200 bg-gradient-to-br from-orange-50 to-amber-50">
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
            {{ getInitials(authStore.user?.name) }}
          </div>
          <div class="ml-3 flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ authStore.user?.name }}</p>
            <p class="text-xs text-gray-500 truncate">{{ authStore.user?.email }}</p>
          </div>
        </div>
        <button
          @click="handleLogout"
          class="w-full px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition font-medium text-sm shadow-sm"
        >
          Logout
        </button>
      </div>
    </div>

    <!-- Mobile Overlay -->
    <div
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
    />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Mobile Top Bar -->
      <div class="md:hidden h-16 bg-white shadow-md flex items-center justify-between px-4">
        <button
          @click="sidebarOpen = true"
          class="text-gray-600 hover:text-orange-600 transition"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div class="flex items-center gap-2">
          <span class="text-2xl">🍥</span>
          <span class="font-bold text-gray-900">Kuybi</span>
        </div>
        <div class="w-6"></div> <!-- Spacer for centering -->
      </div>

      <!-- Page Content -->
      <div class="flex-1 overflow-auto">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'
import { usePermissions } from '../composables/usePermissions'
import { useAclStore } from '../stores/aclStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const aclStore = useAclStore()
const { can, hasMinLevel } = usePermissions()
const sidebarOpen = ref(false)

// Load cached permissions on mount
onMounted(() => {
  aclStore.loadCachedPermissions()
})

const canViewACL = computed(() => {
  // Show ACL menu for Admin priority (90) and above
  // Check from user's roleInfo directly (available immediately after login)
  const userPriority = authStore.user?.roleInfo?.priority ?? 0
  return userPriority >= 90
})

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const getInitials = (name?: string) => {
  if (!name) return 'U'
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
</style>
