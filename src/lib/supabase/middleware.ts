import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const ADMIN_EMAILS = [
  "garybyss972@gmail.com",   // Supabase auth
  "gary@byss-group.com",     // Pro
];

export async function updateSession(request: NextRequest) {
  // Public routes that don't require auth
  const publicPaths = ["/login", "/api/auth/callback", "/api/", "/launch", "/news"];
  const isPublicRoute = publicPaths.some((p) =>
    request.nextUrl.pathname.startsWith(p)
  );

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not run code between createServerClient and supabase.auth.getUser().
  // A simple mistake could make it very hard to debug issues with users being
  // randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If on public route, allow access
  // On localhost: NEVER redirect /login → / (let the hyperspace animation play)
  if (isPublicRoute) {
    if (user && request.nextUrl.pathname === "/login" && !isLocalDev) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // LOCAL DEV: skip auth for admin pages (Gary's personal machine)
  const isLocalDev = request.headers.get("host")?.includes("localhost");
  if (isLocalDev && !request.nextUrl.pathname.startsWith("/login")) {
    return supabaseResponse;
  }

  // Protected route: not authenticated -> redirect to login
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Authenticated but not an authorized admin -> redirect to login
  if (!ADMIN_EMAILS.includes(user.email ?? "")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
