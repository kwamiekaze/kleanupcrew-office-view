import { createFileRoute } from "@tanstack/react-router";
import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { RigInput } from "@/components/office/CameraRig";
import { QuoteDrawer } from "@/components/kleanup/QuoteDrawer";
import { useAmbientAudio } from "@/lib/use-ambient-audio";
import { TRUST_CHIPS, VIEWS, type ViewId } from "@/lib/kleanup-content";

const OfficeCanvas = lazy(() => import("@/components/kleanup/OfficeCanvas"));

const TITLE = "KleanupCrew — Clean it. Clear it. Care for it.";
const DESC =
  "KleanupCrew connects property owners with insured local crews for cleaning, junk removal, lawn care, tree work and curb-appeal property care.";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const NAV = [
  { label: "Services", id: "cleaning" as ViewId },
  { label: "How It Works", id: "quote" as ViewId },
  { label: "For Providers", id: "junk" as ViewId },
  { label: "About", id: "welcome" as ViewId },
];

function Home() {
  const [activeId, setActiveId] = useState<ViewId>("welcome");
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const { enabled: soundOn, setEnabled: setSoundOn } = useAmbientAudio();

  const view = useMemo(
    () => VIEWS.find((v) => v.id === activeId) ?? VIEWS[0]!,
    [activeId],
  );

  const input = useRef<RigInput>({ dragX: 0, dragY: 0, zoom: 0 });
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const on = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", on);
    const t = window.setTimeout(() => setReady(true), 900);
    return () => {
      mq.removeEventListener("change", on);
      window.clearTimeout(t);
    };
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
  }, []);
  const endDrag = useCallback(() => {
    dragging.current = false;
  }, []);
  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = (e.clientX - last.current.x) / 400;
    const dy = (e.clientY - last.current.y) / 500;
    last.current = { x: e.clientX, y: e.clientY };
    const i = input.current;
    i.dragX = Math.max(-1, Math.min(1, i.dragX - dx));
    i.dragY = Math.max(-1, Math.min(1, i.dragY + dy));
  }, []);
  const onWheel = useCallback((e: React.WheelEvent) => {
    const i = input.current;
    i.zoom = Math.max(-1, Math.min(1, i.zoom + e.deltaY / 900));
  }, []);

  const select = useCallback((id: ViewId) => {
    setActiveId(id);
    input.current.dragX = 0;
    input.current.dragY = 0;
    input.current.zoom = 0;
  }, []);

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-forest-deep text-cream">
      {/* 3D stage */}
      <div
        className="absolute inset-0 touch-pan-y"
        onPointerDown={onPointerDown}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerMove={onPointerMove}
        onWheel={onWheel}
        aria-hidden="true"
      >
        <Suspense fallback={null}>
          <OfficeCanvas
            view={view}
            input={input}
            reducedMotion={reducedMotion}
          />
        </Suspense>
      </div>

      {/* loading screen */}
      <div
        className={`pointer-events-none absolute inset-0 z-40 flex items-center justify-center bg-forest-deep transition-opacity duration-700 ${
          ready ? "opacity-0" : "opacity-100"
        }`}
        aria-hidden={ready}
      >
        <div className="text-center">
          <p className="text-2xl font-semibold tracking-tight">KleanupCrew</p>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-cream/60">
            Opening the office
          </p>
        </div>
      </div>

      {/* top bar */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 p-4 sm:p-6">
        <div className="pointer-events-auto kc-glass rounded-2xl px-4 py-2.5">
          <p className="text-base font-semibold leading-tight tracking-tight sm:text-lg">
            Kleanup<span className="text-lime">Crew</span>
          </p>
          <p className="text-[10px] uppercase tracking-[0.18em] text-cream/65">
            Clean it. Clear it. Care for it.
          </p>
        </div>

        <nav
          aria-label="Primary"
          className="pointer-events-auto flex items-center gap-2"
        >
          <ul className="hidden items-center gap-1 kc-glass rounded-full px-2 py-1.5 lg:flex">
            {NAV.map((n) => (
              <li key={n.label}>
                <button
                  className="kc-focus rounded-full px-3 py-1.5 text-xs text-cream/85 hover:bg-cream/10"
                  onClick={() => select(n.id)}
                >
                  {n.label}
                </button>
              </li>
            ))}
          </ul>
          <button className="kc-btn" onClick={() => setQuoteOpen(true)}>
            Get a Free Quote
          </button>
        </nav>
      </header>

      {/* camera rail (desktop) */}
      <nav
        aria-label="Office views"
        className="absolute left-4 top-1/2 z-30 hidden w-52 -translate-y-1/2 kc-glass rounded-2xl p-2 md:block"
      >
        <p className="px-2 pb-1.5 pt-1 text-[10px] uppercase tracking-[0.2em] text-cream/55">
          Walk the office
        </p>
        <ul className="space-y-0.5">
          {VIEWS.map((v) => (
            <li key={v.id}>
              <button
                className="kc-rail-btn kc-focus"
                aria-current={v.id === activeId}
                onClick={() => select(v.id)}
              >
                <span className="idx">{v.index}</span>
                <span>{v.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* trust chips */}
      <ul className="absolute right-4 top-24 z-30 hidden space-y-1.5 text-right md:block">
        {TRUST_CHIPS.map((c) => (
          <li
            key={c}
            className="kc-glass inline-block rounded-full px-3 py-1 text-[11px] text-cream/85"
          >
            {c}
          </li>
        ))}
      </ul>

      {/* mute toggle */}
      <button
        onClick={() => setSoundOn(!soundOn)}
        aria-pressed={soundOn}
        aria-label={
          soundOn ? "Mute ambient office sound" : "Unmute ambient office sound"
        }
        className="kc-glass kc-focus absolute bottom-4 right-4 z-30 hidden rounded-full px-3.5 py-2 text-xs text-cream/85 md:block"
      >
        {soundOn ? "Sound on" : "Sound off"}
      </button>

      {/* active view panel */}
      <section
        aria-live="polite"
        className="absolute inset-x-0 bottom-20 z-30 mx-auto w-[min(44rem,calc(100%-2rem))] kc-glass rounded-2xl p-4 sm:p-5 md:bottom-6"
      >
        <p className="text-[10px] uppercase tracking-[0.22em] text-lime">
          {view.index} · {view.label}
        </p>
        <h1 className="mt-1.5 text-lg font-semibold leading-snug tracking-tight sm:text-xl">
          {view.title}
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-cream/75">
          {view.line}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button className="kc-btn" onClick={() => setQuoteOpen(true)}>
            {view.cta}
          </button>
          <span className="text-[11px] text-cream/50 md:hidden">
            Insured providers · Upfront estimates · Local crews
          </span>
        </div>
      </section>

      {/* mobile tab bar */}
      <nav
        aria-label="Office views"
        className="absolute inset-x-0 bottom-0 z-30 md:hidden"
      >
        <ul className="flex snap-x gap-1.5 overflow-x-auto px-3 py-3 [scrollbar-width:none]">
          {VIEWS.map((v) => (
            <li key={v.id} className="snap-start shrink-0">
              <button
                className="kc-rail-btn kc-focus kc-glass !w-auto rounded-full"
                aria-current={v.id === activeId}
                onClick={() => select(v.id)}
              >
                <span className="idx">{v.index}</span>
                <span>{v.label}</span>
              </button>
            </li>
          ))}
          <li className="snap-start shrink-0">
            <button
              onClick={() => setSoundOn(!soundOn)}
              aria-pressed={soundOn}
              aria-label={soundOn ? "Mute ambient sound" : "Unmute ambient sound"}
              className="kc-rail-btn kc-focus kc-glass !w-auto rounded-full"
            >
              {soundOn ? "Sound on" : "Sound off"}
            </button>
          </li>
        </ul>
      </nav>

      <QuoteDrawer
        open={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        service={activeId === "welcome" ? undefined : view.label}
      />
    </main>
  );
}
