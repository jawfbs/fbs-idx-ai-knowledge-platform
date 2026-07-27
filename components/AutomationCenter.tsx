"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AutomationCategory,
  KnowledgeAutomation,
  readAutomations,
  resetAutomations,
  saveAutomations
} from "../lib/automationConfig";

type Activity = {
  id: string;
  automation: string;
  result: string;
  createdAt: string;
};

const categories: Array<"All" | AutomationCategory> = ["All", "Sources", "Quality", "Analytics", "Operations", "Governance"];
const ACTIVITY_KEY = "fbs-automation-activity-v1";

function readActivity(): Activity[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(ACTIVITY_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function statusClass(status: KnowledgeAutomation["status"]) {
  return status.toLowerCase().replace(/\s+/g, "-");
}

function formatActivityTime(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

export default function AutomationCenter() {
  const [automations, setAutomations] = useState<KnowledgeAutomation[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [running, setRunning] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setAutomations(readAutomations());
    setActivity(readActivity());
  }, []);

  const persist = (next: KnowledgeAutomation[]) => {
    setAutomations(next);
    saveAutomations(next);
  };

  const log = (items: Activity[]) => {
    const next = [...items, ...activity].slice(0, 40);
    setActivity(next);
    window.localStorage.setItem(ACTIVITY_KEY, JSON.stringify(next));
  };

  const flash = (value: string) => {
    setMessage(value);
    window.setTimeout(() => setMessage(""), 2200);
  };

  const run = (automation: KnowledgeAutomation) => {
    if (automation.status === "Needs setup") return;
    setRunning((current) => [...current, automation.id]);
    window.setTimeout(() => {
      const now = new Date().toISOString();
      persist(automations.map((item) => item.id === automation.id ? {
        ...item,
        status: "Healthy",
        lastRun: "Just now",
        runCount: item.runCount + 1,
        outcome: item.outcome || "Completed successfully"
      } : item));
      log([{ id: `${Date.now()}-${automation.id}`, automation: automation.name, result: automation.outcome || "Completed successfully", createdAt: now }]);
      setRunning((current) => current.filter((id) => id !== automation.id));
      flash(`${automation.name} completed`);
    }, 650);
  };

  const runEnabled = () => {
    const runnable = automations.filter((item) => item.enabled && item.status !== "Needs setup");
    if (!runnable.length) return;
    setRunning(runnable.map((item) => item.id));
    window.setTimeout(() => {
      const now = new Date().toISOString();
      const ids = new Set(runnable.map((item) => item.id));
      persist(automations.map((item) => ids.has(item.id) ? { ...item, status: "Healthy", lastRun: "Just now", runCount: item.runCount + 1 } : item));
      log(runnable.map((item, index) => ({ id: `${Date.now()}-${index}-${item.id}`, automation: item.name, result: item.outcome || "Completed successfully", createdAt: now })));
      setRunning([]);
      flash(`${runnable.length} enabled automations completed`);
    }, 900);
  };

  const toggle = (automation: KnowledgeAutomation) => {
    persist(automations.map((item) => item.id === automation.id ? {
      ...item,
      enabled: !item.enabled,
      status: !item.enabled && item.status === "Paused" ? "Ready" : item.enabled ? "Paused" : item.status
    } : item));
  };

  const stats = useMemo(() => ({
    enabled: automations.filter((item) => item.enabled).length,
    healthy: automations.filter((item) => item.status === "Healthy").length,
    setup: automations.filter((item) => item.status === "Needs setup").length,
    runs: automations.reduce((sum, item) => sum + item.runCount, 0)
  }), [automations]);

  const visible = useMemo(() => category === "All" ? automations : automations.filter((item) => item.category === category), [automations, category]);
  const setupItems = automations.filter((item) => item.status === "Needs setup");

  return <main className="automationShell">
    <nav className="adminNav automationNav">
      <a className="workspaceBrand" href="/"><span>FBS</span><b>Knowledge Admin</b></a>
      <div><a href="/sources">Sources</a><a href="/routes">Routes</a><a href="/analytics">Analytics</a><a className="active" href="/automations">Automations</a></div>
      <a href="/">Workspace ↗</a>
    </nav>

    <header className="automationHero">
      <div><span className="sectionKicker">AUTOMATION CONTROL</span><h1>Keep knowledge current without the busywork.</h1><p>Schedule source refreshes, quality checks, analytics reporting, monitoring, and governance from one operations center.</p><div className="automationHeroActions"><button type="button" onClick={runEnabled} disabled={running.length > 0}>{running.length ? `Running ${running.length} tasks…` : "Run enabled automations"}</button><a href="#automation-list">Review all tasks</a></div></div>
      <aside><span>OPERATIONS STATUS</span><strong>{stats.setup ? "Action needed" : "All systems healthy"}</strong><p>{stats.enabled} automations enabled · {stats.setup} awaiting setup</p><div className="automationPulse"><i /><span>Automation engine ready</span></div></aside>
    </header>

    {message && <div className="adminToast">✓ {message}</div>}

    <section className="automationMetrics" aria-label="Automation metrics">
      <article><span>Enabled</span><strong>{stats.enabled}</strong><small>of {automations.length} automations</small></article>
      <article><span>Healthy</span><strong>{stats.healthy}</strong><small>last run successful</small></article>
      <article><span>Needs setup</span><strong>{stats.setup}</strong><small>connector or database required</small></article>
      <article><span>Total runs</span><strong>{stats.runs.toLocaleString()}</strong><small>recorded executions</small></article>
    </section>

    {setupItems.length > 0 && <section className="automationSetup">
      <div><span>ACTION QUEUE</span><h2>Finish {setupItems.length} integrations</h2><p>Complete these connections to unlock every automation.</p></div>
      <div>{setupItems.map((item) => <article key={item.id}><span>{item.category}</span><b>{item.name}</b><small>{item.outcome}</small><a href={item.id === "jira-gaps" ? "/routes" : "/sources"}>Configure ↗</a></article>)}</div>
    </section>}

    <section className="automationPanel" id="automation-list">
      <div className="automationPanelHeader"><div><span>REGISTRY</span><h2>Automation library</h2></div><div className="automationPanelActions"><button type="button" onClick={() => { resetAutomations(); setAutomations(readAutomations()); flash("Default automations restored"); }}>Restore defaults</button></div></div>
      <div className="automationFilters">{categories.map((item) => <button key={item} type="button" className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}<span>{item === "All" ? automations.length : automations.filter((automation) => automation.category === item).length}</span></button>)}</div>
      <div className="automationList">{visible.map((automation) => <article key={automation.id} className={!automation.enabled ? "disabled" : ""}>
        <div className={`automationCategory category-${automation.category.toLowerCase()}`}>{automation.category.slice(0, 1)}</div>
        <div className="automationIdentity"><div><span>{automation.category}</span><i className={`automationStatus status-${statusClass(automation.status)}`}>{automation.status}</i></div><h3>{automation.name}</h3><p>{automation.description}</p><small>{automation.outcome}</small></div>
        <div className="automationSchedule"><span>CADENCE</span><b>{automation.cadence}</b><small>{automation.trigger}</small></div>
        <div className="automationRunMeta"><span>LAST / NEXT</span><b>{automation.lastRun}</b><small>{automation.nextRun}</small></div>
        <div className="automationControls"><button className={automation.enabled ? "toggle active" : "toggle"} type="button" aria-label={`${automation.enabled ? "Disable" : "Enable"} ${automation.name}`} onClick={() => toggle(automation)}><i /></button><button className="runAutomation" type="button" disabled={!automation.enabled || automation.status === "Needs setup" || running.includes(automation.id)} onClick={() => run(automation)}>{running.includes(automation.id) ? "Running…" : automation.status === "Needs setup" ? "Setup" : "Run now"}</button></div>
      </article>)}</div>
    </section>

    <section className="automationActivity">
      <div className="automationPanelHeader"><div><span>HISTORY</span><h2>Recent automation runs</h2></div>{activity.length > 0 && <button type="button" onClick={() => { setActivity([]); window.localStorage.removeItem(ACTIVITY_KEY); }}>Clear history</button>}</div>
      {activity.length ? <div>{activity.slice(0, 12).map((item) => <article key={item.id}><i>✓</i><span><b>{item.automation}</b><small>{item.result}</small></span><time>{formatActivityTime(item.createdAt)}</time></article>)}</div> : <p className="automationEmpty">Run an automation to begin the activity history.</p>}
    </section>
  </main>;
}
