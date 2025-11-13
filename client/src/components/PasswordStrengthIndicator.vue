<template>
  <div v-if="password" class="mt-2">
    <!-- Strength Bar -->
    <div class="flex items-center gap-2 mb-2">
      <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          :class="strengthBarClass"
          :style="{ width: strengthPercentage }"
          class="h-full transition-all duration-300"
        ></div>
      </div>
      <span :class="strengthTextClass" class="text-xs font-semibold uppercase min-w-[60px]">
        {{ strengthData?.strength || 'Checking...' }}
      </span>
    </div>

    <!-- Loading State -->
    <div v-if="checking" class="text-xs text-gray-500 flex items-center gap-1">
      <span class="inline-block animate-spin">⏳</span>
      Checking password strength...
    </div>

    <!-- Requirements -->
    <div v-if="strengthData && !checking" class="space-y-1">
      <div class="grid grid-cols-2 gap-1 text-xs">
        <div :class="strengthData.requirements?.minLength ? 'text-green-600' : 'text-gray-400'" class="flex items-center gap-1">
          {{ strengthData.requirements?.minLength ? '✓' : '○' }} Min 8 characters
        </div>
        <div :class="strengthData.requirements?.hasUppercase ? 'text-green-600' : 'text-gray-400'" class="flex items-center gap-1">
          {{ strengthData.requirements?.hasUppercase ? '✓' : '○' }} Uppercase
        </div>
        <div :class="strengthData.requirements?.hasLowercase ? 'text-green-600' : 'text-gray-400'" class="flex items-center gap-1">
          {{ strengthData.requirements?.hasLowercase ? '✓' : '○' }} Lowercase
        </div>
        <div :class="strengthData.requirements?.hasNumber ? 'text-green-600' : 'text-gray-400'" class="flex items-center gap-1">
          {{ strengthData.requirements?.hasNumber ? '✓' : '○' }} Number
        </div>
        <div :class="strengthData.requirements?.hasSpecialChar ? 'text-green-600' : 'text-gray-400'" class="flex items-center gap-1 col-span-2">
          {{ strengthData.requirements?.hasSpecialChar ? '✓' : '○' }} Special character
        </div>
      </div>

      <!-- Feedback Messages -->
      <div v-if="strengthData.feedback && strengthData.feedback.length > 0" class="mt-2 space-y-1">
        <div
          v-for="(message, index) in strengthData.feedback"
          :key="index"
          class="text-xs p-2 rounded"
          :class="strengthData.isBreached ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'"
        >
          {{ message }}
        </div>
      </div>

      <!-- Breach Warning -->
      <div v-if="strengthData.isBreached" class="mt-2 p-2 bg-red-100 border border-red-300 rounded text-xs text-red-800 font-medium">
        🚨 This password has been compromised in a data breach. Please choose a different password.
      </div>

      <!-- Pass/Fail Status -->
      <div v-if="!strengthData.passed && !strengthData.isBreached" class="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
        ⚠️ Password does not meet all requirements
      </div>
      <div v-else-if="strengthData.passed && !strengthData.isBreached" class="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
        ✅ Password meets all requirements
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { authService } from '../services/authService'

interface Props {
  password: string
  debounceMs?: number
}

interface PasswordStrength {
  score: number
  strength: string
  feedback: string[]
  passed: boolean
  isBreached: boolean
  requirements: {
    minLength: boolean
    hasUppercase: boolean
    hasLowercase: boolean
    hasNumber: boolean
    hasSpecialChar: boolean
  }
}

const props = withDefaults(defineProps<Props>(), {
  debounceMs: 500
})

const strengthData = ref<PasswordStrength | null>(null)
const checking = ref(false)
let debounceTimeout: any = null

const strengthPercentage = computed(() => {
  if (!strengthData.value) return '0%'
  return `${(strengthData.value.score / 4) * 100}%`
})

const strengthBarClass = computed(() => {
  if (!strengthData.value) return 'bg-gray-300'
  
  if (strengthData.value.isBreached) return 'bg-red-500'
  
  switch (strengthData.value.strength) {
    case 'weak':
      return 'bg-red-500'
    case 'fair':
      return 'bg-orange-500'
    case 'good':
      return 'bg-amber-500'
    case 'strong':
      return 'bg-green-500'
    case 'very strong':
      return 'bg-green-600'
    default:
      return 'bg-gray-300'
  }
})

const strengthTextClass = computed(() => {
  if (!strengthData.value) return 'text-gray-500'
  
  if (strengthData.value.isBreached) return 'text-red-600'
  
  switch (strengthData.value.strength) {
    case 'weak':
      return 'text-red-600'
    case 'fair':
      return 'text-orange-600'
    case 'good':
      return 'text-amber-600'
    case 'strong':
      return 'text-green-600'
    case 'very strong':
      return 'text-green-700'
    default:
      return 'text-gray-500'
  }
})

const checkStrength = async (password: string) => {
  if (!password || password.length < 3) {
    strengthData.value = null
    return
  }

  try {
    checking.value = true
    const response = await authService.checkPasswordStrength(password)
    const data = response.data?.data || response.data
    strengthData.value = data
  } catch (err: any) {
    console.error('Password strength check error:', err)
    // Don't show error to user, just hide indicator
    strengthData.value = null
  } finally {
    checking.value = false
  }
}

watch(
  () => props.password,
  (newPassword) => {
    clearTimeout(debounceTimeout)
    
    if (!newPassword || newPassword.length < 3) {
      strengthData.value = null
      checking.value = false
      return
    }

    checking.value = true
    debounceTimeout = setTimeout(() => {
      checkStrength(newPassword)
    }, props.debounceMs)
  }
)
</script>
