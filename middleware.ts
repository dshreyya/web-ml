import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Fallback to your project URL if env variable is invalid
  if (
    !supabaseUrl ||
    (!supabaseUrl.startsWith("http://") &&
      !supabaseUrl.startsWith("https://"))
  ) {
    supabaseUrl = "https://ihjtbwlrdkezosolwqaz.supabase.co";
  }

  // Fallback to your publishable (anon) key if env variable is invalid
  if (!supabaseAnonKey || supabaseAnonKey.startsWith("sb_secret_")) {
    supabaseAnonKey =
      "sb_publishable_vfL2-Hze8IHOc9HzvnTXtQ_zYiDSgoG";
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },

      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );

        supabaseResponse = NextResponse.next({
          request,
        });

        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Logged-in users shouldn't visit login/signup
  if (
    user &&
    (pathname === "/login" || pathname === "/signup")
  ) {
    const url = request.nextUrl.clone();

    const role = user.user_metadata?.role;

    if (role === "farmer") {
      url.pathname = "/farmer/onboarding";
    } else if (role === "buyer") {
      url.pathname = "/industry/onboarding";
    } else if (role === "admin") {
      url.pathname = "/admin/dashboard";
    } else {
      url.pathname = "/";
    }

    return NextResponse.redirect(url);
  }

  // Public routes (No authentication required)
  const isPublicRoute =
    pathname === "/" ||
    pathname.startsWith("/role-selection") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/verify-email") ||
    pathname.startsWith("/api");

  // Redirect unauthenticated users trying to access protected pages
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};