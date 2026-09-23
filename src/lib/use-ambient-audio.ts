import { useEffect, useRef, useState } from "react";

/**
 * Subtle synthesized ambience (soft air, outdoor hush) with no external assets.
 * Off by default; only starts after an explicit user gesture.
 */
export function useAmbientAudio() {
  const [enabled, setEnabled] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ src: AudioBufferSourceNode; gain: GainNode } | null>(
    null,
  );

  useEffect(() => {
    if (!enabled) {
      nodesRef.current?.gain.gain.setTargetAtTime(
        0,
        ctxRef.current?.currentTime ?? 0,
        0.3,
      );
      return;
    }

    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return;
    const ctx = ctxRef.current ?? new Ctor();
    ctxRef.current = ctx;
    void ctx.resume();

    if (!nodesRef.current) {
      const seconds = 4;
      const buffer = ctx.createBuffer(
        1,
        ctx.sampleRate * seconds,
        ctx.sampleRate,
      );
      const data = buffer.getChannelData(0);
      let last = 0;
      for (let i = 0; i < data.length; i++) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.015 * white) / 1.015;
        data[i] = last * 3.2;
      }
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 780;
      const gain = ctx.createGain();
      gain.gain.value = 0;
      src.connect(filter).connect(gain).connect(ctx.destination);
      src.start();
      nodesRef.current = { src, gain };
    }
    nodesRef.current.gain.gain.setTargetAtTime(0.05, ctx.currentTime, 0.8);
  }, [enabled]);

  useEffect(
    () => () => {
      nodesRef.current?.src.stop();
      void ctxRef.current?.close();
    },
    [],
  );

  return { enabled, setEnabled };
}
