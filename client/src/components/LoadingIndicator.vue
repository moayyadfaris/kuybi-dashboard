<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="loadingStore.isLoading" class="fixed inset-0 z-50">
        <!-- Backdrop with blur effect -->
        <div class="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-indigo-900/10 backdrop-blur-sm"></div>

        <!-- Loading Container -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center gap-6 transform transition-all">
            <!-- Animated Logo Spinner -->
            <div class="relative w-20 h-20">
              <!-- Outer ring -->
              <div class="absolute inset-0 rounded-full border-4 border-blue-100"></div>
              
              <!-- Animated gradient ring -->
              <div
                class="absolute inset-0 rounded-full border-4 border-transparent animate-spin"
                style="
                  border-top-color: #3b82f6;
                  border-right-color: #6366f1;
                  animation-duration: 1s;
                "
              ></div>
              
              <!-- Inner pulsing circle -->
              <div class="absolute inset-2 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 animate-pulse flex items-center justify-center">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>

            <!-- Loading Text with animated dots -->
            <div class="flex items-center gap-2">
              <p class="text-gray-700 font-semibold text-lg">Loading</p>
              <div class="flex gap-1">
                <span class="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
                <span class="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
                <span class="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
              </div>
            </div>

            <!-- Progress bar -->
            <div class="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-blue-500 to-indigo-600 animate-progress"></div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useLoadingStore } from '../stores/loadingStore'

const loadingStore = useLoadingStore()
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes progress {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
}

.animate-progress {
  animation: progress 1.5s ease-in-out infinite;
}

/* Custom bounce animation for dots */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.animate-bounce {
  animation: bounce 1s ease-in-out infinite;
}
</style>
