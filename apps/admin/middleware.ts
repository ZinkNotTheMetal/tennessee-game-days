// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(request: NextRequest, response: NextResponse, ) {
//   // Only process requests to /api/*
//   if (request.nextUrl.pathname.startsWith('/api')) {

//     const apiKeyPassedIn = request.headers.get('authorization')?.split(' ')[1];

//     if (apiKeyPassedIn !== process.env.NEXT_PUBLIC_API_KEY) {
//       return NextResponse.json({ message: 'Unauthorized' }, { status: 401})
//     }
//     // Custom logic for API requests
//     console.log('Processing API request:', request.nextUrl.pathname);
//   }
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/api/:path*'],
// };
