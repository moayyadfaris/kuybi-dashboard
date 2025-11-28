import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/authStore'


const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/Login.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../pages/Dashboard.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/stories',
    name: 'Stories',
    component: () => import('../pages/Stories.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/stories/create',
    name: 'CreateStory',
    component: () => import('../pages/CreateStory.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/stories/:id',
    name: 'StoryDetail',
    component: () => import('../pages/StoryDetail.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/stories/:id/edit',
    name: 'EditStory',
    component: () => import('../pages/EditStory.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/stories/:id/versions',
    name: 'VersionHistory',
    component: () => import('../pages/VersionHistoryPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('../pages/Categories.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/tags',
    name: 'Tags',
    component: () => import('../pages/Tags.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../pages/Settings.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../pages/Profile.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/media',
    name: 'Media',
    component: () => import('../pages/Media.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('../pages/Users.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/sessions',
    name: 'Sessions',
    component: () => import('../pages/Sessions.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/post-types',
    name: 'PostTypes',
    component: () => import('../pages/PostTypes.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/post-types/:slug/fields',
    name: 'FieldBuilder',
    component: () => import('../pages/FieldBuilder.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/post-types/:slug/content',
    name: 'PostContent',
    component: () => import('../pages/PostContent.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/post-types/:slug/content/create',
    name: 'CreateContent',
    component: () => import('../pages/CreateContent.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/post-types/:slug/content/:id/edit',
    name: 'EditContent',
    component: () => import('../pages/EditContent.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/acl/roles',
    name: 'Roles',
    component: () => import('../pages/Roles.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/acl/permissions',
    name: 'Permissions',
    component: () => import('../pages/Permissions.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/system-status',
    name: 'SystemStatus',
    component: () => import('../pages/SystemStatus.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard to check authentication
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Check auth and fetch user if token exists but user is not loaded
  await authStore.checkAuth()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login if trying to access protected route
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    // Redirect to dashboard if already logged in
    next('/')
  } else {
    next()
  }
})

export default router
