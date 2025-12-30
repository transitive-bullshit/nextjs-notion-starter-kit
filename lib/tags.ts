export const normalizeTag = (tag?: string | null) =>
  (tag ?? '').trim().toLowerCase()

export const tagToSlug = (tag: string) => {
  const normalized = normalizeTag(tag)

  return normalized
    .replaceAll(/[^a-z0-9\s-]/g, '')
    .replaceAll(/\s+/g, '-')
    // eslint-disable-next-line unicorn/prefer-string-replace-all
    .replace(/-+/g, '-')
    .replaceAll(/^-|-$/g, '')
}

export const slugToTag = (slug: string) =>
  slug ? decodeURIComponent(slug).replaceAll('-', ' ').trim() : ''

const hiddenTags = new Set<string>([
  // 'hidden-example'
])

export const isHiddenTag = (tag?: string | null) =>
  hiddenTags.has(normalizeTag(tag))
