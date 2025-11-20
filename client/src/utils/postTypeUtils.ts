/**
 * Post Types Utilities
 * Helper functions for Dynamic Post Types system
 * Based on: Dynamic Post Types - Frontend Integration Guide v1.0.0
 */

import type { PostType, FieldDefinition, PostContent } from '../types/postTypes'

/**
 * Generate slug from text
 * Auto-generates URL-friendly slugs
 * 
 * Example: "My Event Title" -> "my-event-title"
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')      // Remove special characters
    .replace(/[\s_-]+/g, '-')      // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, '')       // Remove leading/trailing hyphens
}

/**
 * Generate field name from label
 * Converts human-readable label to snake_case field name
 * 
 * Example: "Event Date" -> "event_date"
 */
export const generateFieldName = (label: string): string => {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '')       // Remove special characters
    .replace(/\s+/g, '_')          // Replace spaces with underscores
}

/**
 * Format field name for display
 * Converts snake_case to Title Case
 * 
 * Example: "event_date" -> "Event Date"
 */
export const formatFieldName = (name: string): string => {
  return name
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}

/**
 * Validate slug format
 * Ensures slug meets requirements
 */
export const isValidSlug = (slug: string): boolean => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return slugRegex.test(slug)
}

/**
 * Validate field name format
 * Ensures field name is snake_case
 */
export const isValidFieldName = (name: string): boolean => {
  const nameRegex = /^[a-z][a-z0-9_]*$/
  return nameRegex.test(name)
}

/**
 * Cache Management Functions
 */

interface CachedData<T> {
  data: T
  timestamp: number
  ttl: number
}

/**
 * Cache data in localStorage
 */
export const cacheData = <T>(key: string, data: T, ttl: number = 30 * 60 * 1000): void => {
  try {
    const cached: CachedData<T> = {
      data,
      timestamp: Date.now(),
      ttl
    }
    localStorage.setItem(`cache_${key}`, JSON.stringify(cached))
  } catch (error) {
    console.error('Failed to cache data:', error)
  }
}

/**
 * Get cached data from localStorage
 */
export const getCachedData = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(`cache_${key}`)
    if (!item) return null

    const cached: CachedData<T> = JSON.parse(item)
    const isExpired = Date.now() - cached.timestamp > cached.ttl

    if (isExpired) {
      localStorage.removeItem(`cache_${key}`)
      return null
    }

    return cached.data
  } catch (error) {
    console.error('Failed to get cached data:', error)
    return null
  }
}

/**
 * Clear cached data
 */
export const clearCachedData = (pattern?: string): void => {
  try {
    if (pattern) {
      // Clear keys matching pattern
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith('cache_') && key.includes(pattern)) {
          localStorage.removeItem(key)
        }
      })
    } else {
      // Clear all cache keys
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith('cache_')) {
          localStorage.removeItem(key)
        }
      })
    }
  } catch (error) {
    console.error('Failed to clear cached data:', error)
  }
}

/**
 * Format Date/Time Functions
 */

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return 'Invalid Date'
  }
}

/**
 * Format datetime for display
 */
export const formatDateTime = (dateString: string): string => {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'Invalid Date'
  }
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (dateString: string): string => {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`
    
    return formatDate(dateString)
  } catch {
    return 'Invalid Date'
  }
}

/**
 * Content Status Helpers
 */

/**
 * Get status badge class
 */
export const getStatusBadgeClass = (status: string): string => {
  const classes: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800',
    pending_review: 'bg-yellow-100 text-yellow-800',
    published: 'bg-green-100 text-green-800',
    scheduled: 'bg-blue-100 text-blue-800',
    archived: 'bg-purple-100 text-purple-800',
    deleted: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

/**
 * Get status label
 */
export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    draft: 'Draft',
    pending_review: 'Pending Review',
    published: 'Published',
    scheduled: 'Scheduled',
    archived: 'Archived',
    deleted: 'Deleted'
  }
  return labels[status] || status
}

/**
 * Field Data Helpers
 */

/**
 * Extract field data from form values
 * Separates standard fields from custom field_data
 */
export const extractFieldData = (
  formData: Record<string, any>,
  fields: FieldDefinition[]
): { standard: Record<string, any>; field_data: Record<string, any> } => {
  const standardFields = ['title', 'excerpt', 'status', 'parentId', 'scheduledFor']
  const standard: Record<string, any> = {}
  const field_data: Record<string, any> = {}

  Object.entries(formData).forEach(([key, value]) => {
    if (standardFields.includes(key)) {
      standard[key] = value
    } else {
      field_data[key] = value
    }
  })

  return { standard, field_data }
}

/**
 * Merge field_data with form defaults
 */
export const mergeFieldData = (
  field_data: Record<string, any>,
  fields: FieldDefinition[]
): Record<string, any> => {
  const merged: Record<string, any> = {}

  fields.forEach(field => {
    merged[field.name] = field_data[field.name] ?? field.defaultValue ?? ''
  })

  return merged
}

/**
 * Validation Helpers
 */

/**
 * Validate all fields in form data
 */
export const validateFormData = (
  formData: Record<string, any>,
  fields: FieldDefinition[]
): Record<string, string> => {
  const errors: Record<string, string> = {}

  fields.forEach(field => {
    const value = formData[field.name]

    // Required validation
    if (field.isRequired && !value) {
      errors[field.name] = `${field.label} is required`
      return
    }

    // Skip further validation if no value
    if (!value) return

    const rules = field.validationRules || {}

    // String length validation
    if (typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        errors[field.name] = `${field.label} must be at least ${rules.minLength} characters`
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        errors[field.name] = `${field.label} must not exceed ${rules.maxLength} characters`
      }
    }

    // Number validation
    if (typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        errors[field.name] = `${field.label} must be at least ${rules.min}`
      }
      if (rules.max !== undefined && value > rules.max) {
        errors[field.name] = `${field.label} must not exceed ${rules.max}`
      }
    }
  })

  return errors
}

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Truncate text
 */
export const truncate = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Count words in text
 */
export const countWords = (text: string): number => {
  return text.trim().split(/\s+/).length
}

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
