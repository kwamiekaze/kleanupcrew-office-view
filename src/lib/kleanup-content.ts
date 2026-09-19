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
    pos: [0, 3.1, 7.6],
    target: [0, 1.5, -1.2],
  },
  {
    id: "lawn",
    index: "02",
    label: "Lawn Care",
    title: "Lawn & yard maintenance",
    line: "Mowing, edging, trimming, leaf and yard cleanup, hedge shaping and brush clearing on a one-off or recurring schedule.",
    cta: "Set up lawn service",
    pos: [0.25, 2.55, 4.9],
    target: [-5.25, 1.05, 1.85],
    horizontalFov: 45,
  },
  {
    id: "tree",
    index: "03",
    label: "Tree & Yard",
    title: "Tree & heavy yard work",
    line: "Trimming, pruning, removal and stump grinding handled by qualified, equipped providers in your area.",
    cta: "Request a site visit",
    pos: [0.9, 2.75, 1.5],
    target: [-5.5, 1.45, -1.85],
    horizontalFov: 42,
  },
  {
    id: "cleaning",
    index: "04",
    label: "Home Cleaning",
    title: "Residential & commercial cleaning",
    line: "Standard, deep, recurring and move-in/move-out cleans, rental turnovers, carpet, upholstery, window, gutter and pressure washing.",
    cta: "Book a cleaning estimate",
    pos: [-2.0, 2.7, 7.8],
    target: [5.15, 1.18, -2.0],
    horizontalFov: 34,
  },
  {
    id: "junk",
    index: "05",
    label: "Junk Removal",
    title: "Junk removal & cleanouts",
    line: "Bulk-item pickup, property, garage and estate cleanouts, plus non-hazardous renovation debris hauled away in one visit.",
    cta: "Get a haul-away price",
    pos: [-3.0, 2.8, 3.2],
    target: [5.35, 0.82, 3.2],
    horizontalFov: 24,
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
