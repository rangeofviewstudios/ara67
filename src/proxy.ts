import { NextResponse, type NextRequest } from "next/server";

/**
 * Local editing writes straight to disk, so the editor is hidden on a production
 * build unless it has been set up to save through GitHub, which requires a login.
 */
export function proxy(request: NextRequest) {
  const editorAvailable =
    process.env.NODE_ENV !== "production" || Boolean(process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO);
  if (editorAvailable) return NextResponse.next();
  return NextResponse.rewrite(new URL("/404", request.url), { status: 404 });
}

export const config = {
  matcher: ["/keystatic/:path*", "/api/keystatic/:path*"],
};
