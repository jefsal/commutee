import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  const origin = request.nextUrl.origin;
  const successUrl = new URL("/home", origin);
  const errorUrl = new URL("/login", origin);

  if (!code) {
    errorUrl.searchParams.set("error", "missing_code");
    return NextResponse.redirect(errorUrl);
  }

  const response = NextResponse.redirect(successUrl);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    errorUrl.searchParams.set("error", "missing_env");
    return NextResponse.redirect(errorUrl);
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    errorUrl.searchParams.set("error", "exchange_failed");
    return NextResponse.redirect(errorUrl);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.id && user?.email) {
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name ?? null,
        },
        { onConflict: "id" }
      );

    if (profileError) {
      errorUrl.searchParams.set("error", "profile_upsert_failed");
      return NextResponse.redirect(errorUrl);
    }
  }

  return response;
}
