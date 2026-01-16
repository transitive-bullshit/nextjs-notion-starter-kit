import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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
      maxAge: 60 * 60 * 24 * 30 // 30 days
    })
    return response
  }

  return new NextResponse(
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex,nofollow">
  <title>Protected Site</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex; 
      align-items: center; 
      justify-content: center; 
      min-height: 100vh;
      background: #0a0a0a;
      color: #ededed;
    }
    .container { 
      text-align: center; 
      padding: 2rem;
      max-width: 400px;
    }
    h1 { 
      font-size: 1.5rem; 
      margin-bottom: 1.5rem;
      font-weight: 500;
    }
    form { display: flex; flex-direction: column; gap: 1rem; }
    input[type="password"] {
      padding: 0.75rem 1rem;
      border: 1px solid #333;
      border-radius: 8px;
      background: #1a1a1a;
      color: #ededed;
      font-size: 1rem;
      outline: none;
      transition: border-color 0.2s;
    }
    input[type="password"]:focus { border-color: #666; }
    button {
      padding: 0.75rem 1rem;
      background: #ededed;
      color: #0a0a0a;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    button:hover { opacity: 0.9; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔒 This site is protected</h1>
    <form method="GET">
      <input type="password" name="password" placeholder="Enter password" required autofocus>
      <button type="submit">Access</button>
    </form>
  </div>
</body>
</html>`,
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
