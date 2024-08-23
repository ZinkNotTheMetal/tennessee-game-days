import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { CustomMiddleware } from "./chain";

const protectedApiRoutes = [
  '/api/attendee/add'
]

export function withApiKeyAuthentication(middleware: CustomMiddleware): CustomMiddleware {
  
  return async (request: NextRequest, event: NextFetchEvent, response: NextResponse) => {
    const pathname = request.nextUrl.pathname;
    const isProtectedApiRoute = protectedApiRoutes.some(route => pathname.startsWith(route));

    if (isProtectedApiRoute) {
      const apiKeyPassedIn = request.headers.get('authorization')?.split(' ')[1];

      if (apiKeyPassedIn !== process.env.NEXT_PUBLIC_API_KEY) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }

      return NextResponse.next();
    }
  }
}