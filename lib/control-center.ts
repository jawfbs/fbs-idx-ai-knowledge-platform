import { appendRows, clearRange, readRange, replaceRange } from "./sheets";

export type PromptRoute = {
  routeName: string;
  intent: string;
  example: string;
  skill: string;
  primarySource: string;
  fallbackSource: string;
  connector: string;
  action: string;
  output: string;
  confidenceThreshold: number;
  active: boolean;
};

export type SearchAnalyticsEvent = {
  user?: string;
  question: string;
  detectedIntent: string;
  routeName: string;
  selectedSkill: string;
  connector: string;
  sources: string[];
  mcpTool?: string;
  responseTimeMs: number;
  confidence: number;
  answered: boolean;
  escalated: boolean;
  feedback?: string;
};

const routeHeaders = ["Route Name","User Intent","Example Question","Primary Skill","Primary Source","Fallback Source","Connector","MCP Tool / Action","Required Output","Confidence Threshold","Active","Notes"];

export async function loadPromptRoutes(): Promise<PromptRoute[]> {
  const rows = await readRange("Prompt Routes!A2:L500");
  return rows.filter((row) => row[0] && String(row[10] || "").toLowerCase() !== "no").map((row) => ({
    routeName: String(row[0] || ""), intent: String(row[1] || ""), example: String(row[2] || ""), skill: String(row[3] || ""),
    primarySource: String(row[4] || ""), fallbackSource: String(row[5] || ""), connector: String(row[6] || ""), action: String(row[7] || ""),
    output: String(row[8] || ""), confidenceThreshold: Number(row[9] || 0.8), active: String(row[10] || "yes").toLowerCase() !== "no"
  }));
}

export async function regeneratePromptRoutesFromSkillTracker() {
  const skills = await readRange("Skill Tracker!A8:L1000");
  const generated = skills.filter((row) => row[0]).map((row) => {
    const skill = String(row[0]);
    const status = String(row[1] || "Draft");
    const primarySource = String(row[4] || "Google Drive");
    const connector = String(row[5] || "Google Drive");
    const active = /approved|complete|active/i.test(status) ? "Yes" : "No";
    return [
      skill,
      inferIntent(skill),
      `Use ${skill}`,
      skill,
      primarySource,
      "Google Drive Knowledge Docs",
      connector,
      inferAction(connector),
      "Concise answer; steps when applicable; source links; suggested follow-up",
      0.8,
      active,
      "Generated automatically from Skill Tracker"
    ];
  });
  await clearRange("Prompt Routes!A2:L500");
  if (generated.length) await replaceRange(`Prompt Routes!A2:L${generated.length + 1}`, generated);
  return { generated: generated.length, headers: routeHeaders };
}

function inferIntent(skill: string) {
  const value = skill.toLowerCase();
  if (value.includes("troubleshoot") || value.includes("error")) return "Troubleshooting";
  if (value.includes("listing") || value.includes("property")) return "Listing search";
  if (value.includes("support") || value.includes("response")) return "Support response";
  if (value.includes("requirement") || value.includes("policy")) return "Policy / requirements";
  return "Knowledge search";
}

function inferAction(connector: string) {
  if (/flexmls/i.test(connector)) return "FlexmlsHelp";
  if (/atlassian|confluence|jira/i.test(connector)) return "Search company knowledge";
  if (/github/i.test(connector)) return "Repository lookup";
  return "Search source";
}

export async function logSearchEvent(event: SearchAnalyticsEvent) {
  await appendRows("Search Analytics!A:N", [[
    new Date().toISOString(), event.user || "Anonymous", event.question, event.detectedIntent, event.routeName,
    event.selectedSkill, event.connector, event.sources.join(", "), event.mcpTool || "", event.responseTimeMs,
    event.confidence, event.answered ? "Yes" : "No", event.escalated ? "Yes" : "No", event.feedback || ""
  ]]);
}
