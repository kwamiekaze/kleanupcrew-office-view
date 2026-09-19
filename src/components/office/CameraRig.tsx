import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { PerspectiveCamera, Vector3 } from "three";
import type { OfficeView } from "@/lib/kleanup-content";

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
}: {
  view: OfficeView;
  input: React.RefObject<RigInput>;
  reducedMotion: boolean;
}) {
  const { camera, size } = useThree();
  const pos = useRef(new Vector3(...view.pos));
  const look = useRef(new Vector3(...view.target));
  const desiredPos = useRef(new Vector3());
  const desiredLook = useRef(new Vector3(...view.target));

  const isMobile = size.width < 768;

  useEffect(() => {
    if (reducedMotion) {
      pos.current.set(...(isMobile && view.mobilePos ? view.mobilePos : view.pos));
      look.current.set(...(isMobile && view.mobileTarget ? view.mobileTarget : view.target));
    }
  }, [view, reducedMotion, isMobile]);

  useFrame((_, rawDelta) => {
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
    const yaw = baseYaw + i.dragX;
    const pitch = Math.max(-0.35, Math.min(1.05, basePitch + i.dragY * 0.7));

    // Full horizontal orbit with a safe vertical arc and restrained dolly.
    // Wide rotations pull the Welcome camera inside the room so a 360-degree
    // orbit never exposes the unmodeled exterior side of the walls.
    const orbitProgress = Math.min(1, Math.abs(i.dragX) / (Math.PI / 2));
    const safeOrbitDistance = dist > 5 ? dist + (4.35 - dist) * orbitProgress : dist;
    // A small dolly plus a wider field-of-view range makes pinch zoom feel
    // immediate on phones without pushing the camera through the room walls.
    const radius = Math.max(1.2, safeOrbitDistance * (1 + i.zoom * 0.1));
    const horizontalRadius = Math.cos(pitch) * radius;
    desiredPos.current.set(
      target.x + Math.sin(yaw) * horizontalRadius,
      target.y + Math.sin(pitch) * radius,
      target.z + Math.cos(yaw) * horizontalRadius,
    );
    desiredLook.current.copy(target);

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
