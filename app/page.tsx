import SearchClient from "../components/SearchClient";
import { knowledgeItems, metrics } from "../lib/data";

const mostUsed = knowledgeItems.filter((item) => item.type === "Skill").slice(0, 3);
const recent = [...knowledgeItems].sort((a, b) => b.updated.localeCompare(a.updated)).slice(0, 4);

export default function Home() {
  return (
    <main>
      <header className="hero">
        <div className="eyebrow">FBS INTERNAL</div>
        <h1>AI Knowledge Platform</h1>
        <p>One approved source of truth for IDX sales, support, MLS compliance, Website Concierge, Spark API, and AI-assisted work.</p>
      </header>

      <SearchClient />

      <section className="metrics" aria-label="Knowledge platform metrics">
        <article><strong>{metrics.totalSkills}</strong><span>Total Skills</span></article>
        <article><strong>{metrics.totalCases}</strong><span>Total Cases</span></article>
        <article><strong>{metrics.averageQualityScore.toFixed(1)}</strong><span>Average Quality</span></article>
        <article><strong>{metrics.dueForReview}</strong><span>Due for Review</span></article>
      </section>

      <section className="twoColumn">
        <div className="panel">
          <h2>Most-used Skills</h2>
          {mostUsed.map((item) => <a href={item.href} target="_blank" rel="noreferrer" key={item.title}>{item.title}<span>→</span></a>)}
        </div>
        <div className="panel">
          <h2>Decision Tree shortcuts</h2>
          <a href="https://docs.google.com/document/d/1KyvSOEOvsaXs3KyY0KVV87BHzuYU2dNl4PtHg8iMz88" target="_blank" rel="noreferrer">IDX Product Recommendation<span>→</span></a>
          <a href="https://drive.google.com/drive/folders/1RkV5Ydd1jHC794ZCWt_kzYbRT0hOC2ke" target="_blank" rel="noreferrer">All Decision Trees<span>→</span></a>
        </div>
      </section>

      <section className="twoColumn">
        <div className="panel">
          <h2>Recently updated</h2>
          {recent.map((item) => <a href={item.href} target="_blank" rel="noreferrer" key={item.title}>{item.title}<small>{item.updated}</small></a>)}
        </div>
        <div className="panel">
          <h2>New case studies</h2>
          <a href="https://docs.google.com/document/d/1rzURM0NS3szZAQykG-z7HZytzu3hpPdw7ExKVjgl2Wg" target="_blank" rel="noreferrer">Brokerage mergers<span>Draft</span></a>
          <a href="https://docs.google.com/document/d/1rzURM0NS3szZAQykG-z7HZytzu3hpPdw7ExKVjgl2Wg" target="_blank" rel="noreferrer">MLS migrations<span>Draft</span></a>
          <a href="https://docs.google.com/document/d/1rzURM0NS3szZAQykG-z7HZytzu3hpPdw7ExKVjgl2Wg" target="_blank" rel="noreferrer">Domain changes<span>Draft</span></a>
        </div>
      </section>

      <section className="guide">
        <div>
          <h2>How to use this knowledge base</h2>
          <p>Search first. Open the most specific Skill. Verify changing facts in authoritative References. Use Decision Trees for routing and Cases for judgment-heavy examples. Human review remains required before customer-facing use.</p>
        </div>
        <a href="https://docs.google.com/document/d/1FH0JT6n5Pc1aP-GBFMlql5EjBjWT5dsePGyo6YfysU8" target="_blank" rel="noreferrer">Open the full guide</a>
      </section>
    </main>
  );
}
