import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  const requestCount = ref(0)
  const isLoading = computed(() => requestCount.value > 0)

  const startLoading = () => {
    requestCount.value++
  }

  const stopLoading = () => {
    if (requestCount.value > 0) {
      requestCount.value--
    }
  }

  const resetLoading = () => {
    requestCount.value = 0
  }

  return {
    isLoading,
    requestCount,
    startLoading,
    stopLoading,
    resetLoading,
  }
})
