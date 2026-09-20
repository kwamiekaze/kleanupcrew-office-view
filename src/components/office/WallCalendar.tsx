import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";

/**
 * KleanupCrew wall calendar. The printed face is drawn into an offscreen canvas
 * at print resolution and mapped onto the paper, so it stays sharp at the camera
 * distances the room is viewed from, and it is redrawn only when the visitor's
 * local calendar day actually changes - once at mount, then once a night.
 */

const TEXTURE_WIDTH = 1024;
const TEXTURE_HEIGHT = 1400;

/** Printed size on the wall, in metres, keeping the artwork's proportions. */
const PAPER_WIDTH = 1.82;
const PAPER_HEIGHT = (PAPER_WIDTH * TEXTURE_HEIGHT) / TEXTURE_WIDTH;
const PAPER_THICKNESS = 0.022;

const PAPER = "#fffdf7";
const FOREST = "#14502f";
const FOREST_SOFT = "#1d5f39";
const LIME = "#6fbf3b";
const GOLD = "#c9a24a";
const INK = "#2b332e";
const GRID_LINE = "#ddd7c6";

const SANS = '"Helvetica Neue", Helvetica, Arial, sans-serif';
const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
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

const SLOGAN = "Inside. Outside. Handled.";

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  if (typeof context.roundRect === "function") {
    context.roundRect(x, y, width, height, radius);
    return;
  }
  // Older engines without roundRect still get the same shape.
  const r = Math.min(radius, width / 2, height / 2);
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

function setTracking(context: CanvasRenderingContext2D, value: string) {
  // Supported by current engines; ignored elsewhere, which only costs tracking.
  const typed = context as CanvasRenderingContext2D & { letterSpacing?: string };
  if ("letterSpacing" in typed) typed.letterSpacing = value;
}

/** A single soft leaf, used as a corner accent. */
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
  context.quadraticCurveTo(length * 0.55, -length * 0.42, length, 0);
  context.quadraticCurveTo(length * 0.55, length * 0.42, 0, 0);
  context.fill();
  context.strokeStyle = "rgba(255,255,255,0.55)";
  context.lineWidth = Math.max(1.5, length * 0.03);
  context.beginPath();
  context.moveTo(length * 0.08, 0);
  context.lineTo(length * 0.92, 0);
  context.stroke();
  context.restore();
}

/** The neighbourhood photo band across the head of the sheet. */
function drawNeighbourhood(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  context.save();
  roundedRect(context, x, y, width, height, 18);
  context.clip();

  const sky = context.createLinearGradient(0, y, 0, y + height * 0.7);
  sky.addColorStop(0, "#b6dcf0");
  sky.addColorStop(1, "#edf7fc");
  context.fillStyle = sky;
  context.fillRect(x, y, width, height);

  // Distant tree line.
  context.fillStyle = "#83b168";
  for (let i = 0; i < 16; i += 1) {
    const cx = x + (i / 15) * width;
    const cy = y + height * 0.5;
    context.beginPath();
    context.ellipse(cx, cy, width * 0.07, height * 0.13, 0, 0, Math.PI * 2);
    context.fill();
  }

  // A short row of houses set back behind the trees.
  const houses: Array<[number, number, string, string]> = [
    [0.05, 0.15, "#e6dccb", "#8a7a66"],
    [0.27, 0.17, "#d6cab5", "#77685a"],
    [0.52, 0.14, "#ece3d4", "#8f8070"],
    [0.73, 0.17, "#dcd0bd", "#7b6c5d"],
  ];
  for (const [left, wide, wall, roof] of houses) {
    const hx = x + width * left;
    const hw = width * wide;
    const hh = height * 0.26;
    const hy = y + height * 0.36;
    context.fillStyle = wall;
    context.fillRect(hx, hy, hw, hh);
    context.fillStyle = roof;
    context.beginPath();
    context.moveTo(hx - hw * 0.07, hy);
    context.lineTo(hx + hw * 0.5, hy - hh * 0.55);
    context.lineTo(hx + hw * 1.07, hy);
    context.closePath();
    context.fill();
    context.fillStyle = "rgba(255,255,255,0.75)";
    context.fillRect(hx + hw * 0.18, hy + hh * 0.26, hw * 0.16, hh * 0.34);
    context.fillRect(hx + hw * 0.64, hy + hh * 0.26, hw * 0.16, hh * 0.34);
  }

  // Foreground hedges tuck the houses into the street.
  context.fillStyle = "#5d9b46";
  for (let i = 0; i < 13; i += 1) {
    const cx = x + width * 0.02 + (i / 12) * width * 0.96;
    context.beginPath();
    context.ellipse(cx, y + height * 0.62, width * 0.055, height * 0.1, 0, 0, Math.PI * 2);
    context.fill();
  }

  // Lawn, kerb and clipped verge.
  const lawn = context.createLinearGradient(0, y + height * 0.66, 0, y + height);
  lawn.addColorStop(0, "#92c96b");
  lawn.addColorStop(1, "#6fae4d");
  context.fillStyle = lawn;
  context.fillRect(x, y + height * 0.68, width, height * 0.32);
  context.fillStyle = "rgba(255,255,255,0.16)";
  for (let i = 0; i < 4; i += 1) {
    context.fillRect(x, y + height * (0.74 + i * 0.06), width, height * 0.014);
  }

  context.restore();
  context.strokeStyle = "rgba(20,80,47,0.18)";
  context.lineWidth = 2;
  roundedRect(context, x, y, width, height, 18);
  context.stroke();
}

/** Paint the whole sheet for the given local day. */
function drawCalendar(context: CanvasRenderingContext2D, today: Date) {
  const W = TEXTURE_WIDTH;
  const H = TEXTURE_HEIGHT;
  const year = today.getFullYear();
  const month = today.getMonth();
  const dayOfMonth = today.getDate();

  // Local-time construction, so the grid always agrees with the visitor's clock.
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weekRows = Math.ceil((firstWeekday + daysInMonth) / 7);

  context.clearRect(0, 0, W, H);
  context.fillStyle = PAPER;
  context.fillRect(0, 0, W, H);
  const warmth = context.createLinearGradient(0, 0, W, H);
  warmth.addColorStop(0, "rgba(255,255,255,0.9)");
  warmth.addColorStop(1, "rgba(240,234,218,0.22)");
  context.fillStyle = warmth;
  context.fillRect(0, 0, W, H);

  // Binding margin: punched holes sit under the spiral modelled in the scene.
  context.fillStyle = "rgba(60,64,58,0.3)";
  for (let i = 0; i < 15; i += 1) {
    const cx = 56 + (i / 14) * (W - 112);
    context.beginPath();
    context.ellipse(cx, 24, 10, 8, 0, 0, Math.PI * 2);
    context.fill();
  }

  context.textBaseline = "alphabetic";

  // Masthead.
  drawLeaf(context, 62, 150, 92, -0.5, "#5ea83a");
  drawLeaf(context, 86, 196, 66, -1.15, "#8ccf5c");
  drawLeaf(context, W - 62, 132, 86, Math.PI + 0.55, "#5ea83a");

  context.textAlign = "left";
  context.font = `bold 92px ${SANS}`;
  const brandA = "Kleanup";
  const brandB = "Crew";
  const widthA = context.measureText(brandA).width;
  const widthB = context.measureText(brandB).width;
  const brandX = (W - (widthA + widthB)) / 2;
  context.fillStyle = FOREST;
  context.fillText(brandA, brandX, 190);
  context.fillStyle = LIME;
  context.fillText(brandB, brandX + widthA, 190);

  // Slogan, set at the top right of the sheet.
  context.textAlign = "right";
  setTracking(context, "3px");
  context.font = `bold 38px ${SANS}`;
  context.fillStyle = FOREST_SOFT;
  context.fillText(SLOGAN, W - 62, 252);
  setTracking(context, "0px");

  context.strokeStyle = GOLD;
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(62, 282);
  context.lineTo(W - 62, 282);
  context.stroke();

  drawNeighbourhood(context, 48, 306, W - 96, 286);

  // Month band.
  const bandY = 626;
  const bandH = 112;
  context.fillStyle = FOREST;
  roundedRect(context, 48, bandY, W - 96, bandH, 12);
  context.fill();
  context.fillStyle = GOLD;
  context.fillRect(48, bandY + bandH - 7, W - 96, 5);

  const monthLabel = MONTHS[month] ?? "";
  const yearLabel = ` ${year}`;
  context.textAlign = "left";
  context.font = `bold 68px ${SANS}`;
  const monthWidth = context.measureText(monthLabel).width;
  context.font = `300 62px ${SANS}`;
  const yearWidth = context.measureText(yearLabel).width;
  const headX = (W - (monthWidth + yearWidth)) / 2;
  context.font = `bold 68px ${SANS}`;
  context.fillStyle = "#ffffff";
  context.fillText(monthLabel, headX, bandY + 78);
  context.font = `300 62px ${SANS}`;
  context.fillStyle = "#cfe6c4";
  context.fillText(yearLabel, headX + monthWidth, bandY + 78);

  // Grid.
  const gridX = 48;
  const gridW = W - 96;
  const cellW = gridW / 7;
  const headerY = 766;
  const headerH = 56;
  const gridY = headerY + headerH;
  const gridH = 1232 - gridY;
  const cellH = gridH / weekRows;

  context.fillStyle = "#f1ece0";
  context.fillRect(gridX, headerY, gridW, headerH);
  context.textAlign = "center";
  setTracking(context, "2px");
  context.font = `bold 27px ${SANS}`;
  context.fillStyle = "#54655a";
  WEEKDAYS.forEach((label, index) => {
    context.fillText(label, gridX + cellW * (index + 0.5), headerY + 38);
  });
  setTracking(context, "0px");

  context.fillStyle = "#ffffff";
  context.fillRect(gridX, gridY, gridW, gridH);

  context.strokeStyle = GRID_LINE;
  context.lineWidth = 2;
  for (let column = 0; column <= 7; column += 1) {
    const x = gridX + column * cellW;
    context.beginPath();
    context.moveTo(x, headerY);
    context.lineTo(x, gridY + gridH);
    context.stroke();
  }
  for (let row = 0; row <= weekRows; row += 1) {
    const y = gridY + row * cellH;
    context.beginPath();
    context.moveTo(gridX, y);
    context.lineTo(gridX + gridW, y);
    context.stroke();
  }
  context.beginPath();
  context.moveTo(gridX, headerY);
  context.lineTo(gridX + gridW, headerY);
  context.stroke();

  for (let day = 1; day <= daysInMonth; day += 1) {
    const slot = firstWeekday + day - 1;
    const column = slot % 7;
    const row = Math.floor(slot / 7);
    const centreX = gridX + cellW * (column + 0.5);
    const centreY = gridY + cellH * (row + 0.5);

    if (day === dayOfMonth) {
      // Today: the only highlighted cell on the sheet.
      context.fillStyle = "#eaf5e0";
      context.fillRect(
        gridX + cellW * column + 1,
        gridY + cellH * row + 1,
        cellW - 2,
        cellH - 2,
      );
      const chip = Math.min(cellW, cellH) * 0.74;
      context.fillStyle = FOREST;
      roundedRect(context, centreX - chip / 2, centreY - chip / 2, chip, chip, chip * 0.28);
      context.fill();
      context.fillStyle = "#ffffff";
      context.font = `bold 42px ${SANS}`;
    } else {
      context.fillStyle = INK;
      context.font = `500 40px ${SANS}`;
    }
    context.fillText(String(day), centreX, centreY + 14);
  }

  // Footer.
  context.textAlign = "left";
  context.font = `italic 600 31px ${SANS}`;
  context.fillStyle = FOREST_SOFT;
  context.fillText("Good Work Changes", 60, 1296);
  context.fillText("Neighborhoods", 60, 1338);
  const heartX = 60 + context.measureText("Neighborhoods").width + 16;
  context.fillStyle = LIME;
  context.font = `30px ${SANS}`;
  context.fillText("♥", heartX, 1338);

  context.fillStyle = "#e8f3de";
  roundedRect(context, 548, 1262, W - 548 - 60, 96, 20);
  context.fill();
  context.textAlign = "center";
  context.fillStyle = FOREST;
  context.font = `600 28px ${SANS}`;
  const pillCentre = 548 + (W - 548 - 60) / 2;
  context.fillText("Same Neighbors.", pillCentre, 1300);
  context.fillText("A Cleaner Tomorrow.", pillCentre, 1338);
  drawLeaf(context, W - 92, 1276, 34, 0.5, "#8ccf5c");
}

/** Today's local date, refreshed the moment the day rolls over. */
function useLocalDay() {
  const [today, setToday] = useState<Date>(() => new Date());

  useEffect(() => {
    let timer = 0;

    const sameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();

    // Only ever swaps in a new Date when the day genuinely changed, so a tab
    // coming back into view does not re-render the sheet for nothing.
    const refresh = () =>
      setToday((previous) => {
        const now = new Date();
        return sameDay(previous, now) ? previous : now;
      });

    const schedule = () => {
      const now = new Date();
      const nextMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        2,
      );
      timer = window.setTimeout(() => {
        refresh();
        schedule();
      }, Math.max(1000, nextMidnight.getTime() - now.getTime()));
    };

    schedule();
    // A laptop that slept through midnight wakes up on the wrong day otherwise.
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  return today;
}

export function WallCalendar({ position }: { position: [number, number, number] }) {
  const { gl } = useThree();
  const today = useLocalDay();
  const dayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = TEXTURE_WIDTH;
    canvas.height = TEXTURE_HEIGHT;
    const context = canvas.getContext("2d");
    if (!context) return null;
    const [yearPart, monthPart, dayPart] = dayKey.split("-").map(Number);
    drawCalendar(context, new Date(yearPart ?? 1970, monthPart ?? 0, dayPart ?? 1));
    const created = new CanvasTexture(canvas);
    created.colorSpace = SRGBColorSpace;
    created.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    return created;
  }, [dayKey, gl]);

  useEffect(() => () => texture?.dispose(), [texture]);

  const halfWidth = PAPER_WIDTH / 2;
  const halfHeight = PAPER_HEIGHT / 2;

  return (
    <group position={position}>
      {/* Paper block: gives the sheet real thickness against the wall. */}
      <mesh position={[0, 0, -PAPER_THICKNESS / 2]} castShadow receiveShadow>
        <boxGeometry args={[PAPER_WIDTH, PAPER_HEIGHT, PAPER_THICKNESS]} />
        <meshStandardMaterial color="#f2ecdd" roughness={0.9} />
      </mesh>

      {/* Printed face. */}
      <mesh position={[0, 0, 0.0015]} receiveShadow>
        <planeGeometry args={[PAPER_WIDTH, PAPER_HEIGHT]} />
        <meshStandardMaterial map={texture} roughness={0.82} />
      </mesh>

      {/* Twin-loop spiral over the top edge. */}
      <mesh
        position={[0, halfHeight - 0.024, -PAPER_THICKNESS / 2]}
        rotation-z={Math.PI / 2}
        castShadow
      >
        <cylinderGeometry args={[0.006, 0.006, PAPER_WIDTH * 0.94, 8]} />
        <meshStandardMaterial color="#b89a55" metalness={0.55} roughness={0.34} />
      </mesh>
      {Array.from({ length: 15 }, (_, index) => (
        <mesh
          key={index}
          position={[
            -halfWidth + 0.08 + (index / 14) * (PAPER_WIDTH - 0.16),
            halfHeight - 0.024,
            -PAPER_THICKNESS / 2,
          ]}
          rotation-y={Math.PI / 2}
          castShadow
        >
          <torusGeometry args={[0.036, 0.0058, 6, 16]} />
          <meshStandardMaterial color="#c6a961" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}

      {/* Brass hanging tab. */}
      <mesh position={[0, halfHeight + 0.042, -PAPER_THICKNESS / 2]} castShadow>
        <boxGeometry args={[0.1, 0.07, 0.012]} />
        <meshStandardMaterial color="#c9a24a" metalness={0.62} roughness={0.34} />
      </mesh>
      <mesh
        position={[0, halfHeight + 0.055, -PAPER_THICKNESS / 2 + 0.008]}
        rotation-x={Math.PI / 2}
      >
        <cylinderGeometry args={[0.013, 0.013, 0.016, 12]} />
        <meshStandardMaterial color="#5d4f2c" roughness={0.5} />
      </mesh>
    </group>
  );
}
