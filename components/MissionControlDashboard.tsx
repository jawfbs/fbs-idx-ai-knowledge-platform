"use client";

import { useMemo, useState } from "react";
import { KnowledgeItem } from "../lib/data";
import { KnowledgeSource } from "../lib/platformConfig";

type DashboardView = "overview" | "connectors" | "activity" | "trending" | "review";

type Props = {
  items: KnowledgeItem[];
  sources: KnowledgeSource[];
};

const viewLabels: Record<DashboardView, string> = {
  overview: "Overview",
  connectors: "Connector health",
  activity: "Recent activity",
  trending: "Trending knowledge",
  review: "Review queue"
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T12:00:00`));
}

export default function MissionControlDashboard({ items, sources }: Props) {
  const [view, setView] = useState<DashboardView>("overview");

  const approved = items.filter((item) => item.status === "Approved");
  const reviewQueue = items.filter((item) => item.status !== "Approved");
  const healthySources = sources.filter((source) => source.enabled && source.health === "Healthy");
  const enabledSources = sources.filter((source) => source.enabled);
  const coverage = items.length ? Math.round((approved.length / items.length) * 100) : 0;
  const recent = [...items].sort((a, b) => b.updated.localeCompare(a.updated)).slice(0, 6);

  const trending = useMemo(() => {
    const counts = new Map<string, number>();
    items.forEach((item) => item.tags.forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 6);
  }, [items]);

  const runSearch = (query: string) => {
    window.dispatchEvent(new CustomEvent("run-platform-search", { detail: query }));
    window.setTimeout(() => document.getElementById("workspace")?.scrollIntoView({ behavior: "smooth", block: "start" }), 40);
  };

  return (
    <section className="missionControl" id="operations" aria-labelledby="mission-control-title">
      <div className="missionControlHeader">
        <div>
          <span className="sectionKicker">MISSION CONTROL</span>
          <h2 id="mission-control-title">AI operations at a glance</h2>
          <p>Live calculations from the current knowledge registry, source configuration, approval status, tags, and update dates.</p>
        </div>
        <div className="missionControlState"><i /><span>Operational</span><small>{enabledSources.length} enabled connectors</small></div>
      </div>

      <div className="missionMetrics" aria-label="Operations metrics">
        <button type="button" className={view === "overview" ? "active" : ""} onClick={() => setView("overview")}>
          <span>Knowledge coverage</span><strong>{coverage}%</strong><small>{approved.length} of {items.length} items approved</small>
        </button>
        <button type="button" className={view === "connectors" ? "active" : ""} onClick={() => setView("connectors")}>
          <span>Connector health</span><strong>{healthySources.length}/{enabledSources.length}</strong><small>Healthy enabled sources</small>
        </button>
        <button type="button" className={view === "activity" ? "active" : ""} onClick={() => setView("activity")}>
          <span>Recent updates</span><strong>{recent.length}</strong><small>Latest registry changes</small>
        </button>
        <button type="button" className={view === "review" ? "active" : ""} onClick={() => setView("review")}>
          <span>Review queue</span><strong>{reviewQueue.length}</strong><small>Draft or in-review items</small>
        </button>
      </div>

      <div className="missionWorkspace">
        <nav className="missionTabs" aria-label="Mission Control views">
          {(Object.keys(viewLabels) as DashboardView[]).map((key) => <button type="button" key={key} className={view === key ? "active" : ""} onClick={() => setView(key)}>{viewLabels[key]}</button>)}
        </nav>

        {view === "overview" && <div className="missionOverview">
          <article className="missionPrimaryPanel">
            <div className="missionPanelHeader"><div><span>KNOWLEDGE HEALTH</span><h3>Registry readiness</h3></div><b>{coverage}%</b></div>
            <div className="missionProgress"><i style={{ width: `${coverage}%` }} /></div>
            <div className="missionBreakdown">
              <span><b>{approved.length}</b> Approved</span>
              <span><b>{items.filter((item) => item.status === "In Review").length}</b> In review</span>
              <span><b>{items.filter((item) => item.status === "Draft").length}</b> Draft</span>
            </div>
          </article>
          <article className="missionInsightPanel">
            <div className="missionPanelHeader"><div><span>AI INSIGHT</span><h3>Highest-impact next step</h3></div></div>
            <p>{reviewQueue.length ? `Review ${reviewQueue[0].title} to increase approved coverage and improve answer reliability.` : "All registered knowledge is approved. Focus next on adding source freshness checks."}</p>
            {reviewQueue.length ? <button type="button" onClick={() => runSearch(reviewQueue[0].title)}>Open related search <span>↗</span></button> : <a href="/sources">Review sources <span>↗</span></a>}
          </article>
        </div>}

        {view === "connectors" && <div className="connectorGrid">
          {sources.map((source) => <article key={source.id}>
            <div className="connectorTop"><span className={`connectorDot connector-${source.health.toLowerCase().replace(" ", "-")}`} /><b>{source.type}</b><small>{source.enabled ? "Enabled" : "Disabled"}</small></div>
            <h3>{source.name}</h3><p>{source.location}</p>
            <footer><span>{source.health}</span><span>{source.lastIndexed}</span></footer>
          </article>)}
        </div>}

        {view === "activity" && <div className="missionList">
          {recent.map((item) => <button type="button" key={item.title} onClick={() => runSearch(item.title)}><span><b>{item.title}</b><small>{item.type} · {item.status}</small></span><time>{formatDate(item.updated)}</time><i>↗</i></button>)}
        </div>}

        {view === "trending" && <div className="trendGrid">
          {trending.map(([tag, count], index) => <button type="button" key={tag} onClick={() => runSearch(tag)}><span>0{index + 1}</span><div><b>{tag}</b><small>{count} indexed item{count === 1 ? "" : "s"}</small></div><i>↗</i></button>)}
        </div>}

        {view === "review" && <div className="missionList">
          {reviewQueue.length ? reviewQueue.map((item) => <button type="button" key={item.title} onClick={() => runSearch(item.title)}><span><b>{item.title}</b><small>{item.type} · {item.status}</small></span><time>{formatDate(item.updated)}</time><i>↗</i></button>) : <div className="missionEmpty"><b>Review queue is clear</b><span>Every registered item is approved.</span></div>}
        </div>}
      </div>
    </section>
  );
}
