"use client";

import { useEffect, useId, useState } from "react";

const STORAGE_KEY = "hideKnowledgePlatformWelcomeVideo";
const VIDEO_URL = "https://docs.google.com/videos/d/1E7uJrN4igWPchDzfqcPprOGslr2hDXVcAv5pV7HiIRE/preview";

export default function WelcomeVideo() {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (window.localStorage.getItem(STORAGE_KEY) !== "true") {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, dontShowAgain]);

  function openModal() {
    setDontShowAgain(false);
    setIsOpen(true);
  }

  function closeModal() {
    if (dontShowAgain) {
      window.localStorage.setItem(STORAGE_KEY, "true");
    }
    setIsOpen(false);
  }

  return (
    <>
      <div className="heroActions">
        <button className="videoButton" type="button" onClick={openModal} aria-haspopup="dialog">
          <span aria-hidden="true">▶</span>
          Watch intro
        </button>
        <span className="aiReady">AI Ready</span>
      </div>

      {isOpen && (
        <div className="videoOverlay" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeModal();
        }}>
          <section className="videoModal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
            <div className="videoModalHeader">
              <div>
                <div className="eyebrow">START HERE</div>
                <h2 id={titleId}>FBS IDX AI Knowledge Platform</h2>
              </div>
              <button className="modalClose" type="button" onClick={closeModal} aria-label="Close video">
                ×
              </button>
            </div>

            <div className="videoFrame">
              <iframe
                src={VIDEO_URL}
                title="FBS IDX AI Knowledge Platform introduction"
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="videoModalFooter">
              <label className="dontShowAgain">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(event) => setDontShowAgain(event.target.checked)}
                />
                Don&apos;t show again
              </label>
              <button className="modalDone" type="button" onClick={closeModal}>Close</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
