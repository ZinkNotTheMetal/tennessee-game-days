// withAuthMiddleware.ts
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';
import { CustomMiddleware } from './chain';

export function withAuthMiddleware(middleware: CustomMiddleware): CustomMiddleware {
  return async (request: NextRequest, event: NextFetchEvent, response: NextResponse) => {
    if (!request.nextUrl.pathname.startsWith('/api')) {
      const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
      if (!token) {
        return NextResponse.redirect(new URL('/api/auth/signin', request.url));
      }
    }

    return middleware(request, event, response);
  };
}