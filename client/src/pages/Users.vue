<template>
  <DashboardLayout>
    <div class="min-h-screen bg-gray-50 p-8">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">👥 User Management</h1>
          <p class="text-gray-600">Manage and monitor all users in the system</p>
        </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Total Users</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span class="text-2xl">👤</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Active Users</p>
              <p class="text-2xl font-bold text-green-600">{{ stats.active }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span class="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Verified</p>
              <p class="text-2xl font-bold text-blue-600">{{ stats.verified }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span class="text-2xl">🔒</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">Inactive</p>
              <p class="text-2xl font-bold text-red-600">{{ stats.inactive }}</p>
            </div>
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span class="text-2xl">⛔</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white rounded-lg shadow mb-6 p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name or email..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              @input="debouncedSearch"
            />
          </div>

          <!-- Role Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              v-model="filters.role"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              @change="loadUsers"
            >
              <option value="">All Roles</option>
              <option v-for="role in roles" :key="role.name" :value="role.name">
                {{ role.displayName || formatRole(role.name) }}
              </option>
            </select>
          </div>

          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              v-model="filters.status"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              @change="loadUsers"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <!-- Loading State -->
        <div v-if="loading" class="p-12 text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          <p class="text-gray-600 mt-4">Loading users...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="p-12 text-center">
          <div class="text-6xl mb-4">❌</div>
          <p class="text-red-600 font-medium mb-2">Error Loading Users</p>
          <p class="text-gray-600 mb-4">{{ error }}</p>
          <button
            @click="loadUsers"
            class="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition font-medium"
          >
            Try Again
          </button>
        </div>

        <!-- Users Table -->
        <div v-else-if="users.length > 0" class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Joined</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition">
                <!-- User Info -->
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {{ getInitials(user.name) }}
                    </div>
                    <div class="ml-4">
                      <div class="font-medium text-gray-900">{{ user.name }}</div>
                      <div class="text-sm text-gray-500">{{ user.email }}</div>
                    </div>
                  </div>
                </td>

                <!-- Contact -->
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ user.mobileNumber || 'N/A' }}</div>
                </td>

                <!-- Role -->
                <td class="px-6 py-4">
                  <span
                    :class="getRoleBadgeClass(user.role)"
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {{ formatRole(user.role) }}
                  </span>
                </td>

                <!-- Status -->
                <td class="px-6 py-4">
                  <div class="flex flex-col gap-1">
                    <span
                      :class="user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium w-fit"
                    >
                      {{ user.isActive ? '✅ Active' : '⛔ Inactive' }}
                    </span>
                    <span
                      v-if="user.isVerified"
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 w-fit"
                    >
                      🔒 Verified
                    </span>
                    <span
                      v-if="user.isEmailVerified"
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 w-fit"
                    >
                      ✉️ Email
                    </span>
                  </div>
                </td>

                <!-- Joined Date -->
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ formatDate(user.createdAt) }}</div>
                  <div class="text-xs text-gray-500">{{ formatRelativeTime(user.createdAt) }}</div>
                </td>

                <!-- Actions -->
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2 flex-wrap">
                    <button
                      @click="viewUser(user)"
                      class="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition text-xs font-medium"
                      title="View details"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>
                    <button
                      @click="viewUserSessions(user)"
                      class="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition text-xs font-medium"
                      title="View sessions"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Sessions
                    </button>
                    <button
                      @click="editUser(user)"
                      class="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg transition text-xs font-medium"
                      title="Edit user"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      @click="openSetPasswordModal(user)"
                      class="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition text-xs font-medium"
                      title="Set password"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                      Set Password
                    </button>
                    <button
                      @click="openResetPasswordModal(user)"
                      class="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition text-xs font-medium"
                      title="Reset password"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Reset
                    </button>
                    <button
                      @click="toggleUserStatus(user)"
                      :class="user.isActive ? 'bg-red-50 hover:bg-red-100 text-red-700' : 'bg-green-50 hover:bg-green-100 text-green-700'"
                      class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg transition text-xs font-medium"
                      :title="user.isActive ? 'Deactivate' : 'Activate'"
                    >
                      <svg v-if="user.isActive" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {{ user.isActive ? 'Deactivate' : 'Activate' }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div class="text-sm text-gray-600">
              Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, totalUsers) }} of {{ totalUsers }} users
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm"
              >
                ← Previous
              </button>
              <div class="flex items-center gap-1">
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="goToPage(page)"
                  :class="page === currentPage ? 'bg-orange-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'"
                  class="w-10 h-10 rounded-lg border border-gray-300 transition font-medium text-sm"
                >
                  {{ page }}
                </button>
              </div>
              <button
                @click="nextPage"
                :disabled="currentPage >= totalPages"
                class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-sm"
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="p-12 text-center">
          <div class="text-6xl mb-4">👥</div>
          <p class="text-gray-600 font-medium mb-2">No Users Found</p>
          <p class="text-gray-500 text-sm">Try adjusting your filters or search query</p>
        </div>
      </div>

      <!-- User Detail Modal -->
      <div
        v-if="selectedUser"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="closeModal"
      >
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-xl font-semibold text-gray-900">User Details</h3>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div class="px-6 py-6">
          <!-- User Avatar and Basic Info -->
          <div class="flex items-center mb-6 pb-6 border-b border-gray-200">
            <div class="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {{ getInitials(selectedUser.name) }}
            </div>
            <div class="ml-6">
              <h4 class="text-2xl font-bold text-gray-900">{{ selectedUser.name }}</h4>
              <p class="text-gray-600">{{ selectedUser.email }}</p>
              <div class="flex items-center gap-2 mt-2">
                <span :class="getRoleBadgeClass(selectedUser.role)" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium">
                  {{ formatRole(selectedUser.role) }}
                </span>
                <span
                  :class="selectedUser.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                >
                  {{ selectedUser.isActive ? '✅ Active' : '⛔ Inactive' }}
                </span>
              </div>
            </div>
          </div>

          <!-- User Details Grid -->
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">User ID</label>
              <p class="text-gray-900 font-mono text-sm break-all">{{ selectedUser.id }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Mobile Number</label>
              <p class="text-gray-900">{{ selectedUser.mobileNumber || 'N/A' }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Email Verified</label>
              <p class="text-gray-900">{{ selectedUser.isEmailVerified ? '✅ Yes' : '❌ No' }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Account Verified</label>
              <p class="text-gray-900">{{ selectedUser.isVerified ? '✅ Yes' : '❌ No' }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Joined Date</label>
              <p class="text-gray-900">{{ formatDate(selectedUser.createdAt) }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Last Updated</label>
              <p class="text-gray-900">{{ formatDate(selectedUser.updatedAt) }}</p>
            </div>
          </div>
        </div>

        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button
            @click="closeModal"
            class="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition font-medium"
          >
            Close
          </button>
          <button
            @click="editUser(selectedUser)"
            class="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition font-medium"
          >
            Edit User
          </button>
        </div>
      </div>
    </div>

    <!-- Set Password Modal -->
    <div
      v-if="showSetPasswordModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closePasswordModals"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-xl font-semibold text-gray-900">🔑 Set Password</h3>
          <button
            @click="closePasswordModals"
            class="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form @submit.prevent="handleSetPassword" class="px-6 py-6">
          <div v-if="passwordUser" class="mb-4 p-3 bg-blue-50 rounded-lg">
            <p class="text-sm text-gray-700">
              <strong>User:</strong> {{ passwordUser.name }}
            </p>
            <p class="text-sm text-gray-600">{{ passwordUser.email }}</p>
          </div>

          <div v-if="passwordError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ passwordError }}</p>
          </div>

          <div v-if="passwordSuccess" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-sm text-green-600">✅ Password set successfully!</p>
          </div>

          <div class="space-y-4">
            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">New Password *</label>
              <input
                id="newPassword"
                v-model="setPasswordForm.newPassword"
                type="password"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter new password"
              />
              <PasswordStrengthIndicator :password="setPasswordForm.newPassword" />
            </div>

            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
              <input
                id="confirmPassword"
                v-model="setPasswordForm.confirmPassword"
                type="password"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Confirm new password"
              />
            </div>

            <div>
              <label class="flex items-center">
                <input
                  v-model="setPasswordForm.forcePasswordChange"
                  type="checkbox"
                  class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span class="ml-2 text-sm text-gray-700">Force password change on next login</span>
              </label>
            </div>

            <div>
              <label class="flex items-center">
                <input
                  v-model="setPasswordForm.sendNotification"
                  type="checkbox"
                  class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span class="ml-2 text-sm text-gray-700">Send notification email</span>
              </label>
            </div>

            <div>
              <label for="reason" class="block text-sm font-medium text-gray-700 mb-2">Reason (Optional)</label>
              <textarea
                id="reason"
                v-model="setPasswordForm.reason"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Reason for setting password..."
              ></textarea>
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <button
              type="button"
              @click="closePasswordModals"
              class="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="passwordSubmitting"
              class="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition font-medium"
            >
              {{ passwordSubmitting ? 'Setting...' : 'Set Password' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Reset Password Modal -->
    <div
      v-if="showResetPasswordModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closePasswordModals"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-xl font-semibold text-gray-900">🔄 Reset Password</h3>
          <button
            @click="closePasswordModals"
            class="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form @submit.prevent="handleResetPassword" class="px-6 py-6">
          <div v-if="passwordUser" class="mb-4 p-3 bg-blue-50 rounded-lg">
            <p class="text-sm text-gray-700">
              <strong>User:</strong> {{ passwordUser.name }}
            </p>
            <p class="text-sm text-gray-600">{{ passwordUser.email }}</p>
          </div>

          <div class="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p class="text-sm text-amber-800 font-medium mb-2">⚠️ Warning</p>
            <p class="text-sm text-amber-700">
              This will generate a temporary password and send it to the user's email.
              The user will be required to change it on next login.
            </p>
          </div>

          <div v-if="passwordError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ passwordError }}</p>
          </div>

          <div v-if="passwordSuccess" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-sm text-green-600">✅ Password reset successfully!</p>
            <p v-if="temporaryPassword" class="text-sm text-gray-700 mt-2">
              <strong>Temporary Password:</strong> <code class="bg-white px-2 py-1 rounded">{{ temporaryPassword }}</code>
            </p>
          </div>

          <div class="space-y-4">
            <div>
              <label class="flex items-center">
                <input
                  v-model="resetPasswordForm.forcePasswordChange"
                  type="checkbox"
                  class="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                />
                <span class="ml-2 text-sm text-gray-700">Force password change on next login</span>
              </label>
            </div>

            <div>
              <label for="resetReason" class="block text-sm font-medium text-gray-700 mb-2">Reason (Optional)</label>
              <textarea
                id="resetReason"
                v-model="resetPasswordForm.reason"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Reason for resetting password..."
              ></textarea>
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <button
              type="button"
              @click="closePasswordModals"
              class="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="passwordSubmitting"
              class="px-6 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white rounded-lg transition font-medium"
            >
              {{ passwordSubmitting ? 'Resetting...' : 'Reset Password' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div
      v-if="showEditUserModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeEditUserModal"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-xl font-semibold text-gray-900">✏️ Edit User</h3>
          <button
            @click="closeEditUserModal"
            class="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form @submit.prevent="handleUpdateUser" class="px-6 py-6">
          <div v-if="editingUser" class="mb-4 p-3 bg-blue-50 rounded-lg">
            <p class="text-sm text-gray-700">
              <strong>User ID:</strong> <span class="font-mono text-xs">{{ editingUser.id }}</span>
            </p>
          </div>

          <div v-if="editError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ editError }}</p>
          </div>

          <div v-if="editSuccess" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-sm text-green-600">✅ User updated successfully!</p>
          </div>

          <div class="space-y-4">
            <!-- Name -->
            <div>
              <label for="editName" class="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input
                id="editName"
                v-model="editUserForm.name"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter user name"
              />
            </div>

            <!-- Email -->
            <div>
              <label for="editEmail" class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                id="editEmail"
                v-model="editUserForm.email"
                type="email"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter email address"
              />
            </div>

            <!-- Mobile Number -->
            <div>
              <label for="editMobile" class="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
              <input
                id="editMobile"
                v-model="editUserForm.mobileNumber"
                type="tel"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter mobile number"
              />
            </div>

            <!-- Role -->
            <div>
              <label for="editRole" class="block text-sm font-medium text-gray-700 mb-2">Role *</label>
              <select
                id="editRole"
                v-model="editUserForm.primaryRoleId"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select a role</option>
                <option v-for="role in roles" :key="role.id" :value="role.id">
                  {{ role.displayName || formatRole(role.name) }}
                </option>
              </select>
            </div>

            <!-- Active Status -->
            <div>
              <label class="flex items-center">
                <input
                  v-model="editUserForm.isActive"
                  type="checkbox"
                  class="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span class="ml-2 text-sm text-gray-700">Account is active</span>
              </label>
            </div>

            <!-- Email Verified -->
            <div>
              <label class="flex items-center">
                <input
                  v-model="editUserForm.isEmailVerified"
                  type="checkbox"
                  class="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span class="ml-2 text-sm text-gray-700">Email is verified</span>
              </label>
            </div>

            <!-- Verified -->
            <div>
              <label class="flex items-center">
                <input
                  v-model="editUserForm.isVerified"
                  type="checkbox"
                  class="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span class="ml-2 text-sm text-gray-700">Account is verified</span>
              </label>
            </div>

            <!-- Reason -->
            <div>
              <label for="editReason" class="block text-sm font-medium text-gray-700 mb-2">Reason for Changes</label>
              <textarea
                id="editReason"
                v-model="editUserForm.reason"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Explain why these changes are being made..."
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">This will be logged for audit purposes</p>
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <button
              type="button"
              @click="closeEditUserModal"
              class="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="editSubmitting"
              class="px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-lg transition font-medium"
            >
              {{ editSubmitting ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- User Sessions Modal -->
    <div
      v-if="showSessionsModal && sessionsUser"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeSessionsModal"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-white">🔒 User Sessions</h2>
            <p class="text-indigo-100 text-sm mt-1">
              Viewing sessions for {{ sessionsUser.name }}
            </p>
          </div>
          <button
            @click="closeSessionsModal"
            class="text-white hover:bg-indigo-700 p-2 rounded-lg transition"
          >
            ✕
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <!-- Loading State -->
          <div v-if="sessionsLoading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
            <p class="text-gray-600 mt-4">Loading sessions...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="sessionsError" class="text-center py-12">
            <div class="text-6xl mb-4">❌</div>
            <p class="text-red-600 font-medium mb-2">Error Loading Sessions</p>
            <p class="text-gray-600">{{ sessionsError }}</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="userSessions.length === 0" class="text-center py-12">
            <div class="text-6xl mb-4">🔒</div>
            <p class="text-gray-600 font-medium mb-2">No Active Sessions</p>
            <p class="text-gray-500 text-sm">This user has no active sessions</p>
          </div>

          <!-- Sessions List -->
          <div v-else class="space-y-4">
            <!-- Session Stats -->
            <div class="grid grid-cols-3 gap-4 mb-6">
              <div class="bg-indigo-50 rounded-lg p-4">
                <p class="text-sm text-indigo-600 font-medium">Total Sessions</p>
                <p class="text-2xl font-bold text-indigo-900">{{ userSessions.length }}</p>
              </div>
              <div class="bg-green-50 rounded-lg p-4">
                <p class="text-sm text-green-600 font-medium">Active</p>
                <p class="text-2xl font-bold text-green-900">{{ userSessions.filter(s => s.isActive).length }}</p>
              </div>
              <div class="bg-amber-50 rounded-lg p-4">
                <p class="text-sm text-amber-600 font-medium">Desktop</p>
                <p class="text-2xl font-bold text-amber-900">{{ userSessions.filter(s => s.deviceType === 'desktop').length }}</p>
              </div>
            </div>

            <!-- Session Cards -->
            <div
              v-for="session in userSessions"
              :key="session.id"
              class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div class="flex items-start justify-between">
                <div class="flex items-start gap-3 flex-1">
                  <!-- Device Icon -->
                  <div class="text-3xl">{{ getDeviceIcon(session.deviceType) }}</div>
                  
                  <div class="flex-1">
                    <!-- Device Info -->
                    <div class="flex items-center gap-2 mb-2">
                      <h4 class="font-semibold text-gray-900">
                        {{ getBrowserInfo(session.userAgent) }} on {{ session.deviceType }}
                      </h4>
                      <span
                        :class="getSecurityBadgeClass(session.securityLevel)"
                        class="px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {{ session.securityLevel }} security
                      </span>
                      <span
                        v-if="session.isActive"
                        class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
                      >
                        Active
                      </span>
                    </div>

                    <!-- Session Details -->
                    <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div>
                        <span class="text-gray-500">IP Address:</span>
                        <span class="text-gray-900 ml-2 font-mono">{{ session.ipAddress }}</span>
                      </div>
                      <div>
                        <span class="text-gray-500">Session Type:</span>
                        <span class="text-gray-900 ml-2">{{ session.sessionType }}</span>
                      </div>
                      <div>
                        <span class="text-gray-500">Last Activity:</span>
                        <span class="text-gray-900 ml-2">{{ formatSessionTime(session.lastActivityAt) }}</span>
                      </div>
                      <div>
                        <span class="text-gray-500">Expires:</span>
                        <span class="text-gray-900 ml-2">{{ formatDate(session.expiresAt) }}</span>
                      </div>
                      <div class="col-span-2">
                        <span class="text-gray-500">User Agent:</span>
                        <span class="text-gray-900 ml-2 text-xs font-mono break-all">{{ session.userAgent }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <button
                  v-if="session.isActive"
                  @click="revokeUserSession(session.id)"
                  class="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition font-medium text-sm"
                >
                  Revoke
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { userService } from '../services/userService'
import { sessionService } from '../services/sessionService'
import DashboardLayout from '../components/DashboardLayout.vue'
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator.vue'

interface User {
  id: string
  name: string
  email: string
  mobileNumber: string | null
  role: string
  isActive: boolean
  isVerified: boolean
  isEmailVerified: boolean
  createdAt: string
  updatedAt: string
  roleInfo?: {
    id: number
    name: string
    description: string
    isSystem: boolean
    isActive: boolean
    priority: number
  }
}

// State
const users = ref<User[]>([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const selectedUser = ref<User | null>(null)
const roles = ref<any[]>([])

// Password Management State
const showSetPasswordModal = ref(false)
const showResetPasswordModal = ref(false)
const passwordUser = ref<User | null>(null)
const passwordError = ref('')
const passwordSuccess = ref(false)
const passwordSubmitting = ref(false)
const temporaryPassword = ref('')

const setPasswordForm = ref({
  newPassword: '',
  confirmPassword: '',
  forcePasswordChange: true,
  sendNotification: false,
  reason: '',
})

const resetPasswordForm = ref({
  forcePasswordChange: true,
  reason: '',
})

// Edit User State
const showEditUserModal = ref(false)
const editingUser = ref<User | null>(null)
const editError = ref('')
const editSuccess = ref(false)
const editSubmitting = ref(false)

const editUserForm = ref({
  name: '',
  email: '',
  mobileNumber: '',
  primaryRoleId: '',
  isActive: true,
  isEmailVerified: false,
  isVerified: false,
  reason: '',
})

// User Sessions State
const showSessionsModal = ref(false)
const sessionsUser = ref<User | null>(null)
const userSessions = ref<any[]>([])
const sessionsLoading = ref(false)
const sessionsError = ref('')

// Pagination
const currentPage = ref(1)
const pageSize = ref(10)
const totalUsers = ref(0)

// Filters
const filters = ref({
  role: '',
  status: '',
})

// Computed
const totalPages = computed(() => Math.ceil(totalUsers.value / pageSize.value))

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const stats = computed(() => {
  return {
    total: users.value.length,
    active: users.value.filter(u => u.isActive).length,
    verified: users.value.filter(u => u.isVerified).length,
    inactive: users.value.filter(u => !u.isActive).length,
  }
})

// Methods
const loadUsers = async () => {
  try {
    loading.value = true
    error.value = ''

    const filterParams: any = {}
    
    if (filters.value.role) {
      filterParams.role = filters.value.role
    }

    if (filters.value.status === 'active') {
      filterParams.isActive = true
    } else if (filters.value.status === 'inactive') {
      filterParams.isActive = false
    } else if (filters.value.status === 'verified') {
      filterParams.isVerified = true
    } else if (filters.value.status === 'unverified') {
      filterParams.isVerified = false
    }

    if (searchQuery.value) {
      filterParams.search = searchQuery.value
    }

    const response = await userService.getUsers(currentPage.value, pageSize.value, filterParams)
    
    // Handle nested data structure
    const data = response.data?.data?.data || response.data?.data || response.data
    
    if (Array.isArray(data)) {
      users.value = data
      totalUsers.value = data.length
    } else if (data.items && Array.isArray(data.items)) {
      users.value = data.items
      totalUsers.value = data.total || data.items.length
    } else {
      users.value = []
      totalUsers.value = 0
    }
  } catch (err: any) {
    error.value = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to load users'
    console.error('Load users error:', err)
  } finally {
    loading.value = false
  }
}

const loadRoles = async () => {
  try {
    const response = await userService.getRoles()
    // Handle nested data structure
    const data = response.data?.data?.data || response.data?.data || response.data
    
    if (Array.isArray(data)) {
      roles.value = data
    } else {
      roles.value = []
    }
  } catch (err: any) {
    console.error('Load roles error:', err)
    // Don't show error to user, just use empty array
    roles.value = []
  }
}

let searchTimeout: any = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    loadUsers()
  }, 500)
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadUsers()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadUsers()
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
  loadUsers()
}

const viewUser = (user: User) => {
  selectedUser.value = user
}

const viewUserSessions = async (user: User) => {
  sessionsUser.value = user
  showSessionsModal.value = true
  userSessions.value = []
  sessionsError.value = ''
  sessionsLoading.value = true
  
  try {
    const response = await sessionService.getUserSessions(user.id)
    // Response structure: response.data.data.sessions
    userSessions.value = response.data.data.sessions || []
  } catch (err: any) {
    console.error('Error loading user sessions:', err)
    sessionsError.value = err.response?.data?.message || 'Failed to load user sessions'
  } finally {
    sessionsLoading.value = false
  }
}

const closeSessionsModal = () => {
  showSessionsModal.value = false
  sessionsUser.value = null
  userSessions.value = []
  sessionsError.value = ''
}

const revokeUserSession = async (sessionId: string) => {
  if (!confirm('Are you sure you want to revoke this session?')) return
  
  try {
    await sessionService.revokeSession(sessionId)
    // Reload sessions
    if (sessionsUser.value) {
      await viewUserSessions(sessionsUser.value)
    }
  } catch (err: any) {
    console.error('Error revoking session:', err)
    alert(err.response?.data?.message || 'Failed to revoke session')
  }
}

const getDeviceIcon = (deviceType: string) => {
  const icons: Record<string, string> = {
    'desktop': '💻',
    'mobile': '📱',
    'tablet': '📱',
    'api-client': '🔧',
    'bot': '🤖',
    'unknown': '❓',
  }
  return icons[deviceType] || '❓'
}

const getBrowserInfo = (userAgent: string) => {
  if (userAgent.includes('Chrome')) return 'Chrome'
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('Safari')) return 'Safari'
  if (userAgent.includes('Edge')) return 'Edge'
  if (userAgent.includes('Postman')) return 'Postman'
  return 'Unknown'
}

const getSecurityBadgeClass = (level: string) => {
  const classes: Record<string, string> = {
    'low': 'bg-red-100 text-red-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'high': 'bg-green-100 text-green-800',
  }
  return classes[level] || 'bg-gray-100 text-gray-800'
}

const formatSessionTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
}

const editUser = (user: User) => {
  editingUser.value = user
  showEditUserModal.value = true
  editError.value = ''
  editSuccess.value = false
  
  // Use roleInfo.id if available, otherwise search through roles
  const roleId = user.roleInfo?.id || roles.value.find(r => r.name === user.role)?.id || ''
  
  editUserForm.value = {
    name: user.name,
    email: user.email,
    mobileNumber: user.mobileNumber || '',
    primaryRoleId: roleId,
    isActive: user.isActive,
    isEmailVerified: user.isEmailVerified,
    isVerified: user.isVerified,
    reason: '',
  }
}

const closeEditUserModal = () => {
  showEditUserModal.value = false
  editingUser.value = null
  editError.value = ''
  editSuccess.value = false
}

const handleUpdateUser = async () => {
  try {
    editError.value = ''
    editSuccess.value = false

    if (!editingUser.value) return

    editSubmitting.value = true

    // Prepare update data - only include changed fields
    const updateData: any = {}
    
    if (editUserForm.value.name !== editingUser.value.name) {
      updateData.name = editUserForm.value.name
    }
    
    if (editUserForm.value.email !== editingUser.value.email) {
      updateData.email = editUserForm.value.email
    }
    
    if (editUserForm.value.mobileNumber !== (editingUser.value.mobileNumber || '')) {
      updateData.mobileNumber = editUserForm.value.mobileNumber || null
    }

    // Check if role changed - use roleInfo.id if available
    const currentRoleId = editingUser.value.roleInfo?.id || roles.value.find(r => r.name === editingUser.value?.role)?.id
    if (editUserForm.value.primaryRoleId && editUserForm.value.primaryRoleId !== currentRoleId) {
      updateData.primaryRoleId = editUserForm.value.primaryRoleId
    }
    
    if (editUserForm.value.isActive !== editingUser.value.isActive) {
      updateData.isActive = editUserForm.value.isActive
    }
    
    if (editUserForm.value.isEmailVerified !== editingUser.value.isEmailVerified) {
      updateData.isEmailVerified = editUserForm.value.isEmailVerified
    }
    
    if (editUserForm.value.isVerified !== editingUser.value.isVerified) {
      updateData.isVerified = editUserForm.value.isVerified
    }

    // Add reason if provided
    if (editUserForm.value.reason) {
      updateData.reason = editUserForm.value.reason
    }

    // Check if there are any changes
    if (Object.keys(updateData).length === 0 || (Object.keys(updateData).length === 1 && updateData.reason)) {
      editError.value = 'No changes to save'
      return
    }

    await userService.adminUpdateUser(editingUser.value.id, updateData)

    editSuccess.value = true

    // Close modal and reload after 1.5 seconds
    setTimeout(() => {
      closeEditUserModal()
      loadUsers()
    }, 1500)
  } catch (err: any) {
    editError.value = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to update user'
    console.error('Update user error:', err)
  } finally {
    editSubmitting.value = false
  }
}

const toggleUserStatus = async (user: User) => {
  const action = user.isActive ? 'deactivate' : 'activate'
  if (!confirm(`Are you sure you want to ${action} ${user.name}?`)) {
    return
  }

  try {
    await userService.updateUser(user.id, { isActive: !user.isActive })
    await loadUsers()
  } catch (err: any) {
    alert(err.response?.data?.error?.message || err.response?.data?.message || `Failed to ${action} user`)
  }
}

const closeModal = () => {
  selectedUser.value = null
}

// Password Management Functions
const openSetPasswordModal = (user: User) => {
  passwordUser.value = user
  showSetPasswordModal.value = true
  passwordError.value = ''
  passwordSuccess.value = false
  setPasswordForm.value = {
    newPassword: '',
    confirmPassword: '',
    forcePasswordChange: true,
    sendNotification: false,
    reason: '',
  }
}

const openResetPasswordModal = (user: User) => {
  passwordUser.value = user
  showResetPasswordModal.value = true
  passwordError.value = ''
  passwordSuccess.value = false
  temporaryPassword.value = ''
  resetPasswordForm.value = {
    forcePasswordChange: true,
    reason: '',
  }
}

const closePasswordModals = () => {
  showSetPasswordModal.value = false
  showResetPasswordModal.value = false
  passwordUser.value = null
  passwordError.value = ''
  passwordSuccess.value = false
  temporaryPassword.value = ''
}

const handleSetPassword = async () => {
  try {
    passwordError.value = ''
    passwordSuccess.value = false

    // Validate passwords match
    if (setPasswordForm.value.newPassword !== setPasswordForm.value.confirmPassword) {
      passwordError.value = 'Passwords do not match'
      return
    }

    // Validate password length
    if (setPasswordForm.value.newPassword.length < 8) {
      passwordError.value = 'Password must be at least 8 characters'
      return
    }

    if (!passwordUser.value) return

    passwordSubmitting.value = true

    await userService.setUserPassword(
      passwordUser.value.id,
      setPasswordForm.value.newPassword,
      setPasswordForm.value.forcePasswordChange,
      setPasswordForm.value.reason,
      setPasswordForm.value.sendNotification
    )

    passwordSuccess.value = true

    // Close modal after 2 seconds
    setTimeout(() => {
      closePasswordModals()
      loadUsers()
    }, 2000)
  } catch (err: any) {
    passwordError.value = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to set password'
    console.error('Set password error:', err)
  } finally {
    passwordSubmitting.value = false
  }
}

const handleResetPassword = async () => {
  try {
    passwordError.value = ''
    passwordSuccess.value = false
    temporaryPassword.value = ''

    if (!passwordUser.value) return

    passwordSubmitting.value = true

    const response = await userService.resetUserPassword(
      passwordUser.value.id,
      resetPasswordForm.value.forcePasswordChange,
      resetPasswordForm.value.reason
    )

    // Extract temporary password from response if available
    const data = response.data?.data || response.data
    if (data?.temporaryPassword) {
      temporaryPassword.value = data.temporaryPassword
    }

    passwordSuccess.value = true

    // Close modal after 5 seconds (longer to allow copying temp password)
    setTimeout(() => {
      closePasswordModals()
      loadUsers()
    }, 5000)
  } catch (err: any) {
    passwordError.value = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to reset password'
    console.error('Reset password error:', err)
  } finally {
    passwordSubmitting.value = false
  }
}

// Utility Functions
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const formatRole = (role: string) => {
  return role.replace('ROLE_', '').charAt(0) + role.replace('ROLE_', '').slice(1).toLowerCase()
}

const getRoleBadgeClass = (role: string) => {
  if (role === 'ROLE_ADMIN') {
    return 'bg-orange-100 text-orange-800'
  }
  return 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

// Lifecycle
onMounted(() => {
  loadRoles()
  loadUsers()
})
</script>
