import { NextResponse } from "next/server";

/** Health check endpoint — used by load balancers and uptime monitors */
export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "LuxeLens AI",
      version: process.env.npm_package_version ?? "unknown",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      gemini_configured: Boolean(process.env.GEMINI_API_KEY),
    },
    { status: 200 }
  );
}
