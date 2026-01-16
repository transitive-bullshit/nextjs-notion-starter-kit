import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { getAuthPageHTML } from '@/lib/auth-page'

export function middleware(request: NextRequest) {
  const sitePassword = process.env.SITE_PASSWORD

  if (!sitePassword) {
    return NextResponse.next()
  }

  const authCookie = request.cookies.get('site-auth')
  
  if (authCookie?.value === sitePassword) {
    return NextResponse.next()
  }

  const url = request.nextUrl
  
  if (url.pathname === '/api/auth') {
    return NextResponse.next()
  }

  if (url.pathname.startsWith('/_next') || 
      url.pathname.startsWith('/static') ||
      url.pathname.includes('.')) {
    return NextResponse.next()
  }

  const authParam = url.searchParams.get('password')
  if (authParam === sitePassword) {
    const response = NextResponse.redirect(new URL(url.pathname, request.url))
    response.cookies.set('site-auth', sitePassword, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30
    })
    return response
  }

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Commander Workspace'

  return new NextResponse(
    getAuthPageHTML(siteName),
    {
      status: 401,
      headers: {
        'Content-Type': 'text/html',
        'X-Robots-Tag': 'noindex, nofollow'
      }
    }
  )
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}
