import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";
import { BRAND_SLOGAN } from "@/lib/brand";

/**
 * The dashboard on the office monitor: the KleanupCrew masthead over a painted
 * front-garden scene, with the visitor's real local date and time on a card and
 * the four service lines below it.
 *
 * The whole picture is 2D canvas work at screen resolution, repainted on the
 * minute, so the clock is true and the page still downloads nothing for it.
 *
 * The painter and its dimensions are exported so the same artwork can back a
 * sign-in or preview screen elsewhere on the site: size a canvas to
 * SCREEN_WIDTH by SCREEN_HEIGHT, call paintScreen(context, new Date()), and
 * repaint it each minute.
 */

export const SCREEN_WIDTH = 1600;
export const SCREEN_HEIGHT = 870;

const TEXTURE_WIDTH = SCREEN_WIDTH;
const TEXTURE_HEIGHT = SCREEN_HEIGHT;

const FOREST = "#14502f";
const FOREST_SOFT = "#1d5f39";
const LIME = "#6fbf3b";
const GOLD = "#c9a24a";
const MUTED = "#4a6b52";

const SANS = '"Helvetica Neue", Helvetica, Arial, sans-serif';

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const SERVICES = ["CLEANING", "LAWN CARE", "JUNK REMOVAL", "PROPERTY CARE"] as const;

function setTracking(context: CanvasRenderingContext2D, value: string) {
  // Supported by current engines; ignored elsewhere, which only costs tracking.
  const typed = context as CanvasRenderingContext2D & { letterSpacing?: string };
  if ("letterSpacing" in typed) typed.letterSpacing = value;
}

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

/** A stack of short words, one per line, used for the corner captions. */
function drawCaption(
  context: CanvasRenderingContext2D,
  lines: string[],
  x: number,
  y: number,
  align: CanvasTextAlign,
  color: string,
  size = 21,
) {
  context.save();
  context.fillStyle = color;
  context.textAlign = align;
  context.textBaseline = "alphabetic";
  context.font = `600 ${size}px ${SANS}`;
  setTracking(context, "3px");
  lines.forEach((line, index) => {
    context.fillText(line, x, y + index * (size * 1.72));
  });
  setTracking(context, "0px");
  context.restore();
}

function drawLeaf(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  length: number,
  angle: number,
  color: string,
) {
  context.save();
  context.translate(x, y);
  context.rotate(angle);
  context.fillStyle = color;
  context.beginPath();
  context.moveTo(0, 0);
  context.quadraticCurveTo(length * 0.55, -length * 0.44, length, 0);
  context.quadraticCurveTo(length * 0.55, length * 0.44, 0, 0);
  context.fill();
  context.restore();
}

/** Soft rolling hills behind the lawn. */
function drawHills(context: CanvasRenderingContext2D) {
  const bands: Array<[number, number, string]> = [
    [470, 120, "#cfe0c4"],
    [508, 96, "#b9d5ac"],
    [548, 78, "#a6cb96"],
  ];
  for (const [baseline, rise, color] of bands) {
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(-40, baseline + rise);
    context.quadraticCurveTo(200, baseline - rise * 0.9, 520, baseline);
    context.quadraticCurveTo(820, baseline + rise * 0.7, 1120, baseline - rise * 0.5);
    context.quadraticCurveTo(1400, baseline - rise, TEXTURE_WIDTH + 40, baseline + rise * 0.2);
    context.lineTo(TEXTURE_WIDTH + 40, baseline + rise * 2.4);
    context.lineTo(-40, baseline + rise * 2.4);
    context.closePath();
    context.fill();
  }
}

/** Distant tree line, drawn as overlapping crowns so it reads as planting. */
function drawTreeLine(context: CanvasRenderingContext2D) {
  const crowns: Array<[number, number, number, string]> = [
    [120, 520, 74, "#79b26a"],
    [210, 536, 58, "#6aa65e"],
    [296, 524, 66, "#84bb72"],
    [1250, 512, 70, "#78b169"],
    [1338, 532, 54, "#69a45d"],
    [1420, 518, 62, "#83ba71"],
  ];
  for (const [x, y, radius, color] of crowns) {
    context.fillStyle = color;
    context.beginPath();
    context.ellipse(x, y, radius, radius * 0.82, 0, 0, Math.PI * 2);
    context.fill();
  }
  context.fillStyle = "#8a6a4a";
  for (const [x, y, radius] of crowns) {
    context.fillRect(x - radius * 0.07, y + radius * 0.6, radius * 0.14, radius * 0.5);
  }
}

/** The lawn, with a stone path running back toward the house. */
function drawLawn(context: CanvasRenderingContext2D) {
  const grass = context.createLinearGradient(0, 600, 0, TEXTURE_HEIGHT);
  grass.addColorStop(0, "#a8cf88");
  grass.addColorStop(0.45, "#96c675");
  grass.addColorStop(1, "#7fb85f");
  context.fillStyle = grass;
  context.beginPath();
  context.moveTo(-40, 636);
  context.quadraticCurveTo(420, 606, 900, 630);
  context.quadraticCurveTo(1300, 650, TEXTURE_WIDTH + 40, 618);
  context.lineTo(TEXTURE_WIDTH + 40, TEXTURE_HEIGHT + 40);
  context.lineTo(-40, TEXTURE_HEIGHT + 40);
  context.closePath();
  context.fill();

  context.fillStyle = "rgba(255,255,255,0.5)";
  const stones: Array<[number, number, number]> = [
    [1178, 806, 1],
    [1246, 762, 0.86],
    [1302, 726, 0.74],
    [1350, 698, 0.64],
  ];
  for (const [x, y, scale] of stones) {
    context.save();
    context.translate(x, y);
    context.scale(scale, scale * 0.42);
    context.beginPath();
    context.ellipse(0, 0, 58, 58, 0, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }
}

/** A trimmed hedge, used to bracket the lawn. */
function drawHedge(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  context.fillStyle = "#4f9243";
  roundedRect(context, x, y, width, height, height * 0.42);
  context.fill();
  context.fillStyle = "rgba(255,255,255,0.18)";
  roundedRect(context, x + width * 0.08, y + height * 0.1, width * 0.5, height * 0.3, height * 0.2);
  context.fill();
}

/** The neighbouring house: eaves, wall, door, window and a step. */
function drawHouse(context: CanvasRenderingContext2D) {
  context.save();
  context.fillStyle = "#47574d";
  context.beginPath();
  context.moveTo(1188, 402);
  context.lineTo(1436, 288);
  context.lineTo(TEXTURE_WIDTH + 40, 288);
  context.lineTo(TEXTURE_WIDTH + 40, 352);
  context.lineTo(1214, 436);
  context.closePath();
  context.fill();

  context.fillStyle = "#f6f4ec";
  context.fillRect(1240, 420, TEXTURE_WIDTH + 40 - 1240, 260);
  context.fillStyle = "#e6e2d6";
  context.fillRect(1240, 420, 22, 260);

  context.fillStyle = "#2f3d35";
  context.fillRect(1466, 452, 96, 206);
  context.fillStyle = "#8fb9a0";
  context.fillRect(1478, 464, 72, 150);

  context.fillStyle = "#e0dccd";
  context.fillRect(1300, 660, 170, 16);
  context.fillRect(1318, 676, 134, 16);
  context.fillRect(1336, 692, 98, 16);

  context.fillStyle = "#cfd8cc";
  context.fillRect(1252, 396, 14, 30);
  context.restore();
}

/** A potted shrub beside the steps. */
function drawPot(context: CanvasRenderingContext2D, x: number, y: number, scale: number) {
  context.save();
  context.translate(x, y);
  context.scale(scale, scale);
  context.fillStyle = "#f2efe4";
  context.beginPath();
  context.moveTo(-30, 0);
  context.lineTo(30, 0);
  context.lineTo(23, 62);
  context.lineTo(-23, 62);
  context.closePath();
  context.fill();
  context.fillStyle = "#3f8a3c";
  for (const angle of [-1.1, -0.55, 0, 0.55, 1.1]) {
    drawLeaf(context, 0, -6, 56, -Math.PI / 2 + angle, "#3f8a3c");
  }
  context.restore();
}

/** One service chip: a soft white disc with a drawn glyph and its label. */
function drawService(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  label: string,
  index: number,
) {
  const radius = 46;
  context.save();
  context.shadowColor = "rgba(20,80,47,0.22)";
  context.shadowBlur = 18;
  context.shadowOffsetY = 5;
  context.fillStyle = "#fbfdf7";
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();
  context.restore();

  context.save();
  context.translate(x, y);
  if (index === 0) {
    // A house with a clean sparkle over its roof.
    context.fillStyle = FOREST_SOFT;
    context.beginPath();
    context.moveTo(-22, -2);
    context.lineTo(0, -22);
    context.lineTo(22, -2);
    context.closePath();
    context.fill();
    context.fillRect(-15, -2, 30, 22);
    context.fillStyle = GOLD;
    context.beginPath();
    for (let step = 0; step < 4; step += 1) {
      const angle = (step * Math.PI) / 2;
      context.moveTo(18, -20);
      context.lineTo(18 + Math.cos(angle) * 11, -20 + Math.sin(angle) * 11);
      context.lineTo(18 + Math.cos(angle + 0.8) * 3.5, -20 + Math.sin(angle + 0.8) * 3.5);
    }
    context.fill();
  } else if (index === 1) {
    // Blades of grass.
    context.strokeStyle = "#4f9b45";
    context.lineWidth = 5.5;
    context.lineCap = "round";
    const blades: Array<[number, number]> = [
      [-20, -14],
      [-10, -20],
      [0, -24],
      [10, -20],
      [20, -14],
    ];
    for (const [tipX, tipY] of blades) {
      context.beginPath();
      context.moveTo(tipX * 0.45, 22);
      context.quadraticCurveTo(tipX * 0.8, 2, tipX, tipY);
      context.stroke();
    }
  } else if (index === 2) {
    // A bin with its lid and ribs.
    context.fillStyle = GOLD;
    context.beginPath();
    context.moveTo(-17, -8);
    context.lineTo(17, -8);
    context.lineTo(13, 24);
    context.lineTo(-13, 24);
    context.closePath();
    context.fill();
    context.fillRect(-22, -16, 44, 8);
    context.fillRect(-7, -24, 14, 7);
    context.strokeStyle = "#fbfdf7";
    context.lineWidth = 3.4;
    for (const offset of [-6, 0, 6]) {
      context.beginPath();
      context.moveTo(offset, -1);
      context.lineTo(offset, 17);
      context.stroke();
    }
  } else {
    // A single leaf with its midrib.
    drawLeaf(context, -22, 6, 46, -0.62, FOREST_SOFT);
    context.strokeStyle = "rgba(251,253,247,0.85)";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(-18, 3);
    context.lineTo(14, -16);
    context.stroke();
  }
  context.restore();

  context.save();
  context.fillStyle = FOREST;
  context.font = `700 17px ${SANS}`;
  context.textAlign = "center";
  context.textBaseline = "alphabetic";
  setTracking(context, "1.2px");
  context.fillText(label, x, y + radius + 34);
  setTracking(context, "0px");
  context.restore();
}

/** Paint the whole screen for the given local moment. */
export function paintScreen(context: CanvasRenderingContext2D, now: Date) {
  const width = TEXTURE_WIDTH;
  const height = TEXTURE_HEIGHT;
  context.clearRect(0, 0, width, height);

  const sky = context.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "#fbfdf6");
  sky.addColorStop(0.42, "#eef5e6");
  sky.addColorStop(0.72, "#dcebcf");
  sky.addColorStop(1, "#c9e0b6");
  context.fillStyle = sky;
  context.fillRect(0, 0, width, height);

  drawHills(context);
  drawTreeLine(context);
  drawHouse(context);
  drawLawn(context);
  drawHedge(context, -30, 612, 300, 108);
  drawHedge(context, 232, 640, 190, 78);
  drawHedge(context, 1120, 636, 210, 72);
  drawPot(context, 1520, 632, 1);

  // Foliage over the top-right corner, kept clear of the caption beside it.
  drawLeaf(context, 1702, -46, 140, 2.42, "#2f7a35");
  drawLeaf(context, 1644, -8, 112, 2.16, "#3f8a3c");
  drawLeaf(context, 1732, 28, 92, 2.68, "#54a049");

  // Brand discs in opposite corners.
  context.fillStyle = FOREST_SOFT;
  context.beginPath();
  context.arc(-26, -52, 292, 0, Math.PI * 2);
  context.fill();
  context.beginPath();
  context.arc(width + 44, height + 42, 268, 0, Math.PI * 2);
  context.fill();

  drawCaption(
    context,
    ["CLEANER", "GREENER", "HAPPIER", "TOMORROW"],
    54,
    78,
    "left",
    "rgba(255,255,255,0.94)",
  );
  context.fillStyle = GOLD;
  context.fillRect(54, 196, 60, 3);

  drawCaption(
    context,
    ["SAME", "SPACES", "BRIGHTER", "DAYS"],
    width - 54,
    132,
    "right",
    MUTED,
  );
  context.fillStyle = GOLD;
  context.fillRect(width - 114, 250, 60, 3);

  drawCaption(
    context,
    ["GOOD", "WORK", "GOES A", "LONG WAY"],
    width - 150,
    738,
    "left",
    "rgba(255,255,255,0.94)",
    19,
  );

  // Plinth on the left with the standing line.
  context.save();
  context.shadowColor = "rgba(20,80,47,0.16)";
  context.shadowBlur = 22;
  context.fillStyle = "#f7f6ee";
  roundedRect(context, -40, 530, 300, 232, 14);
  context.fill();
  context.restore();
  drawCaption(
    context,
    ["PEOPLE", "PROPERTIES", "COMMUNITIES", "THRIVE HERE"],
    52,
    580,
    "left",
    "#3f5c47",
    20,
  );

  // Masthead.
  context.textBaseline = "alphabetic";
  context.font = `800 104px ${SANS}`;
  const first = "Kleanup";
  const second = "Crew";
  const firstWidth = context.measureText(first).width;
  const secondWidth = context.measureText(second).width;
  const startX = width / 2 - (firstWidth + secondWidth) / 2;
  context.textAlign = "left";
  context.fillStyle = FOREST;
  context.fillText(first, startX, 198);
  context.fillStyle = LIME;
  context.fillText(second, startX + firstWidth, 198);

  context.textAlign = "center";
  context.fillStyle = FOREST_SOFT;
  context.font = `600 36px ${SANS}`;
  setTracking(context, "5px");
  context.fillText(BRAND_SLOGAN, width / 2, 250);
  setTracking(context, "0px");
  context.fillStyle = GOLD;
  context.fillRect(width / 2 - 70, 276, 140, 3);

  // Date and time card.
  context.save();
  context.shadowColor = "rgba(20,80,47,0.2)";
  context.shadowBlur = 26;
  context.shadowOffsetY = 6;
  context.fillStyle = "rgba(252,254,248,0.9)";
  roundedRect(context, width / 2 - 366, 304, 732, 234, 26);
  context.fill();
  context.restore();

  const weekday = WEEKDAYS[now.getDay()] ?? "";
  const month = MONTHS[now.getMonth()] ?? "";
  context.fillStyle = FOREST;
  context.font = `600 36px ${SANS}`;
  context.fillText(
    `${weekday}, ${month} ${now.getDate()}, ${now.getFullYear()}`,
    width / 2,
    368,
  );

  const hours = now.getHours();
  const display = hours % 12 === 0 ? 12 : hours % 12;
  const clock = `${String(display).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const suffix = hours < 12 ? "AM" : "PM";
  context.font = `800 112px ${SANS}`;
  const clockWidth = context.measureText(clock).width;
  context.font = `700 54px ${SANS}`;
  const suffixWidth = context.measureText(` ${suffix}`).width;
  const clockX = width / 2 - (clockWidth + suffixWidth) / 2;
  context.textAlign = "left";
  context.fillStyle = FOREST;
  context.font = `800 112px ${SANS}`;
  context.fillText(clock, clockX, 500);
  context.font = `700 54px ${SANS}`;
  context.fillText(` ${suffix}`, clockX + clockWidth, 500);

  // Service line.
  SERVICES.forEach((label, index) => {
    drawService(context, width / 2 - 324 + index * 216, 626, label, index);
  });

  // Closing line.
  context.textAlign = "center";
  context.fillStyle = MUTED;
  context.font = `600 22px ${SANS}`;
  setTracking(context, "4px");
  const closing = "A CLEANER, BRIGHTER TOMORROW";
  const closingWidth = context.measureText(closing).width;
  context.fillText(closing, width / 2, 790);
  setTracking(context, "0px");
  context.fillStyle = GOLD;
  const rule = closingWidth / 2 + 26;
  context.fillRect(width / 2 - rule - 46, 782, 46, 3);
  context.fillRect(width / 2 + rule, 782, 46, 3);
}


/** Last-resort face: the wordmark and the clock on a clean ground. */
function drawFallback(context: CanvasRenderingContext2D, now: Date) {
  context.fillStyle = "#f4f8ed";
  context.fillRect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);
  context.textAlign = "center";
  context.textBaseline = "alphabetic";
  context.font = `800 104px ${SANS}`;
  context.fillStyle = FOREST;
  context.fillText("KleanupCrew", TEXTURE_WIDTH / 2, 360);
  context.font = `600 36px ${SANS}`;
  context.fillStyle = FOREST_SOFT;
  context.fillText(BRAND_SLOGAN, TEXTURE_WIDTH / 2, 420);
  const hours = now.getHours();
  const display = hours % 12 === 0 ? 12 : hours % 12;
  context.font = `800 112px ${SANS}`;
  context.fillStyle = FOREST;
  context.fillText(
    `${String(display).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} ${hours < 12 ? "AM" : "PM"}`,
    TEXTURE_WIDTH / 2,
    560,
  );
}

/**
 * The current local minute. It re-renders on the turn of each minute rather
 * than on a fixed interval, so the clock never sits a beat behind, and it
 * re-checks whenever the tab comes back after being hidden or asleep.
 */
function useLocalMinute() {
  const [moment, setMoment] = useState(() => new Date());

  useEffect(() => {
    let timer = 0;
    const tick = () => {
      setMoment(new Date());
      schedule();
    };
    const schedule = () => {
      window.clearTimeout(timer);
      const now = new Date();
      const nextMinute = new Date(now);
      nextMinute.setSeconds(60, 200);
      timer = window.setTimeout(tick, Math.max(500, nextMinute.getTime() - now.getTime()));
    };
    const refresh = () => {
      if (document.visibilityState !== "visible") return;
      setMoment(new Date());
      schedule();
    };

    schedule();
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  return moment;
}

export function DeskScreen({ width, height }: { width: number; height: number }) {
  const { gl } = useThree();
  const moment = useLocalMinute();
  const canvas = useRef<HTMLCanvasElement | null>(null);

  // Painted before the texture is built, so the very first upload already
  // carries the picture. A texture handed to the renderer blank stays blank on
  // the GPU, which is how this screen came out black, and a fresh texture each
  // minute is the same shape the wall calendar uses for its daily repaint.
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;
    if (!canvas.current) {
      const element = document.createElement("canvas");
      element.width = TEXTURE_WIDTH;
      element.height = TEXTURE_HEIGHT;
      canvas.current = element;
    }
    const context = canvas.current.getContext("2d");
    if (!context) return null;
    try {
      paintScreen(context, moment);
    } catch {
      // Whatever the engine choked on, the screen still has to read as a
      // screen rather than a dead panel.
      drawFallback(context, moment);
    }
    const created = new CanvasTexture(canvas.current);
    created.colorSpace = SRGBColorSpace;
    created.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    return created;
  }, [moment, gl]);

  useEffect(() => () => texture?.dispose(), [texture]);

  return (
    <group>
      {/* Backlight behind the artwork: a blank panel then reads as an unlit
          screen, never as a hole. */}
      <mesh position={[0, 0, -0.002]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color="#f4f8ed" toneMapped={false} />
      </mesh>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}
