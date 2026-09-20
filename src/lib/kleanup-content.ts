import { BRAND_SLOGAN } from "./brand.ts";

export type ViewId = "welcome" | "cleaning" | "lawn" | "junk" | "tree" | "quote";

export interface OfficeView {
  id: ViewId;
  index: string;
  label: string;
  title: string;
  line: string;
  cta: string;
  /** camera position */
  pos: [number, number, number];
  /** look-at target */
  target: [number, number, number];
  /** optional responsive camera overrides */
  mobilePos?: [number, number, number];
  mobileTarget?: [number, number, number];
  fov?: number;
  mobileFov?: number;
  horizontalFov?: number;
}

export const VIEWS: OfficeView[] = [
  {
    id: "welcome",
    index: "01",
    label: "Welcome",
    title: BRAND_SLOGAN,
    line: "KleanupCrew connects you with local, insured crews who clean it, clear it, maintain it and improve the property.",
    cta: "Make this property look good again",
    // Aimed a little higher than the room's centre, so the view tips down and
    // the whole sun clears the top of the window frame.
    pos: [0, 3.1, 7.6],
    target: [0, 1.56, -1.2],
    mobilePos: [0, 3.1, 7.35],
    mobileTarget: [0, 1.28, -1.2],
  },
  {
    id: "lawn",
    index: "02",
    label: "Lawn Care",
    title: "Lawn & yard maintenance",
    line: "Mowing, edging, trimming, leaf and yard cleanup, hedge shaping and brush clearing on a one-off or recurring schedule.",
    cta: "Set up lawn service",
    // Square on to the lawn board, close enough to read every tool and low
    // enough to keep the mower's wheels on screen.
    pos: [1.44, 2.83, 1.0],
    target: [-5.38, 1.12, 1.78],
    horizontalFov: 44,
  },
  {
    id: "tree",
    index: "03",
    label: "Tree & Yard",
    title: "Tree & heavy yard work",
    line: "Trimming, pruning, removal and stump grinding handled by qualified, equipped providers in your area.",
    cta: "Request a site visit",
    // Centres the tool board with the loppers, rake and spade at its foot.
    pos: [0.9, 2.75, 1.5],
    target: [-5.58, 1.45, -1.7],
    horizontalFov: 40,
  },
  {
    id: "cleaning",
    index: "04",
    label: "Home Cleaning",
    title: "Residential & commercial cleaning",
    line: "Standard, deep, recurring and move-in/move-out cleans, rental turnovers, carpet, upholstery, window, gutter and pressure washing.",
    cta: "Book a cleaning estimate",
    // Was set back across the whole room; now it stands in front of the supply
    // shelf so the bottles, rolls, bucket and caddy are all legible.
    pos: [-0.8, 2.4, 2.9],
    target: [5.1, 1.42, -1.05],
    horizontalFov: 44,
  },
  {
    id: "junk",
    index: "05",
    label: "Junk Removal",
    title: "Junk removal & cleanouts",
    line: "Bulk-item pickup, property, garage and estate cleanouts, plus non-hazardous renovation debris hauled away in one visit.",
    cta: "Get a haul-away price",
    // Wider and tipped down, so the hand truck, cartons, bags, bin and offcuts
    // all sit in frame with floor beneath them instead of bare wall above.
    pos: [-1.8, 2.72, 5.95],
    target: [5.32, 0.78, 3.5],
    horizontalFov: 31,
  },
  {
    id: "quote",
    index: "06",
    label: "Get a Quote",
    title: "Property prep & curb appeal",
    line: "Tell us about the property once — we match the right crews for prep packages, curb appeal and recurring property care.",
    cta: "Start a free quote",
    pos: [0, 1.95, 1.3],
    target: [0, 1.25, -2.3],
  },
];

export const SERVICE_OPTIONS = [
  "Home or office cleaning",
  "Deep / move-out clean",
  "Rental turnover",
  "Carpet, window or pressure washing",
  "Junk removal or cleanout",
  "Lawn mowing & yard care",
  "Tree trimming or removal",
  "Make this property look good again",
  "Other",
];

export const SERVICE_FOR_VIEW: Record<ViewId, string> = {
  welcome: SERVICE_OPTIONS[0]!,
  cleaning: "Home or office cleaning",
  lawn: "Lawn mowing & yard care",
  junk: "Junk removal or cleanout",
  tree: "Tree trimming or removal",
  quote: "Make this property look good again",
};

export const TRUST_CHIPS = ["Insured providers", "Upfront estimates", "Local crews"];
