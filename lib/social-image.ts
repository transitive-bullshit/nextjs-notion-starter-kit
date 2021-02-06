export type ImageLoader = (url: string) => Promise<string | undefined>

export interface SocialImageBackgroundSources {
  fallbackUrl?: string | null
  pageCoverUrl?: string | null
  socialImageUrl?: string | null
}

export async function selectSocialImageBackground(
  { fallbackUrl, pageCoverUrl, socialImageUrl }: SocialImageBackgroundSources,
  loadImage: ImageLoader
): Promise<string | undefined> {
  return selectImageWithFallback(
    [socialImageUrl, pageCoverUrl],
    fallbackUrl,
    loadImage
  )
}

export async function selectImageWithFallback(
  candidates: ReadonlyArray<string | null | undefined>,
  fallbackUrl: string | null | undefined,
  loadImage: ImageLoader
): Promise<string | undefined> {
  const seen = new Set<string>()

  for (const candidate of [...candidates, fallbackUrl]) {
    if (!candidate) continue

    const imageUrl = prepareSocialImageUrl(candidate)
    if (seen.has(imageUrl)) continue

    seen.add(imageUrl)
    const image = await loadImage(imageUrl)
    if (image) return image
  }

  return
}

export function createCachedImageLoader(loadImage: ImageLoader): ImageLoader {
  const images = new Map<string, Promise<string | undefined>>()

  return (url) => {
    const cachedImage = images.get(url)
    if (cachedImage) return cachedImage

    const image = loadImage(url)
    images.set(url, image)
    return image
  }
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
