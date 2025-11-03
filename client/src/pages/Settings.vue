<template>
  <DashboardLayout>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 class="text-3xl font-bold text-gray-900">Settings</h1>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Settings Card -->
        <div class="md:col-span-2">
          <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900">Breadcrumb Animation</h2>
              <p class="text-sm text-gray-600 mt-1">Customize the animation style for breadcrumb icons</p>
            </div>

            <div class="px-6 py-6 space-y-6">
              <!-- Animation Style Selection -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">Animation Style</label>
                <div class="space-y-3">
                  <label v-for="style in animationStyles" :key="style.value" class="flex items-center">
                    <input
                      type="radio"
                      :value="style.value"
                      v-model="settings.animationStyle"
                      @change="saveSettings"
                      class="h-4 w-4 text-orange-600"
                    />
                    <span class="ml-3 text-sm text-gray-700">
                      {{ style.label }}
                      <span class="text-gray-500 text-xs ml-2">({{ style.description }})</span>
                    </span>
                  </label>
                </div>
              </div>

              <!-- Animation Speed -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">Animation Speed</label>
                <div class="space-y-3">
                  <label v-for="speed in animationSpeeds" :key="speed.value" class="flex items-center">
                    <input
                      type="radio"
                      :value="speed.value"
                      v-model="settings.animationSpeed"
                      @change="saveSettings"
                      class="h-4 w-4 text-orange-600"
                    />
                    <span class="ml-3 text-sm text-gray-700">{{ speed.label }}</span>
                  </label>
                </div>
              </div>

              <!-- Enable/Disable Animations -->
              <div>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="settings.enableAnimations"
                    @change="saveSettings"
                    class="h-4 w-4 text-orange-600 rounded"
                  />
                  <span class="ml-3 text-sm text-gray-700">Enable breadcrumb animations</span>
                </label>
              </div>

              <!-- Preview Section -->
              <div class="pt-4 border-t border-gray-200">
                <p class="text-sm font-medium text-gray-700 mb-4">Preview</p>
                <div class="bg-gray-50 p-4 rounded border border-gray-200">
                  <div class="flex items-center space-x-2 text-sm">
                    <span class="text-gray-600">Home</span>
                    <span class="text-gray-400">/</span>
                    <div class="flex items-center">
                      <svg 
                        class="w-4 h-4 mr-1 text-gray-600" 
                        :class="getAnimationClass()"
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000-2H6a4 4 0 014 4v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3 1h6v6H7V6z" clip-rule="evenodd" />
                      </svg>
                      <span class="text-gray-600">Settings</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Info Card -->
        <div class="md:col-span-1">
          <div class="bg-orange-50 rounded-lg p-4 border border-blue-200">
            <h3 class="text-sm font-semibold text-orange-900 mb-2">Animation Styles</h3>
            <ul class="text-xs text-orange-800 space-y-2">
              <li><strong>Bounce:</strong> Subtle vertical bouncing motion</li>
              <li><strong>Pulse:</strong> Gentle opacity pulsing effect</li>
              <li><strong>Spin:</strong> Smooth rotating animation</li>
              <li><strong>Fade:</strong> Smooth fade in/out effect</li>
              <li><strong>None:</strong> No animation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DashboardLayout from '../components/DashboardLayout.vue'

interface Settings {
  animationStyle: string
  animationSpeed: string
  enableAnimations: boolean
}

const animationStyles = [
  { value: 'bounce', label: 'Bounce', description: 'Vertical bouncing motion' },
  { value: 'pulse', label: 'Pulse', description: 'Gentle opacity pulsing' },
  { value: 'spin', label: 'Spin', description: 'Smooth rotation' },
  { value: 'fade', label: 'Fade', description: 'Fade in/out effect' },
  { value: 'none', label: 'None', description: 'No animation' }
]

const animationSpeeds = [
  { value: 'slow', label: 'Slow (1.5s)' },
  { value: 'normal', label: 'Normal (1s)' },
  { value: 'fast', label: 'Fast (0.5s)' }
]

const settings = ref<Settings>({
  animationStyle: 'bounce',
  animationSpeed: 'normal',
  enableAnimations: true
})

const getAnimationClass = () => {
  if (!settings.value.enableAnimations) return ''
  
  const baseClass = {
    bounce: 'animate-bounce',
    pulse: 'animate-pulse',
    spin: 'animate-spin',
    fade: 'animate-pulse opacity-75',
    none: ''
  }[settings.value.animationStyle] || ''

  const speedClass = {
    slow: '[animation-duration:1.5s]',
    normal: '',
    fast: '[animation-duration:0.5s]'
  }[settings.value.animationSpeed] || ''

  return `${baseClass} ${speedClass}`.trim()
}

const saveSettings = () => {
  localStorage.setItem('breadcrumbSettings', JSON.stringify(settings.value))
  // Dispatch custom event to update breadcrumb animations globally
  window.dispatchEvent(new CustomEvent('breadcrumb-settings-changed', { detail: settings.value }))
}

onMounted(() => {
  // Load settings from localStorage
  const saved = localStorage.getItem('breadcrumbSettings')
  if (saved) {
    try {
      settings.value = JSON.parse(saved)
    } catch (e) {
      console.error('Failed to load settings:', e)
    }
  }
})
</script>

<style scoped>
</style>
