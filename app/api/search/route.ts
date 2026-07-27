import { NextRequest, NextResponse } from "next/server";
import { askFlexmlsHelp } from "../../../lib/flexmlsMcp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FLEXMLS_TERMS = [
  "flexmls",
  "saved search",
  "subscription",
  "listing",
  "contact",
  "portal",
  "quick search",
  "hot sheet",
  "member",
  "office",
  "permission",
  "setting",
  "error",
];

function shouldUseFlexmls(question: string) {
  const normalized = question.toLowerCase();
  return FLEXMLS_TERMS.some((term) => normalized.includes(term));
}

export async function POST(request: NextRequest) {
  const started = Date.now();

  try {
    const body = (await request.json()) as { question?: string; forceFlexmls?: boolean };
    const question = body.question?.trim();

    if (!question) {
      return NextResponse.json({ error: "A question is required." }, { status: 400 });
    }

    const route = body.forceFlexmls || shouldUseFlexmls(question) ? "flexmls-help" : "local-knowledge";
    if (route === "local-knowledge") {
      return NextResponse.json({
        route,
        answered: false,
        responseTimeMs: Date.now() - started,
      });
    }

    const cookieToken = request.cookies.get("flexmls_access_token")?.value;
    const accessToken = cookieToken || process.env.FLEXMLS_ACCESS_TOKEN;
    const result = await askFlexmlsHelp(question, accessToken);

    return NextResponse.json({
      route,
      answered: true,
      answer: result.answer,
      sources: result.sources,
      followUps: result.followUps,
      responseTimeMs: Date.now() - started,
    });
  } catch (error) {
    const typed = error as Error & { code?: string; authenticate?: string | null };

    if (typed.code === "FLEXMLS_AUTH_REQUIRED") {
      return NextResponse.json(
        {
          route: "flexmls-help",
          answered: false,
          authRequired: true,
          message: "Connect Flexmls to search current Flexmls help documentation.",
          authenticate: typed.authenticate || null,
          responseTimeMs: Date.now() - started,
        },
        { status: 401 },
      );
    }

    console.error("Flexmls search failed", error);
    return NextResponse.json(
      {
        route: "flexmls-help",
        answered: false,
        error: typed.message || "Flexmls search failed.",
        responseTimeMs: Date.now() - started,
      },
      { status: 502 },
    );
  }
}
