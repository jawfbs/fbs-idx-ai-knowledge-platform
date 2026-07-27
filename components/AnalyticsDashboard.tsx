"use client";

import { useEffect, useMemo, useState } from "react";
import { clearSearchEvents, readSearchEvents, SearchAnalyticsEvent } from "../lib/analytics";

function average(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}
function rank(events: SearchAnalyticsEvent[], key: "question" | "skillUsed" | "connector") {
  const counts = new Map<string, number>();
  events.forEach((event) => counts.set(event[key], (counts.get(event[key]) || 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
}
function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

export default function AnalyticsDashboard() {
  const [events, setEvents] = useState<SearchAnalyticsEvent[]>([]);
  useEffect(() => {
    const load = () => setEvents(readSearchEvents());
    load();
    window.addEventListener("fbs-analytics-updated", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("fbs-analytics-updated", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  const today = new Date().toDateString();
  const todayEvents = events.filter((event) => new Date(event.createdAt).toDateString() === today);
  const answered = events.filter((event) => event.answered).length;
  const positive = events.filter((event) => event.feedback === "positive").length;
  const negative = events.filter((event) => event.feedback === "negative").length;
  const metrics = {
    total: events.length,
    today: todayEvents.length,
    confidence: average(events.map((event) => event.confidence)),
    responseTime: average(events.map((event) => event.responseTimeMs)),
    answerRate: events.length ? answered / events.length * 100 : 0
  };
  const questions = useMemo(() => rank(events, "question"), [events]);
  const skills = useMemo(() => rank(events, "skillUsed"), [events]);
  const connectors = useMemo(() => rank(events, "connector"), [events]);
  const unanswered = events.filter((event) => !event.answered).slice(0, 8);
  const slowest = [...events].sort((a, b) => b.responseTimeMs - a.responseTimeMs).slice(0, 8);

  return <div className="analyticsShell">
    <header className="analyticsHeader">
      <div><span className="sectionKicker">INTELLIGENCE CONTROL CENTER</span><h1>Search Analytics</h1><p>Live operational insight into questions, routes, connectors, confidence, performance, and knowledge gaps.</p></div>
      <div className="analyticsHeaderActions"><a href="/">← Workspace</a><button type="button" onClick={() => clearSearchEvents()} disabled={!events.length}>Clear local data</button></div>
    </header>

    <section className="analyticsMetricGrid">
      <article><span>Total searches</span><strong>{metrics.total}</strong><small>{metrics.today} today</small></article>
      <article><span>Answer rate</span><strong>{metrics.answerRate.toFixed(0)}%</strong><small>{answered} answered</small></article>
      <article><span>Average confidence</span><strong>{metrics.confidence.toFixed(1)}%</strong><small>Across all searches</small></article>
      <article><span>Average response</span><strong>{metrics.responseTime.toFixed(0)} ms</strong><small>Local search runtime</small></article>
      <article><span>Feedback</span><strong>{positive} / {negative}</strong><small>Helpful / not helpful</small></article>
    </section>

    {!events.length ? <section className="analyticsEmpty"><h2>No search activity yet</h2><p>Run searches from the workspace. Each query will automatically appear here with its route, connector, confidence, result count, response time, and feedback.</p><a href="/">Open workspace</a></section> : <>
      <section className="analyticsThreeColumn">
        {[{ title: "Most searched", rows: questions }, { title: "Most-used skills", rows: skills }, { title: "Most-used connectors", rows: connectors }].map((group) => <article className="analyticsPanel" key={group.title}><div className="analyticsPanelHeader"><h2>{group.title}</h2><span>{group.rows.length} ranked</span></div><div className="analyticsRankList">{group.rows.map(([label, count], index) => <div key={label}><b>{index + 1}</b><span>{label}</span><strong>{count}</strong></div>)}</div></article>)}
      </section>

      <section className="analyticsTwoColumn">
        <article className="analyticsPanel"><div className="analyticsPanelHeader"><h2>Knowledge gaps</h2><span>{unanswered.length} unanswered</span></div>{unanswered.length ? <div className="analyticsTable">{unanswered.map((event) => <div key={event.id}><span><b>{event.question}</b><small>{formatTime(event.createdAt)} · {event.connector}</small></span><em>{event.confidence}%</em></div>)}</div> : <p className="analyticsGoodState">Every recorded question returned at least one source.</p>}</article>
        <article className="analyticsPanel"><div className="analyticsPanelHeader"><h2>Slowest searches</h2><span>Performance review</span></div><div className="analyticsTable">{slowest.map((event) => <div key={event.id}><span><b>{event.question}</b><small>{event.skillUsed} · {event.resultCount} sources</small></span><em>{event.responseTimeMs} ms</em></div>)}</div></article>
      </section>

      <section className="analyticsPanel"><div className="analyticsPanelHeader"><h2>Recent activity</h2><span>Newest first</span></div><div className="analyticsActivityTable"><div className="analyticsTableHead"><span>Question</span><span>Skill</span><span>Connector</span><span>Confidence</span><span>Time</span><span>Status</span></div>{events.slice(0, 20).map((event) => <div className="analyticsActivityRow" key={event.id}><span><b>{event.question}</b><small>{formatTime(event.createdAt)}</small></span><span>{event.skillUsed}</span><span>{event.connector}</span><span>{event.confidence}%</span><span>{event.responseTimeMs} ms</span><span className={event.answered ? "answered" : "unanswered"}>{event.answered ? "Answered" : "Unanswered"}{event.feedback ? ` · ${event.feedback === "positive" ? "👍" : "👎"}` : ""}</span></div>)}</div>
      </section>
    </>}
  </div>;
}
