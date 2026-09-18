import { Canvas } from "@react-three/fiber";
import type { RefObject } from "react";
import { CameraRig, type RigInput } from "@/components/office/CameraRig";
import { OfficeScene } from "@/components/office/OfficeScene";
import type { OfficeView } from "@/lib/kleanup-content";

export default function OfficeCanvas({
  view,
  input,
  reducedMotion,
}: {
  view: OfficeView;
  input: RefObject<RigInput>;
  reducedMotion: boolean;
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: view.pos, fov: 42, near: 0.1, far: 60 }}
    >
      <OfficeScene reducedMotion={reducedMotion} />
      <CameraRig view={view} input={input} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
