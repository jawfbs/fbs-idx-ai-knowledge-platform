import { NextRequest, NextResponse } from "next/server";
import { regeneratePromptRoutesFromSkillTracker } from "../../../../lib/control-center";

export const runtime = "nodejs";

function authorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const routes = await regeneratePromptRoutesFromSkillTracker();
    return NextResponse.json({ ok: true, promptRoutes: routes, syncedAt: new Date().toISOString() });
  } catch (error) {
    console.error("Control center sync failed", error);
    return NextResponse.json({ error: "Control center synchronization failed" }, { status: 500 });
  }
}
