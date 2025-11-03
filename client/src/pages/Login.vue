<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
    <div class="w-full max-w-md">
      <!-- Card Container -->
      <div class="bg-white rounded-lg shadow-xl border-t-4 border-orange-500 p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="text-6xl mb-4">🍥</div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Kuybi</h1>
          <p class="text-gray-600">Sign in to your account</p>
        </div>

        <!-- Alert Messages -->
        <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-700 text-sm">{{ error }}</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="admin@kuybi.dev"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              :class="{ 'border-red-500': errors.email }"
              @blur="validateField('email')"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              placeholder="Enter your password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              :class="{ 'border-red-500': errors.password }"
              @blur="validateField('password')"
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input
                v-model="formData.rememberMe"
                type="checkbox"
                class="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
              />
              <span class="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" class="text-sm text-orange-600 hover:text-orange-700">Forgot password?</a>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-orange-300 disabled:to-orange-400 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center shadow-md"
          >
            <span v-if="!loading">Sign In</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          </button>
        </form>

        <!-- Demo Credentials -->
        <div class="mt-6 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
          <p class="text-sm font-medium text-orange-900 mb-2">Demo Credentials:</p>
          <p class="text-sm text-orange-700">Email: <span class="font-mono">admin@kuybi.dev</span></p>
          <p class="text-sm text-orange-700">Password: <span class="font-mono">Admin@123</span></p>
        </div>
      </div>

      <!-- Footer -->
      <p class="text-center text-gray-600 text-sm mt-6">
        Powered by <span class="font-semibold text-orange-600">Kuybi</span> • Enterprise Content Management
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const formData = reactive({
  email: '',
  password: '',
  rememberMe: false,
})

const errors = reactive({
  email: '',
  password: '',
})

const loading = ref(false)
const error = ref('')

const validateField = (field: 'email' | 'password') => {
  errors[field] = ''

  if (field === 'email') {
    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
  }

  if (field === 'password') {
    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
  }
}

const isValidEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const handleLogin = async () => {
  // Validate all fields
  validateField('email')
  validateField('password')

  if (errors.email || errors.password) {
    return
  }

  loading.value = true
  error.value = ''

  const success = await authStore.login(formData.email, formData.password)

  if (success) {
    // Redirect to dashboard
    router.push('/')
  } else {
    error.value = authStore.error || 'Login failed. Please try again.'
  }

  loading.value = false
}
</script>

<style scoped>
/* Smooth transitions */
input:focus {
  transition: all 0.3s ease;
}

button:disabled {
  cursor: not-allowed;
}
</style>
