import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { versionService } from '../services/versionService'
import type {
  Version,
  VersionComparison,
  BranchInfo,
  CreateVersionRequest,
  RollbackVersionRequest,
  CreateBranchRequest,
  MergeVersionRequest,
  CompareVersionsRequest,
  TagVersionRequest,
  GetVersionsParams,
} from '../types/version'

export const useVersionStore = defineStore('version', () => {
  // State
  const versions = ref<Version[]>([])
  const currentVersion = ref<Version | null>(null)
  const branches = ref<BranchInfo[]>([])
  const comparison = ref<VersionComparison | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentStoryId = ref<number | null>(null)

  // Computed
  const versionsByBranch = computed(() => {
    const grouped: Record<string, Version[]> = {}
    versions.value.forEach((version) => {
      if (!grouped[version.branchName]) {
        grouped[version.branchName] = []
      }
      grouped[version.branchName].push(version)
    })
    return grouped
  })

  const pinnedVersions = computed(() =>
    versions.value.filter((v) => v.isPinned)
  )

  const latestVersion = computed(() =>
    versions.value.length > 0 ? versions.value[0] : null
  )

  // Actions
  const fetchVersionHistory = async (
    storyId: number,
    params?: GetVersionsParams
  ) => {
    loading.value = true
    error.value = null
    currentStoryId.value = storyId

    try {
      const response = await versionService.getVersionHistory(storyId, params)
      const data: any = response.data
      versions.value = data.data || data
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch version history'
      return false
    } finally {
      loading.value = false
    }
  }

  const fetchVersion = async (storyId: number, versionNumber: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await versionService.getVersion(storyId, versionNumber)
      const data: any = response.data
      currentVersion.value = data.data || data
      return currentVersion.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch version'
      return null
    } finally {
      loading.value = false
    }
  }

  const createVersion = async (storyId: number, data: CreateVersionRequest) => {
    loading.value = true
    error.value = null

    try {
      const response = await versionService.createVersion(storyId, data)
      const responseData: any = response.data
      const newVersion = responseData.data || responseData
      
      // Add to beginning of versions array
      versions.value.unshift(newVersion)
      
      return newVersion
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create version'
      return null
    } finally {
      loading.value = false
    }
  }

  const rollbackVersion = async (
    storyId: number,
    data: RollbackVersionRequest
  ) => {
    loading.value = true
    error.value = null

    try {
      const response = await versionService.rollbackVersion(storyId, data)
      const responseData: any = response.data
      const rollbackVersion = responseData.data || responseData
      
      // Add to versions array
      versions.value.unshift(rollbackVersion)
      
      return rollbackVersion
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to rollback version'
      return null
    } finally {
      loading.value = false
    }
  }

  const createBranch = async (storyId: number, data: CreateBranchRequest) => {
    loading.value = true
    error.value = null

    try {
      const response = await versionService.createBranch(storyId, data)
      const responseData: any = response.data
      const branchVersion = responseData.data || responseData
      
      // Add to versions array
      versions.value.unshift(branchVersion)
      
      // Refresh branch info
      await fetchBranchInfo(storyId)
      
      return branchVersion
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create branch'
      return null
    } finally {
      loading.value = false
    }
  }

  const mergeBranches = async (storyId: number, data: MergeVersionRequest) => {
    loading.value = true
    error.value = null

    try {
      const response = await versionService.mergeBranches(storyId, data)
      const responseData: any = response.data
      const mergeVersion = responseData.data || responseData
      
      // Add to versions array
      versions.value.unshift(mergeVersion)
      
      return mergeVersion
    } catch (err: any) {
      // Check for merge conflicts (409)
      if (err.response?.status === 409) {
        error.value = 'Merge conflicts detected'
        return {
          conflicts: err.response?.data?.conflicts,
          error: true,
        }
      }
      error.value = err.response?.data?.message || 'Failed to merge branches'
      return null
    } finally {
      loading.value = false
    }
  }

  const compareVersions = async (
    storyId: number,
    data: CompareVersionsRequest
  ) => {
    loading.value = true
    error.value = null

    try {
      const response = await versionService.compareVersions(storyId, data)
      const responseData: any = response.data
      comparison.value = responseData.data || responseData
      return comparison.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to compare versions'
      return null
    } finally {
      loading.value = false
    }
  }

  const fetchBranchInfo = async (storyId: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await versionService.getBranchInfo(storyId)
      const data: any = response.data
      branches.value = data.data || data
      return branches.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch branch info'
      return []
    } finally {
      loading.value = false
    }
  }

  const tagVersion = async (
    storyId: number,
    versionNumber: number,
    data: TagVersionRequest
  ) => {
    loading.value = true
    error.value = null

    try {
      const response = await versionService.tagVersion(storyId, versionNumber, data)
      const responseData: any = response.data
      const taggedVersion = responseData.data || responseData
      
      // Update in versions array
      const index = versions.value.findIndex(
        (v) => v.versionNumber === versionNumber
      )
      if (index !== -1) {
        versions.value[index] = taggedVersion
      }
      
      return taggedVersion
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to tag version'
      return null
    } finally {
      loading.value = false
    }
  }

  const clearVersions = () => {
    versions.value = []
    currentVersion.value = null
    branches.value = []
    comparison.value = null
    error.value = null
    currentStoryId.value = null
  }

  return {
    // State
    versions,
    currentVersion,
    branches,
    comparison,
    loading,
    error,
    currentStoryId,
    
    // Computed
    versionsByBranch,
    pinnedVersions,
    latestVersion,
    
    // Actions
    fetchVersionHistory,
    fetchVersion,
    createVersion,
    rollbackVersion,
    createBranch,
    mergeBranches,
    compareVersions,
    fetchBranchInfo,
    tagVersion,
    clearVersions,
  }
})
