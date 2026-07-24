import PlatformControls from "../components/PlatformControls";
import ResourceShelf from "../components/ResourceShelf";
import SearchClient from "../components/SearchClient";
import WelcomeVideo from "../components/WelcomeVideo";
import { knowledgeItems, metrics } from "../lib/data";

const mostUsed = knowledgeItems.filter((item) => item.type === "Skill").slice(0, 3);
const recent = [...knowledgeItems].sort((a, b) => b.updated.localeCompare(a.updated)).slice(0, 4);

export default function Home() {
  return (
    <main>
      <div className="ambient ambientOne" aria-hidden="true" />
      <div className="ambient ambientTwo" aria-hidden="true" />

      <div className="floatingPlatformControls">
        <WelcomeVideo />
        <PlatformControls />
      </div>

      <header className="hero" id="top">
        <div className="heroBadge"><span>✦</span> FBS BAS AI · INTERNAL KNOWLEDGE</div>
        <h1>Knowledge, instantly<br /><span>within reach.</span></h1>
        <p>Ask natural-language questions across IDX requirements, MLS compliance, SmartFrame, Spark API, sales guidance, and BAS procedures.</p>
      </header>

      <SearchClient />
      <ResourceShelf />

      <section className="metrics" aria-label="Knowledge platform metrics">
        <article><span className="metricIcon">✦</span><strong>{metrics.totalSkills}</strong><span>AI Skills</span><small>Curated workflows</small></article>
        <article><span className="metricIcon">◫</span><strong>{knowledgeItems.length}</strong><span>Indexed Sources</span><small>Searchable guidance</small></article>
        <article><span className="metricIcon">◎</span><strong>{metrics.averageQualityScore.toFixed(1)}</strong><span>Quality Score</span><small>Reviewed knowledge</small></article>
        <article><span className="metricIcon">↻</span><strong>{metrics.dueForReview}</strong><span>Review Queue</span><small>Items due for review</small></article>
      </section>

      <section className="contentHeading">
        <div><span className="sectionKicker">Explore the platform</span><h2>Knowledge that moves work forward</h2></div>
        <p>Jump into approved guidance, decision trees, and recently updated resources.</p>
      </section>

      <section className="twoColumn">
        <div className="panel featuredPanel">
          <div className="panelHeader"><span className="panelIcon">✦</span><div><span>CURATED</span><h2>Most-used skills</h2></div></div>
          {mostUsed.map((item) => <a href={item.href} target="_blank" rel="noreferrer" key={item.title}><span>{item.title}<small>{item.description}</small></span><b>↗</b></a>)}
        </div>
        <div className="panel">
          <div className="panelHeader"><span className="panelIcon">⌘</span><div><span>GUIDED</span><h2>Decision shortcuts</h2></div></div>
          <a href="https://docs.google.com/document/d/1KyvSOEOvsaXs3KyY0KVV87BHzuYU2dNl4PtHg8iMz88" target="_blank" rel="noreferrer"><span>IDX Product Recommendation<small>Find the right product path</small></span><b>↗</b></a>
          <a href="https://drive.google.com/drive/folders/1RkV5Ydd1jHC794ZCWt_kzYbRT0hOC2ke" target="_blank" rel="noreferrer"><span>All Decision Trees<small>Browse guided workflows</small></span><b>↗</b></a>
        </div>
      </section>

      <section className="twoColumn">
        <div className="panel">
          <div className="panelHeader"><span className="panelIcon">↻</span><div><span>FRESH</span><h2>Recently updated</h2></div></div>
          {recent.map((item) => <a href={item.href} target="_blank" rel="noreferrer" key={item.title}><span>{item.title}<small>{item.type}</small></span><time>{item.updated}</time></a>)}
        </div>
        <div className="panel">
          <div className="panelHeader"><span className="panelIcon">◈</span><div><span>LEARNING</span><h2>Case study library</h2></div></div>
          {[["Brokerage mergers", "Complex account scenarios"], ["MLS migrations", "Data and authorization changes"], ["Domain changes", "Website transition guidance"]].map(([title, description]) => <a href="https://docs.google.com/document/d/1rzURM0NS3szZAQykG-z7HZytzu3hpPdw7ExKVjgl2Wg" target="_blank" rel="noreferrer" key={title}><span>{title}<small>{description}</small></span><em>Draft</em></a>)}
        </div>
      </section>

      <section className="guide">
        <div className="guideGlow" aria-hidden="true" />
        <div><span className="sectionKicker">HUMAN + AI</span><h2>Built for confident answers</h2><p>Search first. Use the most specific approved Skill. Verify changing facts in authoritative References. Human review remains required before customer-facing use.</p></div>
        <a href="https://docs.google.com/document/d/1FH0JT6n5Pc1aP-GBFMlql5EjBjWT5dsePGyo6YfysU8" target="_blank" rel="noreferrer">Open platform guide <span>↗</span></a>
      </section>

      <footer><span>FBS BAS AI Knowledge Platform</span><span>Internal use only · Human review required</span></footer>
    </main>
  );
}
