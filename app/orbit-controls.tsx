"use client";

import { useState } from "react";

export function OrbitControls({ play, pause }: { play: string; pause: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <button
      type="button"
      className="orbit-controls button secondary"
      aria-controls="core-scene"
      data-playing={playing}
      onClick={() => setPlaying(!playing)}
    >
      {playing ? pause : play}
    </button>
  );
}
