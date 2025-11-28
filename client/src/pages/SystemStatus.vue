<template>
  <DashboardLayout>
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">System Status</h1>
        <p class="text-gray-600">Monitor system health and test integrations.</p>
      </div>

      <!-- Tabs -->
      <div class="mb-6 border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="currentTab = tab.id"
            :class="[
              currentTab === tab.id
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Health Tab -->
      <div v-if="currentTab === 'health'" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Overall Health -->
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Overall Health</h3>
            <div class="flex items-center">
              <div :class="['w-3 h-3 rounded-full mr-2', healthStatus.health ? 'bg-green-500' : 'bg-red-500']"></div>
              <span class="text-gray-700">{{ healthStatus.health ? 'Healthy' : 'Unhealthy' }}</span>
            </div>
            <button @click="checkHealth" class="mt-4 text-sm text-orange-600 hover:text-orange-700">Refresh</button>
          </div>

          <!-- Liveness -->
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Liveness</h3>
            <div class="flex items-center">
              <div :class="['w-3 h-3 rounded-full mr-2', healthStatus.liveness ? 'bg-green-500' : 'bg-red-500']"></div>
              <span class="text-gray-700">{{ healthStatus.liveness ? 'Live' : 'Not Live' }}</span>
            </div>
            <button @click="checkLiveness" class="mt-4 text-sm text-orange-600 hover:text-orange-700">Refresh</button>
          </div>

          <!-- Readiness -->
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Readiness</h3>
            <div class="flex items-center">
              <div :class="['w-3 h-3 rounded-full mr-2', healthStatus.readiness ? 'bg-green-500' : 'bg-red-500']"></div>
              <span class="text-gray-700">{{ healthStatus.readiness ? 'Ready' : 'Not Ready' }}</span>
            </div>
            <button @click="checkReadiness" class="mt-4 text-sm text-orange-600 hover:text-orange-700">Refresh</button>
          </div>
        </div>
      </div>

      <!-- Email Tab -->
      <div v-if="currentTab === 'email'" class="space-y-6">
        <!-- Email Health -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Email Service Status</h3>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div :class="['w-3 h-3 rounded-full mr-2', emailHealth ? 'bg-green-500' : 'bg-red-500']"></div>
              <span class="text-gray-700">{{ emailHealth ? 'Connected' : 'Disconnected' }}</span>
            </div>
            <button @click="checkEmailHealth" class="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">Check Connection</button>
          </div>
        </div>

        <!-- Send Test Email -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Send Test Email</h3>
          <form @submit.prevent="sendTestEmail" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">To</label>
              <input v-model="emailForm.to" type="email" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm border p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Subject</label>
              <input v-model="emailForm.subject" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm border p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Content (HTML)</label>
              <textarea v-model="emailForm.html" rows="4" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm border p-2"></textarea>
            </div>
            <div class="flex justify-end">
              <button type="submit" :disabled="sendingEmail" class="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50">
                {{ sendingEmail ? 'Sending...' : 'Send Email' }}
              </button>
            </div>
          </form>
          <div v-if="emailResult" :class="['mt-4 p-3 rounded', emailResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700']">
            {{ emailResult.message }}
          </div>
        </div>
      </div>

      <!-- Sentry Tab -->
      <div v-if="currentTab === 'sentry'" class="space-y-6">
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Sentry Integration</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded">
              <div>
                <h4 class="font-medium text-gray-900">Trigger Test Error</h4>
                <p class="text-sm text-gray-500">This will throw a test error to verify Sentry capturing.</p>
              </div>
              <button @click="triggerSentryError" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Throw Error</button>
            </div>
            
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded">
              <div>
                <h4 class="font-medium text-gray-900">Trigger Transaction</h4>
                <p class="text-sm text-gray-500">This will create a test transaction for performance monitoring.</p>
              </div>
              <button @click="triggerSentryTransaction" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Create Transaction</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { systemService } from '../services/systemService'
import DashboardLayout from '../components/DashboardLayout.vue'

const tabs = [
  { id: 'health', name: 'System Health' },
  { id: 'email', name: 'Email Testing' },
  { id: 'sentry', name: 'Sentry' },
]

const currentTab = ref('health')

// Health State
const healthStatus = ref({
  health: false,
  liveness: false,
  readiness: false,
})

// Email State
const emailHealth = ref(false)
const sendingEmail = ref(false)
const emailForm = ref({
  to: '',
  subject: 'Test Email from Kuybi Dashboard',
  html: '<p>This is a test email sent from the <strong>System Status</strong> page.</p>',
})
const emailResult = ref<{ success: boolean; message: string } | null>(null)

// Actions
const checkHealth = async () => {
  try {
    await systemService.getHealth()
    healthStatus.value.health = true
  } catch (e) {
    healthStatus.value.health = false
  }
}

const checkLiveness = async () => {
  try {
    await systemService.getLiveness()
    healthStatus.value.liveness = true
  } catch (e) {
    healthStatus.value.liveness = false
  }
}

const checkReadiness = async () => {
  try {
    await systemService.getReadiness()
    healthStatus.value.readiness = true
  } catch (e) {
    healthStatus.value.readiness = false
  }
}

const checkAllHealth = () => {
  checkHealth()
  checkLiveness()
  checkReadiness()
}

const checkEmailHealth = async () => {
  try {
    await systemService.getEmailHealth()
    emailHealth.value = true
  } catch (e) {
    emailHealth.value = false
  }
}

const sendTestEmail = async () => {
  sendingEmail.value = true
  emailResult.value = null
  try {
    await systemService.sendTestEmail(emailForm.value.to, emailForm.value.subject, emailForm.value.html)
    emailResult.value = { success: true, message: 'Email sent successfully!' }
  } catch (e: any) {
    emailResult.value = { success: false, message: e.response?.data?.message || 'Failed to send email' }
  } finally {
    sendingEmail.value = false
  }
}

const triggerSentryError = async () => {
  try {
    await systemService.triggerSentryError()
    alert('Error triggered! Check Sentry dashboard.')
  } catch (e) {
    console.error('Sentry test error:', e)
  }
}

const triggerSentryTransaction = async () => {
  try {
    await systemService.triggerSentryTransaction()
    alert('Transaction triggered! Check Sentry dashboard.')
  } catch (e) {
    console.error('Sentry transaction error:', e)
  }
}

onMounted(() => {
  checkAllHealth()
  checkEmailHealth()
})
</script>
