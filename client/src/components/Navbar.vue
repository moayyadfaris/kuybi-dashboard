<template>
  <nav class="bg-white shadow-md border-b-4 border-orange-500">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center space-x-8">
          <router-link to="/" class="text-2xl font-bold text-orange-600 hover:text-orange-700 flex items-center gap-2">
            <span class="text-3xl">🍥</span>
            Kuybi
          </router-link>
          <div class="hidden md:flex space-x-6">
            <router-link 
              to="/" 
              class="px-3 py-2 rounded-md text-sm font-medium transition border-b-2 border-transparent"
              :class="{ 'text-orange-600 border-orange-600 bg-orange-50': $route.path === '/', 'text-gray-600 hover:text-gray-900 hover:bg-gray-50': $route.path !== '/' }"
            >
              Dashboard
            </router-link>
            <router-link 
              to="/stories" 
              class="px-3 py-2 rounded-md text-sm font-medium transition border-b-2 border-transparent"
              :class="{ 'text-orange-600 border-orange-600 bg-orange-50': $route.path.startsWith('/stories'), 'text-gray-600 hover:text-gray-900 hover:bg-gray-50': !$route.path.startsWith('/stories') }"
            >
              Stories
            </router-link>
            <router-link 
              to="/categories" 
              class="px-3 py-2 rounded-md text-sm font-medium transition border-b-2 border-transparent"
              :class="{ 'text-orange-600 border-orange-600 bg-orange-50': $route.path === '/categories', 'text-gray-600 hover:text-gray-900 hover:bg-gray-50': $route.path !== '/categories' }"
            >
              Categories
            </router-link>
            <router-link 
              to="/tags" 
              class="px-3 py-2 rounded-md text-sm font-medium transition border-b-2 border-transparent"
              :class="{ 'text-orange-600 border-orange-600 bg-orange-50': $route.path === '/tags', 'text-gray-600 hover:text-gray-900 hover:bg-gray-50': $route.path !== '/tags' }"
            >
              Tags
            </router-link>
            <router-link 
              to="/settings" 
              class="px-3 py-2 rounded-md text-sm font-medium transition border-b-2 border-transparent"
              :class="{ 'text-orange-600 border-orange-600 bg-orange-50': $route.path === '/settings', 'text-gray-600 hover:text-gray-900 hover:bg-gray-50': $route.path !== '/settings' }"
            >
              Settings
            </router-link>
            <router-link 
              to="/media" 
              class="px-3 py-2 rounded-md text-sm font-medium transition border-b-2 border-transparent"
              :class="{ 'text-orange-600 border-orange-600 bg-orange-50': $route.path === '/media', 'text-gray-600 hover:text-gray-900 hover:bg-gray-50': $route.path !== '/media' }"
            >
              Media
            </router-link>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="hidden sm:flex items-center space-x-4">
            <router-link 
              to="/profile"
              class="text-gray-700 hover:text-orange-600 transition text-sm font-medium"
            >
              {{ authStore.user?.name }}
            </router-link>
            <span class="text-gray-400">|</span>
            <span class="text-gray-600 text-sm">{{ authStore.user?.role }}</span>
          </div>
          <button
            @click="handleLogout"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
</style>
