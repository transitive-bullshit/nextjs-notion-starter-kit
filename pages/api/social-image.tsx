import { NextApiRequest, NextApiResponse } from 'next'
import * as fs from 'fs/promises'
import * as path from 'path'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Read the static PNG from the public directory
    const imagePath = path.join(process.cwd(), 'public', 'images', 'og-preview.png')
    const imageBuffer = await fs.readFile(imagePath)
    
    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.send(imageBuffer)
  } catch (error) {
    console.error('Error reading og-preview.png:', error)
    res.status(404).json({ error: 'Image not found' })
  }
}
