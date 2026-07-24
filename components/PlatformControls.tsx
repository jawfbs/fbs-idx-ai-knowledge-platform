"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { knowledgeItems } from "../lib/data";

const GUIDE_URL = "https://docs.google.com/document/d/1FH0JT6n5Pc1aP-GBFMlql5EjBjWT5dsePGyo6YfysU8";
const colors = [
  ["blue", "Blue", "#2563eb"], ["violet", "Violet", "#7c3aed"], ["cyan", "Cyan", "#0891b2"],
  ["teal", "Teal", "#0f766e"], ["green", "Green", "#16a34a"], ["lime", "Lime", "#65a30d"],
  ["amber", "Amber", "#d97706"], ["orange", "Orange", "#ea580c"], ["rose", "Rose", "#e11d48"],
  ["slate", "Slate", "#475569"]
] as const;
const quickCommands = [
  { title: "Search IDX requirements", detail: "Find MLS-specific requirements", query: "IDX requirements MLS" },
  { title: "Recommend an IDX product", detail: "Compare SmartFrame, WordPress, Website Concierge, and Spark API", query: "IDX product recommendation" },
  { title: "Troubleshoot missing listings", detail: "Open the missing-listings workflow", query: "missing listings troubleshooting" },
  { title: "Prepare an escalation", detail: "Collect evidence before escalating", query: "IDX escalation evidence" }
];

type IconName = "sliders" | "close" | "play" | "search" | "keyboard" | "moon" | "sun" | "book" | "trash" | "arrow" | "check";
function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    sliders: <><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></>,
    close: <path d="m7 7 10 10M17 7 7 17"/>, play: <><circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4Z"/></>,
    search: <><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></>, keyboard: <><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10h.01M11 10h.01M15 10h.01M19 10h.01M7 14h8M17 14h2"/></>,
    moon: <path d="M20 15.2A8 8 0 0 1 8.8 4a8 8 0 1 0 11.2 11.2Z"/>, sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5Z"/><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5A2.5 2.5 0 0 1 20 21.5Z"/></>,
    trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/></>, arrow: <><path d="M7 17 17 7M9 7h8v8"/></>, check: <path d="m7 12 3 3 7-7"/>
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

export default function PlatformControls() {
  const [open, setOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [accent, setAccent] = useState("blue");

  const paletteItems = useMemo(() => {
    const needle = paletteQuery.toLowerCase().trim();
    const commands = quickCommands.map((item) => ({ ...item, kind: "Command" as const }));
    const sources = knowledgeItems.map((item) => ({ title: item.title, detail: `${item.status} ${item.type} · ${item.description}`, href: item.href, kind: "Source" as const }));
    return [...commands, ...sources].filter((item) => !needle || `${item.title} ${item.detail}`.toLowerCase().includes(needle)).slice(0, 10);
  }, [paletteQuery]);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("fbs-theme");
    const dark = savedTheme ? savedTheme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedAccent = window.localStorage.getItem("fbs-accent") || "blue";
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document.documentElement.dataset.accent = savedAccent;
    setIsDark(dark); setAccent(savedAccent);
    const handleKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setPaletteOpen(true); }
      if (event.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => { if (!notice) return; const timer = window.setTimeout(() => setNotice(""), 2200); return () => window.clearTimeout(timer); }, [notice]);
  const runQuery = (query: string) => { window.dispatchEvent(new CustomEvent("run-platform-search", { detail: query })); setPaletteOpen(false); };
  const toggleTheme = () => { const next = !isDark; setIsDark(next); document.documentElement.dataset.theme = next ? "dark" : "light"; window.localStorage.setItem("fbs-theme", next ? "dark" : "light"); };
  const chooseAccent = (name: string) => { setAccent(name); document.documentElement.dataset.accent = name; window.localStorage.setItem("fbs-accent", name); setNotice(`${name[0].toUpperCase()}${name.slice(1)} color selected`); };
  const clearHistory = () => { ["fbs-recent-searches", "fbs-search-counts", "fbs-recent-views"].forEach((key) => window.localStorage.removeItem(key)); window.dispatchEvent(new Event("platform-storage-updated")); setNotice("Local history cleared"); };

  return <>
    <div className="settingsWrap">
      {!open && <button className="controlOrb" type="button" aria-label="Customize platform" onClick={() => setOpen(true)}><Icon name="sliders" /></button>}
      {open && <aside className="settingsPanel" aria-label="Customize platform">
        <div className="settingsPanelHeader"><div><strong>Customize</strong><small>Make the workspace feel like yours</small></div><button className="settingsClose" type="button" aria-label="Close customize panel" onClick={() => setOpen(false)}><Icon name="close" /></button></div>
        <div className="settingsSectionTitle">Accent color</div>
        <div className="colorGrid" aria-label="Platform accent color">
          {colors.map(([name, label, hex]) => <button key={name} className="colorChoice" style={{ "--swatch": hex } as React.CSSProperties} type="button" aria-label={label} aria-pressed={accent === name} onClick={() => chooseAccent(name)}>{accent === name && <Icon name="check" />}</button>)}
        </div>
        <div className="settingsSectionTitle">Appearance</div>
        <div className="settingsList">
          <div className="settingsRow"><span className="settingsIcon"><Icon name={isDark ? "moon" : "sun"} /></span><span className="settingsCopy"><strong>Dark mode</strong><small>{isDark ? "Dark appearance is enabled" : "Use a darker interface"}</small></span><button className="themeSwitch" type="button" role="switch" aria-checked={isDark} aria-label="Toggle dark mode" onClick={toggleTheme} /></div>
        </div>
        <div className="settingsSectionTitle">Workspace</div>
        <div className="settingsList">
          <button className="settingsRow" type="button" onClick={() => window.dispatchEvent(new Event("open-welcome-video"))}><span className="settingsIcon"><Icon name="play" /></span><span className="settingsCopy"><strong>Watch introduction</strong><small>Replay the platform overview</small></span><span className="settingsMeta">Play</span></button>
          <button className="settingsRow" type="button" onClick={() => window.dispatchEvent(new Event("focus-platform-search"))}><span className="settingsIcon"><Icon name="search" /></span><span className="settingsCopy"><strong>Focus search</strong><small>Jump to the question field</small></span><span className="settingsMeta">/</span></button>
          <button className="settingsRow" type="button" onClick={() => setPaletteOpen(true)}><span className="settingsIcon"><Icon name="keyboard" /></span><span className="settingsCopy"><strong>Command palette</strong><small>Search actions, skills, and sources</small></span><span className="settingsMeta">⌘K</span></button>
          <a className="settingsRow" href={GUIDE_URL} target="_blank" rel="noreferrer"><span className="settingsIcon"><Icon name="book" /></span><span className="settingsCopy"><strong>Platform guide</strong><small>Open usage guidance</small></span><span className="settingsMeta"><Icon name="arrow" /></span></a>
          <button className="settingsRow settingsDanger" type="button" onClick={clearHistory}><span className="settingsIcon"><Icon name="trash" /></span><span className="settingsCopy"><strong>Clear local history</strong><small>Remove recent searches and views</small></span><span className="settingsMeta">Clear</span></button>
        </div>
      </aside>}
    </div>
    {notice && <div className="platformNotice" role="status" aria-live="polite">{notice}</div>}
    {paletteOpen && <div className="commandOverlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setPaletteOpen(false)}><section className="commandPalette" role="dialog" aria-modal="true" aria-label="Command palette"><div className="commandSearch"><span>⌕</span><input autoFocus value={paletteQuery} onChange={(event) => setPaletteQuery(event.target.value)} placeholder="Search skills, sources, and actions…"/><kbd>Esc</kbd></div><div className="commandList">{paletteItems.map((item) => <button key={`${item.kind}-${item.title}`} type="button" onClick={() => "query" in item ? runQuery(item.query) : window.open(item.href, "_blank", "noopener,noreferrer")}><span className="commandKind">{item.kind}</span><span><b>{item.title}</b><small>{item.detail}</small></span><i>↗</i></button>)}{!paletteItems.length && <p className="commandEmpty">No matching skills or sources.</p>}</div></section></div>}
  </>;
}
