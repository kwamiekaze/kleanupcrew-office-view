import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import type { OfficeView } from "@/lib/kleanup-content";

export interface RigInput {
  /** normalized look-around offset, -1..1 */
  dragX: number;
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
    const dir = base.clone().sub(target);
    const dist = dir.length();
    dir.normalize();

    // restrained dolly along the view axis
    const dolly = 1 + i.zoom * 0.28;
    desiredPos.current
      .copy(target)
      .add(dir.multiplyScalar(Math.max(0.9, dist * dolly)));
    // small look-around offset
    desiredPos.current.x += i.dragX * 0.7;
    desiredPos.current.y += i.dragY * 0.45;
    desiredLook.current.copy(target);
    desiredLook.current.x -= i.dragX * 0.25;

    const k = reducedMotion ? 1 : 1 - Math.exp(-2.6 * dt);
    pos.current.lerp(desiredPos.current, k);
    look.current.lerp(desiredLook.current, k);
    camera.position.copy(pos.current);
    camera.lookAt(look.current);
  });

  return null;
}
