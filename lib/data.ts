export type KnowledgeItem = {
  title: string;
  type: "Skill" | "Decision Tree" | "Case" | "Guide" | "Reference";
  description: string;
  status: "Approved" | "Draft" | "In Review";
  updated: string;
  href: string;
  tags: string[];
};

export const knowledgeItems: KnowledgeItem[] = [
  {
    title: "Confirm MLS Eligibility",
    type: "Skill",
    description: "Determine whether an MLS participant and intended product are eligible for IDX service.",
    status: "Approved",
    updated: "2026-07-24",
    href: "https://docs.google.com/document/d/1X2PptSe8HcWmhxdGmeqJDPSeKBSrLH7SDCCt3py8KcI",
    tags: ["MLS", "Eligibility", "Compliance"]
  },
  {
    title: "Lookup IDX Requirements",
    type: "Skill",
    description: "Find and verify the authoritative MLS-specific IDX requirements before answering.",
    status: "Approved",
    updated: "2026-07-22",
    href: "https://docs.google.com/document/d/1klrpryYpHeOQfGH3Ugj4DbwdORMlHJGgEX0Y7W-fqA4",
    tags: ["MLS", "Requirements", "Confluence"]
  },
  {
    title: "Verify IDX Authorization",
    type: "Skill",
    description: "Confirm that the correct authorization and approvals are in place before activation.",
    status: "In Review",
    updated: "2026-07-24",
    href: "https://docs.google.com/document/d/1m9WlfE7QJkNb7RDtNeNdpiWDfB5kbtL9fHv2oxRJqCQ",
    tags: ["Authorization", "MLS", "Activation"]
  },
  {
    title: "Troubleshoot Missing Listings",
    type: "Skill",
    description: "Run a consistent checklist for missing agent or office listings before escalating the issue.",
    status: "Draft",
    updated: "2026-07-24",
    href: "https://fbsdata.atlassian.net/wiki/spaces/BAS/pages/3473901/IDX+Requirements",
    tags: ["Troubleshooting", "Listings", "Escalation"]
  },
  {
    title: "Prepare an IDX Escalation",
    type: "Skill",
    description: "Collect the account, MLS, product, URL, reproduction steps, and evidence needed for a useful escalation.",
    status: "Draft",
    updated: "2026-07-24",
    href: "https://fbsdata.atlassian.net/wiki/spaces/BAS/pages/3473901/IDX+Requirements",
    tags: ["Escalation", "Support", "Evidence"]
  },
  {
    title: "Validate Customer-Facing IDX Answers",
    type: "Skill",
    description: "Review an answer for authoritative sourcing, changing facts, MLS-specific rules, and required human approval.",
    status: "Draft",
    updated: "2026-07-24",
    href: "https://docs.google.com/document/d/1FH0JT6n5Pc1aP-GBFMlql5EjBjWT5dsePGyo6YfysU8",
    tags: ["Quality", "Compliance", "Customer Communication"]
  },
  {
    title: "Collect Website and IDX Intake",
    type: "Skill",
    description: "Gather the branding, contact, domain, MLS, IDX, and website requirements needed before setup begins.",
    status: "Draft",
    updated: "2026-07-24",
    href: "https://docs.google.com/document/d/1FH0JT6n5Pc1aP-GBFMlql5EjBjWT5dsePGyo6YfysU8",
    tags: ["Intake", "Website", "Onboarding"]
  },
  {
    title: "Explain SmartFrame vs. WordPress IDX",
    type: "Skill",
    description: "Create a concise, needs-based comparison without overpromising features or implementation effort.",
    status: "Draft",
    updated: "2026-07-24",
    href: "https://docs.google.com/document/d/1KyvSOEOvsaXs3KyY0KVV87BHzuYU2dNl4PtHg8iMz88",
    tags: ["SmartFrame", "WordPress", "Sales"]
  },
  {
    title: "Check Spark API Access Needs",
    type: "Skill",
    description: "Determine whether a use case requires public data, private data, specific datasets, or additional permissions.",
    status: "Draft",
    updated: "2026-07-24",
    href: "https://www.sparkapi.io/",
    tags: ["Spark API", "Permissions", "Datasets"]
  },
  {
    title: "Summarize an IDX Case",
    type: "Skill",
    description: "Turn a complex support scenario into reusable facts, decision points, resolution steps, and lessons learned.",
    status: "Draft",
    updated: "2026-07-24",
    href: "https://docs.google.com/document/d/1rzURM0NS3szZAQykG-z7HZytzu3hpPdw7ExKVjgl2Wg",
    tags: ["Cases", "Learning", "Documentation"]
  },
  {
    title: "IDX Product Recommendation",
    type: "Decision Tree",
    description: "Route a customer to SmartFrame, WordPress IDX, Website Concierge, or Spark API.",
    status: "Draft",
    updated: "2026-07-24",
    href: "https://docs.google.com/document/d/1KyvSOEOvsaXs3KyY0KVV87BHzuYU2dNl4PtHg8iMz88",
    tags: ["Sales", "Qualification", "Products"]
  },
  {
    title: "IDX Case Library",
    type: "Case",
    description: "Anonymized cases covering unusual and judgment-heavy IDX scenarios.",
    status: "Draft",
    updated: "2026-07-22",
    href: "https://docs.google.com/document/d/1rzURM0NS3szZAQykG-z7HZytzu3hpPdw7ExKVjgl2Wg",
    tags: ["Cases", "Learning", "Support"]
  },
  {
    title: "How to Use the AI Knowledge Platform",
    type: "Guide",
    description: "Instructions for employees and AI assistants using the shared source of truth.",
    status: "Approved",
    updated: "2026-07-24",
    href: "https://docs.google.com/document/d/1FH0JT6n5Pc1aP-GBFMlql5EjBjWT5dsePGyo6YfysU8",
    tags: ["Onboarding", "AI", "Governance"]
  }
];

const skills = knowledgeItems.filter((item) => item.type === "Skill");
const cases = knowledgeItems.filter((item) => item.type === "Case");
const approvedItems = knowledgeItems.filter((item) => item.status === "Approved");
const inReviewItems = knowledgeItems.filter((item) => item.status === "In Review");
const draftItems = knowledgeItems.filter((item) => item.status === "Draft");

export const metrics = {
  totalSkills: skills.length,
  totalCases: cases.length,
  averageQualityScore: 9.2,
  dueForReview: inReviewItems.length,
  completedItems: approvedItems.length,
  inProgressItems: inReviewItems.length,
  plannedItems: draftItems.length
};