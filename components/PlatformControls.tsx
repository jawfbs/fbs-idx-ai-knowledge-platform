"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { knowledgeItems } from "../lib/data";

const GUIDE_URL = "https://docs.google.com/document/d/1FH0JT6n5Pc1aP-GBFMlql5EjBjWT5dsePGyo6YfysU8";

const colors = [
  ["blue", "Blue", "#2563eb"],
  ["violet", "Violet", "#7c3aed"],
  ["cyan", "Cyan", "#0891b2"],
  ["teal", "Teal", "#0f766e"],
  ["green", "Green", "#16a34a"],
  ["lime", "Lime", "#65a30d"],
  ["amber", "Amber", "#d97706"],
  ["orange", "Orange", "#ea580c"],
  ["rose", "Rose", "#e11d48"],
  ["slate", "Slate", "#475569"],
] as const;

const positions = [
  { id: "top-left", label: "Top Left" },
  { id: "top-right", label: "Top Right" },
  { id: "bottom-left", label: "Bottom Left" },
  { id: "bottom-right", label: "Bottom Right" },
] as const;

type OrbPosition = (typeof positions)[number]["id"];

const quickCommands = [
  { title: "Search IDX requirements", detail: "Find MLS-specific requirements", query: "IDX requirements MLS" },
  { title: "Recommend an IDX product", detail: "Compare SmartFrame, WordPress, Website Concierge, and Spark API", query: "IDX product recommendation" },
  { title: "Troubleshoot missing listings", detail: "Open the missing-listings workflow", query: "missing listings troubleshooting" },
  { title: "Prepare an escalation", detail: "Collect evidence before escalating", query: "IDX escalation evidence" },
];

type IconName = "sliders" | "close" | "play" | "search" | "keyboard" | "book" | "trash" | "arrow" | "check";

type SettingRowProps = {
  icon: IconName;
  title: string;
  detail: string;
  meta?: ReactNode;
  danger?: boolean;
  onClick?: () => void;
  href?: string;
};

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    sliders: (
      <>
        <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
        <circle cx="16" cy="7" r="2" />
        <circle cx="8" cy="17" r="2" />
      </>
    ),
    close: <path d="m7 7 10 10M17 7 7 17" />,
    play: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m10 8 6 4-6 4Z" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="6" />
        <path d="m16 16 4 4" />
      </>
    ),
    keyboard: (
      <>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M7 10h.01M11 10h.01M15 10h.01M19 10h.01M7 14h8M17 14h2" />
      </>
    ),
    book: (
      <>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5Z" />
        <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5A2.5 2.5 0 0 1 20 21.5Z" />
      </>
    ),
    trash: (
      <>
        <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" />
      </>
    ),
    arrow: <path d="M7 17 17 7M9 7h8v8" />,
    check: <path d="m7 12 3 3 7-7" />,
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function SettingRow({ icon, title, detail, meta, danger, onClick, href }: SettingRowProps) {
  const content = (
    <>
      <span className="settingsIcon">
        <Icon name={icon} />
      </span>
      <span className="settingsCopy">
        <strong>{title}</strong>
        <small>{detail}</small>
      </span>
      {meta && <span className="settingsMeta">{meta}</span>}
    </>
  );

  if (href) {
    return (
      <a className={`settingsRow${danger ? " settingsDanger" : ""}`} href={href} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  }

  return (
    <button className={`settingsRow${danger ? " settingsDanger" : ""}`} type="button" onClick={onClick}>
      {content}
    </button>
  );
}

export default function PlatformControls() {
  const [open, setOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [accent, setAccent] = useState("blue");
  const [orbPosition, setOrbPosition] = useState<OrbPosition>("bottom-right");
  const panelRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const paletteItems = useMemo(() => {
    const needle = paletteQuery.toLowerCase().trim();
    const commands = quickCommands.map((item) => ({ ...item, kind: "Command" as const }));
    const sources = knowledgeItems.map((item) => ({
      title: item.title,
      detail: `${item.status} ${item.type} · ${item.description}`,
      href: item.href,
      kind: "Source" as const,
    }));
    return [...commands, ...sources]
      .filter((item) => !needle || `${item.title} ${item.detail}`.toLowerCase().includes(needle))
      .slice(0, 10);
  }, [paletteQuery]);

  useEffect(() => {
    const savedAccent = window.localStorage.getItem("fbs-accent") || "blue";
    const savedPosition = (window.localStorage.getItem("fbs-orb-position") as OrbPosition) || "bottom-right";

    document.documentElement.dataset.theme = "light";
    document.documentElement.dataset.accent = savedAccent;
    window.localStorage.setItem("fbs-theme", "light");

    setAccent(savedAccent);
    setOrbPosition(savedPosition);

    const handleKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(true);
      }
      if (event.key === "Escape") {
        setPaletteOpen(false);
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const firstControl = panelRef.current?.querySelector<HTMLElement>("button, a");
    firstControl?.focus();
  }, [open]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 2200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const closePanel = () => {
    setOpen(false);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  };

  const runQuery = (query: string) => {
    window.dispatchEvent(new CustomEvent("run-platform-search", { detail: query }));
    setPaletteOpen(false);
  };

  const chooseAccent = (name: string) => {
    setAccent(name);
    document.documentElement.dataset.accent = name;
    window.localStorage.setItem("fbs-accent", name);
    setNotice(`${name[0].toUpperCase()}${name.slice(1)} color selected`);
  };

  const choosePosition = (pos: OrbPosition) => {
    setOrbPosition(pos);
    window.localStorage.setItem("fbs-orb-position", pos);
    setNotice(`Button moved to ${pos.replace("-", " ")}`);
  };

  const clearHistory = () => {
    ["fbs-recent-searches", "fbs-search-counts", "fbs-recent-views"].forEach((key) =>
      window.localStorage.removeItem(key)
    );
    window.dispatchEvent(new Event("platform-storage-updated"));
    setNotice("Local history cleared");
  };

  return (
    <>
      <div className={`settingsWrap position-${orbPosition}`}>
        {!open && (
          <button
            ref={triggerRef}
            className="controlOrb"
            type="button"
            aria-label="Customize platform"
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Icon name="sliders" />
          </button>
        )}

        {open && (
          <>
            <div className="settingsBackdrop" onClick={closePanel} />
            <aside
              ref={panelRef}
              className="settingsPanel"
              role="dialog"
              aria-modal="true"
              aria-label="Settings"
            >
              <button className="settingsClose" type="button" aria-label="Close" onClick={closePanel}>
                <Icon name="close" />
              </button>

              <section className="settingsSection" aria-labelledby="accent-heading">
                <h2 id="accent-heading" className="settingsSectionTitle">
                  Accent color
                </h2>
                <div className="colorGrid" aria-label="Platform accent color">
                  {colors.map(([name, label, hex]) => (
                    <button
                      key={name}
                      className={`colorChoice${accent === name ? " is-selected" : ""}`}
                      style={{ "--swatch": hex } as CSSProperties}
                      type="button"
                      aria-label={`${label} accent`}
                      aria-pressed={accent === name}
                      onClick={() => chooseAccent(name)}
                    >
                      {accent === name && <Icon name="check" />}
                    </button>
                  ))}
                </div>
              </section>

              <section className="settingsSection" aria-labelledby="position-heading">
                <h2 id="position-heading" className="settingsSectionTitle">
                  Button position
                </h2>
                <div className="positionGrid">
                  {positions.map((pos) => (
                    <button
                      key={pos.id}
                      type="button"
                      className={`positionChoice${orbPosition === pos.id ? " is-selected" : ""}`}
                      onClick={() => choosePosition(pos.id)}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </section>

              <section className="settingsSection" aria-labelledby="workspace-heading">
                <h2 id="workspace-heading" className="settingsSectionTitle">
                  Workspace
                </h2>
                <div className="settingsList">
                  <SettingRow
                    icon="search"
                    title="Focus search"
                    detail="Jump to the question field"
                    meta={<kbd>/</kbd>}
                    onClick={() => window.dispatchEvent(new Event("focus-platform-search"))}
                  />
                  <SettingRow
                    icon="keyboard"
                    title="Command palette"
                    detail="Search actions, skills, and sources"
                    meta={<kbd>⌘K</kbd>}
                    onClick={() => setPaletteOpen(true)}
                  />
                  <SettingRow
                    icon="play"
                    title="Watch introduction"
                    detail="Replay the platform overview"
                    meta="Play"
                    onClick={() => window.dispatchEvent(new Event("open-welcome-video"))}
                  />
                  <SettingRow
                    icon="book"
                    title="Platform guide"
                    detail="Open usage guidance"
                    meta={<Icon name="arrow" />}
                    href={GUIDE_URL}
                  />
                </div>
              </section>

              <section className="settingsSection" aria-labelledby="advanced-heading">
                <h2 id="advanced-heading" className="settingsSectionTitle">
                  Advanced
                </h2>
                <div className="settingsList">
                  <SettingRow
                    icon="trash"
                    title="Clear local history"
                    detail="Remove recent searches and views"
                    meta="Clear"
                    danger
                    onClick={clearHistory}
                  />
                </div>
              </section>
            </aside>
          </>
        )}
      </div>

      {notice && (
        <div className="platformNotice" role="status" aria-live="polite">
          {notice}
        </div>
      )}

      {paletteOpen && (
        <div
          className="commandOverlay"
          role="presentation"
          onMouseDown={(event) => event.target === event.currentTarget && setPaletteOpen(false)}
        >
          <section className="commandPalette" role="dialog" aria-modal="true" aria-label="Command palette">
            <div className="commandSearch">
              <Icon name="search" />
              <input
                autoFocus
                value={paletteQuery}
                onChange={(event) => setPaletteQuery(event.target.value)}
                placeholder="Search skills, sources, and actions…"
              />
              <kbd>Esc</kbd>
            </div>
            <div className="commandList">
              {paletteItems.map((item) => (
                <button
                  key={`${item.kind}-${item.title}`}
                  type="button"
                  onClick={() =>
                    "query" in item
                      ? runQuery(item.query)
                      : window.open(item.href, "_blank", "noopener,noreferrer")
                  }
                >
                  <span className="commandKind">{item.kind}</span>
                  <span>
                    <b>{item.title}</b>
                    <small>{item.detail}</small>
                  </span>
                  <i>
                    <Icon name="arrow" />
                  </i>
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
