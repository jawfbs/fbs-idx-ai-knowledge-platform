export type AutomationCategory = "Sources" | "Quality" | "Analytics" | "Operations" | "Governance";
export type AutomationStatus = "Healthy" | "Ready" | "Needs setup" | "Paused";

export type KnowledgeAutomation = {
  id: string;
  name: string;
  description: string;
  category: AutomationCategory;
  cadence: string;
  trigger: string;
  enabled: boolean;
  status: AutomationStatus;
  lastRun: string;
  nextRun: string;
  runCount: number;
  outcome: string;
};

const STORAGE_KEY = "fbs-knowledge-automations-v1";

export const defaultAutomations: KnowledgeAutomation[] = [
  { id: "source-sync", name: "Knowledge source sync", description: "Refresh approved Google Drive, Confluence, website, and repository content.", category: "Sources", cadence: "Nightly", trigger: "Schedule · 2:00 AM", enabled: true, status: "Healthy", lastRun: "Today · 2:00 AM", nextRun: "Tomorrow · 2:00 AM", runCount: 31, outcome: "5 sources checked · 2 updates found" },
  { id: "flexmls-refresh", name: "Flexmls Help refresh", description: "Confirm the Flexmls MCP route is available and current for product questions.", category: "Sources", cadence: "Every 6 hours", trigger: "Schedule", enabled: true, status: "Healthy", lastRun: "3 hours ago", nextRun: "In 3 hours", runCount: 124, outcome: "FlexmlsHelp available · 184 ms" },
  { id: "connector-health", name: "Connector health check", description: "Test enabled sources and flag authentication, availability, or latency problems.", category: "Operations", cadence: "Hourly", trigger: "Schedule", enabled: true, status: "Healthy", lastRun: "42 minutes ago", nextRun: "In 18 minutes", runCount: 412, outcome: "4 healthy · 1 warning" },
  { id: "broken-links", name: "Broken source link audit", description: "Find invalid or unreachable links before employees encounter them.", category: "Quality", cadence: "Daily", trigger: "Schedule · 5:00 AM", enabled: true, status: "Ready", lastRun: "Yesterday", nextRun: "Tomorrow · 5:00 AM", runCount: 18, outcome: "0 broken links · 2 redirects" },
  { id: "route-tests", name: "Prompt route regression test", description: "Run sample questions through every active route after configuration changes.", category: "Quality", cadence: "On change", trigger: "Sources or routes updated", enabled: true, status: "Healthy", lastRun: "2 hours ago", nextRun: "On next change", runCount: 27, outcome: "18 of 18 route tests passed" },
  { id: "unanswered", name: "Knowledge gap detection", description: "Collect unanswered and low-confidence searches for documentation review.", category: "Analytics", cadence: "Continuous", trigger: "Every search", enabled: true, status: "Healthy", lastRun: "8 minutes ago", nextRun: "On next search", runCount: 286, outcome: "3 questions added to review queue" },
  { id: "article-suggestions", name: "Knowledge article suggestions", description: "Recommend new articles when similar unanswered questions repeat.", category: "Analytics", cadence: "Daily", trigger: "Knowledge gaps detected", enabled: true, status: "Ready", lastRun: "Today · 6:00 AM", nextRun: "Tomorrow · 6:00 AM", runCount: 16, outcome: "2 draft article opportunities found" },
  { id: "review-queue", name: "Content review queue", description: "Flag stale, unowned, or review-due knowledge for administrators.", category: "Governance", cadence: "Weekly", trigger: "Monday · 8:00 AM", enabled: true, status: "Healthy", lastRun: "Last Monday", nextRun: "Next Monday", runCount: 8, outcome: "5 items need review" },
  { id: "duplicate-sources", name: "Duplicate source detection", description: "Identify duplicate URLs, documents, and overlapping indexed content.", category: "Quality", cadence: "Weekly", trigger: "Wednesday · 4:00 AM", enabled: true, status: "Ready", lastRun: "Last Wednesday", nextRun: "Next Wednesday", runCount: 7, outcome: "1 possible duplicate group" },
  { id: "analytics-digest", name: "Search analytics digest", description: "Prepare a weekly summary of questions, routes, confidence, speed, and gaps.", category: "Analytics", cadence: "Weekly", trigger: "Friday · 3:00 PM", enabled: true, status: "Needs setup", lastRun: "Not run", nextRun: "After Slack or email setup", runCount: 0, outcome: "Choose a delivery connector" },
  { id: "sensitive-redaction", name: "Sensitive data redaction", description: "Remove likely credentials and customer-identifiable data from analytics logs.", category: "Governance", cadence: "Continuous", trigger: "Before analytics write", enabled: true, status: "Healthy", lastRun: "8 minutes ago", nextRun: "On next search", runCount: 286, outcome: "No sensitive values stored" },
  { id: "vercel-monitor", name: "Production deployment monitor", description: "Watch Vercel deployments and runtime errors and alert administrators on failures.", category: "Operations", cadence: "Hourly", trigger: "Schedule", enabled: true, status: "Healthy", lastRun: "42 minutes ago", nextRun: "In 18 minutes", runCount: 412, outcome: "Production healthy · no runtime errors" },
  { id: "accessibility", name: "Accessibility and mobile audit", description: "Check core pages for keyboard, contrast, semantics, and responsive layout regressions.", category: "Quality", cadence: "Weekly", trigger: "Sunday · 4:00 AM", enabled: true, status: "Ready", lastRun: "Last Sunday", nextRun: "Next Sunday", runCount: 6, outcome: "No blocking issues" },
  { id: "backup-verify", name: "Backup recovery verification", description: "Confirm configuration and analytics backups are current and recoverable.", category: "Governance", cadence: "Daily", trigger: "Schedule · 3:00 AM", enabled: false, status: "Needs setup", lastRun: "Not run", nextRun: "After database setup", runCount: 0, outcome: "Persistent database required" },
  { id: "admin-audit", name: "Administrative audit log", description: "Record source, route, automation, and configuration changes for traceability.", category: "Governance", cadence: "Continuous", trigger: "Every admin change", enabled: true, status: "Ready", lastRun: "Today", nextRun: "On next change", runCount: 44, outcome: "44 configuration events recorded" },
  { id: "jira-gaps", name: "Knowledge gap Jira tasks", description: "Create a Jira task when a high-frequency unanswered topic crosses its threshold.", category: "Operations", cadence: "Daily", trigger: "3 similar unanswered questions", enabled: false, status: "Needs setup", lastRun: "Not run", nextRun: "After Jira project setup", runCount: 0, outcome: "Choose a Jira project and owner" }
];

export function readAutomations(): KnowledgeAutomation[] {
  if (typeof window === "undefined") return defaultAutomations;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
    return Array.isArray(parsed) ? parsed : defaultAutomations;
  } catch {
    return defaultAutomations;
  }
}

export function saveAutomations(automations: KnowledgeAutomation[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(automations));
  window.dispatchEvent(new Event("fbs-automations-updated"));
}

export function resetAutomations() {
  saveAutomations(defaultAutomations);
}
