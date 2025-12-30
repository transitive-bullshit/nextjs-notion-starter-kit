export const normalizeTag = (tag?: string | null) =>
  (tag ?? '').trim().toLowerCase()

export const tagToSlug = (tag: string) => {
  const normalized = normalizeTag(tag)

  return normalized
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export const slugToTag = (slug: string) =>
  slug ? decodeURIComponent(slug).replace(/-/g, ' ').trim() : ''

const hiddenTags = new Set<string>([
  // 'hidden-example'
])

export const isHiddenTag = (tag?: string | null) =>
  hiddenTags.has(normalizeTag(tag))
