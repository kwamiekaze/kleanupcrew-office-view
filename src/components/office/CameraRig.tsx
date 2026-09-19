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
    orbit: 0.5,
    mobileOrbit: 0.32,
    lateral: 0,
    mobileLateral: 0,
    secondsPerLeg: 8,
  },
  lawn: {
    orbit: 0.035,
    mobileOrbit: 0.03,
    lateral: 0.52,
    mobileLateral: 0.4,
    secondsPerLeg: 6,
  },
  tree: {
    orbit: 0.035,
    mobileOrbit: 0.03,
    lateral: 0.46,
    mobileLateral: 0.36,
    secondsPerLeg: 6,
  },
  cleaning: {
    orbit: 0.03,
    mobileOrbit: 0.025,
    lateral: 0.42,
    mobileLateral: 0.34,
    secondsPerLeg: 6,
  },
  junk: {
    orbit: 0.03,
    mobileOrbit: 0.025,
    lateral: 0.36,
    mobileLateral: 0.3,
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

  useFrame(({ clock }, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const i = input.current ?? { dragX: 0, dragY: 0, zoom: 0 };

    const base = new Vector3(...(isMobile && view.mobilePos ? view.mobilePos : view.pos));
    const target = new Vector3(
      ...(isMobile && view.mobileTarget ? view.mobileTarget : view.target),
    );
    const offset = base.clone().sub(target);
    const dist = offset.length();
    const baseYaw = Math.atan2(offset.x, offset.z);
    const basePitch = Math.asin(offset.y / Math.max(dist, 0.001));
    let automaticOrbit = 0;
    let automaticLateral = 0;
    let automaticLift = 0;
    let automaticDistance = 1;
    if (!reducedMotion) {
      const pan = AUTO_PAN[view.id];
      const orbitAmplitude = isMobile ? pan.mobileOrbit : pan.orbit;
      if (!introStarted && view.id === "welcome") {
        // Prepare the left edge of the orbit behind the opening screen so the
        // visible motion begins smoothly as soon as the visitor enters.
        automaticOrbit = -orbitAmplitude;
      } else if (introStarted) {
        introStart.current ??= clock.elapsedTime;
        const elapsed = clock.elapsedTime - introStart.current;
        // Each view gets a visible, continuous sweep with a gentle reversal.
        // Service sections use a slightly shorter leg so their tighter arcs
        // remain clearly perceptible without leaving the selected setup.
        const panPhase = -Math.cos((elapsed * Math.PI) / pan.secondsPerLeg);
        automaticOrbit = panPhase * orbitAmplitude;
        automaticLateral = panPhase * (isMobile ? pan.mobileLateral : pan.lateral);
      }
      if (view.id === "welcome") {
        automaticLift = 0.14;
        // Keep phone framing below the ceiling edge throughout the orbit.
        automaticDistance = isMobile ? 0.96 : 1.04;
      }
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
      const responsiveFov = view.horizontalFov
        ? (2 * Math.atan(Math.tan((view.horizontalFov * Math.PI) / 360) / aspect) * 180) / Math.PI
        : isMobile
          ? (view.mobileFov ?? view.fov ?? 42)
          : (view.fov ?? 42);
      const minimumFov = view.horizontalFov ? 10 : 18;
      const targetFov = Math.max(minimumFov, Math.min(70, responsiveFov + i.zoom * 28));
      camera.fov += (targetFov - camera.fov) * k;
      camera.updateProjectionMatrix();
    }
    camera.lookAt(look.current);
  });

  return null;
}
