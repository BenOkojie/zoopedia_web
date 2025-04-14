import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export function middleware(req: NextRequest) {
  // Clone the request so we can modify the response
  const res = NextResponse.next();

  // If no sessionId cookie, create one
  const sessionId = req.cookies.get('sessionId');
  if (!sessionId) {
    const newId = uuidv4();
    // We'll store it for 1 year
    res.cookies.set('sessionId', newId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year in seconds
    });
  }

  return res;
}

/**
 * Apply this middleware to all routes except _next/static etc.
 * 
 * You can limit it to certain paths if you prefer:
 */
export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'], 
};
