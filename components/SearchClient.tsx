"use client";

import { useMemo, useState } from "react";
import { knowledgeItems } from "../lib/data";

export default function SearchClient() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return knowledgeItems;
    return knowledgeItems.filter((item) =>
      [item.title, item.type, item.description, ...item.tags].join(" ").toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <section>
      <div className="searchBox">
        <span aria-hidden="true">⌕</span>
        <input
          aria-label="Search the knowledge platform"
          placeholder="Search a customer question, MLS, product, workflow, or error…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <div className="resultGrid">
        {results.map((item) => (
          <a className="resultCard" href={item.href} key={item.title} target="_blank" rel="noreferrer">
            <div className="resultMeta">
              <span>{item.type}</span>
              <span>{item.status}</span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <div className="tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          </a>
        ))}
      </div>
    </section>
  );
}
