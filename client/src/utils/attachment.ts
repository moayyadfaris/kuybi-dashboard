const ASSET_BASE_URL =
  import.meta.env.VITE_ASSET_BASE_URL ||
  import.meta.env.VITE_ASSETS_BASE_URL ||
  ''

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const getBaseOrigin = () => {
  if (ASSET_BASE_URL) {
    return ASSET_BASE_URL.replace(/\/$/, '')
  }

  if (API_BASE_URL) {
    try {
      const apiUrl = new URL(API_BASE_URL)
      return apiUrl.origin.replace(/\/$/, '')
    } catch (_error) {
      // ignore parsing error and fallback later
    }
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin.replace(/\/$/, '')
  }

  return ''
}

const baseOrigin = getBaseOrigin()

const makeAbsoluteUrl = (value?: string | null): string => {
  if (!value) return ''

  if (/^(https?:)?\/\//i.test(value) || value.startsWith('data:')) {
    return value
  }

  if (!baseOrigin) {
    return value
  }

  if (value.startsWith('/')) {
    return `${baseOrigin}${value}`
  }

  return `${baseOrigin}/${value}`
}

export const resolveAttachmentUrl = (attachment?: Record<string, any> | null): string => {
  if (!attachment) return ''

  const candidateKeys: Array<string | undefined> = [
    attachment.previewUrl,
    attachment.url,
    attachment.secureUrl,
    attachment.originalImageUrl,
    attachment.originalUrl,
    attachment.thumbnailUrl,
    attachment.thumbnailPath,
    attachment.metadata?.thumbnails?.preview?.url,
    attachment.metadata?.thumbnails?.preview?.key,
    attachment.metadata?.thumbnails?.medium?.url,
    attachment.metadata?.thumbnails?.medium?.key,
    attachment.metadata?.thumbnails?.small?.url,
    attachment.metadata?.thumbnails?.small?.key,
    attachment.path,
    attachment.key,
    attachment.downloadUrl,
  ]

  for (const candidate of candidateKeys) {
    const url = makeAbsoluteUrl(candidate)
    if (url) {
      return url
    }
  }

  return ''
}

export default resolveAttachmentUrl
