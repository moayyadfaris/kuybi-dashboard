import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import Login from '../pages/Login.vue'
import Dashboard from '../pages/Dashboard.vue'
import Stories from '../pages/Stories.vue'
import StoryDetail from '../pages/StoryDetail.vue'
import CreateStory from '../pages/CreateStory.vue'
import EditStory from '../pages/EditStory.vue'
import VersionHistoryPage from '../pages/VersionHistoryPage.vue'
import Categories from '../pages/Categories.vue'
import Tags from '../pages/Tags.vue'
import Settings from '../pages/Settings.vue'
import Profile from '../pages/Profile.vue'
import Media from '../pages/Media.vue'
import Users from '../pages/Users.vue'
import Sessions from '../pages/Sessions.vue'
import PostTypes from '../pages/PostTypes.vue'
import FieldBuilder from '../pages/FieldBuilder.vue'
import PostContent from '../pages/PostContent.vue'
import CreateContent from '../pages/CreateContent.vue'
import EditContent from '../pages/EditContent.vue'
import Roles from '../pages/Roles.vue'
import Permissions from '../pages/Permissions.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/stories',
    name: 'Stories',
    component: Stories,
    meta: { requiresAuth: true },
  },
  {
    path: '/stories/create',
    name: 'CreateStory',
    component: CreateStory,
    meta: { requiresAuth: true },
  },
  {
    path: '/stories/:id',
    name: 'StoryDetail',
    component: StoryDetail,
    meta: { requiresAuth: true },
  },
  {
    path: '/stories/:id/edit',
    name: 'EditStory',
    component: EditStory,
    meta: { requiresAuth: true },
  },
  {
    path: '/stories/:id/versions',
    name: 'VersionHistory',
    component: VersionHistoryPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/categories',
    name: 'Categories',
    component: Categories,
    meta: { requiresAuth: true },
  },
  {
    path: '/tags',
    name: 'Tags',
    component: Tags,
    meta: { requiresAuth: true },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: '/media',
    name: 'Media',
    component: Media,
    meta: { requiresAuth: true },
  },
  {
    path: '/users',
    name: 'Users',
    component: Users,
    meta: { requiresAuth: true },
  },
  {
    path: '/sessions',
    name: 'Sessions',
    component: Sessions,
    meta: { requiresAuth: true },
  },
  {
    path: '/post-types',
    name: 'PostTypes',
    component: PostTypes,
    meta: { requiresAuth: true },
  },
  {
    path: '/post-types/:slug/fields',
    name: 'FieldBuilder',
    component: FieldBuilder,
    meta: { requiresAuth: true },
  },
  {
    path: '/post-types/:slug/content',
    name: 'PostContent',
    component: PostContent,
    meta: { requiresAuth: true },
  },
  {
    path: '/post-types/:slug/content/create',
    name: 'CreateContent',
    component: CreateContent,
    meta: { requiresAuth: true },
  },
  {
    path: '/post-types/:slug/content/:id/edit',
    name: 'EditContent',
    component: EditContent,
    meta: { requiresAuth: true },
  },
  {
    path: '/acl/roles',
    name: 'Roles',
    component: Roles,
    meta: { requiresAuth: true },
  },
  {
    path: '/acl/permissions',
    name: 'Permissions',
    component: Permissions,
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
