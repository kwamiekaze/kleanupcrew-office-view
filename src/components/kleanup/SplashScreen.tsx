import { useCallback, useEffect, useRef, useState } from "react";
import splashVideo from "@/assets/kleanupcrew-splash.mp4.asset.json";

export function SplashScreen({ onDismiss }: { onDismiss: () => void }) {
  const [leaving, setLeaving] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const play = v.play();
    if (play && typeof play.catch === "function") play.catch(() => {});
  }, []);

  const dismiss = useCallback(() => {
    if (leaving) return;
    videoRef.current?.pause();
    setLeaving(true);
    window.setTimeout(onDismiss, 560);
  }, [leaving, onDismiss]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        e.preventDefault();
        dismiss();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dismiss]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Tap to continue into the KleanupCrew office"
      onClick={dismiss}
      className={`kc-splash${leaving ? " kc-splash-leaving" : ""}`}
    >
      <video
        ref={videoRef}
        className="kc-splash-video"
        src={splashVideo.url}
        autoPlay
        muted
        playsInline
        onEnded={dismiss}
        preload="auto"
        disablePictureInPicture
        controls={false}
      />
      <p className="kc-splash-cta">Tap to continue</p>
    </div>
  );
}
