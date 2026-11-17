"use client";

import { useEffect, useRef, useState } from "react";
import { internalExperiments } from "./internal-experiments";
import styles from "./lab.module.css";

export type PlayerLabels = Record<"launch" | "restart" | "fullscreen" | "open" | "preparing" | "loading" | "frameHelp" | "loadError" | "screenError", string>;

type Props = {
  title: string;
  type: "iframe" | "external" | "internal";
  url?: string;
  component?: string;
  fullscreen: boolean;
  labels: PlayerLabels;
};

export function Launcher({ title, type, url, component, fullscreen, labels }: Props) {
  const stage = useRef<HTMLDivElement>(null);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<"idle" | "loading" | "loaded" | "error">("idle");
  const [screenError, setScreenError] = useState(false);
  const Internal = component ? internalExperiments[component] : undefined;
  const available = type === "internal" ? Boolean(Internal) : Boolean(url);
  const running = attempt > 0;
  const embedded = type !== "external";

  useEffect(() => {
    if (state !== "loading") return;
    const timer = window.setTimeout(() => setState("error"), 20000);
    return () => window.clearTimeout(timer);
  }, [state, attempt]);

  function launch() {
    setState(type === "iframe" ? "loading" : "loaded");
    setAttempt((value) => value + 1);
  }

  async function enterFullscreen() {
    setScreenError(false);
    try {
      if (!stage.current?.requestFullscreen) throw new Error("Fullscreen unavailable");
      await stage.current.requestFullscreen();
    } catch {
      setScreenError(true);
    }
  }

  return (
    <section aria-label={title}>
      <div ref={stage} className={styles.stage}>
        {running && type === "iframe" && state !== "error" && (
          <iframe key={attempt} title={title} src={url} sandbox="allow-scripts" referrerPolicy="no-referrer"
            allow={fullscreen ? "fullscreen" : undefined} allowFullScreen={fullscreen}
            onLoad={() => setState("loaded")} onError={() => setState("error")} />
        )}
        {running && type === "internal" && Internal && <Internal key={attempt} />}
        {(!running || state === "error") && (
          <div className={styles.stageMessage}>
            {!available && <p>{labels.preparing}</p>}
            {state === "error" && <p role="alert">{labels.loadError}</p>}
            {available && embedded && <button type="button" className="button primary" onClick={launch}>{running ? labels.restart : labels.launch}</button>}
            {available && type === "external" && url && <a className="button primary" href={url} target="_blank" rel="noopener noreferrer">{labels.open} ↗</a>}
          </div>
        )}
        {state === "loading" && <p className={styles.loading} role="status">{labels.loading}</p>}
      </div>
      {available && embedded && (
        <div className={styles.actions}>
          {running && state !== "error" && <button type="button" className="button secondary" onClick={launch}>{labels.restart}</button>}
          {running && fullscreen && state !== "error" && <button type="button" className="button secondary" onClick={enterFullscreen}>{labels.fullscreen}</button>}
          {url && <a className="button secondary" href={url} target="_blank" rel="noopener noreferrer">{labels.open} ↗</a>}
        </div>
      )}
      {running && type === "iframe" && state !== "error" && <p className={styles.note}>{labels.frameHelp}</p>}
      {screenError && <p role="alert">{labels.screenError}</p>}
    </section>
  );
}
