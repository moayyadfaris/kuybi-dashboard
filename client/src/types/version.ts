// Story Version Types

export enum VersionType {
  AUTO = 'AUTO',
  MANUAL = 'MANUAL',
  ROLLBACK = 'ROLLBACK',
  BRANCH = 'BRANCH',
  MERGE = 'MERGE'
}

export enum VersionStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  DRAFT = 'DRAFT'
}

export interface VersionUser {
  id: string
  email: string
  firstName: string
  lastName: string
}

export interface Version {
  id: string
  storyId: number
  versionNumber: number
  versionLabel?: string
  versionType: VersionType
  status: VersionStatus
  branchName: string
  tag?: string
  changesCount: number
  changeSummary?: string
  createdBy: VersionUser
  createdAt: string
  commitMessage?: string
  isPinned: boolean
  expiresAt?: string
}

export interface FieldDiff {
  old: unknown
  new: unknown
}

export interface VersionDiff {
  added?: Record<string, unknown>
  modified?: Record<string, FieldDiff>
  removed?: Record<string, unknown>
}

export interface VersionComparison {
  versionA: Version
  versionB: Version
  diff: VersionDiff
  changesCount: number
  changedFields: string[]
}

export interface BranchInfo {
  name: string
  versionCount: number
  latestVersion: number
  lastUpdated: string
  isMain: boolean
}

// Request DTOs
export interface CreateVersionRequest {
  versionLabel?: string
  versionType?: VersionType
  branchName?: string
  tag?: string
  commitMessage?: string
  isPinned?: boolean
}

export interface RollbackVersionRequest {
  versionNumber: number
  commitMessage: string
  createBranch?: boolean
  branchName?: string
}

export interface CreateBranchRequest {
  branchName: string
  fromVersionNumber?: number
  commitMessage?: string
}

export interface MergeVersionRequest {
  fromBranch: string
  fromVersionNumber: number
  targetBranch: string
  commitMessage: string
  resolveConflicts?: Record<string, unknown>
}

export interface CompareVersionsRequest {
  versionA: number
  versionB: number
}

export interface TagVersionRequest {
  tag: string
}

export interface GetVersionsParams {
  limit?: number
  offset?: number
  branchName?: string
}
