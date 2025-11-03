<template>
  <DashboardLayout>
    <div class="min-h-screen bg-gray-50">      
      <!-- Header -->
      <div class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Stats Cards -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-gray-500 text-sm font-medium">Total Stories</h3>
            <p class="text-3xl font-bold text-gray-900 mt-2">0</p>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-gray-500 text-sm font-medium">Categories</h3>
            <p class="text-3xl font-bold text-gray-900 mt-2">0</p>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-gray-500 text-sm font-medium">Tags</h3>
            <p class="text-3xl font-bold text-gray-900 mt-2">0</p>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-gray-500 text-sm font-medium">User Role</h3>
            <p class="text-lg font-bold text-gray-900 mt-2">{{ authStore.user?.role }}</p>
          </div>
        </div>

        <!-- Welcome Section -->
        <div class="bg-white rounded-lg shadow p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Welcome to Kuybi Dashboard</h2>
          <p class="text-gray-600 mb-6">
            This is your content management dashboard. You can manage stories, categories, tags, and media files from here.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <router-link to="/stories" class="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition font-medium text-center">
              View Stories
            </router-link>
            <router-link to="/categories" class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium text-center">
              Manage Categories
            </router-link>
            <router-link to="/tags" class="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-medium text-center">
              Manage Tags
            </router-link>
          </div>
        </div>

        <!-- User Profile Info -->
        <div class="mt-8 bg-white rounded-lg shadow p-8">
          <h3 class="text-xl font-bold text-gray-900 mb-4">Your Profile</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p class="text-sm text-gray-500">Email</p>
              <p class="text-lg font-medium text-gray-900">{{ authStore.user?.email }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Full Name</p>
              <p class="text-lg font-medium text-gray-900">{{ authStore.user?.name }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Role</p>
              <p class="text-lg font-medium text-gray-900">{{ authStore.user?.role }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">User ID</p>
              <p class="text-lg font-medium text-gray-900 font-mono">{{ authStore.user?.id }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/authStore'
import DashboardLayout from '../components/DashboardLayout.vue'

const authStore = useAuthStore()
</script>

<style scoped>
</style>
