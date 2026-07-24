"use client";

export default function SearchLauncher() {
  return (
    <button
      type="button"
      className="launcherButton"
      onClick={() => window.dispatchEvent(new Event("focus-platform-search"))}
      aria-label="Focus platform search"
    >
      <span>Search knowledge</span>
      <kbd>⌘ K</kbd>
    </button>
  );
}
