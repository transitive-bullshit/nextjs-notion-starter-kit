import { NextRequest, NextResponse } from 'next/server'
import { getIronSession, IronSessionData } from 'iron-session'
import { sessionOptions } from '@/lib/session-config'

export const config = {
  // Match all routes except for specific ones like API routes, static files,
  // the sign-in page itself, and Next.js internal paths.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|signin|logo.svg).*)',
  ],
}

export async function middleware(req: NextRequest) {
  // Check if password protection is enabled
  const passwordProtectEnabled = process.env.PASSWORD_PROTECT === 'true'

  if (!passwordProtectEnabled) {
    // If protection is disabled, allow the request to proceed
    return NextResponse.next()
  }

  // If protection is enabled, check for a valid session
  const res = NextResponse.next() // Prepare response object for session handling
  const session = await getIronSession<IronSessionData>(req, res, sessionOptions)

  // Check if the user is authenticated
  if (!session.isAuthenticated) {
    // If not authenticated, redirect to the sign-in page
    // Preserve the original URL as a query parameter for redirection after login
    const signInUrl = new URL('/signin', req.url)
    signInUrl.searchParams.set('redirect', req.nextUrl.pathname + req.nextUrl.search)
    console.log(`Unauthenticated access to ${req.nextUrl.pathname}. Redirecting to signin.`)
    return NextResponse.redirect(signInUrl)
  }

  // If authenticated, allow the request to proceed
  // The session cookie will be updated automatically by getIronSession if needed
  console.log(`Authenticated access to ${req.nextUrl.pathname}.`)
  return res // Return the response object (which might contain updated session cookie)
}
