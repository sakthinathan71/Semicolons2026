import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createLogger } from "@/lib/logger";
import { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS } from "@/lib/constants";

const logger = createLogger("middleware");

// ─── Rate Limiting ─────────────────────────────────────────────────────────────
// Uses Upstash Redis when configured (production / multi-instance safe).
// Falls back to an in-process Map for local development (single-instance only).

type RateLimiter = (ip: string) => Promise<{ allowed: boolean; remaining: number }>;

function buildMemoryRateLimiter(): RateLimiter {
  const store = new Map<string, { count: number; resetAt: number }>();

  return async (ip: string) => {
    const now = Date.now();
    const record = store.get(ip);

    if (!record || now >= record.resetAt) {
      store.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
      return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
    }

    record.count++;
    if (record.count > RATE_LIMIT_MAX_REQUESTS) {
      return { allowed: false, remaining: 0 };
    }

    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - record.count };
  };
}

async function buildRedisRateLimiter(): Promise<RateLimiter | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  try {
    const { Ratelimit } = await import("@upstash/ratelimit");
    const { Redis } = await import("@upstash/redis");

    const redis = new Redis({ url, token });
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(RATE_LIMIT_MAX_REQUESTS, "1 m"),
      analytics: false,
    });

    return async (ip: string) => {
      const result = await ratelimit.limit(ip);
      return { allowed: result.success, remaining: result.remaining };
    };
  } catch (err) {
    logger.warn("Failed to initialise Upstash rate limiter — falling back to in-memory", err);
    return null;
  }
}

// Singleton — created once at module level
let rateLimiter: RateLimiter | null = null;

async function getRateLimiter(): Promise<RateLimiter> {
  if (!rateLimiter) {
    rateLimiter = (await buildRedisRateLimiter()) ?? buildMemoryRateLimiter();
  }
  return rateLimiter;
}

// ─── CSRF Guard ────────────────────────────────────────────────────────────────
// Validates that mutating requests (POST/PUT/DELETE/PATCH) originate from the
// same site by checking the Origin / Referer header.
// This is the "double-submit cookie" lite approach — sufficient for SPA clients.

function isValidOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("host") ?? "";

  // Allow server-to-server calls without an origin (e.g. Postman in dev)
  if (!origin && !referer) {
    return process.env.NODE_ENV === "development";
  }

  const source = origin ?? referer ?? "";
  return source.includes(host);
}

// ─── Security Headers ──────────────────────────────────────────────────────────

function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  return response;
}

// ─── Middleware ────────────────────────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "127.0.0.1";

  const isMutation = ["POST", "PUT", "DELETE", "PATCH"].includes(request.method);

  const path = request.nextUrl.pathname;
  const isAuthPage = path === "/login";
  const isApiRoute = path.startsWith("/api");
  const isStaticFile = path.includes(".") || path.startsWith("/_next");

  // 1. Basic Authentication Check (Simulated for demo)
  const isAuthenticated = request.cookies.has("auth_session");

  if (!isAuthenticated && !isAuthPage && !isApiRoute && !isStaticFile) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. CSRF guard for mutating requests
  if (isMutation && !isValidOrigin(request)) {
    logger.warn(`CSRF check failed for IP ${ip} — method: ${request.method}`);
    return new NextResponse("Forbidden", { status: 403 });
  }

  // 3. Rate limiting (Only for API)
  if (isApiRoute) {
    try {
      const limiter = await getRateLimiter();
      const { allowed, remaining } = await limiter(ip);

      if (!allowed) {
        logger.warn(`Rate limit exceeded for IP: ${ip}`);
        return new NextResponse("Too Many Requests", {
          status: 429,
          headers: {
            "Retry-After": "60",
            "X-RateLimit-Limit": String(RATE_LIMIT_MAX_REQUESTS),
            "X-RateLimit-Remaining": "0",
          },
        });
      }

      const response = NextResponse.next();
      response.headers.set("X-RateLimit-Remaining", String(remaining));
      return applySecurityHeaders(response);
    } catch (err) {
      logger.error("Middleware error", err);
      return applySecurityHeaders(NextResponse.next());
    }
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
