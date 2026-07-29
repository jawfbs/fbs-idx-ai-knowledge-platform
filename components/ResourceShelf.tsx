"use client";

import { useEffect, useMemo, useState } from "react";
import { knowledgeItems } from "../lib/data";

type SavedResource = { title: string; href: string; type: string };

const pinnedDefaults: SavedResource[] = [
  { title: "IDX Requirements", href: "https://fbsdata.atlassian.net/wiki/spaces/BAS/pages/3473901/IDX+Requirements", type: "Confluence" },
  { title: "FBS Playbook", href: "https://fbsdata.atlassian.net/wiki/spaces/FBSPB/overview?homepageId=535658840", type: "Confluence" },
  { title: "IDX Product Recommendation", href: "https://docs.google.com/document/d/1KyvSOEOvsaXs3KyY0KVV87BHzuYU2dNl4PtHg8iMz88", type: "Decision Tree" },
  { title: "All Decision Trees", href: "https://drive.google.com/drive/folders/1RkV5Ydd1jHC794ZCWt_kzYbRT0hOC2ke", type: "Google Drive" },
  { title: "Platform Guide", href: "https://docs.google.com/document/d/1FH0JT6n5Pc1aP-GBFMlql5EjBjWT5dsePGyo6YfysU8", type: "Guide" }
];

export default function ResourceShelf() {
  const [recent, setRecent] = useState<SavedResource[]>([]);
  const [pinned, setPinned] = useState<SavedResource[]>(pinnedDefaults);

  useEffect(() => {
    const load = () => {
      try {
        const recentSaved = JSON.parse(window.localStorage.getItem("fbs-recent-views") || "[]");
        const pinnedSaved = JSON.parse(window.localStorage.getItem("fbs-pinned-resources") || "null");
        setRecent(Array.isArray(recentSaved) ? recentSaved.slice(0, 5) : []);
        setPinned(Array.isArray(pinnedSaved) ? pinnedSaved : pinnedDefaults);
      } catch {
        setRecent([]);
        setPinned(pinnedDefaults);
      }
    };
    load();
    window.addEventListener("platform-storage-updated", load);
    return () => window.removeEventListener("platform-storage-updated", load);
  }, []);

  const featured = useMemo(() => {
    const skills = knowledgeItems.filter((item) => item.type === "Skill" && item.status === "Approved");
    return skills[Math.floor(Date.now() / 86400000) % Math.max(skills.length, 1)];
  }, []);

  const togglePin = (resource: SavedResource) => {
    const exists = pinned.some((item) => item.href === resource.href);
    const next = exists ? pinned.filter((item) => item.href !== resource.href) : [...pinned, resource];
    setPinned(next);
    window.localStorage.setItem("fbs-pinned-resources", JSON.stringify(next));
  };

  return (
    <section className="resourceShelf" aria-label="Personalized resources">
      <article className="shelfCard featuredResource">
        <span className="sectionKicker">FEATURED TODAY</span>
        <h2>{featured?.title || "Explore approved skills"}</h2>
        <p>{featured?.description || "Browse approved workflows and reference material."}</p>
        {featured && <a href={featured.href} target="_blank" rel="noreferrer">Open featured skill <span>↗</span></a>}
      </article>

      <article className="shelfCard">
        <div className="shelfHeader"><div><span className="sectionKicker">PINNED</span><h2>Essential resources</h2></div><small>Saved on this device</small></div>
        <div className="shelfLinks">
          {pinned.map((item) => <div className="shelfLink" key={item.href}><a href={item.href} target="_blank" rel="noreferrer"><span><b>{item.title}</b><small>{item.type}</small></span><i>↗</i></a><button type="button" aria-label={`Unpin ${item.title}`} onClick={() => togglePin(item)}>×</button></div>)}
          {!pinned.length && <p className="shelfEmpty">No pinned resources yet.</p>}
        </div>
      </article>

      <article className="shelfCard">
        <div className="shelfHeader"><div><span className="sectionKicker">RECENT</span><h2>Recently viewed</h2></div>{recent.length > 0 && <button type="button" onClick={() => { window.localStorage.removeItem("fbs-recent-views"); setRecent([]); }}>Clear</button>}</div>
        <div className="shelfLinks">
          {recent.map((item) => <div className="shelfLink" key={item.href}><a href={item.href} target="_blank" rel="noreferrer"><span><b>{item.title}</b><small>{item.type}</small></span><i>↗</i></a><button type="button" aria-label={`Pin ${item.title}`} onClick={() => togglePin(item)}>{pinned.some((pin) => pin.href === item.href) ? "★" : "☆"}</button></div>)}
          {!recent.length && <p className="shelfEmpty">Opened search results will appear here automatically.</p>}
        </div>
      </article>
    </section>
  );
}