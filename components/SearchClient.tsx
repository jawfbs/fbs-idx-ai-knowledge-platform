"use client";

import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { KnowledgeItem, knowledgeItems } from "../lib/data";
import { calculateConfidence, inferSearchRoute, recordSearchEvent, updateSearchFeedback } from "../lib/analytics";

type Topic = "All" | "MLS Rules" | "IDX Products" | "Spark API" | "Troubleshooting" | "Sales" | "Internal";
type SuggestedQuestion = { topic: Exclude<Topic, "All">; question: string; search: string };
type Counts = Record<string, number>;

const topics: Topic[] = ["All", "MLS Rules", "IDX Products", "Spark API", "Troubleshooting", "Sales", "Internal"];
const suggestedQuestions: SuggestedQuestion[] = [
  { topic: "MLS Rules", question: "Can this MLS use SmartFrame?", search: "MLS eligibility SmartFrame" },
  { topic: "MLS Rules", question: "What are the IDX requirements for this MLS?", search: "MLS IDX requirements" },
  { topic: "IDX Products", question: "Which IDX product should I recommend?", search: "IDX product recommendation qualification" },
  { topic: "IDX Products", question: "What does SmartFrame include?", search: "SmartFrame features product" },
  { topic: "Spark API", question: "How do I authenticate with Spark API?", search: "Spark API authentication" },
  { topic: "Spark API", question: "Do I need public and private API access?", search: "Spark API public private access" },
  { topic: "Troubleshooting", question: "Why aren't the agent's listings displaying?", search: "missing agent listings troubleshooting" },
  { topic: "Troubleshooting", question: "Why did IDX authorization fail?", search: "IDX authorization failed troubleshooting" },
  { topic: "Sales", question: "What pricing options are available?", search: "IDX pricing annual brokerage sales" },
  { topic: "Sales", question: "Which product fits this customer's needs?", search: "sales product recommendation customer needs" },
  { topic: "Internal", question: "What is the new customer setup workflow?", search: "new customer setup workflow activation" },
  { topic: "Internal", question: "Where is the IDX Requirements document?", search: "IDX Requirements Confluence reference" }
];
const featuredSearches = [
  { label: "IDX Requirements", query: "IDX requirements MLS" },
  { label: "SmartFrame", query: "SmartFrame product eligibility" },
  { label: "Spark API", query: "Spark API" },
  { label: "Authorization", query: "IDX authorization approval" },
  { label: "Product Selection", query: "IDX product recommendation" }
];

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
function scoreItem(item: KnowledgeItem, query: string) {
  const terms = normalize(query).split(" ").filter(Boolean);
  if (!terms.length) return 0;
  const title = normalize(item.title);
  const tags = normalize(item.tags.join(" "));
  const description = normalize(item.description);
  const type = normalize(item.type);
  const searchable = `${title} ${tags} ${description} ${type}`;
  let score = 0;
  let matchedTerms = 0;
  for (const term of terms) {
    if (!searchable.includes(term)) continue;
    matchedTerms += 1;
    if (title === term) score += 30;
    else if (title.includes(term)) score += 12;
    if (tags.includes(term)) score += 7;
    if (type.includes(term)) score += 5;
    if (description.includes(term)) score += 3;
  }
  if (!matchedTerms) return 0;
  score += Math.round((matchedTerms / terms.length) * 15);
  if (title.includes(normalize(query))) score += 20;
  if (tags.includes(normalize(query))) score += 10;
  if (item.status === "Approved") score += 2;
  return score;
}
function sourceLabel(item: KnowledgeItem) {
  const url = item.href.toLowerCase();
  if (url.includes("atlassian.net")) return "Confluence";
  if (url.includes("sparkapi")) return "Spark API";
  if (url.includes("drive.google.com")) return "Google Drive";
  if (url.includes("docs.google.com")) return "Google Doc";
  return item.type;
}
function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${date}T12:00:00`));
}

export default function SearchClient() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [submittedLabel, setSubmittedLabel] = useState("");
  const [activeTopic, setActiveTopic] = useState<Topic>("All");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchCounts, setSearchCounts] = useState<Counts>({});
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [copied, setCopied] = useState(false);
  const [analyticsId, setAnalyticsId] = useState("");
  const [feedback, setFeedback] = useState<"positive" | "negative" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scoredResults = useMemo(() => !submittedQuery.trim() ? [] : knowledgeItems
    .map((item) => ({ item, score: scoreItem(item, submittedQuery) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.item.updated.localeCompare(a.item.updated)), [submittedQuery]);
  const results = scoredResults.map(({ item }) => item);
  const trending = useMemo(() => Object.entries(searchCounts).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([label]) => label), [searchCounts]);
  const visibleSuggestions = useMemo(() => activeTopic === "All" ? suggestedQuestions.slice(0, 6) : suggestedQuestions.filter((item) => item.topic === activeTopic).slice(0, 6), [activeTopic]);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem("fbs-recent-searches") || "[]");
      const counts = JSON.parse(window.localStorage.getItem("fbs-search-counts") || "{}");
      setRecentSearches(Array.isArray(saved) ? saved.slice(0, 5) : []);
      setSearchCounts(counts && typeof counts === "object" ? counts : {});
    } catch { /* optional local history */ }
    const focus = () => inputRef.current?.focus();
    const run = (event: Event) => runSearch((event as CustomEvent<string>).detail);
    window.addEventListener("focus-platform-search", focus);
    window.addEventListener("run-platform-search", run);
    return () => {
      window.removeEventListener("focus-platform-search", focus);
      window.removeEventListener("run-platform-search", run);
    };
  }, []);

  const saveSearch = (value: string) => {
    const updated = [value, ...recentSearches.filter((item) => item.toLowerCase() !== value.toLowerCase())].slice(0, 5);
    const counts = { ...searchCounts, [value]: (searchCounts[value] || 0) + 1 };
    setRecentSearches(updated);
    setSearchCounts(counts);
    window.localStorage.setItem("fbs-recent-searches", JSON.stringify(updated));
    window.localStorage.setItem("fbs-search-counts", JSON.stringify(counts));
  };

  const runSearch = (value = query, label = value) => {
    const started = performance.now();
    const cleaned = value.trim();
    const cleanedLabel = label.trim();
    if (!cleaned) return;
    const ranked = knowledgeItems.map((item) => ({ item, score: scoreItem(item, cleaned) })).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score);
    const topSource = ranked[0] ? sourceLabel(ranked[0].item) : undefined;
    const route = inferSearchRoute(cleanedLabel, topSource);
    const confidence = calculateConfidence(ranked.length, ranked[0]?.score || 0);
    const responseTimeMs = Math.max(1, Math.round(performance.now() - started));
    const id = recordSearchEvent({
      question: cleanedLabel,
      normalizedQuery: cleaned,
      skillUsed: route.skillUsed,
      connector: route.connector,
      confidence,
      responseTimeMs,
      resultCount: ranked.length,
      answered: ranked.length > 0
    });
    setAnalyticsId(id);
    setFeedback(null);
    setQuery(cleanedLabel);
    setSubmittedQuery(cleaned);
    setSubmittedLabel(cleanedLabel);
    setSelectedSuggestion(-1);
    saveSearch(cleanedLabel);
  };

  const clearSearch = () => {
    setQuery(""); setSubmittedQuery(""); setSubmittedLabel(""); setAnalyticsId(""); setFeedback(null); setSelectedSuggestion(-1);
    inputRef.current?.focus();
  };
  const submitFeedback = (value: "positive" | "negative") => {
    if (!analyticsId) return;
    updateSearchFeedback(analyticsId, value);
    setFeedback(value);
  };
  const copyPrompt = async () => {
    await navigator.clipboard.writeText(`Use the FBS AI Knowledge Platform to answer: ${submittedLabel}. Prioritize approved sources and verify changing facts before customer-facing use.`);
    setCopied(true); window.setTimeout(() => setCopied(false), 1600);
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") return clearSearch();
    if (!submittedQuery && visibleSuggestions.length) {
      if (event.key === "ArrowDown") { event.preventDefault(); setSelectedSuggestion((current) => (current + 1) % visibleSuggestions.length); }
      else if (event.key === "ArrowUp") { event.preventDefault(); setSelectedSuggestion((current) => current <= 0 ? visibleSuggestions.length - 1 : current - 1); }
      else if (event.key === "Enter" && selectedSuggestion >= 0) { event.preventDefault(); const item = visibleSuggestions[selectedSuggestion]; runSearch(item.search, item.question); }
    }
  };

  return (
    <section className="searchExperience" aria-label="Search the knowledge platform">
      <div className="featuredSkills"><span className="popularLabel">Popular</span>{featuredSearches.map((item) => <button key={item.label} type="button" onClick={() => runSearch(item.query, item.label)}>{item.label}</button>)}</div>
      <form className="searchBox" onSubmit={(event: FormEvent) => { event.preventDefault(); runSearch(); }} role="search">
        <span className="searchIcon" aria-hidden="true">⌕</span>
        <input ref={inputRef} aria-label="Search the knowledge platform" placeholder="Ask a customer question, MLS, product, workflow, or error…" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={handleKeyDown}/>
        {query && <button className="clearButton" type="button" onClick={clearSearch}>×</button>}
        <button className="searchButton" type="submit">Ask FBS AI</button>
      </form>
      <p className="searchHint">Press Enter to search · / focuses search · ⌘K opens commands · Esc clears</p>

      {!submittedQuery && <div className="emptyState">
        <div className="emptyStateHeader"><span className="sectionKicker">PROMPT LIBRARY</span><h2>What can I help you find?</h2><p>Choose a topic or start with a guided question.</p></div>
        <div className="topicCards">{topics.map((topic) => <button key={topic} type="button" className={activeTopic === topic ? "active" : ""} onClick={() => setActiveTopic(topic)}>{topic}</button>)}</div>
        <div className="suggestionGrid">{visibleSuggestions.map((suggestion, index) => <button type="button" className={selectedSuggestion === index ? "suggestionCard selected" : "suggestionCard"} key={suggestion.question} onClick={() => runSearch(suggestion.search, suggestion.question)}><span>{suggestion.topic}</span><strong>{suggestion.question}</strong><small>Ask FBS AI ↗</small></button>)}</div>
        {(recentSearches.length > 0 || trending.length > 0) && <div className="historyGrid">
          {recentSearches.length > 0 && <div className="recentSearches"><div className="recentHeader"><h3>Recent searches</h3></div><div className="recentChips">{recentSearches.map((item) => <button type="button" key={item} onClick={() => runSearch(item)}>{item}</button>)}</div></div>}
          {trending.length > 0 && <div className="recentSearches"><div className="recentHeader"><h3>Frequently searched</h3></div><div className="recentChips">{trending.map((item) => <button type="button" key={item} onClick={() => runSearch(item)}>{item}</button>)}</div></div>}
        </div>}
      </div>}

      {submittedQuery && <div className="searchResults" aria-live="polite">
        <div className="resultsHeader"><div><span className="sectionKicker">Search results</span><h2>{results.length ? `${results.length} relevant source${results.length === 1 ? "" : "s"}` : "No matching sources"}</h2><p>Results for “{submittedLabel}” are ranked across approved knowledge.</p></div><div className="resultActions"><button type="button" onClick={copyPrompt}>{copied ? "Copied" : "Copy prompt"}</button><button type="button" onClick={clearSearch}>New search</button></div></div>
        {results.length > 0 ? <div className="resultGrid">{results.map((item) => <a className="resultCard" href={item.href} key={item.title} target="_blank" rel="noreferrer"><div className="resultMeta"><span className={`status status-${item.status.toLowerCase().replace(" ", "-")}`}>{item.status}</span><span>{sourceLabel(item)}</span></div><h3>{item.title}</h3><p>{item.description}</p><div className="tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="openSource"><span>Updated {formatDate(item.updated)}</span><b>Open source ↗</b></div></a>)}</div> : <div className="noResults"><h3>Try a broader search</h3><p>This question was logged as unanswered for documentation review.</p><button type="button" onClick={clearSearch}>View suggested questions</button></div>}
        <div className="resultActions" aria-label="Search feedback"><span>Was this search useful?</span><button type="button" aria-pressed={feedback === "positive"} onClick={() => submitFeedback("positive")}>👍 Helpful</button><button type="button" aria-pressed={feedback === "negative"} onClick={() => submitFeedback("negative")}>👎 Not helpful</button><a href="/analytics">View analytics</a></div>
      </div>}
    </section>
  );
}
