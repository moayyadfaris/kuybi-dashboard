import apiClient from './authService'
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

export const versionService = {
  /**
   * Get version history for a story
   */
  getVersionHistory: (storyId: number, params?: GetVersionsParams) =>
    apiClient.get<Version[]>(`/v1/stories/${storyId}/versions`, { params }),

  /**
   * Get a specific version by version number
   */
  getVersion: (storyId: number, versionNumber: number) =>
    apiClient.get<Version>(`/v1/stories/${storyId}/versions/${versionNumber}`),

  /**
   * Create a manual version snapshot
   */
  createVersion: (storyId: number, data: CreateVersionRequest) =>
    apiClient.post<Version>(`/v1/stories/${storyId}/versions`, data),

  /**
   * Rollback to a previous version
   */
  rollbackVersion: (storyId: number, data: RollbackVersionRequest) =>
    apiClient.post<Version>(`/v1/stories/${storyId}/versions/rollback`, data),

  /**
   * Create a new branch from a specific version
   */
  createBranch: (storyId: number, data: CreateBranchRequest) =>
    apiClient.post<Version>(`/v1/stories/${storyId}/versions/branch`, data),

  /**
   * Merge branches
   */
  mergeBranches: (storyId: number, data: MergeVersionRequest) =>
    apiClient.post<Version>(`/v1/stories/${storyId}/versions/merge`, data),

  /**
   * Compare two versions
   */
  compareVersions: (storyId: number, data: CompareVersionsRequest) =>
    apiClient.post<VersionComparison>(
      `/v1/stories/${storyId}/versions/compare`,
      data
    ),

  /**
   * Get branch information for a story
   */
  getBranchInfo: (storyId: number) =>
    apiClient.get<BranchInfo[]>(`/v1/stories/${storyId}/versions/branches/info`),

  /**
   * Tag a specific version
   */
  tagVersion: (storyId: number, versionNumber: number, data: TagVersionRequest) =>
    apiClient.post<Version>(
      `/v1/stories/${storyId}/versions/${versionNumber}/tag`,
      data
    ),
}

export default versionService
