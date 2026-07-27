"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const commands = [
  { group: "Search", label: "Search Flexmls Help", detail: "Current product documentation", query: "Flexmls help documentation" },
  { group: "Search", label: "Check IDX Requirements", detail: "MLS rules and compliance", query: "IDX requirements MLS" },
  { group: "Search", label: "Find Product Guidance", detail: "SmartFrame, WordPress, API, and websites", query: "IDX product recommendation" },
  { group: "Search", label: "Troubleshoot an Error", detail: "Find approved troubleshooting guidance", query: "Flexmls IDX error troubleshooting" },
  { group: "Workflow", label: "Create Support Response", detail: "Find source material for a customer-ready response", query: "customer support response guidance" },
  { group: "Workflow", label: "Open Decision Trees", detail: "Browse guided internal workflows", href: "https://drive.google.com/drive/folders/1RkV5Ydd1jHC794ZCWt_kzYbRT0hOC2ke" },
  { group: "Navigate", label: "Go to Connected Sources", detail: "Review the platform knowledge layer", anchor: "sources" },
  { group: "Navigate", label: "Go to Activity", detail: "Review platform metrics and updates", anchor: "activity" }
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const visible = useMemo(() => {
    const normalized = filter.trim().toLowerCase();
    if (!normalized) return commands;
    return commands.filter((command) => `${command.label} ${command.detail} ${command.group}`.toLowerCase().includes(normalized));
  }, [filter]);

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, []);

  useEffect(() => {
    if (!open) return;
    setFilter("");
    setSelected(0);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }, [open]);

  useEffect(() => setSelected(0), [filter]);

  const run = (command: (typeof commands)[number]) => {
    setOpen(false);
    if (command.query) {
      window.dispatchEvent(new CustomEvent("run-platform-search", { detail: command.query }));
      window.setTimeout(() => document.getElementById("workspace")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    } else if (command.href) {
      window.open(command.href, "_blank", "noopener,noreferrer");
    } else if (command.anchor) {
      document.getElementById(command.anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!open) return <button className="commandLauncher" type="button" onClick={() => setOpen(true)} aria-label="Open command palette"><span>⌘</span><b>Search commands</b><kbd>⌘K</kbd></button>;

  return (
    <div className="commandBackdrop" role="presentation" onMouseDown={() => setOpen(false)}>
      <section className="commandPalette" role="dialog" aria-modal="true" aria-label="Command palette" onMouseDown={(event) => event.stopPropagation()}>
        <div className="commandSearch"><span>⌘</span><input ref={inputRef} value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Search skills, sources, and actions…" onKeyDown={(event) => {
          if (event.key === "ArrowDown") { event.preventDefault(); setSelected((current) => visible.length ? (current + 1) % visible.length : 0); }
          if (event.key === "ArrowUp") { event.preventDefault(); setSelected((current) => visible.length ? (current - 1 + visible.length) % visible.length : 0); }
          if (event.key === "Enter" && visible[selected]) { event.preventDefault(); run(visible[selected]); }
        }} /><kbd>ESC</kbd></div>
        <div className="commandResults">
          {visible.length ? visible.map((command, index) => <button type="button" className={index === selected ? "selected" : ""} key={command.label} onMouseEnter={() => setSelected(index)} onClick={() => run(command)}><span className="commandKind">{command.group}</span><span><b>{command.label}</b><small>{command.detail}</small></span><em>↗</em></button>) : <div className="commandEmpty">No matching commands</div>}
        </div>
        <footer className="commandFooter"><span>↑↓ Navigate</span><span>↵ Select</span><span>Esc Close</span></footer>
      </section>
    </div>
  );
}
