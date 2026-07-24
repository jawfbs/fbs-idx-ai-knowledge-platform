"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { knowledgeItems } from "../lib/data";

const GUIDE_URL = "https://docs.google.com/document/d/1FH0JT6n5Pc1aP-GBFMlql5EjBjWT5dsePGyo6YfysU8";

const quickCommands = [
  { title: "Search IDX requirements", detail: "Find MLS-specific requirements", query: "IDX requirements MLS" },
  { title: "Recommend an IDX product", detail: "Compare SmartFrame, WordPress, Website Concierge, and Spark API", query: "IDX product recommendation" },
  { title: "Troubleshoot missing listings", detail: "Open the missing-listings workflow", query: "missing listings troubleshooting" },
  { title: "Prepare an escalation", detail: "Collect evidence before escalating", query: "IDX escalation evidence" }
];

export default function PlatformControls() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const settingsRef = useRef<HTMLDivElement>(null);

  const paletteItems = useMemo(() => {
    const needle = paletteQuery.toLowerCase().trim();
    const commands = quickCommands.map((item) => ({ ...item, kind: "Command" as const }));
    const sources = knowledgeItems.map((item) => ({
      title: item.title,
      detail: `${item.status} ${item.type} · ${item.description}`,
      href: item.href,
      kind: "Source" as const
    }));
    return [...commands, ...sources].filter((item) => !needle || `${item.title} ${item.detail}`.toLowerCase().includes(needle)).slice(0, 10);
  }, [paletteQuery]);

  useEffect(() => {
    const handleKey = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(true);
      }
      if (event.key === "Escape") {
        setPaletteOpen(false);
        setSettingsOpen(false);
      }
    };
    const handlePointer = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) setSettingsOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("mousedown", handlePointer);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("mousedown", handlePointer);
    };
  }, []);

  const runQuery = (query: string) => {
    window.dispatchEvent(new CustomEvent("run-platform-search", { detail: query }));
    setPaletteOpen(false);
    setSettingsOpen(false);
  };

  const toggleTheme = () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("fbs-theme", next);
  };

  const clearHistory = () => {
    ["fbs-recent-searches", "fbs-search-counts", "fbs-recent-views"].forEach((key) => window.localStorage.removeItem(key));
    window.dispatchEvent(new Event("platform-storage-updated"));
    setSettingsOpen(false);
  };

  return (
    <>
      <div className="settingsWrap" ref={settingsRef}>
        <button className="settingsButton" type="button" aria-label="Open settings" aria-expanded={settingsOpen} onClick={() => setSettingsOpen((open) => !open)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.12 2.12-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.55V20.3h-3v-.09a1.7 1.7 0 0 0-1.03-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06-2.12-2.12.06-.06A1.7 1.7 0 0 0 7 15a1.7 1.7 0 0 0-1.55-1.03H5.3v-3h.15A1.7 1.7 0 0 0 7 9.94a1.7 1.7 0 0 0-.34-1.88L6.6 8l2.12-2.12.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 11.7 4.7V4.6h3v.1a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06L19.8 8l-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.55 1.03h.15v3h-.15A1.7 1.7 0 0 0 19.4 15Z"/></svg>
        </button>
        {settingsOpen && (
          <div className="settingsMenu" role="menu" aria-label="Platform actions">
            <button className="settingsAction" type="button" aria-label="Watch Intro" data-label="Watch Intro" onClick={() => window.dispatchEvent(new Event("open-welcome-video"))}><span aria-hidden="true">▶</span></button>
            <button className="settingsAction" type="button" aria-label="Command Palette" data-label="Command Palette · ⌘K" onClick={() => { setPaletteOpen(true); setSettingsOpen(false); }}><span aria-hidden="true">⌘</span></button>
            <button className="settingsAction" type="button" aria-label="Focus Search" data-label="Focus Search · /" onClick={() => { window.dispatchEvent(new Event("focus-platform-search")); setSettingsOpen(false); }}><span aria-hidden="true">⌕</span></button>
            <button className="settingsAction" type="button" aria-label="Toggle Theme" data-label="Toggle Theme" onClick={toggleTheme}><span aria-hidden="true">◐</span></button>
            <a className="settingsAction" href={GUIDE_URL} target="_blank" rel="noreferrer" aria-label="Open Platform Guide" data-label="Platform Guide"><span aria-hidden="true">?</span></a>
            <button className="settingsAction settingsActionDanger" type="button" aria-label="Clear Local History" data-label="Clear Local History" onClick={clearHistory}><span aria-hidden="true">↻</span></button>
          </div>
        )}
      </div>

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
