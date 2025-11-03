<template>
  <div id="app" class="min-h-screen bg-background text-foreground">
    <LoadingIndicator />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/authStore'
import LoadingIndicator from './components/LoadingIndicator.vue'
import { onMounted } from 'vue'

const authStore = useAuthStore()

onMounted(async () => {
  // Restore token from localStorage and check authentication
  const token = localStorage.getItem('access_token')
  if (token) {
    authStore.token = token
    try {
      await authStore.fetchUserProfile()
    } catch (err) {
      console.error('Failed to restore auth state:', err)
      authStore.logout()
    }
  }
})
</script>

<style scoped>
</style>
