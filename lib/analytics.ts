export type SearchFeedback = "positive" | "negative" | null;

export type SearchAnalyticsEvent = {
  id: string;
  question: string;
  normalizedQuery: string;
  skillUsed: string;
  connector: string;
  confidence: number;
  responseTimeMs: number;
  resultCount: number;
  answered: boolean;
  feedback: SearchFeedback;
  createdAt: string;
};

const STORAGE_KEY = "fbs-search-analytics-v1";
const MAX_EVENTS = 500;

export function inferSearchRoute(query: string, topSource?: string) {
  const value = query.toLowerCase();
  if (value.includes("flexmls") || value.includes("listing") || value.includes("subscription")) {
    return { skillUsed: "Flexmls Help", connector: "Flexmls MCP" };
  }
  if (value.includes("idx") || value.includes("mls") || value.includes("compliance") || value.includes("authorization")) {
    return { skillUsed: "IDX Requirements", connector: topSource === "Confluence" ? "Confluence" : "Knowledge Index" };
  }
  if (value.includes("pricing") || value.includes("sales") || value.includes("recommend")) {
    return { skillUsed: "Sales Guidance", connector: topSource?.includes("Google") ? "Google Drive" : "Knowledge Index" };
  }
  if (value.includes("spark") || value.includes("api")) {
    return { skillUsed: "Spark API Guidance", connector: "Spark API Docs" };
  }
  return { skillUsed: "Platform Search", connector: topSource || "Knowledge Index" };
}

export function calculateConfidence(resultCount: number, topScore: number) {
  if (!resultCount) return 18;
  return Math.min(98, Math.max(52, Math.round(48 + Math.min(topScore, 50) * 0.7 + Math.min(resultCount, 8) * 2)));
}

export function readSearchEvents(): SearchAnalyticsEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function recordSearchEvent(event: Omit<SearchAnalyticsEvent, "id" | "createdAt" | "feedback">) {
  if (typeof window === "undefined") return "";
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const nextEvent: SearchAnalyticsEvent = { ...event, id, createdAt: new Date().toISOString(), feedback: null };
  const events = [nextEvent, ...readSearchEvents()].slice(0, MAX_EVENTS);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  window.dispatchEvent(new Event("fbs-analytics-updated"));
  return id;
}

export function updateSearchFeedback(id: string, feedback: Exclude<SearchFeedback, null>) {
  if (typeof window === "undefined") return;
  const events = readSearchEvents().map((event) => event.id === id ? { ...event, feedback } : event);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  window.dispatchEvent(new Event("fbs-analytics-updated"));
}

export function clearSearchEvents() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("fbs-analytics-updated"));
}
