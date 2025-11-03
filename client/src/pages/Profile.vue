<template>
  <DashboardLayout>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 class="text-3xl font-bold text-gray-900">User Profile</h1>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Profile Card -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <ProfileImageUploader
                class="mb-4"
                :user="user"
                @updated="handleProfileImageUpdated"
              />
              <h2 class="text-2xl font-bold text-gray-900">{{ user?.name }}</h2>
              <p class="text-gray-600 text-sm mt-1">{{ user?.email }}</p>
              <div class="mt-4">
                <span class="inline-block px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                  {{ user?.role || 'User' }}
                </span>
              </div>
              <div class="mt-6 pt-6 border-t border-gray-200">
                <p class="text-xs text-gray-500">Member since</p>
                <p class="text-sm font-medium text-gray-900">{{ formatDate(user?.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Details & Edit Form -->
        <div class="lg:col-span-2">
          <!-- Loading State -->
          <div v-if="loading" class="bg-white rounded-lg shadow p-6">
            <div class="flex justify-center items-center h-64">
              <div class="animate-spin">
                <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p class="text-red-800 font-medium">{{ error }}</p>
          </div>

          <!-- View Mode -->
          <div v-else-if="!isEditing" class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 class="text-xl font-semibold text-gray-900">Profile Information</h3>
              <button
                @click="startEditing"
                class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition font-medium text-sm"
              >
                Edit Profile
              </button>
            </div>

            <div class="px-6 py-6 space-y-6">
              <!-- Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <p class="text-gray-900">{{ user?.name }}</p>
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <p class="text-gray-900">{{ user?.email }}</p>
              </div>

              <!-- Role -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <p class="text-gray-900 capitalize">{{ user?.role || 'User' }}</p>
              </div>

              <!-- Status -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
                <p class="text-gray-900">
                  <span class="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    Active
                  </span>
                </p>
              </div>

              <!-- Additional Info -->
              <div v-if="user?.phone" class="pt-4 border-t border-gray-200">
                <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <p class="text-gray-900">{{ user?.phone }}</p>
              </div>

              <div v-if="user?.bio" class="pt-4 border-t border-gray-200">
                <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <p class="text-gray-900">{{ user?.bio }}</p>
              </div>
            </div>
          </div>

          <!-- Edit Mode -->
          <div v-else class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-xl font-semibold text-gray-900">Edit Profile</h3>
            </div>

            <form @submit.prevent="saveProfile" class="px-6 py-6 space-y-6">
              <!-- Name Field -->
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  id="name"
                  v-model="formData.name"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter your full name"
                />
              </div>

              <!-- Email Field -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  id="email"
                  v-model="formData.email"
                  type="email"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter your email"
                />
              </div>

              <!-- Phone Field (Optional) -->
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">Phone (Optional)</label>
                <input
                  id="phone"
                  v-model="formData.phone"
                  type="tel"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter your phone number"
                />
              </div>

              <!-- Bio Field (Optional) -->
              <div>
                <label for="bio" class="block text-sm font-medium text-gray-700 mb-2">Bio (Optional)</label>
                <textarea
                  id="bio"
                  v-model="formData.bio"
                  rows="4"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Tell us about yourself"
                />
              </div>

              <!-- Error Message -->
              <div v-if="formError" class="bg-red-50 border border-red-200 rounded-lg p-4">
                <p class="text-red-800 text-sm">{{ formError }}</p>
              </div>

              <!-- Success Message -->
              <div v-if="formSuccess" class="bg-green-50 border border-green-200 rounded-lg p-4">
                <p class="text-green-800 text-sm">Profile updated successfully!</p>
              </div>

              <!-- Form Actions -->
              <div class="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  :disabled="formSubmitting"
                  class="px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-lg transition font-medium"
                >
                  {{ formSubmitting ? 'Saving...' : 'Save Changes' }}
                </button>
                <button
                  type="button"
                  @click="cancelEditing"
                  class="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Change Password Section -->
      <div class="mt-8 bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-xl font-semibold text-gray-900">Security</h3>
        </div>

        <div class="px-6 py-6">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-lg font-medium text-gray-900">Password</h4>
              <p class="text-gray-600 text-sm mt-1">Change your password to keep your account secure</p>
            </div>
            <button
              @click="showPasswordModal = true"
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition font-medium text-sm"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <div v-if="showPasswordModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-xl font-semibold text-gray-900">Change Password</h3>
        </div>

        <form @submit.prevent="changePassword" class="px-6 py-6 space-y-4">
          <!-- Current Password -->
          <div>
            <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <input
              id="currentPassword"
              v-model="passwordForm.currentPassword"
              type="password"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter current password"
            />
          </div>

          <!-- New Password -->
          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              id="newPassword"
              v-model="passwordForm.newPassword"
              type="password"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter new password"
            />
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <input
              id="confirmPassword"
              v-model="passwordForm.confirmPassword"
              type="password"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Confirm new password"
            />
          </div>

          <!-- Error Message -->
          <div v-if="passwordError" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-red-800 text-sm">{{ passwordError }}</p>
          </div>

          <!-- Success Message -->
          <div v-if="passwordSuccess" class="bg-green-50 border border-green-200 rounded-lg p-4">
            <p class="text-green-800 text-sm">Password changed successfully!</p>
          </div>

          <!-- Modal Actions -->
          <div class="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              :disabled="passwordSubmitting"
              class="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-lg transition font-medium"
            >
              {{ passwordSubmitting ? 'Changing...' : 'Change Password' }}
            </button>
            <button
              type="button"
              @click="closePasswordModal"
              class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition font-medium"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userService } from '../services/userService'
import DashboardLayout from '../components/DashboardLayout.vue'
import ProfileImageUploader from '../components/ProfileImageUploader.vue'

interface User {
  id: string
  name: string
  email: string
  role: string
  phone?: string
  bio?: string
  createdAt: string
}

interface FormData {
  name: string
  email: string
  phone?: string
  bio?: string
}

// User data
const user = ref<User | null>(null)
const loading = ref(true)
const error = ref('')

// Edit mode
const isEditing = ref(false)
const formData = ref<FormData>({
  name: '',
  email: '',
  phone: '',
  bio: ''
})
const formError = ref('')
const formSuccess = ref(false)
const formSubmitting = ref(false)

// Password change
const showPasswordModal = ref(false)
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const passwordError = ref('')
const passwordSuccess = ref(false)
const passwordSubmitting = ref(false)

const formatDate = (date?: string) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Load user profile
const loadProfile = async () => {
  try {
    loading.value = true
    error.value = ''
    const response = await userService.getProfile()
    const userData = response.data?.data || response.data
    user.value = userData
    formData.value = {
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '',
      bio: userData.bio || ''
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load profile'
    console.error('Profile load error:', err)
  } finally {
    loading.value = false
  }
}

// Edit profile
const startEditing = () => {
  isEditing.value = true
  formError.value = ''
  formSuccess.value = false
}

const cancelEditing = () => {
  isEditing.value = false
  formError.value = ''
  formSuccess.value = false
  if (user.value) {
    formData.value = {
      name: user.value.name,
      email: user.value.email,
      phone: user.value.phone || '',
      bio: user.value.bio || ''
    }
  }
}

const saveProfile = async () => {
  try {
    formError.value = ''
    formSuccess.value = false
    formSubmitting.value = true

    const updateData = {
      name: formData.value.name,
      email: formData.value.email,
      ...(formData.value.phone && { phone: formData.value.phone }),
      ...(formData.value.bio && { bio: formData.value.bio })
    }

    const response = await userService.updateProfile(updateData)
    const updatedUser = response.data?.data || response.data
    user.value = updatedUser
    formSuccess.value = true
    isEditing.value = false

    // Hide success message after 2 seconds
    setTimeout(() => {
      formSuccess.value = false
    }, 2000)
  } catch (err: any) {
    formError.value = err.response?.data?.message || 'Failed to update profile'
    console.error('Profile update error:', err)
  } finally {
    formSubmitting.value = false
  }
}

const handleProfileImageUpdated = async () => {
  await loadProfile()
}

// Change password
const changePassword = async () => {
  try {
    passwordError.value = ''
    passwordSuccess.value = false

    // Validate passwords match
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      passwordError.value = 'New passwords do not match'
      return
    }

    // Validate password length
    if (passwordForm.value.newPassword.length < 6) {
      passwordError.value = 'Password must be at least 6 characters'
      return
    }

    passwordSubmitting.value = true

    await userService.changePassword(
      passwordForm.value.currentPassword,
      passwordForm.value.newPassword
    )

    passwordSuccess.value = true
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }

    // Close modal after 2 seconds
    setTimeout(() => {
      showPasswordModal.value = false
      passwordSuccess.value = false
    }, 2000)
  } catch (err: any) {
    passwordError.value = err.response?.data?.message || 'Failed to change password'
    console.error('Password change error:', err)
  } finally {
    passwordSubmitting.value = false
  }
}

const closePasswordModal = () => {
  showPasswordModal.value = false
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  passwordError.value = ''
  passwordSuccess.value = false
}

onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
</style>
