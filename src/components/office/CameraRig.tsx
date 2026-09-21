import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { PerspectiveCamera, Vector3 } from "three";
import type { OfficeView } from "@/lib/kleanup-content";

const AUTO_PAN: Record<
  OfficeView["id"],
  {
    orbit: number;
    mobileOrbit: number;
    lateral: number;
    mobileLateral: number;
    secondsPerLeg: number;
  }
> = {
  welcome: {
    // A calmer arc: wide enough to feel alive, short enough that the window
    // frame never crops the sun at either end of the sweep. Welcome runs this
    // as its opening pan, then walks the room. See WELCOME_TOUR below.
    orbit: 0.3,
    mobileOrbit: 0.22,
    lateral: 0,
    mobileLateral: 0,
    secondsPerLeg: 8,
  },
  lawn: {
    orbit: 0.035,
    mobileOrbit: 0.03,
    lateral: 0.28,
    mobileLateral: 0.18,
    secondsPerLeg: 6,
  },
  tree: {
    orbit: 0.035,
    mobileOrbit: 0.03,
    lateral: 0.4,
    mobileLateral: 0.22,
    secondsPerLeg: 6,
  },
  cleaning: {
    orbit: 0.03,
    mobileOrbit: 0.025,
    lateral: 0.36,
    mobileLateral: 0.18,
    secondsPerLeg: 6,
  },
  junk: {
    orbit: 0.03,
    mobileOrbit: 0.025,
    lateral: 0.22,
    mobileLateral: 0.14,
    secondsPerLeg: 6,
  },
  quote: {
    orbit: 0.04,
    mobileOrbit: 0.035,
    lateral: 0.36,
    mobileLateral: 0.3,
    secondsPerLeg: 6,
  },
};

/** Widest vertical angle a width-driven view may open to on a tall screen. */
const PORTRAIT_FOV_CAP = 44;

interface TourStop {
  pos: [number, number, number];
  target: [number, number, number];
  fov: number;
  mobilePos?: [number, number, number];
  mobileTarget?: [number, number, number];
  mobileFov?: number;
  /** Seconds held on this framing, then seconds spent travelling to the next. */
  hold: number;
  travel: number;
}

/**
 * Welcome runs two pans back to back. The first is the original wide sweep,
 * unchanged: the camera holds the whole room and arcs gently right, then left,
 * then back to centre.
 *
 * The second walks the office. It leaves the wide shot for the calendar, close
 * enough to read the dates, then widens on the way out so the desk and the
 * window behind it are in one frame, carries on forward past the desk to the
 * plant in the far corner, and pulls back to the wide shot where the first pan
 * picks up again. Both pans start and end centred, so the loop has no seam.
 *
 * Nothing stops for long. Each framing gets a beat to settle, never a pause,
 * and the camera creeps into and out of every move rather than parking.
 *
 * Phones get their own framing for each stop, pulled back and opened up,
 * because a tall screen sees far less across than a wide one.
 */
const WELCOME_TOUR: TourStop[] = [
  {
    // The whole room. Its dwell is the opening pan, so it holds nothing here.
    pos: [0, 3.3, 7.95],
    target: [0, 1.56, -1.2],
    fov: 42,
    mobilePos: [0, 3.17, 7.0],
    mobileTarget: [0, 1.28, -1.2],
    hold: 0,
    travel: 10.5,
  },
  {
    // Close on the calendar: the spiral, the hanger and every date legible.
    pos: [-3.75, 2.36, -3.05],
    target: [-4.78, 2.33, -5.05],
    fov: 42,
    mobilePos: [-3.28, 2.37, -1.95],
    hold: 1.6,
    travel: 8,
  },
  {
    // Wider again on the way out of the calendar, so the desk and the window
    // behind it read as one picture: monitor, lamp, mug, sun and trees.
    pos: [1.85, 1.66, -0.3],
    target: [0.1, 1.2, -2.75],
    fov: 50,
    mobilePos: [2.4, 1.85, 1.4],
    mobileTarget: [0.25, 1.25, -2.8],
    mobileFov: 52,
    hold: 1.6,
    travel: 8.5,
  },
  {
    // Forward, towards the near side of the room, turning onto the corner
    // plant with the botanical prints behind it.
    pos: [2.7, 1.52, 0.15],
    target: [4.45, 1.08, -4.3],
    fov: 44,
    mobilePos: [3.0, 1.62, 0.9],
    mobileTarget: [4.45, 1.3, -4.3],
    mobileFov: 48,
    hold: 1.3,
    travel: 8,
  },
];

const TOUR_LENGTH = WELCOME_TOUR.reduce((total, stop) => total + stop.hold + stop.travel, 0);

/** Seconds the opening pan runs before the walk starts: one sweep, both ways. */
const OPENING_LEG = 8;
const OPENING_PAN = OPENING_LEG * 2;
const WELCOME_CYCLE = OPENING_PAN + TOUR_LENGTH;

/** Eases in and out with no kick at either end, so stops feel settled. */
function smootherstep(value: number) {
  const k = Math.max(0, Math.min(1, value));
  return k * k * k * (k * (k * 6 - 15) + 10);
}

/**
 * The same ease with a thread of constant speed left in it. The camera slows
 * into a framing and creeps out of it instead of coming to a dead stop, which
 * is what keeps the walk reading as one move rather than a run of little ones.
 */
function glide(value: number) {
  const k = Math.max(0, Math.min(1, value));
  return smootherstep(k) * 0.86 + k * 0.14;
}

function readStop(
  stop: TourStop,
  isMobile: boolean,
  position: Vector3,
  look: Vector3,
): number {
  position.set(...(isMobile && stop.mobilePos ? stop.mobilePos : stop.pos));
  look.set(...(isMobile && stop.mobileTarget ? stop.mobileTarget : stop.target));
  return (isMobile && stop.mobileFov) || stop.fov;
}

export interface RigInput {
  /** horizontal orbit angle in radians; wraps continuously through 360 degrees */
  dragX: number;
  /** vertical orbit adjustment, -1..1 */
  dragY: number;
  /** restrained dolly, -1..1 */
  zoom: number;
}

export function CameraRig({
  view,
  input,
  reducedMotion,
  introStarted,
}: {
  view: OfficeView;
  input: React.RefObject<RigInput>;
  reducedMotion: boolean;
  introStarted: boolean;
}) {
  const { camera, size } = useThree();
  const pos = useRef(new Vector3(...view.pos));
  const look = useRef(new Vector3(...view.target));
  const desiredPos = useRef(new Vector3());
  const desiredLook = useRef(new Vector3(...view.target));
  const panRight = useRef(new Vector3());
  const introStart = useRef<number | null>(null);
  const tourStart = useRef<number | null>(null);
  const stopPos = useRef(new Vector3());
  const stopLook = useRef(new Vector3());
  const nextPos = useRef(new Vector3());
  const nextLook = useRef(new Vector3());

  const isMobile = size.width < 768;

  useEffect(() => {
    if (reducedMotion) {
      pos.current.set(...(isMobile && view.mobilePos ? view.mobilePos : view.pos));
      look.current.set(...(isMobile && view.mobileTarget ? view.mobileTarget : view.target));
    }
  }, [view, reducedMotion, isMobile]);

  useEffect(() => {
    if (!introStarted) {
      introStart.current = null;
    }
  }, [introStarted]);

  // Coming back to Welcome should open on the wide shot, not halfway through.
  useEffect(() => {
    tourStart.current = null;
  }, [view.id, introStarted]);

  useFrame(({ clock }, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const i = input.current ?? { dragX: 0, dragY: 0, zoom: 0 };

    const base = new Vector3(...(isMobile && view.mobilePos ? view.mobilePos : view.pos));
    const target = new Vector3(
      ...(isMobile && view.mobileTarget ? view.mobileTarget : view.target),
    );
    let tourFov: number | null = null;
    let tourOrbit = 0;
    if (view.id === "welcome") {
      // Frozen on the opening shot until the visitor is through the splash, and
      // frozen there for good if they have asked for reduced motion.
      let elapsed = 0;
      if (introStarted && !reducedMotion) {
        tourStart.current ??= clock.elapsedTime;
        elapsed = clock.elapsedTime - tourStart.current;
      }

      const cycle = elapsed % WELCOME_CYCLE;
      const wide = WELCOME_TOUR[0]!;
      if (cycle < OPENING_PAN) {
        // Pan one, as it always was: the whole room, arcing right then left.
        // A sine rather than a cosine so the arc begins and ends centred and
        // the handover to the walk has nothing to catch up on.
        const pan = AUTO_PAN.welcome;
        tourFov = readStop(wide, isMobile, stopPos.current, stopLook.current);
        base.copy(stopPos.current);
        target.copy(stopLook.current);
        tourOrbit =
          Math.sin((Math.PI * cycle) / OPENING_LEG) *
          (isMobile ? pan.mobileOrbit : pan.orbit);
      } else {
        // Pan two: the walk.
        let remaining = cycle - OPENING_PAN;
        let index = 0;
        let blend = 0;
        for (let step = 0; step < WELCOME_TOUR.length; step += 1) {
          const stop = WELCOME_TOUR[step]!;
          index = step;
          if (remaining < stop.hold) break;
          remaining -= stop.hold;
          if (remaining < stop.travel) {
            blend = glide(remaining / stop.travel);
            break;
          }
          remaining -= stop.travel;
        }

        const from = WELCOME_TOUR[index]!;
        const to = WELCOME_TOUR[(index + 1) % WELCOME_TOUR.length]!;
        const fromFov = readStop(from, isMobile, stopPos.current, stopLook.current);
        const toFov = readStop(to, isMobile, nextPos.current, nextLook.current);
        base.copy(stopPos.current).lerp(nextPos.current, blend);
        target.copy(stopLook.current).lerp(nextLook.current, blend);
        tourFov = fromFov + (toFov - fromFov) * blend;
      }

      if (introStarted && !reducedMotion) {
        // A held frame still breathes. Two slow waves of different periods, so
        // the sway never repeats on a beat the eye can lock onto, and small
        // enough that it reads as a hand holding the shot rather than a move.
        const breath = clock.elapsedTime;
        base.x += Math.sin(breath * 0.35) * 0.012;
        base.y += Math.sin(breath * 0.2555 + 1.4) * 0.008;
      }
    }

    const offset = base.clone().sub(target);
    const dist = offset.length();
    const baseYaw = Math.atan2(offset.x, offset.z);
    const basePitch = Math.asin(offset.y / Math.max(dist, 0.001));
    let automaticOrbit = tourOrbit;
    let automaticLateral = 0;
    const automaticLift = 0;
    const automaticDistance = 1;
    if (!reducedMotion && introStarted && view.id !== "welcome") {
      const pan = AUTO_PAN[view.id];
      introStart.current ??= clock.elapsedTime;
      const elapsed = clock.elapsedTime - introStart.current;
      // Each view gets a visible, continuous sweep with a gentle reversal.
      // Service sections use a slightly shorter leg so their tighter arcs
      // remain clearly perceptible without leaving the selected setup.
      const panPhase = -Math.cos((elapsed * Math.PI) / pan.secondsPerLeg);
      automaticOrbit = panPhase * (isMobile ? pan.mobileOrbit : pan.orbit);
      automaticLateral = panPhase * (isMobile ? pan.mobileLateral : pan.lateral);
    }

    const yaw = baseYaw + i.dragX + automaticOrbit;
    const pitch = Math.max(-0.35, Math.min(1.05, basePitch + i.dragY * 0.7));

    // Full horizontal orbit with a safe vertical arc and restrained dolly.
    // Wide rotations pull the Welcome camera inside the room so a 360-degree
    // orbit never exposes the unmodeled exterior side of the walls.
    const orbitProgress = Math.min(1, Math.abs(i.dragX) / (Math.PI / 2));
    const safeOrbitDistance = dist > 5 ? dist + (4.35 - dist) * orbitProgress : dist;
    // A small dolly plus a wider field-of-view range makes pinch zoom feel
    // immediate on phones without pushing the camera through the room walls.
    const radius = Math.max(1.2, safeOrbitDistance * (1 + i.zoom * 0.1) * automaticDistance);
    const horizontalRadius = Math.cos(pitch) * radius;
    desiredPos.current.set(
      target.x + Math.sin(yaw) * horizontalRadius,
      target.y + Math.sin(pitch) * radius + automaticLift,
      target.z + Math.cos(yaw) * horizontalRadius,
    );
    desiredLook.current.copy(target);
    // A true sideways camera move keeps flat service displays from appearing
    // stationary while their smaller orbit adds natural perspective change.
    panRight.current.set(Math.cos(yaw), 0, -Math.sin(yaw)).multiplyScalar(automaticLateral);
    desiredPos.current.add(panRight.current);
    desiredLook.current.add(panRight.current);

    const response = isMobile ? 8 : 5.2;
    const k = reducedMotion ? 1 : 1 - Math.exp(-response * dt);
    pos.current.lerp(desiredPos.current, k);
    look.current.lerp(desiredLook.current, k);
    camera.position.copy(pos.current);
    if (camera instanceof PerspectiveCamera) {
      const aspect = Math.max(size.width / Math.max(size.height, 1), 0.1);
      // Service framing is driven by the horizontal field of view, so a wide
      // screen always holds the whole display. On a tall phone that same rule
      // would swing the vertical angle so wide that the display shrank into the
      // middle of the screen, so the vertical angle is capped: the sides crop
      // instead, and the equipment stays large enough to recognise.
      const widthDrivenFov =
        (2 * Math.atan(Math.tan(((view.horizontalFov ?? 42) * Math.PI) / 360) / aspect) * 180) /
        Math.PI;
      const responsiveFov =
        tourFov ??
        (view.horizontalFov
          ? Math.min(widthDrivenFov, PORTRAIT_FOV_CAP)
          : isMobile
            ? (view.mobileFov ?? view.fov ?? 42)
            : (view.fov ?? 42));
      const minimumFov = view.horizontalFov ? 10 : 18;
      const targetFov = Math.max(minimumFov, Math.min(70, responsiveFov + i.zoom * 28));
      camera.fov += (targetFov - camera.fov) * k;
      camera.updateProjectionMatrix();
    }
    camera.lookAt(look.current);
  });

  return null;
}
