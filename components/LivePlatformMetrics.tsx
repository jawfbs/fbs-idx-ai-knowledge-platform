"use client";

import { useEffect, useState } from "react";
import { readSearchEvents, SearchAnalyticsEvent } from "../lib/analytics";

export default function LivePlatformMetrics({ skills, sources, reviewQueue }: { skills: number; sources: number; reviewQueue: number }) {
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

  const confidence = events.length ? events.reduce((sum, event) => sum + event.confidence, 0) / events.length : 0;
  const answered = events.filter((event) => event.answered).length;
  const connectors = new Set(events.map((event) => event.connector)).size;
  const today = events.filter((event) => new Date(event.createdAt).toDateString() === new Date().toDateString()).length;

  return <section className="metrics" aria-label="Knowledge platform metrics" id="activity">
    <article><span className="metricIcon">✦</span><strong>{events.length}</strong><span>Total Searches</span><small>{today} today</small></article>
    <article><span className="metricIcon">◎</span><strong>{events.length ? `${confidence.toFixed(1)}%` : "—"}</strong><span>Average Confidence</span><small>{answered} answered</small></article>
    <article><span className="metricIcon">◫</span><strong>{connectors || 4}</strong><span>Connectors Used</span><small>{sources} indexed sources</small></article>
    <article><span className="metricIcon">↻</span><strong>{reviewQueue}</strong><span>Review Queue</span><small>{skills} active skills</small></article>
  </section>;
}
