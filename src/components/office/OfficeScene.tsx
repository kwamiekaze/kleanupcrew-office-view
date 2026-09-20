import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, useTexture } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import type { Group, Mesh, MeshBasicMaterial } from "three";
import { MeshStandardMaterial, SRGBColorSpace, Vector3 } from "three";
import { Butterflies } from "./Butterflies";
import { WallCalendar } from "./WallCalendar";
import { WallClock } from "./WallClock";
import { BRAND_LOGO } from "@/lib/brand";

const WOOD = "#8a5a33";
const WOOD_DARK = "#5e3c22";
const CREAM = "#efe6d3";
const WALL = "#e6dcc6";
const FOREST = "#274d34";
const LIME = "#8fd14f";
const CHARCOAL = "#2b302e";

function SprayBottle({
  position,
  color,
  scale = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.13, 0]} castShadow>
        <cylinderGeometry args={[0.066, 0.086, 0.26, 18]} />
        <meshStandardMaterial color={color} roughness={0.36} />
      </mesh>
      <mesh position={[0, 0.285, 0]} castShadow>
        <cylinderGeometry args={[0.032, 0.045, 0.07, 14]} />
        <meshStandardMaterial color={CREAM} roughness={0.4} />
      </mesh>
      <mesh position={[0.035, 0.34, 0]} rotation-z={-0.28} castShadow>
        <boxGeometry args={[0.13, 0.045, 0.055]} />
        <meshStandardMaterial color={CREAM} roughness={0.42} />
      </mesh>
      <mesh position={[-0.006, 0.13, 0.098]}>
        <planeGeometry args={[0.095, 0.1]} />
        <meshStandardMaterial color="#f4f0e4" roughness={0.72} />
      </mesh>
      <mesh position={[-0.006, 0.145, 0.101]}>
        <circleGeometry args={[0.018, 12]} />
        <meshBasicMaterial color={LIME} />
      </mesh>
    </group>
  );
}

function DetailedWheel({
  position,
  radius = 0.16,
}: {
  position: [number, number, number];
  radius?: number;
}) {
  return (
    <group position={position} rotation-y={Math.PI / 2}>
      <mesh castShadow>
        <torusGeometry args={[radius * 0.72, radius * 0.28, 8, 14]} />
        <meshStandardMaterial color="#202421" roughness={0.92} />
      </mesh>
      <mesh rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[radius * 0.44, radius * 0.44, 0.075, 12]} />
        <meshStandardMaterial color={LIME} roughness={0.42} />
      </mesh>
    </group>
  );
}

function Desk() {
  return (
    <group position={[0, 0, -2.4]}>
      <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.0, 0.08, 1.35]} />
        <meshStandardMaterial color={WOOD} roughness={0.55} />
      </mesh>
      {(
        [
          [-1.4, 0.55],
          [1.4, 0.55],
          [-1.4, -0.55],
          [1.4, -0.55],
        ] as Array<[number, number]>
      ).map(([x, z], i) => (
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
  const source = useTexture(BRAND_LOGO);
  const logo = useMemo(() => {
    // Frame the original square artwork without stretching or modifying it.
    const texture = source.clone();
    texture.colorSpace = SRGBColorSpace;
    texture.repeat.set(1, 0.24);
    texture.offset.set(0, 0.38);
    texture.anisotropy = 4;
    texture.needsUpdate = true;
    return texture;
  }, [source]);
  useEffect(() => () => logo.dispose(), [logo]);

  return (
    <group position={[0, 0.78, -2.75]}>
      {/* Soft contact patch anchors the monitor without a harsh floating shadow. */}
      <mesh position={[0, 0.006, 0.015]} rotation-x={-Math.PI / 2} renderOrder={1}>
        <circleGeometry args={[0.3, 48]} />
        <meshBasicMaterial
          color="#34251c"
          transparent
          opacity={0.12}
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={-1}
        />
      </mesh>
      {/* machined elliptical foot */}
      <mesh position={[0, 0.012, 0.01]} scale={[1.75, 1, 1]} castShadow receiveShadow>
        <cylinderGeometry args={[0.16, 0.168, 0.024, 40]} />
        <meshStandardMaterial color="#c0c5c9" metalness={0.3} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.026, 0.01]} scale={[1.7, 1, 1]}>
        <cylinderGeometry args={[0.15, 0.15, 0.006, 40]} />
        <meshStandardMaterial color="#d7dbde" metalness={0.28} roughness={0.26} />
      </mesh>
      {/* slim tapered neck with a hinge collar */}
      <mesh position={[0, 0.25, -0.01]} rotation-x={0.04} castShadow>
        <boxGeometry args={[0.13, 0.44, 0.032]} />
        <meshStandardMaterial color="#c0c5c9" metalness={0.3} roughness={0.32} />
      </mesh>
      <mesh position={[0, 0.462, 0]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.028, 0.028, 0.15, 18]} />
        <meshStandardMaterial color="#aab0b4" metalness={0.3} roughness={0.34} />
      </mesh>
      <group position={[0, 0.62, 0.02]} rotation-x={-0.06}>
        {/* thin display sandwich: dark bezel face over an aluminium housing */}
        <mesh position={[0, 0, 0.014]} castShadow>
          <boxGeometry args={[1.185, 0.665, 0.022]} />
          <meshStandardMaterial color="#1b1e20" roughness={0.42} metalness={0.2} />
        </mesh>
        <mesh position={[0, -0.005, -0.012]} castShadow>
          <boxGeometry args={[1.11, 0.6, 0.034]} />
          <meshStandardMaterial color="#b8bdc1" metalness={0.3} roughness={0.34} />
        </mesh>
        <mesh position={[0, 0, 0.032]}>
          <planeGeometry args={[1.14, 0.62]} />
          <meshBasicMaterial color="#fdfef8" toneMapped={false} />
        </mesh>
        {/* KleanupCrew dispatch dashboard */}
        <mesh position={[0, 0.14, 0.041]}>
          <planeGeometry args={[1.1, 0.264]} />
          <meshBasicMaterial map={logo} toneMapped={false} />
        </mesh>
        {[-0.01, -0.12, -0.23].map((y, index) => (
          <group key={y} position={[0, y, 0.038]}>
            <mesh position={[-0.4, 0, 0]}>
              <circleGeometry args={[0.026, 12]} />
              <meshBasicMaterial color={index === 1 ? "#f0b44d" : LIME} />
            </mesh>
            <mesh position={[-0.14, 0, 0]}>
              <planeGeometry args={[0.4, 0.028]} />
              <meshBasicMaterial color="#779181" />
            </mesh>
            <mesh position={[0.35, 0, 0]}>
              <planeGeometry args={[0.19, 0.055]} />
              <meshBasicMaterial color="#4f8b5d" />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/** Key widths per row, in units; each row is normalised to the deck width. */
const KEY_ROWS: ReadonlyArray<ReadonlyArray<number>> = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.6],
  [1.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.1],
  [1.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.85],
  [2.25, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.35],
  [1, 1, 1, 1.35, 6.3, 1.35, 1, 1, 1],
];

/** Slim aluminium keyboard with a full sculpted key field. */
function Keyboard() {
  const keys = useMemo(() => {
    const deck = 0.68;
    const gap = 0.0045;
    const pitch = 0.0335;
    const placed: Array<{
      id: string;
      x: number;
      z: number;
      width: number;
      depth: number;
    }> = [];

    KEY_ROWS.forEach((row, rowIndex) => {
      const units = row.reduce((total, unit) => total + unit, 0);
      const unit = (deck - gap * (row.length - 1)) / units;
      const isFunctionRow = rowIndex === 0;
      let cursor = -deck / 2;

      row.forEach((widthUnits, keyIndex) => {
        const width = unit * widthUnits;
        placed.push({
          id: `${rowIndex}-${keyIndex}`,
          x: cursor + width / 2,
          z: -0.085 + rowIndex * pitch + (isFunctionRow ? 0.006 : 0),
          width,
          depth: isFunctionRow ? 0.017 : 0.027,
        });
        cursor += width + gap;
      });
    });

    return placed;
  }, []);

  return (
    <group position={[0, 0, 0.28]}>
      {/* brushed aluminium deck with a darker underbody for a thin edge */}
      <mesh position={[0, 0.011, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.735, 0.014, 0.245]} />
        <meshStandardMaterial color="#d5d9dc" metalness={0.32} roughness={0.34} />
      </mesh>
      <mesh position={[0, 0.003, 0]}>
        <boxGeometry args={[0.72, 0.008, 0.232]} />
        <meshStandardMaterial color="#9ba1a5" metalness={0.25} roughness={0.45} />
      </mesh>
      {keys.map(({ id, x, z, width, depth }) => (
        <mesh key={id} position={[x, 0.0225, z]} castShadow>
          <boxGeometry args={[width, 0.009, depth]} />
          <meshStandardMaterial color="#191c1f" roughness={0.68} />
        </mesh>
      ))}
    </group>
  );
}

/** Seamless low-profile mouse on a stitched desk mat. */
function DeskMouse() {
  return (
    <group position={[0.55, 0, 0.3]}>
      <mesh position={[0, 0.005, 0]} receiveShadow>
        <boxGeometry args={[0.34, 0.01, 0.38]} />
        <meshStandardMaterial color="#313f38" roughness={0.96} />
      </mesh>
      <mesh position={[0, 0.0105, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[0.31, 0.35]} />
        <meshStandardMaterial color="#38473f" roughness={0.98} />
      </mesh>
      {/* dark underbody, then the seamless white shell over it */}
      <mesh position={[0, 0.018, 0]} scale={[0.069, 0.012, 0.108]} castShadow>
        <sphereGeometry args={[1, 28, 18]} />
        <meshStandardMaterial color="#3d4440" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.019, 0.006]} scale={[0.062, 0.023, 0.125]} castShadow>
        <sphereGeometry args={[1, 34, 22, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#f5f5f2" roughness={0.16} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.0188, 0.006]} scale={[0.063, 0.005, 0.126]}>
        <sphereGeometry args={[1, 26, 12]} />
        <meshStandardMaterial color="#d8d9d5" roughness={0.4} />
      </mesh>
    </group>
  );
}

/** Wisps of steam drifting off a hot mug. */
function MugSteam({ reducedMotion }: { reducedMotion: boolean }) {
  const puffs = useRef<Array<Mesh | null>>([]);
  const count = 10;

  useFrame(({ clock }) => {
    const time = reducedMotion ? 2.4 : clock.elapsedTime;
    puffs.current.forEach((puff, index) => {
      if (!puff) return;
      const life = (time * 0.22 + index / count) % 1;
      const sway = Math.sin(life * 3.1 + index * 2.4);
      // the plume widens and wanders as it climbs, rather than stacking
      puff.position.set(
        sway * 0.055 * life + (index % 3 === 0 ? 0.012 : -0.008),
        0.05 + life * 0.3,
        Math.cos(life * 2.6 + index) * 0.03 * life,
      );
      puff.scale.setScalar(0.32 + life * 1.85);
      const material = puff.material as MeshBasicMaterial;
      material.opacity = Math.sin(life * Math.PI) * 0.17;
    });
  });

  return (
    <group>
      {Array.from({ length: count }, (_, index) => (
        <mesh
          key={index}
          ref={(node) => {
            puffs.current[index] = node;
          }}
        >
          <sphereGeometry args={[0.028, 12, 9]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function DeskProps({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <group position={[0, 0.78, -2.4]}>
      <Keyboard />
      <DeskMouse />
      {/* clipboard / notebook */}
      <group position={[-0.95, 0.02, 0.2]} rotation-y={Math.PI + 0.32}>
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
      <group position={[0.85, 0.09, 0.12]}>
        {/* A restrained oval contact shadow keeps the mug grounded on the desk. */}
        <mesh
          position={[0.018, -0.084, 0.012]}
          rotation-x={-Math.PI / 2}
          scale={[1.25, 0.62, 1]}
          renderOrder={1}
        >
          <circleGeometry args={[0.1, 40]} />
          <meshBasicMaterial
            color="#3c2b20"
            transparent
            opacity={0.13}
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-1}
          />
        </mesh>
        <mesh castShadow>
          <cylinderGeometry args={[0.085, 0.075, 0.17, 32, 1, true]} />
          <meshStandardMaterial color={CREAM} roughness={0.5} side={2} />
        </mesh>
        {/* The mug is filled generously, well clear of the rim. */}
        <mesh position={[0, 0.035, 0]}>
          <cylinderGeometry args={[0.081, 0.081, 0.006, 40]} />
          <meshBasicMaterial color="#2a1008" />
        </mesh>
        <mesh position={[0, -0.084, 0]} rotation-x={-Math.PI / 2}>
          <circleGeometry args={[0.075, 32]} />
          <meshStandardMaterial color={CREAM} roughness={0.5} side={2} />
        </mesh>
        <mesh position={[0, 0.085, 0]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.077, 0.008, 10, 32]} />
          <meshStandardMaterial color={CREAM} roughness={0.3} />
        </mesh>
        {/* C-shaped handle. Its two open ends are buried in the mug wall below
            the coffee line, so it reads as joined to the cup without any part of
            it showing inside the drink. */}
        <mesh position={[0.0935, -0.02, 0]} rotation-z={-2.094} castShadow>
          <torusGeometry args={[0.0467, 0.012, 14, 40, 4.19]} />
          <meshStandardMaterial color={CREAM} roughness={0.3} />
        </mesh>
        <MugSteam reducedMotion={reducedMotion} />
      </group>
      {/* desk lamp */}
      <group position={[-1.25, 0, -0.32]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.19, 0.21, 0.045, 40]} />
          <meshStandardMaterial color={FOREST} metalness={0.45} roughness={0.28} />
        </mesh>
        <mesh position={[0, 0.28, 0]}>
          <cylinderGeometry args={[0.018, 0.024, 0.55, 16]} />
          <meshStandardMaterial color="#bfa16a" metalness={0.75} roughness={0.25} />
        </mesh>
        <mesh position={[0.1, 0.53, 0]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.018, 0.018, 0.2, 16]} />
          <meshStandardMaterial color="#bfa16a" metalness={0.75} roughness={0.25} />
        </mesh>
        <group position={[0.2, 0.51, 0]} rotation-z={-0.18}>
          <mesh castShadow>
            <cylinderGeometry args={[0.075, 0.22, 0.2, 40, 1, true]} />
            <meshStandardMaterial color={FOREST} metalness={0.35} side={2} roughness={0.28} />
          </mesh>
          <mesh position={[0, -0.1, 0]} rotation-x={Math.PI / 2}>
            <torusGeometry args={[0.216, 0.009, 10, 40]} />
            <meshStandardMaterial color="#cbb078" metalness={0.7} roughness={0.25} />
          </mesh>
          <mesh position={[0, -0.082, 0]} rotation-x={Math.PI / 2}>
            <circleGeometry args={[0.205, 32]} />
            <meshStandardMaterial
              color="#fff0cd"
              emissive="#ffd995"
              emissiveIntensity={0.8}
              side={2}
            />
          </mesh>
          <pointLight position={[0, -0.15, 0]} intensity={0.8} distance={2} color="#ffe3ae" />
        </group>
      </group>
    </group>
  );
}

function Chair({ reducedMotion }: { reducedMotion: boolean }) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (reducedMotion || !ref.current) return;
    ref.current.rotation.y = Math.PI + Math.sin(clock.elapsedTime * 0.25) * 0.04;
  });
  return (
    <group ref={ref} position={[0, 0, -1.25]} rotation-y={Math.PI}>
      {/* five-star base, each arm ending in a caster */}
      {[0, 1, 2, 3, 4].map((index) => (
        <group key={index} rotation-y={(index / 5) * Math.PI * 2}>
          <mesh position={[0, 0.078, 0.2]} rotation-x={0.05} castShadow>
            <boxGeometry args={[0.072, 0.042, 0.4]} />
            <meshStandardMaterial color="#464c50" metalness={0.32} roughness={0.44} />
          </mesh>
          <mesh position={[0, 0.062, 0.375]} castShadow>
            <boxGeometry args={[0.03, 0.05, 0.03]} />
            <meshStandardMaterial color="#2a2f31" metalness={0.5} roughness={0.45} />
          </mesh>
          <mesh position={[0, 0.04, 0.378]} rotation-z={Math.PI / 2} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.026, 16]} />
            <meshStandardMaterial color="#1b1e20" roughness={0.72} />
          </mesh>
        </group>
      ))}
      {/* gas lift with a polished column */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.072, 0.26, 18]} />
        <meshStandardMaterial color="#3a3f42" metalness={0.3} roughness={0.46} />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.032, 0.032, 0.24, 16]} />
        <meshStandardMaterial color="#cdd2d6" metalness={0.35} roughness={0.24} />
      </mesh>
      {/* seat pan and cushion */}
      <mesh position={[0, 0.5, 0.01]} castShadow>
        <boxGeometry args={[0.42, 0.05, 0.38]} />
        <meshStandardMaterial color="#33393c" metalness={0.45} roughness={0.48} />
      </mesh>
      <mesh position={[0, 0.575, 0.015]} scale={[0.33, 0.072, 0.315]} castShadow>
        <sphereGeometry args={[1, 30, 20]} />
        <meshStandardMaterial color={FOREST} roughness={0.84} />
      </mesh>
      <mesh position={[0, 0.575, 0.015]} scale={[0.3, 0.05, 0.285]}>
        <sphereGeometry args={[1, 26, 16]} />
        <meshStandardMaterial color="#2f5a3e" roughness={0.88} />
      </mesh>
      {/* spine linking the seat to the contoured back */}
      <mesh position={[0, 0.66, -0.26]} rotation-x={-0.2} castShadow>
        <boxGeometry args={[0.11, 0.36, 0.045]} />
        <meshStandardMaterial color="#33393c" metalness={0.5} roughness={0.42} />
      </mesh>
      <group position={[0, 0.95, -0.24]} rotation-x={-0.16}>
        <mesh position={[0, 0, 0.46]} castShadow>
          <cylinderGeometry
            args={[0.46, 0.46, 0.58, 30, 1, true, Math.PI - 0.65, 1.3]}
          />
          <meshStandardMaterial color={FOREST} roughness={0.82} side={2} />
        </mesh>
        <mesh position={[0, -0.16, 0.455]}>
          <cylinderGeometry
            args={[0.45, 0.45, 0.2, 26, 1, true, Math.PI - 0.58, 1.16]}
          />
          <meshStandardMaterial color="#2f5a3e" roughness={0.86} side={2} />
        </mesh>
      </group>
      {/* armrests */}
      {[-0.3, 0.3].map((x) => (
        <group key={x} position={[x, 0, -0.02]}>
          <mesh position={[0, 0.61, 0]} castShadow>
            <boxGeometry args={[0.034, 0.2, 0.05]} />
            <meshStandardMaterial color="#33393c" metalness={0.5} roughness={0.44} />
          </mesh>
          <mesh position={[0, 0.728, 0.03]} castShadow>
            <boxGeometry args={[0.068, 0.032, 0.26]} />
            <meshStandardMaterial color="#1f2426" roughness={0.68} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function CleaningEquipment() {
  return (
    <group>
      {/* Push broom: flat head block, dense bristle pad, shaped collar. */}
      <group position={[1.48, 0, 0.22]} rotation-z={-0.06}>
        <mesh position={[0, 0.88, 0]} castShadow>
          <cylinderGeometry args={[0.022, 0.025, 1.5, 10]} />
          <meshStandardMaterial color="#b67a3d" roughness={0.72} />
        </mesh>
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.032, 0.042, 0.14, 8]} />
          <meshStandardMaterial color={FOREST} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.115, 0.01]} castShadow>
          <boxGeometry args={[0.48, 0.08, 0.15]} />
          <meshStandardMaterial color={FOREST} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.04, 0.01]} castShadow>
          <boxGeometry args={[0.46, 0.13, 0.13]} />
          <meshStandardMaterial color="#c8a05a" roughness={1} />
        </mesh>
        {[-0.14, 0, 0.14].map((x) => (
          <mesh key={x} position={[x, 0.04, 0.068]}>
            <boxGeometry args={[0.014, 0.12, 0.006]} />
            <meshStandardMaterial color="#9a7639" roughness={1} />
          </mesh>
        ))}
      </group>

      {/* Long-handled dustpan: sloped floor, side walls, rubber lip. */}
      <group position={[1.84, 0, 0.04]} rotation-z={0.025}>
        <mesh position={[0, 0.7, -0.03]} castShadow>
          <cylinderGeometry args={[0.017, 0.021, 1.16, 10]} />
          <meshStandardMaterial color="#52615a" roughness={0.6} metalness={0.16} />
        </mesh>
        <mesh position={[0, 1.3, -0.03]} rotation-x={Math.PI / 2} castShadow>
          <torusGeometry args={[0.07, 0.018, 6, 14, Math.PI]} />
          <meshStandardMaterial color={FOREST} roughness={0.54} />
        </mesh>
        <mesh position={[0, 0.08, 0.05]} rotation-x={-0.2} castShadow>
          <boxGeometry args={[0.34, 0.022, 0.3] } />
          <meshStandardMaterial color={FOREST} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.16, -0.1]} castShadow>
          <boxGeometry args={[0.34, 0.2, 0.024]} />
          <meshStandardMaterial color={FOREST} roughness={0.5} />
        </mesh>
        {[-0.158, 0.158].map((x) => (
          <mesh key={x} position={[x, 0.12, -0.01]} castShadow>
            <boxGeometry args={[0.022, 0.13, 0.26]} />
            <meshStandardMaterial color="#315f43" roughness={0.55} />
          </mesh>
        ))}
        <mesh position={[0, 0.032, 0.19]}>
          <boxGeometry args={[0.35, 0.014, 0.055]} />
          <meshStandardMaterial color={LIME} roughness={0.6} />
        </mesh>
      </group>

      {/* Upright vacuum: floor head, clear dust canister, motor body, handle. */}
      <group position={[-1.48, 0, 0.28]}>
        <mesh position={[0, 0.07, 0.13]} castShadow receiveShadow>
          <boxGeometry args={[0.46, 0.1, 0.3]} />
          <meshStandardMaterial color={FOREST} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.115, 0.27]}>
          <boxGeometry args={[0.42, 0.05, 0.05]} />
          <meshStandardMaterial color={LIME} roughness={0.45} />
        </mesh>
        {[-0.2, 0.2].map((x) => (
          <mesh key={x} position={[x, 0.05, 0.03]} rotation-z={Math.PI / 2}>
            <cylinderGeometry args={[0.05, 0.05, 0.05, 10]} />
            <meshStandardMaterial color="#202624" roughness={0.8} />
          </mesh>
        ))}
        <group position={[0, 0, 0.02]} rotation-x={0.1}>
          <mesh position={[0, 0.44, -0.02]} castShadow>
            <boxGeometry args={[0.3, 0.68, 0.2]} />
            <meshStandardMaterial color="#315f43" roughness={0.46} />
          </mesh>
          <mesh position={[0, 0.44, 0.13]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.44, 14]} />
            <meshStandardMaterial color="#e3ece2" roughness={0.24} transparent opacity={0.82} />
          </mesh>
          <mesh position={[0, 0.22, 0.13]}>
            <cylinderGeometry args={[0.103, 0.103, 0.06, 14]} />
            <meshStandardMaterial color={LIME} roughness={0.4} />
          </mesh>
          {/* Slightly shallower than the body below, so the two boxes never
              share a face and the overlap cannot flicker. */}
          <mesh position={[0, 0.86, -0.021]} castShadow>
            <boxGeometry args={[0.27, 0.24, 0.185]} />
            <meshStandardMaterial color={FOREST} roughness={0.5} />
          </mesh>
          <mesh position={[0, 1.18, -0.03]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.44, 8]} />
            <meshStandardMaterial color="#8d9691" metalness={0.35} roughness={0.42} />
          </mesh>
          <mesh position={[0, 1.4, -0.03]} rotation-z={Math.PI / 2} castShadow>
            <capsuleGeometry args={[0.032, 0.2, 4, 8]} />
            <meshStandardMaterial color={CHARCOAL} roughness={0.5} />
          </mesh>
          <mesh position={[0.18, 0.48, 0.02]} rotation-z={0.3}>
            <torusGeometry args={[0.15, 0.026, 6, 14, Math.PI * 1.05]} />
            <meshStandardMaterial color="#2a4d38" roughness={0.7} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function Shelves() {
  const bottles: Array<[number, number, string, number]> = [
    [-0.62, 1.36, FOREST, 0.9],
    [-0.3, 1.36, "#62a8c8", 0.86],
    [-0.6, 2.02, "#e0a34a", 0.92],
    [-0.28, 2.02, LIME, 0.88],
  ];

  return (
    <group position={[5.45, 0, -1.0]} rotation-y={-Math.PI / 2}>
      {/* Carcass: back panel, side panels, a capped top and a recessed plinth. */}
      <mesh position={[0, 1.62, -0.3]} receiveShadow>
        <boxGeometry args={[2.0, 2.52, 0.05]} />
        <meshStandardMaterial
          color="#7c5331"
          roughness={0.86}
          polygonOffset
          polygonOffsetFactor={1}
          polygonOffsetUnits={1}
        />
      </mesh>
      {[-0.99, 0.99].map((x) => (
        <mesh key={x} position={[x, 1.58, -0.02]} castShadow receiveShadow>
          <boxGeometry args={[0.07, 2.64, 0.58]} />
          <meshStandardMaterial color={WOOD_DARK} roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, 2.94, -0.02]} castShadow>
        <boxGeometry args={[2.14, 0.08, 0.64]} />
        <meshStandardMaterial color={WOOD} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.14, -0.06]} castShadow>
        <boxGeometry args={[1.9, 0.22, 0.46]} />
        <meshStandardMaterial color="#54361f" roughness={0.84} />
      </mesh>
      {[0.66, 1.32, 1.98, 2.58].map((y) => (
        <group key={y}>
          <mesh position={[0, y, -0.02]} castShadow receiveShadow>
            <boxGeometry args={[1.92, 0.06, 0.56]} />
            <meshStandardMaterial color={WOOD} roughness={0.6} />
          </mesh>
          <mesh position={[0, y - 0.004, 0.268]}>
            <boxGeometry args={[1.92, 0.05, 0.022]} />
            <meshStandardMaterial color="#9c6a3d" roughness={0.62} />
          </mesh>
        </group>
      ))}

      {/* Trigger spray bottles */}
      {bottles.map(([x, y, color, scale]) => (
        <SprayBottle key={`${x}-${y}`} position={[x, y, 0.04]} color={color} scale={scale} />
      ))}

      {/* Detergent jug: squared bottle, neck, cap, side grip and a label. */}
      <group position={[0.2, 2.01, 0.02]}>
        <mesh position={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[0.23, 0.3, 0.17]} />
          <meshStandardMaterial color="#dfe7ea" roughness={0.34} />
        </mesh>
        <mesh position={[0, 0.33, 0]} castShadow>
          <cylinderGeometry args={[0.048, 0.068, 0.07, 12]} />
          <meshStandardMaterial color="#dfe7ea" roughness={0.34} />
        </mesh>
        <mesh position={[0, 0.385, 0]} castShadow>
          <cylinderGeometry args={[0.054, 0.054, 0.05, 12]} />
          <meshStandardMaterial color={FOREST} roughness={0.45} />
        </mesh>
        <mesh position={[0.145, 0.24, 0]} rotation-z={-Math.PI * 0.65} castShadow>
          <torusGeometry args={[0.058, 0.016, 6, 12, Math.PI * 1.3]} />
          <meshStandardMaterial color="#dfe7ea" roughness={0.38} />
        </mesh>
        <mesh position={[0, 0.14, 0.089]}>
          <boxGeometry args={[0.17, 0.15, 0.006]} />
          <meshStandardMaterial color={LIME} roughness={0.62} />
        </mesh>
      </group>

      {/* Scrub brush with a moulded grip */}
      <group position={[0.74, 2.01, 0.04]} rotation-y={-0.22}>
        <mesh position={[0, 0.06, 0]} castShadow>
          <boxGeometry args={[0.26, 0.05, 0.12]} />
          <meshStandardMaterial color="#c8a05a" roughness={0.68} />
        </mesh>
        <mesh position={[0, 0.022, 0]} castShadow>
          <boxGeometry args={[0.24, 0.045, 0.105]} />
          <meshStandardMaterial color="#e8dcc0" roughness={1} />
        </mesh>
        <mesh position={[0.02, 0.115, 0]} rotation-z={0.22} castShadow>
          <boxGeometry args={[0.11, 0.06, 0.075]} />
          <meshStandardMaterial color="#c8a05a" roughness={0.68} />
        </mesh>
      </group>

      {/* Upright kitchen rolls with a visible cardboard core */}
      {[0.2, 0.46].map((x) => (
        <group key={x} position={[x, 1.35, 0.02]}>
          <mesh position={[0, 0.14, 0]} castShadow>
            <cylinderGeometry args={[0.082, 0.082, 0.28, 16]} />
            <meshStandardMaterial color="#f7f3e9" roughness={0.92} />
          </mesh>
          <mesh position={[0, 0.282, 0]}>
            <cylinderGeometry args={[0.029, 0.029, 0.012, 10]} />
            <meshStandardMaterial color="#c6b191" roughness={0.95} />
          </mesh>
        </group>
      ))}

      {/* Sponges: soft block with a contrasting scouring pad */}
      {[0, 1, 2].map((index) => (
        <group
          key={index}
          position={[0.79, 1.37 + index * 0.072, 0.04]}
          rotation-y={index * 0.13}
        >
          <mesh castShadow>
            <boxGeometry args={[0.21, 0.045, 0.14]} />
            <meshStandardMaterial color="#f0c954" roughness={0.92} />
          </mesh>
          <mesh position={[0, 0.032, 0]}>
            <boxGeometry args={[0.21, 0.02, 0.14]} />
            <meshStandardMaterial color="#3f7f45" roughness={0.95} />
          </mesh>
        </group>
      ))}

      {/* Mop bucket with a bail handle */}
      <group position={[-0.58, 0.69, 0.02]}>
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.2, 0.15, 0.3, 18]} />
          <meshStandardMaterial color={FOREST} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <torusGeometry args={[0.2, 0.016, 6, 18]} />
          <meshStandardMaterial color="#315f43" roughness={0.45} />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <torusGeometry args={[0.19, 0.012, 5, 14, Math.PI]} />
          <meshStandardMaterial color="#9aa3a0" metalness={0.4} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.199, 0.189, 0.055, 18, 1, true]} />
          <meshStandardMaterial color={LIME} roughness={0.58} side={2} />
        </mesh>
      </group>

      {/* Carry caddy holding two refills */}
      <group position={[0.12, 0.69, 0.02]} rotation-y={-0.12}>
        <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.38, 0.2, 0.26]} />
          <meshStandardMaterial color={FOREST} roughness={0.55} />
        </mesh>
        <mesh position={[0, 0.205, 0]}>
          <boxGeometry args={[0.35, 0.02, 0.23]} />
          <meshStandardMaterial color="#1f3f2c" roughness={0.62} />
        </mesh>
        <mesh position={[0, 0.235, 0]}>
          <torusGeometry args={[0.1, 0.014, 5, 12, Math.PI]} />
          <meshStandardMaterial color={CHARCOAL} roughness={0.6} />
        </mesh>
        {[-0.1, 0.1].map((x) => (
          <mesh key={x} position={[x, 0.27, 0]} castShadow>
            <cylinderGeometry args={[0.034, 0.042, 0.16, 10]} />
            <meshStandardMaterial color={x < 0 ? "#62a8c8" : LIME} roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* Folded towels */}
      {[0, 1, 2].map((index) => (
        <mesh key={index} position={[0.74, 0.73 + index * 0.072, 0.02]} castShadow>
          <boxGeometry args={[0.34, 0.068, 0.26]} />
          <meshStandardMaterial color={index % 2 ? CREAM : "#cfe3b6"} roughness={0.9} />
        </mesh>
      ))}

      {/* Refill sprays and a stack of folded cloths on the top shelf */}
      <SprayBottle position={[-0.6, 2.62, 0.04]} color="#8b6bb0" scale={0.84} />
      <SprayBottle position={[-0.28, 2.62, 0.04]} color={CREAM} scale={0.8} />
      {[0, 1, 2].map((index) => (
        <mesh key={index} position={[0.26, 2.64 + index * 0.05, 0.03]} castShadow>
          <boxGeometry args={[0.28, 0.046, 0.21]} />
          <meshStandardMaterial color={index === 1 ? "#cfe3b6" : "#e8f0e2"} roughness={0.92} />
        </mesh>
      ))}

      <CleaningEquipment />
    </group>
  );
}

function LawnMower() {
  return (
    <group position={[-5.72, 0, 1.85]} rotation-y={Math.PI / 2}>
      {/* Lawn-care zone sits on the left wall, with a clear gap before Tree & Yard. */}
      <mesh position={[0, 1.55, -0.02]} castShadow receiveShadow>
        <boxGeometry args={[1.75, 1.55, 0.09]} />
        <meshStandardMaterial color="#244832" roughness={0.82} />
      </mesh>
      {[-0.5, -0.05, 0.4].map((y) => (
        <mesh key={y} position={[0, 1.55 + y, 0.065]}>
          <boxGeometry args={[1.63, 0.035, 0.025]} />
          <meshStandardMaterial color="#6d8d70" roughness={0.68} />
        </mesh>
      ))}

      {/* Cordless leaf blower: motor body, tapered nozzle, top grip, battery. */}
      <group position={[-0.1, 1.95, 0.16]} rotation-z={-0.12}>
        <mesh castShadow>
          <boxGeometry args={[0.34, 0.26, 0.22]} />
          <meshStandardMaterial color={LIME} roughness={0.42} />
        </mesh>
        <mesh position={[-0.21, 0, 0]} rotation-z={Math.PI / 2} castShadow>
          <cylinderGeometry args={[0.115, 0.13, 0.1, 12]} />
          <meshStandardMaterial color="#2f3a34" roughness={0.6} />
        </mesh>
        <mesh position={[-0.27, 0, 0]} rotation-z={-Math.PI / 2}>
          <circleGeometry args={[0.1, 12]} />
          <meshStandardMaterial color="#151b18" roughness={0.9} />
        </mesh>
        <mesh position={[0.34, 0, 0]} rotation-z={-Math.PI / 2} castShadow>
          <cylinderGeometry args={[0.07, 0.1, 0.42, 12]} />
          <meshStandardMaterial color="#2f3a34" roughness={0.55} />
        </mesh>
        <mesh position={[0.6, 0, 0]} rotation-z={-Math.PI / 2} castShadow>
          <cylinderGeometry args={[0.055, 0.07, 0.12, 12]} />
          <meshStandardMaterial color={CHARCOAL} roughness={0.55} />
        </mesh>
        <mesh position={[0.02, 0.2, 0]} castShadow>
          <boxGeometry args={[0.22, 0.07, 0.1]} />
          <meshStandardMaterial color={CHARCOAL} roughness={0.55} />
        </mesh>
        <mesh position={[-0.02, 0.12, 0]} castShadow>
          <boxGeometry args={[0.05, 0.08, 0.06]} />
          <meshStandardMaterial color="#202723" roughness={0.6} />
        </mesh>
        <mesh position={[0.02, -0.2, 0]} castShadow>
          <boxGeometry args={[0.22, 0.14, 0.18]} />
          <meshStandardMaterial color={FOREST} roughness={0.48} />
        </mesh>
      </group>

      {/* Walk-behind mower: square deck, motor cowl, four wheels, grass bag. */}
      <group position={[0, 0, 0.62]}>
        <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.92, 0.2, 0.7]} />
          <meshStandardMaterial color={FOREST} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.27, 0.37]} rotation-x={0.4} castShadow>
          <boxGeometry args={[0.9, 0.16, 0.1]} />
          <meshStandardMaterial color="#1f3f2c" roughness={0.55} />
        </mesh>
        <mesh position={[0, 0.19, 0]} castShadow>
          <boxGeometry args={[0.86, 0.1, 0.64]} />
          <meshStandardMaterial color="#1f3f2c" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.49, -0.02]} castShadow>
          <boxGeometry args={[0.4, 0.2, 0.36]} />
          <meshStandardMaterial color={LIME} roughness={0.38} />
        </mesh>
        <mesh position={[0, 0.61, -0.02]} castShadow>
          <boxGeometry args={[0.3, 0.06, 0.28]} />
          <meshStandardMaterial color="#2f3a34" roughness={0.5} />
        </mesh>
        <mesh position={[0.21, 0.5, 0.15]} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.035, 0.035, 0.05, 10]} />
          <meshStandardMaterial color={CHARCOAL} roughness={0.55} />
        </mesh>
        {(
          [
            [-0.43, 0.26],
            [0.43, 0.26],
            [-0.43, -0.26],
            [0.43, -0.26],
          ] as Array<[number, number]>
        ).map(([x, z]) => (
          <DetailedWheel key={`${x}-${z}`} position={[x, 0.16, z]} radius={0.16} />
        ))}
        <mesh position={[0, 0.45, -0.53]} rotation-x={0.26} castShadow>
          <boxGeometry args={[0.64, 0.36, 0.42]} />
          <meshStandardMaterial color="#5f6b46" roughness={0.95} />
        </mesh>
        <mesh position={[0, 0.64, -0.5]} castShadow>
          <boxGeometry args={[0.62, 0.07, 0.3]} />
          <meshStandardMaterial color={CHARCOAL} roughness={0.6} />
        </mesh>
        {/* handle sweeps back over the grass bag, clear of the engine */}
        {[-0.42, 0.42].map((x) => (
          <mesh key={x} position={[x, 0.66, -0.34]} rotation-x={-0.7} castShadow>
            <cylinderGeometry args={[0.024, 0.024, 1.0, 8]} />
            <meshStandardMaterial color="#9aa3a0" metalness={0.35} roughness={0.42} />
          </mesh>
        ))}
        <mesh position={[0, 1.06, -0.69]} rotation-z={Math.PI / 2}>
          <capsuleGeometry args={[0.03, 0.72, 4, 8]} />
          <meshStandardMaterial color={CHARCOAL} />
        </mesh>
        <mesh position={[0, 0.97, -0.64]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.014, 0.014, 0.66, 6]} />
          <meshStandardMaterial color={LIME} roughness={0.5} />
        </mesh>
      </group>

      {/* String trimmer: shaft, D-handle, guard and a spinning line head. */}
      <group position={[-0.72, 0, 0.34]} rotation-z={0.12}>
        <mesh position={[0, 0.82, 0]} castShadow>
          <cylinderGeometry args={[0.022, 0.026, 1.42, 8]} />
          <meshStandardMaterial color="#aeb8b2" metalness={0.35} roughness={0.36} />
        </mesh>
        <mesh position={[0, 1.6, 0]} castShadow>
          <boxGeometry args={[0.18, 0.26, 0.16]} />
          <meshStandardMaterial color={LIME} roughness={0.44} />
        </mesh>
        <mesh position={[0, 1.1, 0.02]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.13, 0.024, 6, 14, Math.PI * 1.5]} />
          <meshStandardMaterial color={CHARCOAL} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.23, -0.05]} rotation-x={-0.22} castShadow>
          <boxGeometry args={[0.32, 0.04, 0.22]} />
          <meshStandardMaterial color="#4f5b54" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.12, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.12, 0.09, 12]} />
          <meshStandardMaterial color="#2a302d" roughness={0.68} />
        </mesh>
        <mesh position={[0, 0.07, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.03, 10]} />
          <meshStandardMaterial color="#e8e2b8" roughness={0.9} />
        </mesh>
      </group>

      {/* Fan rake with a head bar and splayed tines. */}
      <group position={[0.35, 1.32, 0.15]} rotation-z={-0.025}>
        <mesh>
          <cylinderGeometry args={[0.02, 0.024, 0.6, 8]} />
          <meshStandardMaterial color="#c39154" roughness={0.78} />
        </mesh>
        <mesh position={[0, 0.2, -0.05]}>
          <boxGeometry args={[0.09, 0.055, 0.08]} />
          <meshStandardMaterial color={CHARCOAL} roughness={0.58} />
        </mesh>
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[0.42, 0.03, 0.03]} />
          <meshStandardMaterial color={FOREST} roughness={0.6} />
        </mesh>
        {[-0.2, -0.1, 0, 0.1, 0.2].map((x) => (
          <mesh key={x} position={[x * 0.78, 0.45, 0]} rotation-z={-x * 1.15}>
            <cylinderGeometry args={[0.008, 0.008, 0.26, 5]} />
            <meshStandardMaterial color={FOREST} />
          </mesh>
        ))}
      </group>

      {/* Spade: D-grip, shaft, foot step and a squared blade. */}
      <group position={[0.73, 0, 0.2]}>
        <mesh position={[0, 0.86, 0]}>
          <cylinderGeometry args={[0.022, 0.026, 1.2, 8]} />
          <meshStandardMaterial color="#c39154" roughness={0.78} />
        </mesh>
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.055, 0.3, 0.05]} />
          <meshStandardMaterial color="#8d9691" metalness={0.32} roughness={0.42} />
        </mesh>
        <mesh position={[0, 0.13, 0.01]} castShadow>
          <boxGeometry args={[0.24, 0.26, 0.035]} />
          <meshStandardMaterial color="#9aa3a0" metalness={0.36} roughness={0.38} />
        </mesh>
        <mesh position={[0, 0.02, 0.02]} rotation-x={0.14} castShadow>
          <boxGeometry args={[0.22, 0.1, 0.03]} />
          <meshStandardMaterial color="#8d9691" metalness={0.32} roughness={0.42} />
        </mesh>
        <mesh position={[0, 0.27, 0.035]}>
          <boxGeometry args={[0.2, 0.025, 0.022]} />
          <meshStandardMaterial color={CHARCOAL} roughness={0.6} />
        </mesh>
        <mesh position={[0, 1.5, 0]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.1, 0.022, 6, 14, Math.PI]} />
          <meshStandardMaterial color={FOREST} />
        </mesh>
        <mesh position={[0, 1.44, 0]}>
          <boxGeometry args={[0.19, 0.03, 0.04]} />
          <meshStandardMaterial color={FOREST} />
        </mesh>
      </group>
    </group>
  );
}

/** A tied-off refuse sack: slumped lumpy body, gathered neck and a knot. */
function DebrisBag({
  position,
  scale = 1,
  tone = "#3a413c",
  lean = 0,
}: {
  position: [number, number, number];
  scale?: number;
  tone?: string;
  lean?: number;
}) {
  return (
    <group position={position} scale={scale} rotation-z={lean}>
      {/* two soft lumps give the sack a slumped, irregular silhouette */}
      <mesh scale={[1, 0.98, 0.9]} castShadow receiveShadow>
        <sphereGeometry args={[0.3, 14, 10]} />
        <meshStandardMaterial color={tone} roughness={0.96} />
      </mesh>
      <mesh position={[0.11, -0.09, 0.04]} scale={[0.76, 0.66, 0.78]} castShadow>
        <sphereGeometry args={[0.3, 12, 8]} />
        <meshStandardMaterial color={tone} roughness={0.96} />
      </mesh>
      {/* the plastic gathers into a neck, then a knot */}
      <mesh position={[0, 0.29, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.19, 0.15, 10]} />
        <meshStandardMaterial color={tone} roughness={0.94} />
      </mesh>
      <mesh position={[0, 0.38, 0]} castShadow>
        <sphereGeometry args={[0.072, 10, 7]} />
        <meshStandardMaterial color="#2a2f2c" roughness={0.92} />
      </mesh>
      {/* loose ends of the tie flop over and hang down */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * 0.085, 0.395, side * 0.02]}
          rotation-z={side * 1.45}
          scale={[1, 1, 0.55]}
          castShadow
        >
          <capsuleGeometry args={[0.024, 0.075, 3, 6]} />
          <meshStandardMaterial color={tone} roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

/** A taped shipping carton with closed flaps and a seam of packing tape. */
function Carton({
  position,
  size,
  rotation = 0,
  tone = "#c49a66",
  label = false,
}: {
  position: [number, number, number];
  size: [number, number, number];
  rotation?: number;
  tone?: string;
  label?: boolean;
}) {
  const [width, height, depth] = size;
  return (
    <group position={position} rotation-y={rotation}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={tone} roughness={0.93} />
      </mesh>
      {/* closed flaps sit slightly proud of the walls */}
      <mesh position={[0, height / 2 + 0.006, 0]} castShadow>
        <boxGeometry args={[width * 0.96, 0.014, depth * 0.96]} />
        <meshStandardMaterial color="#b08052" roughness={0.95} />
      </mesh>
      {/* packing tape over the seam and down the face */}
      <mesh position={[0, height / 2 + 0.015, 0]}>
        <boxGeometry args={[width * 1.005, 0.008, 0.085]} />
        <meshStandardMaterial color="#e8d9b8" roughness={0.55} />
      </mesh>
      <mesh position={[0, height * 0.22, depth / 2 + 0.005]}>
        <boxGeometry args={[0.085, height * 0.56, 0.008]} />
        <meshStandardMaterial color="#e8d9b8" roughness={0.55} />
      </mesh>
      {label ? (
        <mesh position={[width * 0.24, height * 0.06, depth / 2 + 0.007]}>
          <boxGeometry args={[0.19, 0.13, 0.006]} />
          <meshStandardMaterial color="#f3ede1" roughness={0.9} />
        </mesh>
      ) : null}
    </group>
  );
}

function JunkZone() {
  return (
    <group position={[5.35, 0, 2.55]} rotation-y={-Math.PI / 2}>
      {/* Hand truck: welded uprights, cross braces, rubber grips and a nose plate. */}
      <group position={[-0.7, 0, 0]} rotation-y={0.4}>
        {[-0.22, 0.22].map((x) => (
          <mesh key={x} position={[x, 0.78, 0]} rotation-z={x * -0.08} castShadow>
            <cylinderGeometry args={[0.032, 0.032, 1.42, 8]} />
            <meshStandardMaterial color="#c83b30" metalness={0.25} roughness={0.42} />
          </mesh>
        ))}
        {[0.5, 0.92, 1.3].map((y) => (
          <mesh key={y} position={[0, y, 0]} rotation-z={Math.PI / 2} castShadow>
            <cylinderGeometry args={[0.024, 0.024, 0.46, 8]} />
            <meshStandardMaterial color="#a92f28" metalness={0.22} roughness={0.46} />
          </mesh>
        ))}
        {[-0.23, 0.23].map((x) => (
          <mesh key={`grip-${x}`} position={[x, 1.5, 0]} castShadow>
            <cylinderGeometry args={[0.038, 0.038, 0.2, 8]} />
            <meshStandardMaterial color={CHARCOAL} roughness={0.7} />
          </mesh>
        ))}
        <mesh position={[0, 0.06, 0.18]} castShadow>
          <boxGeometry args={[0.56, 0.045, 0.42]} />
          <meshStandardMaterial color="#8f2f27" metalness={0.2} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.1, 0.38]} rotation-x={-0.28}>
          <boxGeometry args={[0.56, 0.035, 0.08]} />
          <meshStandardMaterial color="#7a281f" roughness={0.55} />
        </mesh>
        {[-0.3, 0.3].map((x) => (
          <DetailedWheel key={x} position={[x, 0.18, -0.08]} radius={0.17} />
        ))}
      </group>

      {/* A stacked run of taped cartons, each clear of its neighbours. */}
      <Carton position={[0.45, 0.26, -0.02]} size={[0.66, 0.52, 0.6]} rotation={0.18} label />
      <Carton
        position={[0.5, 0.72, 0.04]}
        size={[0.5, 0.4, 0.48]}
        rotation={-0.3}
        tone="#b98f5e"
      />
      <Carton
        position={[1.32, 0.21, 0.36]}
        size={[0.44, 0.42, 0.42]}
        rotation={0.72}
        tone="#cfa878"
        label
      />

      {/* Tied refuse sacks, slumped together beside the cartons. */}
      <DebrisBag position={[1.2, 0.29, -0.5]} scale={1} lean={0.06} />
      <DebrisBag position={[0.72, 0.25, -0.62]} scale={0.84} tone="#343b36" lean={-0.09} />

      {/* Wheeled cleanup bin with a hinged lid, grab handle and castors. */}
      <group position={[1.9, 0, -0.52]} rotation-y={-0.1}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.58, 0.78, 0.52]} />
          <meshStandardMaterial color={FOREST} roughness={0.56} />
        </mesh>
        <mesh position={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[0.52, 0.14, 0.46]} />
          <meshStandardMaterial color="#1f3f2c" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.92, -0.02]} rotation-x={-0.08} castShadow>
          <boxGeometry args={[0.64, 0.07, 0.56]} />
          <meshStandardMaterial color="#315f43" roughness={0.52} />
        </mesh>
        <mesh position={[0, 0.885, 0.26]}>
          <boxGeometry args={[0.6, 0.045, 0.05]} />
          <meshStandardMaterial color="#26503a" roughness={0.55} />
        </mesh>
        <mesh position={[0, 0.858, 0.268]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.085, 0.017, 5, 10, Math.PI]} />
          <meshStandardMaterial color="#26503a" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.52, 0.265]}>
          <circleGeometry args={[0.1, 14]} />
          <meshBasicMaterial color={LIME} />
        </mesh>
        {[-0.22, 0.22].map((x) => (
          <mesh key={x} position={[x, 0.09, -0.24]} rotation-z={Math.PI / 2}>
            <cylinderGeometry args={[0.085, 0.085, 0.08, 12]} />
            <meshStandardMaterial color="#202421" roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* Broken-down cartons leaning flat against the wall for recycling. */}
      {[0, 1, 2].map((index) => (
        <group
          key={index}
          position={[2.27 + index * 0.055, 0.47, -0.46 + index * 0.035]}
          rotation-x={-0.2}
          rotation-z={0.02 + index * 0.012}
        >
          <mesh castShadow>
            <boxGeometry args={[0.02, 0.95, 0.66 - index * 0.06]} />
            <meshStandardMaterial
              color={index % 2 ? "#c09062" : "#b38552"}
              roughness={0.96}
            />
          </mesh>
          {/* pale corrugated edge reads as cardboard rather than timber */}
          <mesh position={[0, 0.478, 0]}>
            <boxGeometry args={[0.022, 0.022, 0.66 - index * 0.06]} />
            <meshStandardMaterial color="#d9bb8e" roughness={0.96} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function TreeCareWall() {
  return (
    <group position={[-5.72, 0, -1.85]} rotation-y={Math.PI / 2}>
      {/* slatted professional tool board */}
      <mesh position={[0, 1.62, -0.04]} castShadow receiveShadow>
        <boxGeometry args={[2.55, 2.35, 0.12]} />
        <meshStandardMaterial color="#31563a" roughness={0.86} />
      </mesh>
      {[-0.8, -0.3, 0.2, 0.7].map((y) => (
        <mesh key={y} position={[0, 1.62 + y, 0.085]}>
          <boxGeometry args={[2.42, 0.035, 0.04]} />
          <meshStandardMaterial color="#75906f" roughness={0.75} />
        </mesh>
      ))}

      {/* Chainsaw: engine body, rear and top handles, hand guard, bar and chain. */}
      <group position={[-0.16, 2.05, 0.19]} rotation-z={-0.04}>
        <mesh castShadow>
          <boxGeometry args={[0.42, 0.3, 0.22]} />
          <meshStandardMaterial color="#e76b24" roughness={0.4} />
        </mesh>
        <mesh position={[-0.13, -0.02, 0.115]}>
          <circleGeometry args={[0.08, 12]} />
          <meshStandardMaterial color="#202622" roughness={0.7} />
        </mesh>
        <mesh position={[-0.3, 0.02, 0]} castShadow>
          <boxGeometry args={[0.2, 0.2, 0.13]} />
          <meshStandardMaterial color={CHARCOAL} roughness={0.6} />
        </mesh>
        <mesh position={[-0.04, 0.22, 0]}>
          <torusGeometry args={[0.19, 0.028, 6, 14, Math.PI]} />
          <meshStandardMaterial color={CHARCOAL} roughness={0.62} />
        </mesh>
        <mesh position={[0.19, 0.19, 0]} rotation-z={-0.5} castShadow>
          <boxGeometry args={[0.05, 0.24, 0.15]} />
          <meshStandardMaterial color="#d8dcd9" roughness={0.45} />
        </mesh>
        <mesh position={[0.6, -0.02, 0]} castShadow>
          <boxGeometry args={[0.7, 0.1, 0.034]} />
          <meshStandardMaterial color="#b9c0bb" metalness={0.4} roughness={0.32} />
        </mesh>
        <mesh position={[0.95, -0.02, 0]} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.05, 0.05, 0.034, 10]} />
          <meshStandardMaterial color="#b9c0bb" metalness={0.4} roughness={0.32} />
        </mesh>
        <mesh position={[0.62, 0.038, 0.001]}>
          <boxGeometry args={[0.78, 0.026, 0.044]} />
          <meshStandardMaterial color="#3b433e" metalness={0.45} roughness={0.42} />
        </mesh>
        {[0, 1, 2, 3].map((index) => (
          <mesh key={index} position={[0.4 + index * 0.17, 0.062, 0.001]} rotation-z={0.55}>
            <boxGeometry args={[0.036, 0.022, 0.048]} />
            <meshStandardMaterial color="#5e665f" metalness={0.45} />
          </mesh>
        ))}
      </group>

      {/* Compact top-handle saw. */}
      <group position={[-0.62, 1.38, 0.18]} rotation-z={0.05}>
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.22, 0.16]} />
          <meshStandardMaterial color={LIME} roughness={0.44} />
        </mesh>
        <mesh position={[-0.02, 0.16, 0]}>
          <torusGeometry args={[0.14, 0.026, 5, 12, Math.PI]} />
          <meshStandardMaterial color={CHARCOAL} />
        </mesh>
        <mesh position={[0.35, -0.01, 0]} castShadow>
          <boxGeometry args={[0.44, 0.075, 0.028]} />
          <meshStandardMaterial color="#c2c8c4" metalness={0.4} roughness={0.3} />
        </mesh>
        <mesh position={[0.35, 0.028, 0.001]}>
          <boxGeometry args={[0.46, 0.02, 0.036]} />
          <meshStandardMaterial color="#3b433e" metalness={0.45} />
        </mesh>
      </group>

      {/* Pole saw: telescoping pole, collar and an angled cutting head. */}
      <mesh position={[-1.0, 1.18, 0.18]} rotation-z={0.07} castShadow>
        <cylinderGeometry args={[0.032, 0.036, 2.0, 8]} />
        <meshStandardMaterial color="#d6dbd8" metalness={0.3} roughness={0.36} />
      </mesh>
      <mesh position={[-0.96, 1.86, 0.18]} rotation-z={0.07}>
        <cylinderGeometry args={[0.044, 0.044, 0.14, 8]} />
        <meshStandardMaterial color={CHARCOAL} roughness={0.5} />
      </mesh>
      <group position={[-0.92, 2.3, 0.19]} rotation-z={-0.08}>
        <mesh position={[0, 0.04, 0]} castShadow>
          <boxGeometry args={[0.15, 0.3, 0.12]} />
          <meshStandardMaterial color="#e76b24" roughness={0.45} />
        </mesh>
        <mesh position={[0.03, 0.32, 0]} rotation-z={-0.22} castShadow>
          <boxGeometry args={[0.07, 0.36, 0.028]} />
          <meshStandardMaterial color="#c5cbc7" metalness={0.42} roughness={0.34} />
        </mesh>
      </group>

      {/* Folding pruning saw with a toothed, curved blade. */}
      <group position={[0.73, 1.48, 0.18]} rotation-z={-0.32}>
        <mesh position={[0, -0.2, 0]} castShadow>
          <boxGeometry args={[0.1, 0.4, 0.075]} />
          <meshStandardMaterial color="#e76b24" roughness={0.45} />
        </mesh>
        <mesh position={[0, -0.2, 0.048]}>
          <boxGeometry args={[0.05, 0.3, 0.016]} />
          <meshStandardMaterial color={CHARCOAL} roughness={0.6} />
        </mesh>
        <mesh position={[0.02, 0.17, 0]} rotation-z={0.12} castShadow>
          <boxGeometry args={[0.06, 0.4, 0.02]} />
          <meshStandardMaterial color="#d3d7d4" metalness={0.45} roughness={0.3} />
        </mesh>
        {[0, 1, 2].map((index) => (
          <mesh key={index} position={[0.056, 0.04 + index * 0.1, 0]} rotation-z={0.5}>
            <boxGeometry args={[0.024, 0.016, 0.022]} />
            <meshStandardMaterial color="#aeb4b0" metalness={0.45} />
          </mesh>
        ))}
      </group>

      {/* Arborist helmet with a brim, ear defenders and a mesh visor. */}
      <group position={[0.92, 2.58, 0.2]}>
        <mesh castShadow>
          <sphereGeometry args={[0.2, 14, 9, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#f3b33e" roughness={0.38} />
        </mesh>
        <mesh position={[0, 0, 0]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.2, 0.022, 5, 14]} />
          <meshStandardMaterial color="#d99a2c" roughness={0.45} />
        </mesh>
        <mesh position={[0, 0.03, 0.17]} rotation-x={0.35} castShadow>
          <boxGeometry args={[0.24, 0.035, 0.13]} />
          <meshStandardMaterial color="#d99a2c" roughness={0.45} />
        </mesh>
        {[-0.21, 0.21].map((x) => (
          <mesh key={x} position={[x, -0.05, 0]} rotation-z={Math.PI / 2} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.07, 10]} />
            <meshStandardMaterial color={CHARCOAL} />
          </mesh>
        ))}
        <mesh position={[0, -0.13, 0.12]} rotation-x={0.25}>
          <boxGeometry args={[0.3, 0.16, 0.012]} />
          <meshStandardMaterial color="#3c4a42" roughness={0.6} transparent opacity={0.6} />
        </mesh>
      </group>

      <mesh position={[0.62, 0.38, 0.19]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.22, 0.04, 8, 20]} />
        <meshStandardMaterial color="#e5a54a" roughness={0.8} />
      </mesh>
      {/* a folded pair of work gloves */}
      <group position={[-0.1, 0.05, 0.2]}>
        {[0, 1].map((index) => (
          <group
            key={index}
            position={[index * 0.05, index * 0.07, index * 0.04]}
            rotation-y={index ? 0.34 : -0.18}
          >
            <mesh castShadow>
              <boxGeometry args={[0.28, 0.065, 0.13]} />
              <meshStandardMaterial color="#d9c79e" roughness={0.95} />
            </mesh>
            <mesh position={[-0.16, 0, 0]} castShadow>
              <boxGeometry args={[0.075, 0.08, 0.15]} />
              <meshStandardMaterial color="#b89f6f" roughness={0.95} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Loppers: long handles crossing at a pivot, with hooked blades. */}
      <group position={[-0.5, 0.5, 0.2]} rotation-z={0.2}>
        {[-1, 1].map((side) => (
          <group key={side} rotation-z={side * 0.07}>
            <mesh position={[side * 0.045, -0.22, 0]} castShadow>
              <cylinderGeometry args={[0.024, 0.03, 0.78, 8]} />
              <meshStandardMaterial color="#d6a15d" roughness={0.7} />
            </mesh>
            <mesh position={[side * 0.06, -0.6, 0]} castShadow>
              <capsuleGeometry args={[0.032, 0.14, 4, 8]} />
              <meshStandardMaterial color={FOREST} roughness={0.7} />
            </mesh>
          </group>
        ))}
        {/* crossed cutting head: a hooked blade over a straight anvil jaw */}
        <mesh position={[-0.07, 0.36, 0.01]} rotation-z={0.38} castShadow>
          <boxGeometry args={[0.055, 0.38, 0.022]} />
          <meshStandardMaterial color="#c8cfca" metalness={0.42} roughness={0.32} />
        </mesh>
        <mesh position={[0.09, 0.34, -0.01]} rotation-z={-0.5} castShadow>
          <boxGeometry args={[0.05, 0.34, 0.022]} />
          <meshStandardMaterial color="#9aa3a0" metalness={0.4} roughness={0.36} />
        </mesh>
        <mesh position={[-0.15, 0.52, 0.01]} rotation-z={0.9} castShadow>
          <boxGeometry args={[0.045, 0.16, 0.022]} />
          <meshStandardMaterial color="#c8cfca" metalness={0.42} roughness={0.32} />
        </mesh>
        <mesh position={[0, 0.17, 0.015]} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.032, 0.032, 0.06, 10]} />
          <meshStandardMaterial color={CHARCOAL} metalness={0.42} roughness={0.35} />
        </mesh>
      </group>

      {/* Leaf rake with a head bar and dimensional tines. */}
      <group position={[0.28, 0.42, 0.2]}>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.022, 0.026, 0.65, 8]} />
          <meshStandardMaterial color="#cf9a54" roughness={0.76} />
        </mesh>
        <mesh position={[0, 0.52, 0]}>
          <boxGeometry args={[0.4, 0.03, 0.03]} />
          <meshStandardMaterial color="#263e30" roughness={0.6} />
        </mesh>
        {[-0.22, -0.11, 0, 0.11, 0.22].map((x) => (
          <mesh key={x} position={[x * 0.7, 0.62, 0]} rotation-z={-x * 1.25}>
            <cylinderGeometry args={[0.009, 0.009, 0.32, 5]} />
            <meshStandardMaterial color="#263e30" roughness={0.7} />
          </mesh>
        ))}
      </group>

      {/* Round-point shovel with a D-grip and a step. */}
      <group position={[1.05, 0.65, 0.2]}>
        <mesh>
          <cylinderGeometry args={[0.022, 0.026, 0.76, 8]} />
          <meshStandardMaterial color="#d4a15f" roughness={0.74} />
        </mesh>
        <mesh position={[0, -0.42, 0]} castShadow>
          <boxGeometry args={[0.05, 0.16, 0.045]} />
          <meshStandardMaterial color="#8d9691" metalness={0.3} roughness={0.44} />
        </mesh>
        <mesh position={[0, -0.56, 0.01]} scale={[0.68, 1, 0.16]} castShadow>
          <sphereGeometry args={[0.18, 12, 8]} />
          <meshStandardMaterial color="#9aa3a0" metalness={0.32} roughness={0.42} />
        </mesh>
        <mesh position={[0, -0.44, 0.03]} rotation-x={0.2}>
          <boxGeometry args={[0.2, 0.025, 0.02]} />
          <meshStandardMaterial color={CHARCOAL} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.48, 0]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.1, 0.022, 6, 14, Math.PI]} />
          <meshStandardMaterial color={LIME} roughness={0.55} />
        </mesh>
        <mesh position={[0, 0.42, 0]}>
          <boxGeometry args={[0.19, 0.03, 0.04]} />
          <meshStandardMaterial color={LIME} roughness={0.55} />
        </mesh>
      </group>
    </group>
  );
}

const TREE_TONES = [
  { dark: "#35713f", base: "#478c4a", light: "#63a75a" },
  { dark: "#2f6a3c", base: "#427f46", light: "#5c9e55" },
  { dark: "#3b7a44", base: "#4f9350", light: "#6bad5f" },
] as const;

/**
 * A painted broadleaf tree for the window view: a tapered trunk that forks into
 * visible limbs, under a canopy built from overlapping leaf clusters in three
 * tones so it reads as foliage rather than a flat green circle.
 */
function WindowTree({
  position,
  scale = 1,
  tone = 0,
  flip = false,
}: {
  position: [number, number, number];
  scale?: number;
  tone?: number;
  flip?: boolean;
}) {
  const palette = TREE_TONES[tone % TREE_TONES.length] ?? TREE_TONES[0];
  const side = flip ? -1 : 1;

  return (
    <group position={position} scale={scale}>
      {/* shade pooling at the roots, so the tree sits on the grass */}
      <mesh position={[0, -0.79, -0.002]} scale={[1.8, 0.42, 1]}>
        <circleGeometry args={[0.12, 18]} />
        <meshBasicMaterial color="#2f5d38" transparent opacity={0.22} />
      </mesh>
      {/* trunk, tapering out towards the roots */}
      <mesh position={[0, -0.42, 0]}>
        <cylinderGeometry args={[0.028, 0.055, 0.76, 8]} />
        <meshBasicMaterial color="#7a5438" />
      </mesh>
      {/* shaded side of the trunk */}
      <mesh position={[0.019, -0.42, 0.001]}>
        <cylinderGeometry args={[0.009, 0.019, 0.76, 6]} />
        <meshBasicMaterial color="#5f3f29" />
      </mesh>
      {/* limbs reaching up into the canopy */}
      <mesh position={[-0.07 * side, -0.26, 0.002]} rotation-z={0.72 * side}>
        <cylinderGeometry args={[0.009, 0.026, 0.32, 6]} />
        <meshBasicMaterial color="#7a5438" />
      </mesh>
      <mesh position={[0.07 * side, -0.32, 0.002]} rotation-z={-0.64 * side}>
        <cylinderGeometry args={[0.008, 0.023, 0.3, 6]} />
        <meshBasicMaterial color="#6d4b31" />
      </mesh>
      {/* canopy: shaded underside */}
      <mesh position={[-0.02 * side, 0.1, 0.006]}>
        <circleGeometry args={[0.44, 24]} />
        <meshBasicMaterial color={palette.dark} />
      </mesh>
      <mesh position={[-0.29 * side, -0.05, 0.007]}>
        <circleGeometry args={[0.26, 20]} />
        <meshBasicMaterial color={palette.dark} />
      </mesh>
      <mesh position={[0.3 * side, -0.03, 0.008]}>
        <circleGeometry args={[0.28, 20]} />
        <meshBasicMaterial color={palette.dark} />
      </mesh>
      {/* canopy: mid tone */}
      <mesh position={[-0.05 * side, 0.17, 0.01]}>
        <circleGeometry args={[0.35, 22]} />
        <meshBasicMaterial color={palette.base} />
      </mesh>
      <mesh position={[0.21 * side, 0.11, 0.011]}>
        <circleGeometry args={[0.23, 18]} />
        <meshBasicMaterial color={palette.base} />
      </mesh>
      <mesh position={[-0.27 * side, 0.09, 0.012]}>
        <circleGeometry args={[0.19, 18]} />
        <meshBasicMaterial color={palette.base} />
      </mesh>
      {/* canopy: sunlit crown */}
      <mesh position={[-0.13 * side, 0.31, 0.014]}>
        <circleGeometry args={[0.2, 18]} />
        <meshBasicMaterial color={palette.light} />
      </mesh>
      <mesh position={[0.07 * side, 0.34, 0.015]}>
        <circleGeometry args={[0.13, 16]} />
        <meshBasicMaterial color={palette.light} />
      </mesh>
    </group>
  );
}

function SunnyWindowView() {
  return (
    <group>
      {/* clear blue sky */}
      <mesh position={[0, 1.95, -1.8]}>
        <planeGeometry args={[5.4, 3.4]} />
        <meshBasicMaterial color="#8fd2f2" />
      </mesh>

      {/* Cheerful sun wearing shades, with a soft glow and rays. It sits far
          enough inside the upper right pane that the whole disc stays clear of
          the window head and jamb right across the welcome camera sweep. */}
      <group position={[0.72, 2.38, -1.68]}>
        {/* soft layered glow */}
        {[0.54, 0.47, 0.4].map((radius, index) => (
          <mesh key={radius} position={[0, 0, -0.035 + index * 0.004]}>
            <circleGeometry args={[radius, 36]} />
            <meshBasicMaterial color="#ffd489" transparent opacity={0.1} />
          </mesh>
        ))}
        {/* sun rays */}
        {Array.from({ length: 8 }, (_, index) => {
          const angle = (index / 8) * Math.PI * 2;
          return (
            <mesh
              key={index}
              position={[Math.cos(angle) * 0.37, Math.sin(angle) * 0.37, -0.01]}
              rotation-z={angle}
            >
              <planeGeometry args={[0.16, 0.045]} />
              <meshBasicMaterial color="#ffd35c" transparent opacity={0.9} />
            </mesh>
          );
        })}
        {/* sun face */}
        <mesh>
          <circleGeometry args={[0.28, 32]} />
          <meshBasicMaterial color="#ffdb5c" />
        </mesh>
        {/* dark sunglasses */}
        <mesh position={[-0.095, 0.035, 0.01]}>
          <circleGeometry args={[0.075, 20]} />
          <meshBasicMaterial color="#242424" />
        </mesh>
        <mesh position={[0.095, 0.035, 0.01]}>
          <circleGeometry args={[0.075, 20]} />
          <meshBasicMaterial color="#242424" />
        </mesh>
        <mesh position={[0, 0.045, 0.01]}>
          <planeGeometry args={[0.09, 0.02]} />
          <meshBasicMaterial color="#242424" />
        </mesh>
        {/* big smile */}
        <mesh position={[0, -0.03, 0.01]} rotation-z={3.49}>
          <torusGeometry args={[0.1, 0.018, 8, 24, 2.44]} />
          <meshBasicMaterial color="#c76b1f" />
        </mesh>
      </group>
      {(
        [
          [-1.2, 2.63, 0.22],
          [-0.88, 2.69, 0.28],
          [-0.53, 2.62, 0.2],
        ] as Array<[number, number, number]>
      ).map(([x, y, radius], index) => (
        <mesh key={index} position={[x, y, -1.66]} scale={[1.45, 0.72, 1]}>
          <circleGeometry args={[radius, 20]} />
          <meshBasicMaterial color="#f8fcf4" transparent opacity={0.94} />
        </mesh>
      ))}

      {/* layered lawn and rolling hedges */}
      <mesh position={[0, 1.03, -1.67]}>
        <planeGeometry args={[5.4, 1.55]} />
        <meshBasicMaterial color="#84bd64" />
      </mesh>
      {[-1.45, -0.65, 0.85, 1.55].map((x, index) => (
        <mesh
          key={x}
          position={[x, 1.43 + (index % 2) * 0.07, -1.635 + index * 0.008]}
          scale={[1.25, 0.55, 1]}
        >
          <circleGeometry args={[0.72, 24]} />
          <meshBasicMaterial color={index % 2 ? "#5f9d57" : "#6caa5e"} />
        </mesh>
      ))}

      {/* natural midground grove with no neighboring buildings */}
      {(
        [
          { x: -1.18, y: 1.46, scale: 0.6, tone: 0, flip: false },
          { x: -0.72, y: 1.55, scale: 0.7, tone: 1, flip: true },
          { x: -0.18, y: 1.5, scale: 0.64, tone: 2, flip: false },
          { x: 0.38, y: 1.56, scale: 0.74, tone: 1, flip: false },
          { x: 0.95, y: 1.49, scale: 0.65, tone: 0, flip: true },
        ] as const
      ).map(({ x, y, scale, tone, flip }, index) => (
        <WindowTree
          key={x}
          position={[x, y, -1.585 + index * 0.02]}
          scale={scale}
          tone={tone}
          flip={flip}
        />
      ))}

      {/* clipped lawn stripes, garden stones, foreground trees and flower beds */}
      {[0.77, 0.9, 1.03].map((y) => (
        <mesh key={y} position={[0, y, -1.6]}>
          <planeGeometry args={[3.45, 0.025]} />
          <meshBasicMaterial color="#a9d582" transparent opacity={0.55} />
        </mesh>
      ))}
      {(
        [
          { x: 0.09, y: 0.58, radius: 0.105 },
          { x: 0.04, y: 0.71, radius: 0.09 },
          { x: 0.12, y: 0.82, radius: 0.075 },
        ] as const
      ).map(({ x, y, radius }) => (
        <mesh key={y} position={[x, y, -1.47]} scale={[1.55, 0.56, 1]}>
          <circleGeometry args={[radius, 16]} />
          <meshBasicMaterial color="#d9d0b7" />
        </mesh>
      ))}
      {[-1.5, 1.55].map((x, index) => (
        <WindowTree
          key={x}
          position={[x, 1.4, -1.475 + index * 0.014]}
          scale={0.92}
          tone={index ? 1 : 2}
          flip={index === 1}
        />
      ))}
      {/* Flower beds. Neighbouring beds overlap, so each one is stepped back
          further than a single bed is deep. Otherwise a bed's blossoms land on
          exactly the same plane as the next bed's foliage and the two flicker
          against each other wherever they cross. */}
      {[-1.05, -0.82, 0.78, 1.02].map((x, index) => (
        <group key={x} position={[x, 0.64, -1.44 + index * 0.05]}>
          <mesh scale={[1.3, 0.7, 1]}>
            <circleGeometry args={[0.21, 18]} />
            <meshBasicMaterial color="#336e42" />
          </mesh>
          <mesh position={[-0.07, 0.05, 0.008]} scale={[1, 0.82, 1]}>
            <circleGeometry args={[0.13, 16]} />
            <meshBasicMaterial color="#3f8449" />
          </mesh>
          <mesh position={[0.09, 0.04, 0.014]} scale={[1, 0.8, 1]}>
            <circleGeometry args={[0.11, 16]} />
            <meshBasicMaterial color="#4a9152" />
          </mesh>
          <mesh position={[-0.05, 0.1, 0.02]}>
            <circleGeometry args={[0.028, 10]} />
            <meshBasicMaterial color={index % 2 ? "#fff0ad" : "#f5a1a8"} />
          </mesh>
          <mesh position={[0.08, 0.09, 0.023]}>
            <circleGeometry args={[0.024, 10]} />
            <meshBasicMaterial color={index % 2 ? "#f5a1a8" : "#fff0ad"} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Room() {
  return (
    <group>
      {/* floor */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#9b6d43" roughness={0.72} />
      </mesh>
      {/* subtle timber seams */}
      {Array.from({ length: 18 }, (_, index) => (
        <mesh key={index} rotation-x={-Math.PI / 2} position={[-6.4 + index * 0.76, 0.004, 0]}>
          <planeGeometry args={[0.012, 10.4]} />
          <meshBasicMaterial color="#6f492d" transparent opacity={0.34} />
        </mesh>
      ))}
      {/* rug */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.012, -0.6]} receiveShadow>
        <planeGeometry args={[5.2, 4]} />
        <meshStandardMaterial color="#d9cfb4" roughness={1} />
      </mesh>
      {/* back wall with window opening */}
      <group position={[0, 0, -5.2]}>
        <mesh position={[-3.9, 1.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.4, 3.6, 0.2]} />
          <meshStandardMaterial color={WALL} roughness={1} />
        </mesh>
        <mesh position={[3.9, 1.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.4, 3.6, 0.2]} />
          <meshStandardMaterial color={WALL} roughness={1} />
        </mesh>
        <mesh position={[0, 3.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.4, 0.7, 0.2]} />
          <meshStandardMaterial color={WALL} roughness={1} />
        </mesh>
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.4, 1.0, 0.2]} />
          <meshStandardMaterial color={WALL} roughness={1} />
        </mesh>
        <SunnyWindowView />
        {/* window glass + frame */}
        <mesh position={[0, 1.95, 0]}>
          <boxGeometry args={[3.4, 2.2, 0.04]} />
          <meshStandardMaterial
            color="#e5f7ff"
            transparent
            opacity={0.16}
            roughness={0.06}
            metalness={0.1}
          />
        </mesh>
        <mesh position={[0, 1.95, 0.04]} castShadow>
          <boxGeometry args={[0.07, 2.2, 0.07]} />
          <meshStandardMaterial color={CREAM} />
        </mesh>
        <mesh position={[0, 1.95, 0.04]} castShadow>
          <boxGeometry args={[3.4, 0.07, 0.07]} />
          <meshStandardMaterial color={CREAM} />
        </mesh>
      </group>
      {/* side walls */}
      <mesh position={[-6, 1.8, 0]} rotation-y={Math.PI / 2} castShadow receiveShadow>
        <planeGeometry args={[10.4, 3.6]} />
        <meshStandardMaterial color={WALL} roughness={1} />
      </mesh>
      <mesh position={[6, 1.8, 0]} rotation-y={-Math.PI / 2} castShadow receiveShadow>
        <planeGeometry args={[10.4, 3.6]} />
        <meshStandardMaterial color={WALL} roughness={1} />
      </mesh>
      {/* ceiling */}
      {/* The ceiling runs well past the front of the room so the wide welcome
          framing never looks up past its edge into empty background. */}
      <mesh position={[0, 3.6, 2.4]} rotation-x={Math.PI / 2} castShadow receiveShadow>
        <planeGeometry args={[12, 16]} />
        <meshStandardMaterial color="#f3ecdd" roughness={1} />
      </mesh>
      {/* baseboards */}
      <mesh position={[0, 0.07, -5.08]}>
        <boxGeometry args={[12, 0.14, 0.06]} />
        <meshStandardMaterial color={CREAM} />
      </mesh>
      {/* ceiling fixtures */}
      {[-2.4, 2.4].map((x) => (
        <group key={x} position={[x, 3.38, -0.8]}>
          <mesh>
            <cylinderGeometry args={[0.025, 0.025, 0.38, 10]} />
            <meshStandardMaterial color={CHARCOAL} metalness={0.45} />
          </mesh>
          <mesh position={[0, -0.26, 0]}>
            <coneGeometry args={[0.28, 0.34, 24, 1, true]} />
            <meshStandardMaterial color={FOREST} side={2} roughness={0.48} />
          </mesh>
          <pointLight position={[0, -0.32, 0]} intensity={0.85} distance={4} color="#fff0cb" />
        </group>
      ))}
    </group>
  );
}

function RoomDetails() {
  return (
    <group>
      {/* Brass drawer pulls and inset drawer seams. */}
      {[0.27, 0.45, 0.63].map((y) => (
        <group key={y} position={[1, y, -1.99]}>
          <mesh position={[0, -0.075, 0]}>
            <boxGeometry args={[0.64, 0.008, 0.014]} />
            <meshStandardMaterial color="#392b20" />
          </mesh>
          <mesh>
            <boxGeometry args={[0.22, 0.023, 0.03]} />
            <meshStandardMaterial color="#bd9e62" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      ))}
      {/* Window casing with a deep sill. */}
      {[-1.75, 1.75].map((x) => (
        <mesh key={x} position={[x, 1.95, -5.04]} castShadow>
          <boxGeometry args={[0.13, 2.35, 0.18]} />
          <meshStandardMaterial color={CREAM} roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[0, 0.85, -4.94]} castShadow>
        <boxGeometry args={[3.65, 0.1, 0.4]} />
        <meshStandardMaterial color={WOOD} roughness={0.5} />
      </mesh>
      {/* Botanical prints balance the clock on the back wall. */}
      {[2.7, 3.8].map((x, index) => (
        <group key={x} position={[x, 2.2, -5.04]}>
          <mesh castShadow>
            <boxGeometry args={[0.82, 1.12, 0.065]} />
            <meshStandardMaterial color={WOOD_DARK} roughness={0.58} />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <planeGeometry args={[0.7, 1]} />
            <meshStandardMaterial color="#ece4cc" />
          </mesh>
          <mesh position={[0, -0.03, 0.06]} rotation-z={index ? -0.15 : 0.15}>
            <planeGeometry args={[0.014, 0.68]} />
            <meshBasicMaterial color={FOREST} />
          </mesh>
          {[-1, 1].map((side) =>
            [0, 1, 2].map((leaf) => (
              <mesh
                key={`${side}-${leaf}`}
                position={[side * 0.1, -0.22 + leaf * 0.19, 0.07 + leaf * 0.004]}
                rotation-z={side * -0.65}
                scale={[0.07, 0.14, 1]}
              >
                <circleGeometry args={[1, 16]} />
                <meshBasicMaterial color={index ? "#7d925d" : FOREST} />
              </mesh>
            )),
          )}
        </group>
      ))}
      {/* Rug border and staggered plank joints add material definition. */}
      {[-2.5, 2.5].map((x) => (
        <mesh key={x} position={[x, 0.02, -0.6]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[0.035, 3.8]} />
          <meshStandardMaterial color="#8c9876" roughness={1} />
        </mesh>
      ))}
      {Array.from({ length: 17 }, (_, i) => (
        <mesh
          key={i}
          position={[-6.02 + i * 0.76, 0.005, i % 2 ? 2.8 : -3.4]}
          rotation-x={-Math.PI / 2}
        >
          <planeGeometry args={[0.75, 0.012]} />
          <meshBasicMaterial color="#755134" transparent opacity={0.45} />
        </mesh>
      ))}
    </group>
  );
}

const PLANT_LEAVES = [
  { angle: 0.35, tilt: 0.62, length: 0.6, size: 0.3 },
  { angle: 1.4, tilt: 0.86, length: 0.46, size: 0.25 },
  { angle: 2.45, tilt: 0.5, length: 0.68, size: 0.32 },
  { angle: 3.4, tilt: 0.92, length: 0.42, size: 0.23 },
  { angle: 4.3, tilt: 0.66, length: 0.56, size: 0.28 },
  { angle: 5.3, tilt: 0.44, length: 0.72, size: 0.27 },
  { angle: 0.95, tilt: 0.16, length: 0.8, size: 0.24 },
  { angle: 2.9, tilt: 0.24, length: 0.74, size: 0.22 },
] as const;

/** Broad-leafed house plant in a matte ceramic pot. */
function LeafyPlant({
  position,
  scale = 1,
  potColor = "#f1ede4",
}: {
  position: [number, number, number];
  scale?: number;
  potColor?: string;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.29, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.29, 0.225, 0.58, 30]} />
        <meshStandardMaterial color={potColor} roughness={0.52} />
      </mesh>
      <mesh position={[0, 0.592, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.042, 30]} />
        <meshStandardMaterial color={potColor} roughness={0.44} />
      </mesh>
      <mesh position={[0, 0.613, 0]}>
        <cylinderGeometry args={[0.268, 0.268, 0.016, 26]} />
        <meshStandardMaterial color="#3a2b20" roughness={1} />
      </mesh>
      {PLANT_LEAVES.map(({ angle, tilt, length, size }, index) => (
        <group key={angle} position={[0, 0.615, 0]} rotation-y={angle}>
          <group rotation-z={tilt}>
            <mesh position={[0, length / 2, 0]} castShadow>
              <cylinderGeometry args={[0.011, 0.017, length, 8]} />
              <meshStandardMaterial color="#4a7b3d" roughness={0.72} />
            </mesh>
            <group position={[0, length, 0]} rotation-z={-tilt * 0.5}>
              {/* blade base meets the tip of the stalk */}
              <mesh position={[0, size * 0.92, 0]} scale={[size * 0.15, size, size * 0.7]} castShadow>
                <sphereGeometry args={[1, 22, 16]} />
                <meshStandardMaterial
                  color={index % 2 ? "#3f7f45" : "#4d8f4b"}
                  roughness={0.66}
                />
              </mesh>
              <mesh position={[0, size * 0.92, 0]} scale={[size * 0.18, size * 0.9, size * 0.06]}>
                <sphereGeometry args={[1, 10, 8]} />
                <meshStandardMaterial color="#2f6135" roughness={0.74} />
              </mesh>
            </group>
          </group>
        </group>
      ))}
    </group>
  );
}

const SNAKE_BLADES = [
  { angle: 0.2, tilt: 0.1, height: 0.68 },
  { angle: 0.95, tilt: 0.24, height: 0.5 },
  { angle: 1.7, tilt: 0.14, height: 0.62 },
  { angle: 2.45, tilt: 0.27, height: 0.44 },
  { angle: 3.2, tilt: 0.11, height: 0.72 },
  { angle: 3.95, tilt: 0.25, height: 0.52 },
  { angle: 4.7, tilt: 0.16, height: 0.58 },
  { angle: 5.45, tilt: 0.29, height: 0.46 },
  { angle: 0.6, tilt: 0.36, height: 0.38 },
  { angle: 2.9, tilt: 0.34, height: 0.4 },
  { angle: 4.3, tilt: 0.38, height: 0.36 },
] as const;

/**
 * Upright sword-leaf plant. Deliberately a different species and a lighter
 * green than the broad-leafed plant in the corner, so the two read as two
 * different plants rather than a duplicated prop.
 */
function SnakePlant({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.17, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.155, 0.34, 20]} />
        <meshStandardMaterial color="#efe9dd" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.208, 0.208, 0.032, 20]} />
        <meshStandardMaterial color="#e4dccb" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.366, 0]}>
        <cylinderGeometry args={[0.182, 0.182, 0.012, 16]} />
        <meshStandardMaterial color="#3a2b20" roughness={1} />
      </mesh>
      {SNAKE_BLADES.map(({ angle, tilt, height }, index) => (
        <group key={angle} position={[0, 0.36, 0]} rotation-y={angle}>
          <group rotation-z={tilt}>
            <mesh position={[0, height / 2, 0]} scale={[1, 1, 0.3]} castShadow>
              <cylinderGeometry args={[0.013, 0.055, height, 6]} />
              <meshStandardMaterial
                color={index % 2 ? "#9ccd63" : "#b2da78"}
                roughness={0.62}
              />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}

function CornerPlant() {
  return <LeafyPlant position={[4.65, 0, -4.35]} scale={1.15} />;
}

/**
 * Sunlight direction, in world space, travelling from the sun outside the
 * window down into the room. It leans in from the upper right, the corner the
 * painted sun sits in, so the beam sweeps across the desk and out onto the rug
 * towards the front left.
 */
const SUN_DIRECTION = new Vector3(-0.27, -0.405, 0.873).normalize();
const SUN_LIGHT_POSITION = SUN_DIRECTION.clone().multiplyScalar(-18).toArray();

/**
 * Every solid surface in the room casts and receives the sunlight, so the desk,
 * the things on it, the plants and the equipment all throw real shadows. Flat
 * decorative pieces such as the view through the window and the painted floor
 * seams use basic materials and are skipped, so they neither block the
 * sun nor pick up shading.
 *
 * Nothing that shapes a shadow moves, so the shadow map is drawn during the
 * opening frames and then frozen. That keeps the cost off the phone's budget.
 */
function SunShadowSetup() {
  const { gl, scene } = useThree();
  const framesLeft = useRef(24);

  useEffect(() => {
    gl.shadowMap.autoUpdate = false;
    gl.shadowMap.needsUpdate = true;
    framesLeft.current = 24;

    scene.traverse((object) => {
      const mesh = object as Mesh;
      if (!mesh.isMesh) return;
      const material = mesh.material;
      if (Array.isArray(material)) return;
      if (!(material instanceof MeshStandardMaterial)) return;
      if (material.transparent) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });
  }, [gl, scene]);

  useFrame(() => {
    if (framesLeft.current <= 0) return;
    framesLeft.current -= 1;
    gl.shadowMap.needsUpdate = true;
  });

  return null;
}

export function OfficeScene({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <>
      <color attach="background" args={["#e8e2d3"]} />
      {/* Sky and bounce fill: the room still reads where the sun cannot reach. */}
      <hemisphereLight args={["#eaf3ff", "#d8bb97", 1.15]} />
      <ambientLight intensity={0.62} />
      {/*
       * Key light. It sits on the far side of the glass along SUN_DIRECTION, so
       * the only way into the room is the window opening. The wall segments
       * around it cast shadows, which is what shapes the sunlit patch and the
       * glazing-bar cross on the floor and desk.
       */}
      <directionalLight
        position={SUN_LIGHT_POSITION}
        intensity={3.1}
        color="#fff1d0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-camera-near={4}
        shadow-camera-far={34}
        shadow-normalBias={0.03}
        shadow-bias={-0.00012}
        shadow-radius={1.8}
        shadow-blurSamples={12}
      />
      {/* Daylight spilling back off the walls, so shadowed faces are not flat. */}
      <directionalLight position={[-4.5, 4.2, 5.5]} intensity={0.5} color="#e6eeff" />
      <pointLight position={[0, 3.2, 0]} intensity={0.5} color="#fff0d2" />

      <Room />
      <RoomDetails />
      {/* Ground contact only: no long projections from wall-mounted tools or lights. */}
      <ContactShadows
        position={[0, 0.018, -0.4]}
        scale={14}
        opacity={0.15}
        blur={2.8}
        far={0.85}
        resolution={512}
        frames={1}
        color="#493522"
      />
      <Desk />
      <Monitor />
      <DeskProps reducedMotion={reducedMotion} />
      <Chair reducedMotion={reducedMotion} />
      <Shelves />
      <LawnMower />
      <JunkZone />
      <TreeCareWall />
      <CornerPlant />
      <SnakePlant position={[2.05, 0, -2.35]} scale={0.78} />
      <WallClock position={[-3.2, 2.6, -5.05]} />
      <WallCalendar position={[-4.75, 2.35, -5.07]} />
      <Butterflies reducedMotion={reducedMotion} />
      <SunShadowSetup />
    </>
  );
}

