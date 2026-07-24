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

export const metrics = {
  totalSkills: 10,
  totalCases: 6,
  averageQualityScore: 9.2,
  dueForReview: 0,
  completedItems: 3,
  inProgressItems: 1,
  plannedItems: 24
};
