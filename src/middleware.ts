'use server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ApiRoutes, PageRoutes } from './models/routes';
import { AUTH_TOKEN_COOKIE_NAME } from './models/constants';

const BASE_URL = process.env.BASE_URL;

export async function middleware(request: NextRequest) {
  const requestPath = request.nextUrl.pathname;
  const requestMethod = request.method;

  // ignore bundled files and root path (root path is favicon and things like that)
  if (
    requestPath.startsWith('/_next') ||
    requestPath.indexOf('/') === requestPath.lastIndexOf('/')
  ) {
    return NextResponse.next();
  }

  // get auth cookie
  const authCookie = request.cookies.get(AUTH_TOKEN_COOKIE_NAME)?.value;
  let isLoggedIn = false;
  if (authCookie) {
    try {
      const url = `${BASE_URL}${ApiRoutes.CHECK_AUTH}`;
      const checkAuthRes = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `Bearer ${authCookie}` },
      });
      if (checkAuthRes.ok) {
        isLoggedIn = true;
      }
      console.log(await checkAuthRes.text());
    } catch (err) {
      // ignore for now - we only care if they are accessing a protected route
    }
  }

  // redirect logged in people who try to access the login/signup page
  if (requestMethod === 'GET' && requestPath.startsWith('/auth')) {
    if (isLoggedIn) {
      return NextResponse.redirect(`${BASE_URL}${PageRoutes.DASHBOARD}`);
    }
  }

  // protect backend routes that are not inside /api/open
  if (requestPath.startsWith('/api') && !requestPath.startsWith('/api/open')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(`${BASE_URL}${PageRoutes.LOGIN}`);
    }
  }

  // protect frontend routes that are inside /application
  if (requestPath.startsWith('/application')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(`${BASE_URL}${PageRoutes.LOGIN}`);
    }
  }

  return NextResponse.next();
}
