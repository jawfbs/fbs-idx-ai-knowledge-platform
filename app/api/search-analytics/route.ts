import { NextRequest, NextResponse } from "next/server";
import { logSearchEvent } from "../../../lib/control-center";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body?.question) return NextResponse.json({ error: "question is required" }, { status: 400 });
    await logSearchEvent({
      user: body.user,
      question: String(body.question),
      detectedIntent: String(body.detectedIntent || "Knowledge search"),
      routeName: String(body.routeName || "Local search"),
      selectedSkill: String(body.selectedSkill || "Knowledge index"),
      connector: String(body.connector || "Local index"),
      sources: Array.isArray(body.sources) ? body.sources.map(String) : [],
      mcpTool: body.mcpTool ? String(body.mcpTool) : "",
      responseTimeMs: Number(body.responseTimeMs || 0),
      confidence: Number(body.confidence || 0),
      answered: Boolean(body.answered),
      escalated: Boolean(body.escalated),
      feedback: body.feedback ? String(body.feedback) : ""
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Search analytics logging failed", error);
    return NextResponse.json({ error: "Unable to log search analytics" }, { status: 500 });
  }
}
