import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const BASIC_AUTH_USER = 'jaskurach'
const BASIC_AUTH_PASS = 'zoooom123'

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get('authorization')

  if (authHeader) {
    const base64 = authHeader.split(' ')[1]
    const [user, pass] = atob(base64).split(':')

    if (user === BASIC_AUTH_USER && pass === BASIC_AUTH_PASS) {
      return NextResponse.next()
    }
  }

  return new NextResponse('Authentication Required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Jas ki Rach"',
    }
  })
}
