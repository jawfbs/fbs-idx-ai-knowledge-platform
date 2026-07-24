"use client";

import { useEffect, useMemo, useState } from "react";
import { knowledgeItems } from "../lib/data";

const GUIDE_URL = "https://docs.google.com/document/d/1FH0JT6n5Pc1aP-GBFMlql5EjBjWT5dsePGyo6YfysU8";

const quickCommands = [
  { title: "Search IDX requirements", detail: "Find MLS-specific requirements", query: "IDX requirements MLS" },
  { title: "Recommend an IDX product", detail: "Compare SmartFrame, WordPress, Website Concierge, and Spark API", query: "IDX product recommendation" },
  { title: "Troubleshoot missing listings", detail: "Open the missing-listings workflow", query: "missing listings troubleshooting" },
  { title: "Prepare an escalation", detail: "Collect evidence before escalating", query: "IDX escalation evidence" }
];

type IconName = "settings" | "close" | "play" | "search" | "keyboard" | "moon" | "sun" | "book" | "trash" | "arrow";

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.12 2.12-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.55V20.3h-3v-.09a1.7 1.7 0 0 0-1.03-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06-2.12-2.12.06-.06A1.7 1.7 0 0 0 7 15a1.7 1.7 0 0 0-1.55-1.03H5.3v-3h.15A1.7 1.7 0 0 0 7 9.94a1.7 1.7 0 0 0-.34-1.88L6.6 8l2.12-2.12.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 11.7 4.7V4.6h3v.1a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06L19.8 8l-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.55 1.03h.15v3h-.15A1.7 1.7 0 0 0 19.4 15Z"/></>,
    close: <><path d="m7 7 10 10M17 7 7 17"/></>,
    play: <><circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4Z"/></>,
    search: <><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></>,
    keyboard: <><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10h.01M11 10h.01M15 10h.01M19 10h.01M7 14h8M17 14h2"/></>,
    moon: <path d="M20 15.2A8 8 0 0 1 8.8 4a8 8 0 1 0 11.2 11.2Z"/>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5Z"/><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5A2.5 2.5 0 0 1 20 21.5Z"/></>,
    trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/></>,
    arrow: <><path d="M7 17 17 7M9 7h8v8"/></>
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

export default function PlatformControls() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [isDark, setIsDark] = useState(false);

  const paletteItems = useMemo(() => {
    const needle = paletteQuery.toLowerCase().trim();
    const commands = quickCommands.map((item) => ({ ...item, kind: "Command" as const }));
    const sources = knowledgeItems.map((item) => ({ title: item.title, detail: `${item.status} ${item.type} · ${item.description}`, href: item.href, kind: "Source" as const }));
    return [...commands, ...sources].filter((item) => !needle || `${item.title} ${item.detail}`.toLowerCase().includes(needle)).slice(0, 10);
  }, [paletteQuery]);

  useEffect(() => {
    const saved = window.localStorage.getItem("fbs-theme");
    const dark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    setIsDark(dark);

    const handleKey = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(true);
      }
      if (event.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 2200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const runQuery = (query: string) => {
    window.dispatchEvent(new CustomEvent("run-platform-search", { detail: query }));
    setPaletteOpen(false);
  };

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    document.documentElement.dataset.theme = nextDark ? "dark" : "light";
    window.localStorage.setItem("fbs-theme", nextDark ? "dark" : "light");
    setNotice(`${nextDark ? "Dark" : "Light"} mode enabled`);
  };

  const clearHistory = () => {
    ["fbs-recent-searches", "fbs-search-counts", "fbs-recent-views"].forEach((key) => window.localStorage.removeItem(key));
    window.dispatchEvent(new Event("platform-storage-updated"));
    setNotice("Local history cleared");
  };

  return (
    <>
      <style>{`
        .floatingPlatformControls { position: fixed; top: 20px; right: 20px; z-index: 80; }
        .settingsWrap { position: relative; }
        .settingsButton { min-width: 48px; height: 48px; display: inline-flex; align-items: center; justify-content: center; gap: 9px; padding: 0 15px; border: 1px solid var(--border-soft); border-radius: 16px; background: color-mix(in srgb, var(--surface-raised) 92%, transparent); color: var(--text-primary); box-shadow: var(--shadow-soft); backdrop-filter: blur(20px); cursor: pointer; transition: transform .16s ease, border-color .16s ease, background .16s ease; }
        .settingsButton:hover { transform: translateY(-2px); border-color: var(--border-strong); background: var(--surface-solid); }
        .settingsButton svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
        .settingsButtonLabel { font-size: 13px; font-weight: 750; }
        .settingsPanel { position: fixed; top: 20px; right: 20px; width: min(350px, calc(100vw - 28px)); max-height: calc(100vh - 40px); overflow-y: auto; padding: 18px; border: 1px solid var(--border-soft); border-radius: 22px; background: color-mix(in srgb, var(--surface-solid) 96%, transparent); color: var(--text-primary); box-shadow: var(--shadow-float); backdrop-filter: blur(24px); animation: settingsPanelIn .18s ease-out; }
        .settingsPanelHeader { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 2px 2px 15px; border-bottom: 1px solid var(--border-soft); }
        .settingsPanelHeader strong, .settingsPanelHeader small { display: block; }
        .settingsPanelHeader strong { font-size: 17px; }
        .settingsPanelHeader small { margin-top: 3px; color: var(--text-muted); font-size: 12px; }
        .settingsClose { width: 36px; height: 36px; display: grid; place-items: center; flex: 0 0 auto; border: 1px solid var(--border-soft); border-radius: 11px; background: var(--surface-subtle); color: var(--text-primary); cursor: pointer; }
        .settingsClose:hover { background: var(--surface-hover); }
        .settingsClose svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; }
        .settingsList { display: grid; gap: 8px; padding-top: 14px; }
        .settingsRow { width: 100%; min-height: 62px; display: grid; grid-template-columns: 42px 1fr auto; align-items: center; gap: 12px; padding: 10px 12px; border: 1px solid transparent; border-radius: 15px; background: transparent; color: inherit; text-align: left; text-decoration: none; cursor: pointer; transition: background .14s ease, border-color .14s ease, transform .14s ease; }
        .settingsRow:hover, .settingsRow:focus-visible { transform: translateY(-1px); border-color: var(--border-soft); background: var(--surface-subtle); }
        .settingsIcon { width: 42px; height: 42px; display: grid; place-items: center; border-radius: 12px; background: var(--accent-soft); color: var(--accent); }
        .settingsIcon svg { width: 21px; height: 21px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
        .settingsCopy strong, .settingsCopy small { display: block; }
        .settingsCopy strong { font-size: 14px; font-weight: 750; }
        .settingsCopy small { margin-top: 3px; color: var(--text-muted); font-size: 11px; line-height: 1.35; }
        .settingsMeta { color: var(--text-muted); font-size: 12px; font-weight: 700; }
        .settingsMeta svg { width: 17px; height: 17px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
        .themeSwitch { width: 44px; height: 25px; position: relative; border: 0; border-radius: 999px; background: var(--border-strong); box-shadow: inset 0 0 0 1px var(--border-soft); }
        .themeSwitch::after { content: ""; position: absolute; top: 3px; left: 3px; width: 19px; height: 19px; border-radius: 50%; background: var(--surface-solid); box-shadow: 0 2px 8px rgba(0,0,0,.18); transition: transform .18s ease; }
        .themeSwitch[aria-checked="true"] { background: var(--accent); }
        .themeSwitch[aria-checked="true"]::after { transform: translateX(19px); }
        .settingsDanger .settingsIcon { background: color-mix(in srgb, #d13b4f 12%, transparent); color: #d13b4f; }
        .settingsFooter { margin-top: 14px; padding: 14px 4px 2px; border-top: 1px solid var(--border-soft); color: var(--text-muted); font-size: 11px; text-align: center; }
        .platformNotice { position: fixed; right: 20px; bottom: 20px; z-index: 120; padding: 11px 14px; border: 1px solid var(--border-soft); border-radius: 12px; background: var(--surface-solid); color: var(--text-primary); box-shadow: var(--shadow-float); font-size: 13px; font-weight: 650; animation: noticeIn .18s ease-out; }
        @keyframes settingsPanelIn { from { opacity: 0; transform: translateX(12px) scale(.985); } to { opacity: 1; transform: translateX(0) scale(1); } }
        @keyframes noticeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 680px) { .floatingPlatformControls { top: 12px; right: 12px; } .settingsButton { width: 46px; padding: 0; } .settingsButtonLabel { display: none; } .settingsPanel { top: 10px; right: 10px; width: calc(100vw - 20px); max-height: calc(100vh - 20px); } .platformNotice { right: 10px; bottom: 10px; } }
      `}</style>

      <div className="settingsWrap">
        {!settingsOpen && (
          <button className="settingsButton" type="button" aria-label="Open settings" aria-expanded="false" onClick={() => setSettingsOpen(true)}>
            <Icon name="settings" /><span className="settingsButtonLabel">Settings</span>
          </button>
        )}

        {settingsOpen && (
          <aside className="settingsPanel" aria-label="Platform settings">
            <div className="settingsPanelHeader">
              <div><strong>Platform settings</strong><small>Quick actions and appearance</small></div>
              <button className="settingsClose" type="button" aria-label="Close settings" onClick={() => setSettingsOpen(false)}><Icon name="close" /></button>
            </div>

            <div className="settingsList">
              <button className="settingsRow" type="button" onClick={() => window.dispatchEvent(new Event("open-welcome-video"))}>
                <span className="settingsIcon"><Icon name="play" /></span><span className="settingsCopy"><strong>Watch introduction</strong><small>Replay the platform overview</small></span><span className="settingsMeta">Play</span>
              </button>
              <button className="settingsRow" type="button" onClick={() => window.dispatchEvent(new Event("focus-platform-search"))}>
                <span className="settingsIcon"><Icon name="search" /></span><span className="settingsCopy"><strong>Focus search</strong><small>Jump directly to the main question field</small></span><span className="settingsMeta">/</span>
              </button>
              <button className="settingsRow" type="button" onClick={() => setPaletteOpen(true)}>
                <span className="settingsIcon"><Icon name="keyboard" /></span><span className="settingsCopy"><strong>Command palette</strong><small>Search actions, skills, and sources</small></span><span className="settingsMeta">⌘K</span>
              </button>
              <div className="settingsRow" role="group" aria-label="Appearance">
                <span className="settingsIcon"><Icon name={isDark ? "moon" : "sun"} /></span><span className="settingsCopy"><strong>Dark mode</strong><small>{isDark ? "Dark appearance is enabled" : "Use a darker interface"}</small></span><button className="themeSwitch" type="button" role="switch" aria-checked={isDark} aria-label="Toggle dark mode" onClick={toggleTheme} />
              </div>
              <a className="settingsRow" href={GUIDE_URL} target="_blank" rel="noreferrer">
                <span className="settingsIcon"><Icon name="book" /></span><span className="settingsCopy"><strong>Platform guide</strong><small>Open usage guidance and best practices</small></span><span className="settingsMeta"><Icon name="arrow" /></span>
              </a>
              <button className="settingsRow settingsDanger" type="button" onClick={clearHistory}>
                <span className="settingsIcon"><Icon name="trash" /></span><span className="settingsCopy"><strong>Clear local history</strong><small>Remove recent searches and viewed items</small></span><span className="settingsMeta">Clear</span>
              </button>
            </div>
            <div className="settingsFooter">FBS BAS AI Knowledge Platform</div>
          </aside>
        )}
      </div>

      {notice && <div className="platformNotice" role="status" aria-live="polite">{notice}</div>}

      {paletteOpen && (
        <div className="commandOverlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setPaletteOpen(false)}>
          <section className="commandPalette" role="dialog" aria-modal="true" aria-label="Command palette">
            <div className="commandSearch"><span>⌕</span><input autoFocus value={paletteQuery} onChange={(event) => setPaletteQuery(event.target.value)} placeholder="Search skills, sources, and actions…"/><kbd>Esc</kbd></div>
            <div className="commandList">
              {paletteItems.map((item) => (
                <button key={`${item.kind}-${item.title}`} type="button" onClick={() => "query" in item ? runQuery(item.query) : window.open(item.href, "_blank", "noopener,noreferrer")}>
                  <span className="commandKind">{item.kind}</span><span><b>{item.title}</b><small>{item.detail}</small></span><i>↗</i>
                </button>
              ))}
              {!paletteItems.length && <p className="commandEmpty">No matching skills or sources.</p>}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
