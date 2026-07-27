import CommandPalette from "../components/CommandPalette";
import MissionControlDashboard from "../components/MissionControlDashboard";
import PlatformControls from "../components/PlatformControls";
import ResourceShelf from "../components/ResourceShelf";
import SearchClient from "../components/SearchClient";
import WelcomeVideo from "../components/WelcomeVideo";
import { knowledgeItems, metrics } from "../lib/data";
import { defaultSources } from "../lib/platformConfig";

const mostUsed = knowledgeItems.filter((item) => item.type === "Skill").slice(0, 3);
const recent = [...knowledgeItems].sort((a, b) => b.updated.localeCompare(a.updated)).slice(0, 4);

const routes = [
  ["Flexmls Help", "MCP", "Current product guidance"],
  ["IDX Requirements", "Confluence", "MLS rules and compliance"],
  ["Sales Guidance", "Drive", "Approved positioning and pricing"],
  ["Platform Skills", "GitHub", "Reusable AI workflows"]
];

const quickActions = [
  ["Create support response", "Turn an answer into customer-ready copy"],
  ["Find the right skill", "Route a question to the best workflow"],
  ["Check MLS requirements", "Verify current IDX rules and settings"],
  ["Search Flexmls Help", "Query current product documentation"]
];

export default function Home() {
  return (
    <main>
      <div className="ambient ambientOne" aria-hidden="true" />
      <div className="ambient ambientTwo" aria-hidden="true" />

      <div className="floatingPlatformControls">
        <CommandPalette />
        <WelcomeVideo />
        <PlatformControls />
      </div>

      <nav className="workspaceNav" aria-label="Knowledge workspace navigation">
        <a className="workspaceBrand" href="#top"><span>FBS</span><b>Knowledge</b></a>
        <div className="workspaceNavLinks">
          <a href="#workspace">Workspace</a>
          <a href="#operations">Operations</a>
          <a href="#sources">Sources</a>
          <a href="#activity">Activity</a>
        </div>
        <div className="workspaceStatus"><span /> Systems connected</div>
      </nav>

      <header className="hero" id="top">
        <div className="heroContent">
          <div className="heroBadge"><span>✦</span> FBS AI KNOWLEDGE OS</div>
          <h1>Ask FBS.<br /><span>Move faster.</span></h1>
          <p>One intelligent workspace for Flexmls, IDX requirements, compliance, sales guidance, internal procedures, and current source-backed answers.</p>
          <div className="heroMeta">
            <span><b>{metrics.totalSkills}</b> active skills</span>
            <span><b>{knowledgeItems.length}</b> indexed sources</span>
            <span><b>{metrics.averageQualityScore.toFixed(1)}</b> quality score</span>
          </div>
        </div>

        <aside className="routePreview" aria-label="AI route preview">
          <div className="routePreviewHeader"><span>LIVE ROUTING</span><b>Question → Answer</b></div>
          <div className="routeQuestion">How do Flexmls subscriptions work?</div>
          <div className="routeFlow">
            <span className="routeNode active">Question</span><i>→</i><span className="routeNode active">Flexmls Help</span><i>→</i><span className="routeNode">Sources</span>
          </div>
          <div className="routeChecks"><span>✓ MCP connected</span><span>✓ Current documentation</span><span>✓ Source links enabled</span></div>
          <div className="confidenceBar"><span><b>96%</b> confidence</span><i><em /></i></div>
        </aside>
      </header>

      <section className="workspaceSearch" id="workspace">
        <div className="workspaceSearchLabel"><span>AI WORKSPACE</span><b>Ask anything across FBS knowledge</b></div>
        <SearchClient />
        <div className="searchHints"><span>Try:</span><button>Why can’t a user edit a listing?</button><button>Where is this IDX setting?</button><button>Which product should I recommend?</button></div>
      </section>

      <MissionControlDashboard items={knowledgeItems} sources={defaultSources} />

      <section className="workspaceGrid">
        <div className="workspaceMain">
          <section className="quickActions" aria-label="Quick actions">
            <div className="sectionTitle"><span>START HERE</span><h2>Quick actions</h2></div>
            <div className="quickActionGrid">
              {quickActions.map(([title, description], index) => (
                <article key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{description}</p></div><b>↗</b></article>
              ))}
            </div>
          </section>

          <section id="sources">
            <div className="sectionTitle"><span>KNOWLEDGE LAYER</span><h2>Connected resources</h2></div>
            <ResourceShelf />
          </section>
        </div>

        <aside className="routePanel">
          <div className="sectionTitle"><span>ROUTING MAP</span><h2>Where questions go</h2></div>
          <div className="routeList">
            {routes.map(([title, source, description]) => (
              <article key={title}><div><span>{source}</span><h3>{title}</h3><p>{description}</p></div><b>↗</b></article>
            ))}
          </div>
          <a className="routePanelLink" href="/routes">View all prompt routes <span>↗</span></a>
        </aside>
      </section>

      <section className="metrics" aria-label="Knowledge platform metrics" id="activity">
        <article><span className="metricIcon">✦</span><strong>{metrics.totalSkills}</strong><span>AI Skills</span><small>Curated workflows</small></article>
        <article><span className="metricIcon">◫</span><strong>{knowledgeItems.length}</strong><span>Indexed Sources</span><small>Searchable guidance</small></article>
        <article><span className="metricIcon">◎</span><strong>{metrics.averageQualityScore.toFixed(1)}</strong><span>Quality Score</span><small>Reviewed knowledge</small></article>
        <article><span className="metricIcon">↻</span><strong>{metrics.dueForReview}</strong><span>Review Queue</span><small>Items due for review</small></article>
      </section>

      <section className="contentHeading">
        <div><span className="sectionKicker">Explore the platform</span><h2>Approved knowledge for real work</h2></div>
        <p>Use current sources, guided workflows, and reviewed internal guidance.</p>
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

      <footer><span>FBS AI Knowledge Platform</span><span>Internal use only · Human review required</span></footer>
    </main>
  );
}
