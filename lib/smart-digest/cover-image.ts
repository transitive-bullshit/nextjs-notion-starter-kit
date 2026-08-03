import { execFile } from 'node:child_process'
import { writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

import type { DigestConfig, DigestPost } from './types.js'

const execFileAsync = promisify(execFile)

export interface CoverConfig {
  imageBaseUrl: string
  imageApiKey: string
  imageModel: string
  imagePrompt: string
  r2AccountId: string
  r2Bucket: string
  r2PublicUrl: string
}

const COVER_TEMPLATES = [
  // 1. Neon Circuit — dark + glowing traces
  `Wide 1500x500 tech banner. Dark background (#0a0a1a to #0f0a2e).
Glowing neon circuit board traces in cyan (#00d4ff) and magenta (#ff006e).
Data packets flowing as bright dots along the traces. Subtle grid pattern underneath.
Soft bokeh light orbs. NO text, NO logos, NO faces. Minimal, premium, high contrast.`,

  // 2. Paper Minimal — clean white editorial
  `Wide 1500x500 editorial banner. Warm off-white background (#faf9f6).
A single elegant geometric shape (circle or hexagon) in soft coral (#f97066) positioned off-center.
Thin precise lines in light gray extending from the shape. Plenty of negative space.
Feels like a premium magazine cover. NO text, NO logos, NO faces. Clean, editorial, sophisticated.`,

  // 3. Liquid Glass — frosted morphism
  `Wide 1500x500 tech banner. Dark gradient background (#0c0c1d to #1a1a3e).
Floating translucent glass-morphism shapes - rounded rectangles and circles with frosted blur.
Accent colors: warm amber (#f59e0b), soft teal (#14b8a6), white highlights.
Subtle light refraction and rainbow prism effects on edges. NO text, NO logos, NO faces. Modern and clean.`,

  // 4. Sunrise Gradient — warm bright tones
  `Wide 1500x500 abstract art. Bright warm background.
Smooth horizontal gradient flowing from peach (#fcd5b5) through coral (#f87171) to lavender (#c4b5fd).
Soft organic blob shapes overlapping with slight transparency. Golden light rays from top-left corner.
Feels optimistic and fresh like morning light. NO text, NO logos, NO faces. Bright, warm, inviting.`,

  // 5. Topographic Data — dark terrain
  `Wide 1500x500 tech banner. Dark navy background (#0a1628).
Abstract topographic contour lines glowing softly in emerald green (#10b981) and sky blue (#38bdf8).
Lines form elevation-map patterns with occasional bright node intersections.
Subtle dot matrix pattern. NO text, NO logos, NO faces. Calm, analytical, premium.`,

  // 6. Isometric Blocks — colorful 3D
  `Wide 1500x500 illustration. Isometric 3D view of floating geometric blocks and cubes.
Light cream background (#f5f0eb). Blocks in varying sizes with soft gradients of coral (#f97316), mint (#34d399), and lavender (#a78bfa).
Some blocks have tiny glowing windows. Subtle shadows give depth. Clean vector illustration style.
NO text, NO logos, NO faces. Playful yet professional.`,

  // 7. Retro Terminal — CRT aesthetic
  `Wide 1500x500 tech banner. Black background with subtle CRT scanline texture overlay.
Bright phosphor green (#22c55e) monospaced code characters scattered and fading into the background.
A single blinking cursor in the center. Slight CRT screen curvature and vignette on edges.
Retro computing aesthetic, nostalgic. NO text, NO logos, NO faces.`,

  // 8. Memphis Pop — bright geometric
  `Wide 1500x500 illustration. Bright white background (#ffffff).
Scattered bold geometric shapes: pink triangles (#ec4899), blue circles (#3b82f6), yellow squiggly lines (#facc15), green dots (#22c55e).
Memphis design style from the 80s. Shapes at playful angles, some with dotted patterns inside.
Energetic, fun, creative. NO text, NO logos, NO faces. Bold colors on clean white.`,

  // 9. Aurora Gradient — smooth color flow
  `Wide 1500x500 abstract art. A smooth flowing aurora of color bands across the image.
Colors blend naturally: deep indigo (#312e81) to rose (#f43f5e) to gold (#eab308) to teal (#0d9488).
Silky smooth gradients, no hard edges. Subtle grain texture for warmth.
Feels like a sunset sky meets northern lights. NO text, NO logos, NO faces. Serene and bold.`,

  // 10. Duotone Photo — bold two-color
  `Wide 1500x500 abstract photo. A duotone-treated image of a cityscape or technology workspace.
Only two colors used: deep navy blue (#1e3a8a) and bright electric yellow (#facc15).
High contrast, graphic design poster feel. Strong silhouettes and bold shapes.
Inspired by Spotify Wrapped and modern editorial design. NO text, NO logos, NO faces. Striking and memorable.`
]

function dateHash(date: string): number {
  let hash = 0
  for (const ch of date) hash = ((hash << 5) - hash + ch.charCodeAt(0)) | 0
  return hash
}

function pickCoverTemplate(date: string): string {
  return COVER_TEMPLATES[Math.abs(dateHash(date)) % COVER_TEMPLATES.length]!
}

export function loadCoverConfig(): CoverConfig | null {
  const r2AccountId = process.env.R2_ACCOUNT_ID
  const r2Bucket = process.env.R2_BUCKET
  const r2PublicUrl = process.env.R2_PUBLIC_URL

  if (!r2AccountId || !r2Bucket || !r2PublicUrl) {
    return null
  }

  return {
    imageBaseUrl:
      process.env.COVER_IMAGE_BASE_URL || process.env.LLM_BASE_URL || '',
    imageApiKey:
      process.env.COVER_IMAGE_API_KEY || process.env.LLM_API_KEY || '',
    imageModel: process.env.COVER_IMAGE_MODEL || 'imagen-4.0-generate-001',
    imagePrompt: process.env.COVER_IMAGE_PROMPT || '',
    r2AccountId,
    r2Bucket,
    r2PublicUrl
  }
}

async function generateImage(
  coverConfig: CoverConfig,
  post: DigestPost
): Promise<Buffer> {
  // Use custom prompt from env, or pick a random template based on date
  const basePrompt = coverConfig.imagePrompt || pickCoverTemplate(post.date)
  const summary = post.description
    ? `
Summary: ${post.description}`
    : ''
  const prompt = `${basePrompt}

Inspired by the topic: "${post.title}"${summary}
Tags: ${post.tags.join(', ')}`

  // Try /images/generations first (Google API, OpenAI, etc.)
  // Fall back to /chat/completions (CLIProxyAPI returns images in message.images[])
  const imagesUrl = `${coverConfig.imageBaseUrl}/images/generations`
  const chatUrl = `${coverConfig.imageBaseUrl}/chat/completions`
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${coverConfig.imageApiKey}`
  }

  // Attempt /images/generations
  const imagesRes = await fetch(imagesUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: coverConfig.imageModel,
      prompt,
      n: 1,
      size: '1536x1024',
      response_format: 'b64_json'
    })
  })

  if (imagesRes.ok) {
    const data = (await imagesRes.json()) as {
      data?: Array<{ b64_json?: string; url?: string }>
    }
    const img = data.data?.[0]
    if (img?.b64_json) return Buffer.from(img.b64_json, 'base64')
    if (img?.url) {
      if (img.url.startsWith('data:')) {
        const b64 = img.url.split(',')[1]
        if (b64) return Buffer.from(b64, 'base64')
      }
      const dl = await fetch(img.url)
      if (dl.ok) return Buffer.from(await dl.arrayBuffer())
    }
  }

  // Fall back to /chat/completions (CLIProxyAPI style - images in message.images[])
  console.log(
    '  ↳ /images/generations unavailable, trying /chat/completions...'
  )
  const chatRes = await fetch(chatUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: coverConfig.imageModel,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 4096
    })
  })

  if (!chatRes.ok) {
    const text = await chatRes.text()
    throw new Error(`Image generation failed ${chatRes.status}: ${text}`)
  }

  const chatData = (await chatRes.json()) as {
    error?: { message: string }
    choices?: Array<{
      message?: {
        images?: Array<{ image_url: { url: string } }>
      }
      delta?: {
        images?: Array<{ image_url: { url: string } }>
      }
    }>
  }

  if (chatData.error) {
    throw new Error(`Image generation error: ${chatData.error.message}`)
  }

  const msg = chatData.choices?.[0]?.message ?? chatData.choices?.[0]?.delta
  const images = msg?.images
  if (!images || images.length === 0) {
    throw new Error('No image returned from model')
  }

  const dataUri = images[0]!.image_url.url
  const b64 = dataUri.split(',')[1]
  if (!b64) throw new Error('Invalid image data URI')
  return Buffer.from(b64, 'base64')
}

async function uploadToR2(
  coverConfig: CoverConfig,
  key: string,
  filePath: string,
  contentType = 'image/jpeg'
): Promise<string> {
  const env = {
    ...process.env,
    CLOUDFLARE_ACCOUNT_ID: coverConfig.r2AccountId
  }

  await execFileAsync(
    'wrangler',
    [
      'r2',
      'object',
      'put',
      `${coverConfig.r2Bucket}/${key}`,
      '--file',
      filePath,
      '--remote',
      '--content-type',
      contentType
    ],
    { env }
  )

  return `${coverConfig.r2PublicUrl}/${key}`
}

async function setNotionCover(
  config: DigestConfig,
  pageId: string,
  imageUrl: string
): Promise<void> {
  const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${config.notionApiKey}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cover: {
        type: 'external',
        external: { url: imageUrl }
      }
    })
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to set Notion cover ${res.status}: ${text}`)
  }
}

async function optimizeImage(inputPath: string): Promise<string> {
  const outputPath = inputPath.replace(/\.\w+$/, '.webp')
  const sharp = (await import('sharp')).default
  await sharp(inputPath).resize(1500).webp({ quality: 80 }).toFile(outputPath)
  return outputPath
}
export async function generateAndSetCover(
  config: DigestConfig,
  coverConfig: CoverConfig,
  post: DigestPost,
  pageId: string
): Promise<string> {
  console.log(
    `🎨 Generating cover image (${coverConfig.imageModel}, template ${(Math.abs(dateHash(post.date)) % COVER_TEMPLATES.length) + 1}/${COVER_TEMPLATES.length})...`
  )
  const imageBuffer = await generateImage(coverConfig, post)

  const rawPath = join(tmpdir(), `digest-cover-${post.date}-raw.png`)
  await writeFile(rawPath, imageBuffer)
  console.log(`  ✓ Generated (${(imageBuffer.length / 1024).toFixed(0)}KB)`)

  console.log('🗜️  Optimizing...')
  const optimizedPath = await optimizeImage(rawPath)
  const { size } = await import('node:fs').then((fs) =>
    fs.statSync(optimizedPath)
  )
  console.log(`  ✓ Optimized (${(size / 1024).toFixed(0)}KB WebP)`)

  console.log('☁️  Uploading to R2...')
  const webpKey = `covers/daily-digest-${post.date}.webp`
  const publicUrl = await uploadToR2(
    coverConfig,
    webpKey,
    optimizedPath,
    'image/webp'
  )
  console.log(`  ✓ Uploaded: ${publicUrl}`)

  // Also upload PNG for social sharing (Facebook doesn't support WebP)
  const pngKey = `covers/daily-digest-${post.date}.png`
  await uploadToR2(coverConfig, pngKey, rawPath, 'image/png')
  console.log(
    `  ✓ Uploaded PNG for social: ${coverConfig.r2PublicUrl}/${pngKey}`
  )

  console.log('🖼️  Setting Notion cover...')
  await setNotionCover(config, pageId, publicUrl)
  console.log('  ✓ Cover set!')

  // Keep files in tmpdir for CI artifact upload; cleaned up when runner exits

  return publicUrl
}
