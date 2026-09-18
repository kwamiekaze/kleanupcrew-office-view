import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";
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
  const { camera } = useThree();
  const pos = useRef(new Vector3(...view.pos));
  const look = useRef(new Vector3(...view.target));
  const desiredPos = useRef(new Vector3());
  const desiredLook = useRef(new Vector3(...view.target));

  useEffect(() => {
    if (reducedMotion) {
      pos.current.set(...view.pos);
      look.current.set(...view.target);
    }
  }, [view, reducedMotion]);

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const i = input.current ?? { dragX: 0, dragY: 0, zoom: 0 };

    const base = new Vector3(...view.pos);
    const target = new Vector3(...view.target);
    const offset = base.clone().sub(target);
    const dist = offset.length();
    const baseYaw = Math.atan2(offset.x, offset.z);
    const basePitch = Math.asin(offset.y / Math.max(dist, 0.001));
    const yaw = baseYaw + i.dragX;
    const pitch = Math.max(-0.35, Math.min(1.05, basePitch + i.dragY * 0.7));

    // Full horizontal orbit with a safe vertical arc and restrained dolly.
    const radius = Math.max(1.25, dist * (1 + i.zoom * 0.32));
    const horizontalRadius = Math.cos(pitch) * radius;
    desiredPos.current.set(
      target.x + Math.sin(yaw) * horizontalRadius,
      target.y + Math.sin(pitch) * radius,
      target.z + Math.cos(yaw) * horizontalRadius,
    );
    desiredLook.current.copy(target);

    const k = reducedMotion ? 1 : 1 - Math.exp(-4.2 * dt);
    pos.current.lerp(desiredPos.current, k);
    look.current.lerp(desiredLook.current, k);
    camera.position.copy(pos.current);
    camera.lookAt(look.current);
  });

  return null;
}
