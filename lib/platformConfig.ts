export type SourceType = "Google Drive" | "Confluence" | "Flexmls MCP" | "GitHub" | "Website" | "Help Center";
export type SourceHealth = "Healthy" | "Needs auth" | "Warning";

export type KnowledgeSource = {
  id: string;
  name: string;
  type: SourceType;
  location: string;
  priority: number;
  enabled: boolean;
  health: SourceHealth;
  lastIndexed: string;
};

export type PromptRoute = {
  id: string;
  name: string;
  match: string;
  skill: string;
  connector: string;
  priority: number;
  enabled: boolean;
  fallback: boolean;
};

const SOURCE_KEY = "fbs-knowledge-sources-v1";
const ROUTE_KEY = "fbs-prompt-routes-v1";

export const defaultSources: KnowledgeSource[] = [
  { id: "flexmls-help", name: "Flexmls Help", type: "Flexmls MCP", location: "mcp.flexmls.com/mcp", priority: 1, enabled: true, health: "Healthy", lastIndexed: "Live" },
  { id: "idx-requirements", name: "IDX Requirements", type: "Confluence", location: "FBS BAS / IDX Requirements", priority: 2, enabled: true, health: "Healthy", lastIndexed: "Connected" },
  { id: "fbs-playbook", name: "FBS Playbook", type: "Confluence", location: "FBSPB · The FBS Playbook", priority: 3, enabled: true, health: "Healthy", lastIndexed: "Connected" },
  { id: "sales-drive", name: "Sales Guidance", type: "Google Drive", location: "Approved sales and pricing documents", priority: 4, enabled: true, health: "Healthy", lastIndexed: "Connected" },
  { id: "skill-registry", name: "Skill Registry", type: "GitHub", location: "jawfbs/fbs-idx-ai-knowledge-platform", priority: 5, enabled: true, health: "Healthy", lastIndexed: "Repository" },
  { id: "public-sites", name: "FBS Public Websites", type: "Website", location: "wearefbs.com, flexmls.com, sparkapi.io", priority: 6, enabled: true, health: "Warning", lastIndexed: "Planned" }
];

export const defaultRoutes: PromptRoute[] = [
  { id: "route-flexmls", name: "Flexmls Help", match: "listing, saved search, subscription, setting, Flexmls error", skill: "Flexmls Help", connector: "Flexmls MCP", priority: 1, enabled: true, fallback: false },
  { id: "route-idx", name: "IDX Requirements", match: "MLS rule, IDX requirement, compliance, authorization", skill: "IDX Requirements", connector: "Confluence", priority: 2, enabled: true, fallback: false },
  { id: "route-playbook", name: "FBS Playbook", match: "FBS playbook, SOP, process, policy, framework, strategic plan, employee manual, workflow guideline", skill: "FBS Playbook", connector: "Confluence", priority: 3, enabled: true, fallback: false },
  { id: "route-sales", name: "Sales Guidance", match: "pricing, product recommendation, sales, customer fit", skill: "Sales Guidance", connector: "Google Drive", priority: 4, enabled: true, fallback: false },
  { id: "route-skill", name: "Skill Registry", match: "skill, workflow, automation, prompt", skill: "Platform Skills", connector: "GitHub", priority: 5, enabled: true, fallback: false },
  { id: "route-default", name: "General Knowledge", match: "all unmatched questions", skill: "General Search", connector: "Knowledge Index", priority: 99, enabled: true, fallback: true }
];

function read<T>(key: string, defaults: T[]): T[] {
  if (typeof window === "undefined") return defaults;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || "null");
    return Array.isArray(parsed) ? parsed : defaults;
  } catch {
    return defaults;
  }
}

function write<T>(key: string, value: T[]) {
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("fbs-platform-config-updated"));
}

export const readSources = () => read(SOURCE_KEY, defaultSources);
export const saveSources = (sources: KnowledgeSource[]) => write(SOURCE_KEY, sources);
export const resetSources = () => write(SOURCE_KEY, defaultSources);
export const readRoutes = () => read(ROUTE_KEY, defaultRoutes);
export const saveRoutes = (routes: PromptRoute[]) => write(ROUTE_KEY, routes);
export const resetRoutes = () => write(ROUTE_KEY, defaultRoutes);
