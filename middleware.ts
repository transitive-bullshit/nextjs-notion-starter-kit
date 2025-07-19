import { NextRequest, NextResponse } from 'next/server'

const BASIC_AUTH_USER = process.env.BASIC_AUTH_USER || ''
const BASIC_AUTH_PASS = process.env.BASIC_AUTH_PASS || ''

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get('authorization')

  if (authHeader) {
    const base64 = authHeader.split(' ')[1] || ''
    try {
      const [user, pass] = atob(base64).split(':')
      if (user === BASIC_AUTH_USER && pass === BASIC_AUTH_PASS) {
        return NextResponse.next()
      }
    } catch {
      // ignore error and fall through to return 401
    }
  }

  const res = new NextResponse('Unauthorized', { status: 401 })
  res.headers.set('WWW-Authenticate', 'Basic realm="Secure Area"')
  return res
}
