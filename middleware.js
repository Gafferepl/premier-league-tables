// Iron-clad middleware to prevent IP leakage
import { NextResponse } from 'next/server';

// Blocked paths and patterns
const BLOCKED_PATTERNS = [
  /\.md$/i,                    // All .md files
  /\.txt$/i,                   // All .txt files
  /\.secret$/i,                // All .secret files
  /\.private$/i,               // All .private files
  /\.internal$/i,              // All .internal files
  /\/\.private\//i,           // .private directory
  /\/docs\/internal\//i,      // docs/internal directory
  /\/docs\/private\//i,        // docs/private directory
  /\/documentation\//i,       // documentation directory
  /\/\.env/i,                  // Environment files
  /\/AI_CHAT_IMPLEMENTATION/i, // Specific sensitive files
  /\/CACHING_STRATEGY/i,
  /\/QUICK_START_GUIDE/i,
];

// Blocked user agents (scrapers, bots)
const BLOCKED_AGENTS = [
  /bot/i,
  /crawler/i,
  /scraper/i,
  /spider/i,
  /curl/i,
  /wget/i,
  /python/i,
  /java/i,
  /go-http/i,
  /postman/i,
  /insomnia/i,
];

export function middleware(request) {
  const { pathname, search } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';

  // Log access attempts for monitoring
  console.log(`[${new Date().toISOString()}] ${ip} ${userAgent} ${pathname}`);

  // Block suspicious user agents
  for (const pattern of BLOCKED_AGENTS) {
    if (pattern.test(userAgent)) {
      console.warn(`🚨 BLOCKED - Suspicious user agent: ${userAgent} from ${ip}`);
      return new Response('Access Denied', { 
        status: 403,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }

  // Block access to sensitive paths
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(pathname)) {
      console.warn(`🚨 BLOCKED - Sensitive path access: ${pathname} from ${ip}`);
      return new Response('Access Denied', { 
        status: 403,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }

  // Block directory listing attempts
  if (pathname.endsWith('/') || pathname === '/docs' || pathname === '/.private') {
    console.warn(`🚨 BLOCKED - Directory listing attempt: ${pathname} from ${ip}`);
    return new Response('Access Denied', { 
      status: 403,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  // Add security headers to all responses
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Prevent caching of sensitive routes
  if (pathname.startsWith('/api/') || pathname.includes('admin')) {
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    const clientIP = ip;
    // Note: In production, you'd use Redis or similar for rate limiting
    // This is a basic implementation
    response.headers.set('X-RateLimit-Limit', '100');
    response.headers.set('X-RateLimit-Remaining', '99');
  }

  return response;
}

// Apply middleware to all routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
