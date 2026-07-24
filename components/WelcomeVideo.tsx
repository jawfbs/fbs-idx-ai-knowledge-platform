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

    const shouldHide =
      window.localStorage.getItem(STORAGE_KEY) === "true";

    if (!shouldHide) {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeModal();
      }
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
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

  const modal =
    isMounted && isOpen
      ? createPortal(
          <div
            className="videoOverlay"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeModal();
              }
            }}
          >
            <section
              className="videoModal"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
            >
              <div className="videoModalHeader">
                <div>
                  <div className="eyebrow">START HERE</div>

                  <h2 id={titleId}>
                    FBS IDX AI Knowledge Platform
                  </h2>
                </div>

                <button
                  className="modalClose"
                  type="button"
                  onClick={closeModal}
                  aria-label="Close video"
                >
                  ×
                </button>
              </div>

              <div className="videoFrame">
  <video
    controls
    autoPlay
    playsInline
    style={{
      width: "100%",
      height: "100%",
      border: "none"
    }}
  >
    <source src="/intro.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</div>

              <div className="videoModalFooter">
                <label className="dontShowAgain">
                  <input
                    type="checkbox"
                    checked={dontShowAgain}
                    onChange={(event) =>
                      setDontShowAgain(event.target.checked)
                    }
                  />

                  Don&apos;t show again
                </label>

                <button
                  className="modalDone"
                  type="button"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </section>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <div className="heroActions">
        <button
          className="videoButton"
          type="button"
          onClick={openModal}
          aria-haspopup="dialog"
        >
          <span aria-hidden="true">▶</span>
          Watch intro
        </button>

        <span className="aiReady">AI Ready</span>
      </div>

      {modal}
    </>
  );
}
