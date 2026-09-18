import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group, InstancedMesh } from "three";
import { Object3D } from "three";
import { WallClock } from "./WallClock";

const WOOD = "#8a5a33";
const WOOD_DARK = "#5e3c22";
const CREAM = "#efe6d3";
const WALL = "#e6dcc6";
const FOREST = "#274d34";
const LIME = "#8fd14f";
const CHARCOAL = "#2b302e";

function Desk() {
  return (
    <group position={[0, 0, -2.4]}>
      <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.0, 0.08, 1.35]} />
        <meshStandardMaterial color={WOOD} roughness={0.55} />
      </mesh>
      {[
        [-1.4, 0.55],
        [1.4, 0.55],
        [-1.4, -0.55],
        [1.4, -0.55],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.36, z]} castShadow>
          <boxGeometry args={[0.09, 0.72, 0.09]} />
          <meshStandardMaterial color={WOOD_DARK} roughness={0.7} />
        </mesh>
      ))}
      {/* drawer block */}
      <mesh position={[1.0, 0.44, -0.1]} castShadow>
        <boxGeometry args={[0.7, 0.56, 1.0]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.65} />
      </mesh>
    </group>
  );
}

function Monitor() {
  return (
    <group position={[0, 0.78, -2.75]}>
      <mesh position={[0, 0.03, 0]} castShadow>
        <boxGeometry args={[0.5, 0.04, 0.26]} />
        <meshStandardMaterial color={CHARCOAL} />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 0.38, 12]} />
        <meshStandardMaterial color={CHARCOAL} />
      </mesh>
      <group position={[0, 0.62, 0.02]} rotation-x={-0.06}>
        <mesh castShadow>
          <boxGeometry args={[1.22, 0.7, 0.05]} />
          <meshStandardMaterial color={CHARCOAL} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.032]}>
          <planeGeometry args={[1.14, 0.62]} />
          <meshStandardMaterial
            color={FOREST}
            emissive={"#3d7a4d"}
            emissiveIntensity={0.55}
            roughness={0.3}
          />
        </mesh>
      </group>
    </group>
  );
}

function DeskProps() {
  return (
    <group position={[0, 0.78, -2.4]}>
      {/* keyboard */}
      <mesh position={[0, 0.02, 0.28]} castShadow>
        <boxGeometry args={[0.72, 0.03, 0.24]} />
        <meshStandardMaterial color="#d9d2c2" roughness={0.8} />
      </mesh>
      {/* mouse */}
      <mesh position={[0.52, 0.03, 0.3]} castShadow>
        <sphereGeometry args={[0.055, 14, 10]} />
        <meshStandardMaterial color="#cfc7b6" />
      </mesh>
      {/* clipboard / notebook */}
      <group position={[-0.95, 0.02, 0.2]} rotation-y={0.32}>
        <mesh castShadow>
          <boxGeometry args={[0.42, 0.03, 0.56]} />
          <meshStandardMaterial color={WOOD_DARK} roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.025, -0.02]}>
          <boxGeometry args={[0.36, 0.02, 0.48]} />
          <meshStandardMaterial color="#fbf6ea" />
        </mesh>
        <mesh position={[0, 0.04, 0.22]}>
          <boxGeometry args={[0.2, 0.02, 0.06]} />
          <meshStandardMaterial color={LIME} />
        </mesh>
      </group>
      {/* coffee mug */}
      <group position={[0.85, 0.08, 0.12]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.085, 0.075, 0.17, 20]} />
          <meshStandardMaterial color={CREAM} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.07, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.02, 20]} />
          <meshStandardMaterial color="#4a2f1d" roughness={0.3} />
        </mesh>
        <mesh position={[0.1, 0, 0]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.045, 0.014, 8, 18]} />
          <meshStandardMaterial color={CREAM} />
        </mesh>
      </group>
      {/* desk lamp */}
      <group position={[-1.25, 0, -0.32]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.13, 0.15, 0.04, 20]} />
          <meshStandardMaterial color={FOREST} />
        </mesh>
        <mesh position={[0, 0.26, 0]} rotation-z={-0.24}>
          <cylinderGeometry args={[0.02, 0.02, 0.52, 10]} />
          <meshStandardMaterial color={FOREST} />
        </mesh>
        <mesh position={[0.14, 0.52, 0]} rotation-z={-0.8} castShadow>
          <coneGeometry args={[0.15, 0.22, 18, 1, true]} />
          <meshStandardMaterial color={LIME} side={2} roughness={0.6} />
        </mesh>
        <pointLight
          position={[0.18, 0.45, 0]}
          intensity={2.2}
          distance={3.2}
          color="#ffe6b5"
        />
      </group>
    </group>
  );
}

function Chair({ reducedMotion }: { reducedMotion: boolean }) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (reducedMotion || !ref.current) return;
    ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.25) * 0.06;
  });
  return (
    <group ref={ref} position={[0, 0, -1.25]}>
      <mesh position={[0, 0.06, 0]} castShadow>
        <cylinderGeometry args={[0.36, 0.42, 0.06, 5]} />
        <meshStandardMaterial color={CHARCOAL} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 12]} />
        <meshStandardMaterial color="#3a403d" metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.56, 0]} castShadow>
        <boxGeometry args={[0.58, 0.1, 0.56]} />
        <meshStandardMaterial color={FOREST} roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.94, -0.26]} rotation-x={-0.14} castShadow>
        <boxGeometry args={[0.56, 0.66, 0.1]} />
        <meshStandardMaterial color={FOREST} roughness={0.85} />
      </mesh>
      {[-0.34, 0.34].map((x) => (
        <mesh key={x} position={[x, 0.72, -0.02]} castShadow>
          <boxGeometry args={[0.07, 0.06, 0.4]} />
          <meshStandardMaterial color={CHARCOAL} />
        </mesh>
      ))}
    </group>
  );
}

function Shelves() {
  const bottles: Array<[number, number, string]> = [
    [-0.3, 1.34, LIME],
    [-0.05, 1.34, "#5fa8d3"],
    [0.22, 1.34, CREAM],
    [-0.2, 2.02, "#e0a34a"],
    [0.1, 2.02, LIME],
  ];
  return (
    <group position={[5.45, 0, -1.0]} rotation-y={-Math.PI / 2}>
      {/* uprights */}
      {[-1.0, 1.0].map((x) => (
        <mesh key={x} position={[x, 1.3, 0]} castShadow>
          <boxGeometry args={[0.08, 2.6, 0.5]} />
          <meshStandardMaterial color={WOOD_DARK} />
        </mesh>
      ))}
      {[0.66, 1.3, 1.96, 2.56].map((y) => (
        <mesh key={y} position={[0, y, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.1, 0.06, 0.5]} />
          <meshStandardMaterial color={WOOD} roughness={0.6} />
        </mesh>
      ))}
      {/* supply bottles */}
      {bottles.map(([x, y, c], i) => (
        <group key={i} position={[x, y + 0.14, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.07, 0.08, 0.26, 14]} />
            <meshStandardMaterial color={c} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.17, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.09, 10]} />
            <meshStandardMaterial color={CHARCOAL} />
          </mesh>
        </group>
      ))}
      {/* folded towels */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0.6, 0.76 + i * 0.09, 0]} castShadow>
          <boxGeometry args={[0.42, 0.08, 0.32]} />
          <meshStandardMaterial color={i % 2 ? CREAM : "#cfe3b6"} />
        </mesh>
      ))}
      {/* bucket + mop */}
      <group position={[-0.62, 0.78, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.17, 0.13, 0.22, 18]} />
          <meshStandardMaterial color={LIME} roughness={0.5} />
        </mesh>
      </group>
      <mesh position={[0.92, 2.2, 0.12]} rotation-z={0.12} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 1.3, 10]} />
        <meshStandardMaterial color={WOOD} />
      </mesh>
    </group>
  );
}

function LawnMower() {
  return (
    <group position={[-3.9, 0, 0.4]} rotation-y={0.5}>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.86, 0.3, 0.66]} />
        <meshStandardMaterial color={FOREST} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.54, -0.04]} castShadow>
        <boxGeometry args={[0.36, 0.22, 0.3]} />
        <meshStandardMaterial color={CHARCOAL} />
      </mesh>
      {[
        [-0.38, 0.28],
        [0.38, 0.28],
        [-0.38, -0.28],
        [0.38, -0.28],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.13, z]} rotation-z={Math.PI / 2} castShadow>
          <cylinderGeometry args={[0.13, 0.13, 0.1, 16]} />
          <meshStandardMaterial color="#20241f" roughness={0.9} />
        </mesh>
      ))}
      {/* handle */}
      {[-0.3, 0.3].map((x) => (
        <mesh key={x} position={[x, 0.64, 0.42]} rotation-x={0.75} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 1.0, 10]} />
          <meshStandardMaterial color="#9aa3a0" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 0.96, 0.72]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.028, 0.028, 0.62, 10]} />
        <meshStandardMaterial color={LIME} />
      </mesh>
      {/* grass bag hint */}
      <mesh position={[0, 0.38, -0.5]} castShadow>
        <boxGeometry args={[0.5, 0.34, 0.26]} />
        <meshStandardMaterial color="#6d7a52" roughness={0.95} />
      </mesh>
    </group>
  );
}

function JunkZone() {
  return (
    <group position={[3.4, 0, 2.2]} rotation-y={-0.35}>
      {/* dolly */}
      <group position={[-0.7, 0, 0]} rotation-y={0.4}>
        <mesh position={[0, 0.75, 0]} rotation-x={-0.12} castShadow>
          <boxGeometry args={[0.5, 1.5, 0.06]} />
          <meshStandardMaterial color="#b3392f" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.06, 0.16]} castShadow>
          <boxGeometry args={[0.52, 0.06, 0.34]} />
          <meshStandardMaterial color="#8f2f27" />
        </mesh>
        {[-0.3, 0.3].map((x) => (
          <mesh key={x} position={[x, 0.16, -0.1]} rotation-z={Math.PI / 2} castShadow>
            <cylinderGeometry args={[0.16, 0.16, 0.07, 16]} />
            <meshStandardMaterial color="#1f2320" />
          </mesh>
        ))}
      </group>
      {/* boxes */}
      <mesh position={[0.5, 0.26, 0]} rotation-y={0.2} castShadow receiveShadow>
        <boxGeometry args={[0.66, 0.52, 0.6]} />
        <meshStandardMaterial color="#c49a६6".replace("६", "6")} roughness={0.9} />
      </mesh>
      <mesh position={[0.56, 0.72, 0.06]} rotation-y={-0.32} castShadow>
        <boxGeometry args={[0.5, 0.4, 0.48]} />
        <meshStandardMaterial color="#b98f5e" roughness={0.9} />
      </mesh>
      <mesh position={[1.15, 0.2, 0.3]} rotation-y={0.8} castShadow>
        <boxGeometry args={[0.44, 0.4, 0.42]} />
        <meshStandardMaterial color="#cfa878" roughness={0.9} />
      </mesh>
      {/* bagged debris */}
      <mesh position={[1.25, 0.28, -0.42]} castShadow>
        <sphereGeometry args={[0.28, 16, 12]} />
        <meshStandardMaterial color="#3a3f3c" roughness={0.95} />
      </mesh>
    </group>
  );
}

function TreeCareWall() {
  return (
    <group position={[-5.6, 0, -2.0]} rotation-y={Math.PI / 2}>
      {/* wall rack */}
      <mesh position={[0, 1.45, 0]} castShadow>
        <boxGeometry args={[1.7, 0.08, 0.22]} />
        <meshStandardMaterial color={WOOD_DARK} />
      </mesh>
      {/* chainsaw, stored on rack, bar guarded */}
      <group position={[0, 1.62, 0.02]}>
        <mesh castShadow>
          <boxGeometry args={[0.52, 0.26, 0.2]} />
          <meshStandardMaterial color="#d8641f" roughness={0.45} />
        </mesh>
        <mesh position={[0.1, 0.18, 0]}>
          <boxGeometry args={[0.34, 0.1, 0.16]} />
          <meshStandardMaterial color={CHARCOAL} />
        </mesh>
        <mesh position={[0.62, -0.02, 0]} castShadow>
          <boxGeometry args={[0.76, 0.1, 0.05]} />
          <meshStandardMaterial color="#9aa3a0" metalness={0.6} roughness={0.35} />
        </mesh>
        {/* orange bar guard */}
        <mesh position={[0.62, -0.02, 0]}>
          <boxGeometry args={[0.8, 0.14, 0.09]} />
          <meshStandardMaterial color={LIME} transparent opacity={0.55} />
        </mesh>
      </group>
      {/* pole pruner + rake leaning */}
      <mesh position={[-0.7, 0.9, 0.16]} rotation-z={0.1} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 1.8, 10]} />
        <meshStandardMaterial color={WOOD} />
      </mesh>
      <mesh position={[-0.9, 0.9, 0.16]} rotation-z={0.16} castShadow>
        <cylinderGeometry args={[0.028, 0.028, 1.8, 10]} />
        <meshStandardMaterial color="#6f7a75" metalness={0.4} />
      </mesh>
      {/* helmet + gloves on shelf */}
      <mesh position={[0.78, 1.58, 0]} castShadow>
        <sphereGeometry args={[0.16, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={LIME} />
      </mesh>
    </group>
  );
}

function Room() {
  return (
    <group>
      {/* floor */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#a4784d" roughness={0.85} />
      </mesh>
      {/* rug */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.012, -0.6]} receiveShadow>
        <planeGeometry args={[5.2, 4]} />
        <meshStandardMaterial color="#d9cfb4" roughness={1} />
      </mesh>
      {/* back wall with window opening */}
      <group position={[0, 0, -5.2]}>
        <mesh position={[-3.9, 1.8, 0]} receiveShadow>
          <boxGeometry args={[4.4, 3.6, 0.2]} />
          <meshStandardMaterial color={WALL} roughness={1} />
        </mesh>
        <mesh position={[3.9, 1.8, 0]} receiveShadow>
          <boxGeometry args={[4.4, 3.6, 0.2]} />
          <meshStandardMaterial color={WALL} roughness={1} />
        </mesh>
        <mesh position={[0, 3.25, 0]} receiveShadow>
          <boxGeometry args={[3.4, 0.7, 0.2]} />
          <meshStandardMaterial color={WALL} roughness={1} />
        </mesh>
        <mesh position={[0, 0.5, 0]} receiveShadow>
          <boxGeometry args={[3.4, 1.0, 0.2]} />
          <meshStandardMaterial color={WALL} roughness={1} />
        </mesh>
        {/* window glass + frame */}
        <mesh position={[0, 1.95, 0]}>
          <boxGeometry args={[3.4, 2.2, 0.04]} />
          <meshStandardMaterial
            color="#cfe7f2"
            transparent
            opacity={0.35}
            roughness={0.1}
            metalness={0.1}
          />
        </mesh>
        <mesh position={[0, 1.95, 0.04]}>
          <boxGeometry args={[0.07, 2.2, 0.07]} />
          <meshStandardMaterial color={CREAM} />
        </mesh>
        <mesh position={[0, 1.95, 0.04]}>
          <boxGeometry args={[3.4, 0.07, 0.07]} />
          <meshStandardMaterial color={CREAM} />
        </mesh>
        {/* outdoor backdrop */}
        <mesh position={[0, 1.6, -1.6]}>
          <planeGeometry args={[9, 6]} />
          <meshBasicMaterial color="#bfe0ef" />
        </mesh>
        <mesh position={[0, -0.1, -1.4]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[9, 6]} />
          <meshBasicMaterial color="#79a martial" />
        </mesh>
      </group>
      {/* side walls */}
      <mesh position={[-6, 1.8, 0]} rotation-y={Math.PI / 2} receiveShadow>
        <planeGeometry args={[10.4, 3.6]} />
        <meshStandardMaterial color={WALL} roughness={1} />
      </mesh>
      <mesh position={[6, 1.8, 0]} rotation-y={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[10.4, 3.6]} />
        <meshStandardMaterial color={WALL} roughness={1} />
      </mesh>
      {/* ceiling */}
      <mesh position={[0, 3.6, 0]} rotation-x={Math.PI / 2}>
        <planeGeometry args={[12, 10.4]} />
        <meshStandardMaterial color="#f3ecdd" roughness={1} />
      </mesh>
      {/* baseboards */}
      <mesh position={[0, 0.07, -5.08]}>
        <boxGeometry args={[12, 0.14, 0.06]} />
        <meshStandardMaterial color={CREAM} />
      </mesh>
    </group>
  );
}

function DustMotes({ reducedMotion }: { reducedMotion: boolean }) {
  const ref = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: 42 }, () => ({
        x: (Math.random() - 0.5) * 5,
        y: 0.6 + Math.random() * 2.4,
        z: -4.4 + Math.random() * 3.4,
        s: 0.4 + Math.random(),
      })),
    [],
  );

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = reducedMotion ? 0 : clock.elapsedTime;
    seeds.forEach((p, i) => {
      dummy.position.set(
        p.x + Math.sin(t * 0.18 * p.s + i) * 0.22,
        p.y + Math.sin(t * 0.12 * p.s + i * 2) * 0.18,
        p.z + Math.cos(t * 0.15 * p.s + i) * 0.18,
      );
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, seeds.length]}>
      <sphereGeometry args={[0.015, 6, 6]} />
      <meshBasicMaterial color="#fff6dd" transparent opacity={0.55} />
    </instancedMesh>
  );
}

export function OfficeScene({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <>
      <color attach="background" args={["#e8e2d3"]} />
      <hemisphereLight args={["#dfefff", "#8a6b4a", 0.75]} />
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[-2.5, 6, -7]}
        intensity={2.4}
        color="#fff2d8"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
      />
      <pointLight position={[0, 3.2, 0]} intensity={0.6} color="#fff0d2" />

      <Room />
      <Desk />
      <Monitor />
      <DeskProps />
      <Chair reducedMotion={reducedMotion} />
      <Shelves />
      <LawnMower />
      <JunkZone />
      <TreeCareWall />
      <WallClock position={[-3.2, 2.6, -5.05]} />
      <DustMotes reducedMotion={reducedMotion} />
    </>
  );
}
