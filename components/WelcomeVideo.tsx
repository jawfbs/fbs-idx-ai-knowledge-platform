"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

const STORAGE_KEY = "hideKnowledgePlatformWelcomeVideo";

export default function WelcomeVideo() {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const titleId = useId();

  useEffect(() => {
    setIsMounted(true);
    if (window.localStorage.getItem(STORAGE_KEY) !== "true") setIsOpen(true);
    const open = () => { setDontShowAgain(false); setIsOpen(true); };
    window.addEventListener("open-welcome-video", open);
    return () => window.removeEventListener("open-welcome-video", open);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && closeModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, dontShowAgain]);

  function closeModal() {
    if (dontShowAgain) window.localStorage.setItem(STORAGE_KEY, "true");
    setIsOpen(false);
  }

  if (!isMounted || !isOpen) return null;

  return createPortal(
    <div className="videoOverlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && closeModal()}>
      <section className="videoModal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="videoModalHeader">
          <div><div className="eyebrow">START HERE</div><h2 id={titleId}>FBS IDX AI Knowledge Platform</h2></div>
          <button className="modalClose" type="button" onClick={closeModal} aria-label="Close video">×</button>
        </div>
        <div className="videoFrame">
          <video controls autoPlay playsInline style={{ width: "100%", height: "100%", border: "none" }}>
            <source src="/intro.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="videoModalFooter">
          <label className="dontShowAgain"><input type="checkbox" checked={dontShowAgain} onChange={(event) => setDontShowAgain(event.target.checked)} />Don&apos;t show again</label>
          <button className="modalDone" type="button" onClick={closeModal}>Close</button>
        </div>
      </section>
    </div>,
    document.body
  );
}