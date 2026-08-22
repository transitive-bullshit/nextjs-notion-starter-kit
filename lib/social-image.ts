export type ImageReachabilityCheck = (url: string) => Promise<boolean>

export interface SocialImageBackgroundSources {
  fallbackUrl?: string | null
  pageCoverUrl?: string | null
  socialImageUrl?: string | null
}

export async function selectSocialImageBackground(
  { fallbackUrl, pageCoverUrl, socialImageUrl }: SocialImageBackgroundSources,
  isReachable: ImageReachabilityCheck
): Promise<string | undefined> {
  return selectImageWithFallback(
    [socialImageUrl, pageCoverUrl],
    fallbackUrl,
    isReachable
  )
}

export async function selectImageWithFallback(
  candidates: ReadonlyArray<string | null | undefined>,
  fallbackUrl: string | null | undefined,
  isReachable: ImageReachabilityCheck
): Promise<string | undefined> {
  const seen = new Set<string>()

  for (const candidate of candidates) {
    if (!candidate || seen.has(candidate)) continue

    seen.add(candidate)
    if (await isReachable(candidate)) {
      return prepareSocialImageUrl(candidate)
    }
  }

  return fallbackUrl ? prepareSocialImageUrl(fallbackUrl) : undefined
}

function prepareSocialImageUrl(image: string): string {
  try {
    const imageUrl = new URL(image)

    if (
      imageUrl.host === 'images.unsplash.com' &&
      !imageUrl.searchParams.has('w')
    ) {
      imageUrl.searchParams.set('w', '1200')
      imageUrl.searchParams.set('fit', 'max')
      return imageUrl.toString()
    }
  } catch {
    return image
  }

  return image
}
