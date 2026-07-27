"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  KnowledgeSource,
  PromptRoute,
  SourceType,
  readRoutes,
  readSources,
  resetRoutes,
  resetSources,
  saveRoutes,
  saveSources
} from "../lib/platformConfig";

type Mode = "sources" | "routes";

const sourceTypes: SourceType[] = ["Google Drive", "Confluence", "Flexmls MCP", "GitHub", "Website", "Help Center"];
const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export default function PlatformAdmin({ mode }: { mode: Mode }) {
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [routes, setRoutes] = useState<PromptRoute[]>([]);
  const [message, setMessage] = useState("");
  const [testQuestion, setTestQuestion] = useState("");

  useEffect(() => {
    setSources(readSources());
    setRoutes(readRoutes());
  }, []);

  const persistSources = (next: KnowledgeSource[]) => {
    setSources(next);
    saveSources(next);
    flash("Source configuration saved");
  };
  const persistRoutes = (next: PromptRoute[]) => {
    setRoutes(next);
    saveRoutes(next);
    flash("Prompt routes saved");
  };
  const flash = (value: string) => {
    setMessage(value);
    window.setTimeout(() => setMessage(""), 1800);
  };

  const routeResult = useMemo(() => {
    const question = testQuestion.toLowerCase().trim();
    if (!question) return null;
    const enabled = [...routes].filter((route) => route.enabled).sort((a, b) => a.priority - b.priority);
    const matched = enabled.find((route) => !route.fallback && route.match.split(",").some((term) => question.includes(term.trim().toLowerCase()))) || enabled.find((route) => route.fallback);
    return matched || null;
  }, [routes, testQuestion]);

  const addSource = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const location = String(data.get("location") || "").trim();
    const type = String(data.get("type") || "Website") as SourceType;
    if (!name || !location) return;
    const next: KnowledgeSource = {
      id: uid("source"), name, location, type, enabled: true, priority: sources.length + 1,
      health: type === "Website" ? "Warning" : "Healthy", lastIndexed: "Not indexed"
    };
    persistSources([...sources, next]);
    event.currentTarget.reset();
  };

  const addRoute = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const match = String(data.get("match") || "").trim();
    const skill = String(data.get("skill") || "").trim();
    const connector = String(data.get("connector") || "").trim();
    if (!name || !match || !skill || !connector) return;
    const next: PromptRoute = { id: uid("route"), name, match, skill, connector, priority: routes.length + 1, enabled: true, fallback: false };
    persistRoutes([...routes, next]);
    event.currentTarget.reset();
  };

  return <main className="adminShell">
    <nav className="adminNav">
      <a className="workspaceBrand" href="/"><span>FBS</span><b>Knowledge Admin</b></a>
      <div><a className={mode === "sources" ? "active" : ""} href="/sources">Knowledge Sources</a><a className={mode === "routes" ? "active" : ""} href="/routes">Prompt Routes</a><a href="/analytics">Analytics</a></div>
      <a href="/">Workspace ↗</a>
    </nav>

    <header className="adminHero">
      <div><span className="sectionKicker">PLATFORM CONTROL</span><h1>{mode === "sources" ? "Knowledge Sources" : "Prompt Routes"}</h1><p>{mode === "sources" ? "Register, prioritize, enable, test, and monitor every knowledge connector used by the platform." : "Map employee questions to the right skill and connector without changing application code."}</p></div>
      <div className="adminSummary">
        <article><strong>{mode === "sources" ? sources.length : routes.length}</strong><span>Total</span></article>
        <article><strong>{mode === "sources" ? sources.filter((item) => item.enabled).length : routes.filter((item) => item.enabled).length}</strong><span>Enabled</span></article>
        <article><strong>{mode === "sources" ? sources.filter((item) => item.health === "Healthy").length : routes.filter((item) => item.fallback).length}</strong><span>{mode === "sources" ? "Healthy" : "Fallbacks"}</span></article>
      </div>
    </header>

    {message && <div className="adminToast">✓ {message}</div>}

    {mode === "sources" ? <>
      <section className="adminPanel">
        <div className="adminPanelHeader"><div><span>REGISTRY</span><h2>Connected knowledge</h2></div><button type="button" onClick={() => { resetSources(); setSources(readSources()); flash("Defaults restored"); }}>Restore defaults</button></div>
        <div className="adminTable sourceAdminTable">
          <div className="adminTableHead"><span>Source</span><span>Type</span><span>Health</span><span>Priority</span><span>Enabled</span><span>Actions</span></div>
          {sources.sort((a, b) => a.priority - b.priority).map((source) => <div className="adminTableRow" key={source.id}>
            <span><b>{source.name}</b><small>{source.location}</small></span>
            <span>{source.type}</span>
            <span><i className={`healthDot health-${source.health.toLowerCase().replace(" ", "-")}`} />{source.health}<small>{source.lastIndexed}</small></span>
            <span><input aria-label={`${source.name} priority`} type="number" min="1" value={source.priority} onChange={(event) => persistSources(sources.map((item) => item.id === source.id ? { ...item, priority: Number(event.target.value) || 1 } : item))} /></span>
            <span><button className={source.enabled ? "toggle active" : "toggle"} type="button" onClick={() => persistSources(sources.map((item) => item.id === source.id ? { ...item, enabled: !item.enabled } : item))}><i /></button></span>
            <span className="rowActions"><button type="button" onClick={() => persistSources(sources.map((item) => item.id === source.id ? { ...item, health: "Healthy", lastIndexed: "Tested just now" } : item))}>Test</button><button type="button" onClick={() => persistSources(sources.map((item) => item.id === source.id ? { ...item, lastIndexed: "Indexed just now" } : item))}>Re-index</button><button className="danger" type="button" onClick={() => persistSources(sources.filter((item) => item.id !== source.id))}>Remove</button></span>
          </div>)}
        </div>
      </section>

      <section className="adminPanel">
        <div className="adminPanelHeader"><div><span>ADD CONNECTOR</span><h2>Register a source</h2></div></div>
        <form className="adminForm" onSubmit={addSource}><label>Name<input name="name" required placeholder="Customer Support Drive" /></label><label>Type<select name="type">{sourceTypes.map((type) => <option key={type}>{type}</option>)}</select></label><label className="wide">Location or URL<input name="location" required placeholder="Folder, space, repository, MCP endpoint, or website" /></label><button type="submit">Add source</button></form>
      </section>
    </> : <>
      <section className="routeSimulator adminPanel">
        <div><span className="sectionKicker">ROUTE SIMULATOR</span><h2>Test a question</h2><p>See which active rule would handle an employee’s question before publishing route changes.</p></div>
        <input value={testQuestion} onChange={(event) => setTestQuestion(event.target.value)} placeholder="Why can’t a user edit a listing?" />
        {routeResult ? <div className="routeSimulationResult"><span>Question</span><i>→</i><strong>{routeResult.skill}</strong><i>→</i><b>{routeResult.connector}</b><small>Matched: {routeResult.fallback ? "fallback rule" : routeResult.match}</small></div> : <div className="routeSimulationEmpty">Enter a question to simulate routing.</div>}
      </section>

      <section className="adminPanel">
        <div className="adminPanelHeader"><div><span>RULES</span><h2>Routing registry</h2></div><button type="button" onClick={() => { resetRoutes(); setRoutes(readRoutes()); flash("Defaults restored"); }}>Restore defaults</button></div>
        <div className="routeAdminList">{routes.sort((a, b) => a.priority - b.priority).map((route) => <article key={route.id} className={!route.enabled ? "disabled" : ""}>
          <div className="routePriority"><input aria-label={`${route.name} priority`} type="number" min="1" value={route.priority} onChange={(event) => persistRoutes(routes.map((item) => item.id === route.id ? { ...item, priority: Number(event.target.value) || 1 } : item))} /></div>
          <div><span>{route.fallback ? "FALLBACK" : "MATCH RULE"}</span><h3>{route.name}</h3><p>{route.match}</p></div>
          <div className="routePath"><b>{route.skill}</b><i>→</i><strong>{route.connector}</strong></div>
          <button className={route.enabled ? "toggle active" : "toggle"} type="button" onClick={() => persistRoutes(routes.map((item) => item.id === route.id ? { ...item, enabled: !item.enabled } : item))}><i /></button>
          {!route.fallback && <button className="iconDanger" type="button" onClick={() => persistRoutes(routes.filter((item) => item.id !== route.id))}>×</button>}
        </article>)}</div>
      </section>

      <section className="adminPanel">
        <div className="adminPanelHeader"><div><span>ADD RULE</span><h2>Create a prompt route</h2></div></div>
        <form className="adminForm routeForm" onSubmit={addRoute}><label>Route name<input name="name" required placeholder="Billing Questions" /></label><label>Match terms<input name="match" required placeholder="invoice, billing, refund" /></label><label>Skill<input name="skill" required placeholder="Billing Support" /></label><label>Connector<input name="connector" required placeholder="Confluence" /></label><button type="submit">Add route</button></form>
      </section>
    </>}
  </main>;
}
