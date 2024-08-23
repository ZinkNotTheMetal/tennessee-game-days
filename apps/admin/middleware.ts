import { chain } from "./middlewares/chain";
import { withAuthMiddleware } from "./middlewares/authentication";
import { withApiKeyAuthentication } from "./middlewares/apiKeyAuthentication";

export default chain([withAuthMiddleware, withApiKeyAuthentication]);

export const config = {
  matcher: [
    // Match API routes that require API key protection
    '/api/attendee/add/:path*',

    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}