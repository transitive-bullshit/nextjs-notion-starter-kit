import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const BASIC_AUTH_USER = process.env.BASIC_AUTH_USER || 'jaskurach'
const BASIC_AUTH_PASS = process.env.BASIC_AUTH_PASS || 'zoooo123'

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get('authorization')

  if (authHeader) {
    const parts = authHeader.split(' ')
    if (parts.length === 2 && parts[0] === 'Basic') {
      try {
        const [user, pass] = atob(parts[1]).split(':')
        if (user === BASIC_AUTH_USER && pass === BASIC_AUTH_PASS) {
          return NextResponse.next()
        }
      } catch (err) {
        console.error('Invalid basic auth format')
      }
    }
  }

  const response = new NextResponse('Authentication required', { status: 401 })
  response.headers.set('WWW-Authenticate', 'Basic realm="Secure Area"')
  return response
}
