<template>
  <div class="bg-gray-50 border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <nav class="flex items-center space-x-2 text-sm">
        <!-- Home Link -->
        <router-link 
          to="/" 
          class="text-gray-600 hover:text-gray-900 transition flex items-center"
        >
          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
          </svg>
          Home
        </router-link>

        <!-- Breadcrumb Items -->
        <template v-for="(crumb, index) in breadcrumbs" :key="index">
          <span class="text-gray-400">/</span>
          
          <router-link 
            v-if="crumb.path && index < breadcrumbs.length - 1"
            :to="crumb.path"
            class="text-gray-600 hover:text-gray-900 transition flex items-center"
          >
            <component :is="crumb.icon" :class="getIconAnimationClass()" :style="{ animationDelay: `${index * 100}ms` }" />
            {{ crumb.label }}
          </router-link>
          <span v-else class="text-gray-900 font-medium flex items-center">
            <component :is="crumb.icon" :class="getIconAnimationClass()" :style="{ animationDelay: `${index * 100}ms` }" />
            {{ crumb.label }}
          </span>
        </template>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// Icon components
const StoriesIcon = defineComponent({
  render: () => h('svg', { class: 'w-4 h-4', fill: 'currentColor', viewBox: '0 0 20 20' }, [
    h('path', { d: 'M9 2a1 1 0 000 2h2a1 1 0 100-2H9z' }),
    h('path', { 'fill-rule': 'evenodd', d: 'M4 5a2 2 0 012-2 1 1 0 000-2H6a4 4 0 014 4v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3 1h6v6H7V6z', 'clip-rule': 'evenodd' })
  ])
})

const CategoriesIcon = defineComponent({
  render: () => h('svg', { class: 'w-4 h-4', fill: 'currentColor', viewBox: '0 0 20 20' }, [
    h('path', { d: 'M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h1a1 1 0 001-1v-6a1 1 0 00-1-1h-1z' })
  ])
})

const TagsIcon = defineComponent({
  render: () => h('svg', { class: 'w-4 h-4', fill: 'currentColor', viewBox: '0 0 20 20' }, [
    h('path', { 'fill-rule': 'evenodd', d: 'M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.999.999 0 010 10V4a1 1 0 011-1h6a.999.999 0 01.707.293l7 7zM4 6a2 2 0 100-4 2 2 0 000 4z', 'clip-rule': 'evenodd' })
  ])
})

const CreateIcon = defineComponent({
  render: () => h('svg', { class: 'w-4 h-4', fill: 'currentColor', viewBox: '0 0 20 20' }, [
    h('path', { 'fill-rule': 'evenodd', d: 'M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10.666a1 1 0 11-1.64-1.118L9.687 10H5a1 1 0 01-.82-1.573l7-10.666a1 1 0 011.12-.46z', 'clip-rule': 'evenodd' })
  ])
})

const EditIcon = defineComponent({
  render: () => h('svg', { class: 'w-4 h-4', fill: 'currentColor', viewBox: '0 0 20 20' }, [
    h('path', { d: 'M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' })
  ])
})

const ProfileIcon = defineComponent({
  render: () => h('svg', { class: 'w-4 h-4', fill: 'currentColor', viewBox: '0 0 20 20' }, [
    h('path', { 'fill-rule': 'evenodd', d: 'M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z', 'clip-rule': 'evenodd' })
  ])
})

const SettingsIcon = defineComponent({
  render: () => h('svg', { class: 'w-4 h-4', fill: 'currentColor', viewBox: '0 0 20 20' }, [
    h('path', { 'fill-rule': 'evenodd', d: 'M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z', 'clip-rule': 'evenodd' })
  ])
})

const MediaIcon = defineComponent({
  render: () => h('svg', { class: 'w-4 h-4', fill: 'currentColor', viewBox: '0 0 20 20' }, [
    h('path', { d: 'M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7l-2.5-2.5a1 1 0 00-1.415 0L9 10.414l-2.5-2.5a1 1 0 00-1.415 0L5 10V5z' }),
    h('circle', { cx: '8', cy: '9', r: '1.5' })
  ])
})

interface Breadcrumb {
  label: string
  path?: string
  icon?: any
}

interface Settings {
  animationStyle: string
  animationSpeed: string
  enableAnimations: boolean
}

const route = useRoute()
const settings = ref<Settings>({
  animationStyle: 'bounce',
  animationSpeed: 'normal',
  enableAnimations: true
})

const loadSettings = () => {
  const saved = localStorage.getItem('breadcrumbSettings')
  if (saved) {
    try {
      settings.value = JSON.parse(saved)
    } catch (e) {
      console.error('Failed to load breadcrumb settings:', e)
    }
  }
}

onMounted(() => {
  loadSettings()
  // Listen for settings changes
  window.addEventListener('breadcrumb-settings-changed', (event: any) => {
    settings.value = event.detail
  })
})

const getIconAnimationClass = () => {
  if (!settings.value.enableAnimations) return 'w-4 h-4 mr-1'
  
  const baseClass = {
    bounce: 'animate-bounce',
    pulse: 'animate-pulse',
    spin: 'animate-spin',
    fade: 'animate-pulse opacity-75',
    none: ''
  }[settings.value.animationStyle] || 'animate-bounce'

  const speedClass = {
    slow: '[animation-duration:1.5s]',
    normal: '',
    fast: '[animation-duration:0.5s]'
  }[settings.value.animationSpeed] || ''

  return `w-4 h-4 mr-1 ${baseClass} ${speedClass}`.trim()
}

const breadcrumbs = computed(() => {
  const crumbs: Breadcrumb[] = []
  const pathSegments = route.path.split('/').filter(Boolean)

  pathSegments.forEach((segment, index) => {
    let label = segment.charAt(0).toUpperCase() + segment.slice(1)
    let path = '/' + pathSegments.slice(0, index + 1).join('/')
    let icon = null

    // Customize labels and icons for better readability
    switch (segment) {
      case 'stories':
        label = 'Stories'
        icon = StoriesIcon
        break
      case 'create':
        label = 'Create Story'
        icon = CreateIcon
        break
      case 'edit':
        label = 'Edit Story'
        icon = EditIcon
        break
      case 'categories':
        label = 'Categories'
        icon = CategoriesIcon
        break
      case 'tags':
        label = 'Tags'
        icon = TagsIcon
        break
      case 'profile':
        label = 'Profile'
        icon = ProfileIcon
        break
      case 'settings':
        label = 'Settings'
        icon = SettingsIcon
        break
      case 'media':
        label = 'Media'
        icon = MediaIcon
        break
      default:
        // For story IDs, don't add them to breadcrumbs
        if (segment.match(/^[0-9a-f-]{36}$|^\d+$/)) {
          return
        }
        label = segment.charAt(0).toUpperCase() + segment.slice(1)
    }

    crumbs.push({ label, path, icon })
  })

  return crumbs
})
</script>

<style scoped>
</style>
