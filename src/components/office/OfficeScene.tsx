import { useFrame } from "@react-three/fiber";
import { ContactShadows, useTexture } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import type { Group, Mesh, MeshBasicMaterial } from "three";
import { SRGBColorSpace } from "three";
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
        <torusGeometry args={[radius * 0.72, radius * 0.28, 10, 22]} />
        <meshStandardMaterial color="#202421" roughness={0.92} />
      </mesh>
      <mesh rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[radius * 0.44, radius * 0.44, 0.075, 18]} />
        <meshStandardMaterial color={LIME} roughness={0.42} />
      </mesh>
      <mesh position={[0, 0, 0.045]}>
        <circleGeometry args={[radius * 0.17, 14]} />
        <meshStandardMaterial color={CHARCOAL} metalness={0.42} />
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
      {/* Freestanding broom with a curved collar and individual bristle bundles. */}
      <group position={[1.48, 0, 0.22]} rotation-z={-0.06}>
        <mesh position={[0, 0.82, 0]} castShadow>
          <cylinderGeometry args={[0.022, 0.025, 1.42, 14]} />
          <meshStandardMaterial color="#b67a3d" roughness={0.72} />
        </mesh>
        <mesh position={[0, 0.16, 0]} scale={[1.5, 0.42, 0.62]} castShadow>
          <sphereGeometry args={[0.16, 20, 12]} />
          <meshStandardMaterial color={WOOD_DARK} roughness={0.68} />
        </mesh>
        {[-0.15, -0.1, -0.05, 0, 0.05, 0.1, 0.15].map((x) => (
          <mesh key={x} position={[x, 0.06, 0.04]} rotation-z={x * 0.6}>
            <cylinderGeometry args={[0.008, 0.011, 0.18, 7]} />
            <meshStandardMaterial color="#9f7d43" roughness={1} />
          </mesh>
        ))}
      </group>

      {/* Sculpted long-handled dustpan, spaced cleanly between the broom and wall. */}
      <group position={[1.84, 0, 0.04]} rotation-z={0.025}>
        <mesh position={[0, 0.62, -0.025]} castShadow>
          <cylinderGeometry args={[0.017, 0.022, 1.02, 12]} />
          <meshStandardMaterial color="#52615a" roughness={0.6} metalness={0.16} />
        </mesh>
        <mesh position={[0, 1.16, -0.025]} rotation-x={Math.PI / 2} castShadow>
          <torusGeometry args={[0.07, 0.018, 8, 20, Math.PI]} />
          <meshStandardMaterial color={FOREST} roughness={0.54} />
        </mesh>
        <mesh position={[0, 0.13, 0.04]} scale={[1.48, 0.5, 1.08]} castShadow>
          <sphereGeometry args={[0.16, 24, 14]} />
          <meshStandardMaterial color={FOREST} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.105, 0.19]} scale={[1.62, 0.28, 0.36]} castShadow>
          <capsuleGeometry args={[0.105, 0.15, 7, 16]} />
          <meshStandardMaterial color={LIME} roughness={0.52} />
        </mesh>
        <mesh position={[0, 0.205, -0.08]} castShadow>
          <boxGeometry args={[0.4, 0.12, 0.08]} />
          <meshStandardMaterial color="#315f43" roughness={0.58} />
        </mesh>
      </group>

      {/* Refined upright vacuum with a clean intake, canister, wheels and twin-tube handle. */}
      <group position={[-1.48, 0, 0.28]}>
        <mesh position={[0, 0.13, 0.02]} scale={[1.25, 0.45, 0.95]} castShadow receiveShadow>
          <sphereGeometry args={[0.22, 22, 14]} />
          <meshStandardMaterial color={FOREST} roughness={0.48} />
        </mesh>
        <mesh position={[0, 0.105, 0.205]} rotation-z={Math.PI / 2} castShadow>
          <capsuleGeometry args={[0.07, 0.38, 7, 18]} />
          <meshStandardMaterial color="#203e2c" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.19, 0.225]} castShadow>
          <boxGeometry args={[0.42, 0.055, 0.08]} />
          <meshStandardMaterial color={LIME} roughness={0.43} />
        </mesh>
        <mesh position={[0, 0.47, 0]} scale={[0.92, 1.35, 0.74]} castShadow>
          <sphereGeometry args={[0.22, 22, 16]} />
          <meshStandardMaterial color="#315f43" roughness={0.46} />
        </mesh>
        <mesh position={[0, 0.53, 0.172]} scale={[0.72, 1.15, 0.24]} castShadow>
          <capsuleGeometry args={[0.1, 0.18, 7, 18]} />
          <meshStandardMaterial color="#dce5d8" roughness={0.32} />
        </mesh>
        <mesh position={[0, 0.55, 0.204]}>
          <circleGeometry args={[0.052, 18]} />
          <meshStandardMaterial color={LIME} roughness={0.38} />
        </mesh>
        {[-0.1, 0.1].map((x) => (
          <mesh key={x} position={[x, 1.02, 0]} castShadow>
            <cylinderGeometry args={[0.018, 0.024, 0.72, 12]} />
            <meshStandardMaterial color="#7f8984" metalness={0.45} roughness={0.38} />
          </mesh>
        ))}
        <mesh position={[0, 1.37, 0.02]} rotation-z={Math.PI / 2} castShadow>
          <capsuleGeometry args={[0.034, 0.24, 6, 12]} />
          <meshStandardMaterial color={CHARCOAL} roughness={0.5} />
        </mesh>
        {[-0.2, 0.2].map((x) => (
          <mesh key={x} position={[x, 0.11, 0.08]} rotation-z={Math.PI / 2} castShadow>
            <cylinderGeometry args={[0.075, 0.075, 0.06, 16]} />
            <meshStandardMaterial color="#202624" roughness={0.78} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Shelves() {
  const bottles: Array<[number, number, string, number]> = [
    [-0.44, 1.38, FOREST, 0.92],
    [-0.15, 1.38, "#62a8c8", 0.86],
    [0.16, 1.38, CREAM, 0.9],
    [-0.42, 2.04, "#e0a34a", 0.95],
    [-0.09, 2.04, LIME, 0.9],
    [0.24, 2.04, FOREST, 0.88],
  ];
  return (
    <group position={[5.45, 0, -1.0]} rotation-y={-Math.PI / 2}>
      {/* Stable inset back: no self-shadowing or coplanar cabinet-edge shimmer. */}
      <mesh position={[0, 1.6, -0.32]}>
        <boxGeometry args={[2.05, 2.45, 0.04]} />
        <meshStandardMaterial
          color="#6b4528"
          roughness={0.88}
          polygonOffset
          polygonOffsetFactor={1}
          polygonOffsetUnits={1}
        />
      </mesh>
      {[-1.0, 1.0].map((x) => (
        <mesh key={x} position={[x, 1.3, 0]}>
          <boxGeometry args={[0.08, 2.6, 0.5]} />
          <meshStandardMaterial color={WOOD_DARK} roughness={0.72} />
        </mesh>
      ))}
      {[0.66, 1.3, 1.96, 2.56].map((y) => (
        <mesh key={y} position={[0, y, 0]} receiveShadow>
          <boxGeometry args={[2.1, 0.06, 0.5]} />
          <meshStandardMaterial color={WOOD} roughness={0.6} />
        </mesh>
      ))}
      {/* branded-color spray bottles with no fragile external text/font dependency */}
      {bottles.map(([x, y, color, scale]) => (
        <SprayBottle key={`${x}-${y}`} position={[x, y, 0.06]} color={color} scale={scale} />
      ))}

      {/* detergent jug with integrated handle */}
      <group position={[0.58, 2.14, 0.03]}>
        <mesh scale={[0.9, 1.1, 0.72]} castShadow>
          <sphereGeometry args={[0.18, 20, 16]} />
          <meshStandardMaterial color={CREAM} roughness={0.4} />
        </mesh>
        <mesh position={[0.1, 0.1, 0]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.07, 0.022, 9, 20]} />
          <meshStandardMaterial color={FOREST} roughness={0.45} />
        </mesh>
        <mesh position={[-0.04, 0, 0.14]}>
          <planeGeometry args={[0.13, 0.11]} />
          <meshBasicMaterial color={FOREST} />
        </mesh>
      </group>

      {/* folded towels with visible rolled edges */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[0.55, 0.77 + i * 0.1, 0.03]}
          rotation-z={Math.PI / 2}
          scale={[0.78, 1.45, 0.76]}
          castShadow
        >
          <capsuleGeometry args={[0.075, 0.25, 6, 12]} />
          <meshStandardMaterial color={i % 2 ? CREAM : "#cfe3b6"} />
        </mesh>
      ))}

      {/* cleaning bucket, handle and stocked caddy */}
      <group position={[-0.62, 0.78, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.17, 0.13, 0.22, 18]} />
          <meshStandardMaterial color={FOREST} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.1, 0]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.19, 0.014, 8, 28, Math.PI]} />
          <meshStandardMaterial color={CHARCOAL} metalness={0.35} />
        </mesh>
        <mesh position={[0, 0, 0.135]}>
          <planeGeometry args={[0.13, 0.08]} />
          <meshBasicMaterial color={LIME} />
        </mesh>
      </group>
      <group position={[-0.05, 0.79, 0.04]}>
        <mesh scale={[1.45, 0.62, 0.9]} castShadow>
          <sphereGeometry args={[0.16, 18, 12]} />
          <meshStandardMaterial color={CREAM} roughness={0.72} />
        </mesh>
        {[-0.06, 0.07].map((x, index) => (
          <mesh key={x} position={[x, 0.14, 0]}>
            <capsuleGeometry args={[0.025, 0.15, 5, 10]} />
            <meshStandardMaterial color={index ? FOREST : LIME} />
          </mesh>
        ))}
      </group>

      {/* paper rolls and stacked sponges */}
      {[0, 1].map((index) => (
        <mesh
          key={index}
          position={[0.75, 1.4 + index * 0.18, 0.02]}
          rotation-x={Math.PI / 2}
          castShadow
        >
          <cylinderGeometry args={[0.085, 0.085, 0.16, 18]} />
          <meshStandardMaterial color="#f5f1e7" roughness={0.9} />
        </mesh>
      ))}
      {[0, 1, 2].map((index) => (
        <mesh key={index} position={[0.48, 1.36 + index * 0.075, 0.08]} castShadow>
          <boxGeometry args={[0.22, 0.055, 0.12]} />
          <meshStandardMaterial color={index % 2 ? "#f0c954" : LIME} roughness={0.82} />
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
      {[-0.52, -0.18, 0.16, 0.5].map((y) => (
        <mesh key={y} position={[0, 1.55 + y, 0.065]}>
          <boxGeometry args={[1.63, 0.035, 0.025]} />
          <meshStandardMaterial color="#6d8d70" roughness={0.68} />
        </mesh>
      ))}

      {/* Cordless blower with a rounded motor, ergonomic handle and open tube. */}
      <group position={[-0.06, 1.92, 0.14]} rotation-z={Math.PI / 2}>
        <mesh scale={[1.08, 0.94, 0.88]} castShadow>
          <sphereGeometry args={[0.22, 22, 16]} />
          <meshStandardMaterial color={LIME} roughness={0.42} />
        </mesh>
        <mesh position={[0, 0.39, 0]} castShadow>
          <cylinderGeometry args={[0.105, 0.15, 0.54, 22]} />
          <meshStandardMaterial color="#2f3a34" roughness={0.62} />
        </mesh>
        <mesh position={[0, 0.7, 0]} castShadow>
          <cylinderGeometry args={[0.115, 0.115, 0.1, 22]} />
          <meshStandardMaterial color="#202723" roughness={0.58} />
        </mesh>
        <mesh position={[0, 0.755, 0]} rotation-x={Math.PI / 2}>
          <circleGeometry args={[0.085, 20]} />
          <meshStandardMaterial color="#151b18" roughness={0.9} />
        </mesh>
        {[-0.13, 0.13].map((y) => (
          <mesh key={y} position={[0.2, y, 0]} castShadow>
            <boxGeometry args={[0.24, 0.052, 0.085]} />
            <meshStandardMaterial color={CHARCOAL} roughness={0.56} />
          </mesh>
        ))}
        <mesh position={[0.34, 0, 0]} castShadow>
          <capsuleGeometry args={[0.034, 0.22, 6, 12]} />
          <meshStandardMaterial color="#202723" roughness={0.5} />
        </mesh>
        <mesh position={[-0.23, -0.09, 0]} castShadow>
          <boxGeometry args={[0.16, 0.18, 0.18]} />
          <meshStandardMaterial color={FOREST} roughness={0.48} />
        </mesh>
        <mesh position={[0, 0, 0.2]} rotation-x={Math.PI / 2}>
          <circleGeometry args={[0.09, 20]} />
          <meshStandardMaterial color={FOREST} roughness={0.55} />
        </mesh>
      </group>

      {/* rounded mower deck and sculpted electric motor cowling */}
      <group position={[0, 0, 0.62]}>
        <mesh position={[0, 0.28, 0]} scale={[1.28, 0.42, 1]} castShadow receiveShadow>
          <sphereGeometry args={[0.42, 28, 18]} />
          <meshStandardMaterial color={FOREST} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.52, -0.03]} scale={[1.1, 0.72, 0.92]} castShadow>
          <sphereGeometry args={[0.26, 24, 16]} />
          <meshStandardMaterial color={LIME} roughness={0.38} />
        </mesh>
        <mesh position={[0, 0.53, 0.205]}>
          <circleGeometry args={[0.105, 18]} />
          <meshStandardMaterial color={FOREST} roughness={0.42} />
        </mesh>
        {(
          [
            [-0.43, 0.29],
            [0.43, 0.29],
            [-0.43, -0.29],
            [0.43, -0.29],
          ] as Array<[number, number]>
        ).map(([x, z]) => (
          <DetailedWheel key={`${x}-${z}`} position={[x, 0.16, z]} radius={0.17} />
        ))}
        {/* twin-tube folding handle with padded cross grip */}
        {[-0.3, 0.3].map((x) => (
          <mesh key={x} position={[x, 0.64, 0.42]} rotation-x={0.75} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 1.0, 10]} />
            <meshStandardMaterial color="#9aa3a0" metalness={0.5} roughness={0.4} />
          </mesh>
        ))}
        <mesh position={[0, 0.96, 0.72]} rotation-z={Math.PI / 2}>
          <capsuleGeometry args={[0.032, 0.56, 6, 12]} />
          <meshStandardMaterial color={CHARCOAL} />
        </mesh>
        {/* soft grass catcher */}
        <mesh position={[0, 0.38, -0.5]} castShadow>
          <sphereGeometry args={[0.28, 18, 12]} />
          <meshStandardMaterial color="#6d7a52" roughness={0.95} />
        </mesh>
      </group>

      {/* string trimmer with guard, cutting head and auxiliary handle */}
      <group position={[-0.72, 0, 0.34]} rotation-z={0.12}>
        <mesh position={[0, 0.76, 0]} castShadow>
          <cylinderGeometry args={[0.022, 0.027, 1.38, 12]} />
          <meshStandardMaterial color="#aeb8b2" metalness={0.55} roughness={0.34} />
        </mesh>
        <mesh position={[0, 1.47, 0]} castShadow>
          <capsuleGeometry args={[0.09, 0.2, 7, 14]} />
          <meshStandardMaterial color={LIME} roughness={0.44} />
        </mesh>
        <mesh position={[0, 1.63, 0]} castShadow>
          <boxGeometry args={[0.11, 0.12, 0.12]} />
          <meshStandardMaterial color={CHARCOAL} />
        </mesh>
        <mesh position={[0, 1.05, 0.02]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.13, 0.025, 10, 24, Math.PI * 1.55]} />
          <meshStandardMaterial color={CHARCOAL} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.08, 0]} rotation-x={Math.PI / 2} castShadow>
          <cylinderGeometry args={[0.16, 0.16, 0.06, 22]} />
          <meshStandardMaterial color="#2a302d" roughness={0.68} />
        </mesh>
        <mesh position={[0.07, 0.13, -0.02]} rotation-z={-0.4}>
          <torusGeometry args={[0.2, 0.035, 8, 22, Math.PI * 1.1]} />
          <meshStandardMaterial color="#4f5b54" roughness={0.72} />
        </mesh>
      </group>

      {/* Wall-mounted rake has its own clear bay, away from the mower and spade. */}
      <group position={[0.35, 1.32, 0.15]} rotation-z={-0.025}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.025, 0.6, 12]} />
          <meshStandardMaterial color="#c39154" roughness={0.78} />
        </mesh>
        <mesh position={[0, 0.2, -0.055]}>
          <boxGeometry args={[0.09, 0.055, 0.08]} />
          <meshStandardMaterial color={CHARCOAL} roughness={0.58} />
        </mesh>
        {[-0.22, -0.15, -0.08, 0, 0.08, 0.15, 0.22].map((x) => (
          <mesh key={x} position={[x * 0.72, 0.48, 0]} rotation-z={-x * 1.1}>
            <cylinderGeometry args={[0.009, 0.009, 0.26, 7]} />
            <meshStandardMaterial color={FOREST} />
          </mesh>
        ))}
      </group>
      <group position={[0.73, 0, 0.2]}>
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.022, 0.027, 1.35, 12]} />
          <meshStandardMaterial color="#c39154" roughness={0.78} />
        </mesh>
        <mesh position={[0, 0.13, 0]} scale={[0.7, 1, 0.25]}>
          <sphereGeometry args={[0.2, 18, 12]} />
          <meshStandardMaterial color={CHARCOAL} roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.5, 0]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.11, 0.024, 8, 20, Math.PI]} />
          <meshStandardMaterial color={FOREST} />
        </mesh>
      </group>
    </group>
  );
}

function JunkZone() {
  return (
    <group position={[5.35, 0, 2.55]} rotation-y={-Math.PI / 2}>
      {/* tubular appliance dolly with cross braces, grip, toe plate and detailed wheels */}
      <group position={[-0.7, 0, 0]} rotation-y={0.4}>
        {[-0.22, 0.22].map((x) => (
          <mesh key={x} position={[x, 0.78, 0]} rotation-z={x * -0.08} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 1.42, 12]} />
            <meshStandardMaterial color="#c83b30" metalness={0.32} roughness={0.4} />
          </mesh>
        ))}
        {[0.48, 0.83, 1.14].map((y) => (
          <mesh key={y} position={[0, y, 0]} rotation-z={Math.PI / 2} castShadow>
            <cylinderGeometry args={[0.026, 0.026, 0.46, 10]} />
            <meshStandardMaterial color="#a92f28" metalness={0.28} roughness={0.45} />
          </mesh>
        ))}
        <mesh position={[0, 1.49, 0]} rotation-z={Math.PI / 2} castShadow>
          <capsuleGeometry args={[0.034, 0.38, 6, 12]} />
          <meshStandardMaterial color={CHARCOAL} roughness={0.64} />
        </mesh>
        <mesh position={[0, 0.06, 0.16]} castShadow>
          <boxGeometry args={[0.54, 0.055, 0.4]} />
          <meshStandardMaterial color="#8f2f27" />
        </mesh>
        {[-0.3, 0.3].map((x) => (
          <DetailedWheel key={x} position={[x, 0.18, -0.08]} radius={0.17} />
        ))}
      </group>

      {/* taped cartons with seams and branded green handling marks */}
      <mesh position={[0.5, 0.26, 0]} rotation-y={0.2} castShadow receiveShadow>
        <boxGeometry args={[0.66, 0.52, 0.6]} />
        <meshStandardMaterial color="#c49a66" roughness={0.9} />
      </mesh>
      <mesh position={[0.5, 0.535, 0]} rotation-y={0.2}>
        <boxGeometry args={[0.1, 0.018, 0.58]} />
        <meshStandardMaterial color="#e0c394" roughness={0.9} />
      </mesh>
      <mesh position={[0.5, 0.27, 0.305]} rotation-y={0.2}>
        <planeGeometry args={[0.2, 0.15]} />
        <meshBasicMaterial color={FOREST} />
      </mesh>
      <mesh position={[0.56, 0.72, 0.06]} rotation-y={-0.32} castShadow>
        <boxGeometry args={[0.5, 0.4, 0.48]} />
        <meshStandardMaterial color="#b98f5e" roughness={0.9} />
      </mesh>
      <mesh position={[0.56, 0.925, 0.06]} rotation-y={-0.32}>
        <boxGeometry args={[0.08, 0.018, 0.46]} />
        <meshStandardMaterial color="#dec397" roughness={0.9} />
      </mesh>
      <mesh position={[1.15, 0.2, 0.3]} rotation-y={0.8} castShadow>
        <boxGeometry args={[0.44, 0.4, 0.42]} />
        <meshStandardMaterial color="#cfa878" roughness={0.9} />
      </mesh>

      {/* cinched debris bags with gathered tops */}
      {(
        [
          [1.22, 0.3, -0.44, 0.3],
          [0.78, 0.26, -0.58, 0.25],
        ] as Array<[number, number, number, number]>
      ).map(([x, y, z, scale]) => (
        <group key={x} position={[x, y, z]}>
          <mesh scale={[1, 1.25, 0.84]} castShadow>
            <sphereGeometry args={[scale, 20, 14]} />
            <meshStandardMaterial color="#303633" roughness={0.82} />
          </mesh>
          <mesh position={[0, scale * 1.28, 0]}>
            <cylinderGeometry args={[scale * 0.12, scale * 0.32, scale * 0.26, 10]} />
            <meshStandardMaterial color="#2a302c" roughness={0.88} />
          </mesh>
          <mesh position={[0, scale * 1.53, 0]} rotation-z={0.16}>
            <coneGeometry args={[scale * 0.13, scale * 0.26, 8]} />
            <meshStandardMaterial color="#202522" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* wheeled green cleanup bin and flattened cardboard */}
      <group position={[1.9, 0, -0.52]} rotation-y={-0.1}>
        <mesh position={[0, 0.48, 0]} castShadow>
          <boxGeometry args={[0.58, 0.82, 0.52]} />
          <meshStandardMaterial color={FOREST} roughness={0.56} />
        </mesh>
        <mesh position={[0, 0.92, -0.02]} rotation-x={-0.08} castShadow>
          <boxGeometry args={[0.66, 0.09, 0.58]} />
          <meshStandardMaterial color="#315f43" roughness={0.52} />
        </mesh>
        <mesh position={[0, 0.52, 0.265]}>
          <circleGeometry args={[0.1, 18]} />
          <meshBasicMaterial color={LIME} />
        </mesh>
        {[-0.22, 0.22].map((x) => (
          <mesh key={x} position={[x, 0.09, -0.24]} rotation-z={Math.PI / 2}>
            <cylinderGeometry args={[0.085, 0.085, 0.08, 16]} />
            <meshStandardMaterial color="#202421" roughness={0.9} />
          </mesh>
        ))}
      </group>
      {[0, 1, 2].map((index) => (
        <mesh
          key={index}
          position={[2.2 + index * 0.045, 0.36, 0.35]}
          rotation-z={-0.08}
          castShadow
        >
          <boxGeometry args={[0.035, 0.66, 0.44]} />
          <meshStandardMaterial color="#ba8d59" roughness={0.94} />
        </mesh>
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
      {[-0.82, -0.42, -0.02, 0.38, 0.78].map((y) => (
        <mesh key={y} position={[0, 1.62 + y, 0.085]}>
          <boxGeometry args={[2.42, 0.035, 0.04]} />
          <meshStandardMaterial color="#75906f" roughness={0.75} />
        </mesh>
      ))}

      {/* full-size chainsaw with visible bar, chain and wrap handle */}
      <group position={[-0.05, 2.05, 0.19]} rotation-z={-0.04}>
        <mesh scale={[1.45, 0.85, 0.72]} castShadow>
          <sphereGeometry args={[0.25, 24, 16]} />
          <meshStandardMaterial color="#e76b24" roughness={0.38} />
        </mesh>
        <mesh position={[-0.16, 0.01, 0.135]}>
          <circleGeometry args={[0.105, 18]} />
          <meshStandardMaterial color="#202622" roughness={0.7} />
        </mesh>
        <mesh position={[0.15, 0.27, 0]} rotation-z={-0.22}>
          <torusGeometry args={[0.24, 0.035, 8, 22, Math.PI * 1.45]} />
          <meshStandardMaterial color={CHARCOAL} roughness={0.62} />
        </mesh>
        <mesh position={[0.72, -0.015, 0]} rotation-z={Math.PI / 2} castShadow>
          <capsuleGeometry args={[0.06, 0.72, 7, 18]} />
          <meshStandardMaterial color="#bcc3be" metalness={0.72} roughness={0.3} />
        </mesh>
        {Array.from({ length: 10 }, (_, index) => (
          <mesh key={index} position={[0.38 + index * 0.075, 0.068, 0.043]}>
            <boxGeometry args={[0.035, 0.025, 0.025]} />
            <meshStandardMaterial color="#343b37" metalness={0.65} />
          </mesh>
        ))}
        <mesh position={[0.68, -0.015, 0.048]} rotation-z={Math.PI / 2}>
          <capsuleGeometry args={[0.074, 0.74, 7, 18]} />
          <meshStandardMaterial color="#3b433e" metalness={0.7} />
        </mesh>
        <mesh position={[0.68, -0.015, 0.052]} rotation-z={Math.PI / 2}>
          <capsuleGeometry args={[0.052, 0.72, 7, 18]} />
          <meshStandardMaterial color="#c8cfcb" metalness={0.72} roughness={0.26} />
        </mesh>
      </group>

      {/* compact top-handle pruning saw */}
      <group position={[-0.55, 1.38, 0.18]} rotation-z={0.05}>
        <mesh scale={[1.25, 0.72, 0.65]} castShadow>
          <sphereGeometry args={[0.22, 22, 15]} />
          <meshStandardMaterial color={LIME} roughness={0.42} />
        </mesh>
        <mesh position={[-0.02, 0.22, 0]} rotation-z={-0.15}>
          <torusGeometry args={[0.17, 0.03, 7, 18, Math.PI * 1.35]} />
          <meshStandardMaterial color={CHARCOAL} />
        </mesh>
        <mesh position={[0.37, 0, 0]} rotation-z={Math.PI / 2}>
          <capsuleGeometry args={[0.045, 0.26, 6, 16]} />
          <meshStandardMaterial color="#c2c8c4" metalness={0.68} roughness={0.28} />
        </mesh>
      </group>

      {/* pole saw and hand pruning saw */}
      <mesh position={[-1.0, 1.18, 0.18]} rotation-z={0.07} castShadow>
        <cylinderGeometry args={[0.038, 0.038, 2.18, 12]} />
        <meshStandardMaterial color="#d6dbd8" metalness={0.58} roughness={0.34} />
      </mesh>
      <group position={[-0.92, 2.28, 0.19]} rotation-z={-0.1}>
        <mesh position={[0, 0.13, 0]}>
          <boxGeometry args={[0.16, 0.32, 0.11]} />
          <meshStandardMaterial color="#e76b24" />
        </mesh>
        <mesh position={[0, 0.39, 0]} rotation-z={-0.18}>
          <boxGeometry args={[0.09, 0.35, 0.045]} />
          <meshStandardMaterial color="#c5cbc7" metalness={0.65} />
        </mesh>
      </group>
      <group position={[0.73, 1.48, 0.18]} rotation-z={-0.32}>
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[0.12, 0.42, 0.09]} />
          <meshStandardMaterial color="#e76b24" />
        </mesh>
        <mesh position={[0, 0.17, 0]}>
          <boxGeometry args={[0.075, 0.38, 0.035]} />
          <meshStandardMaterial color="#d3d7d4" metalness={0.72} />
        </mesh>
      </group>

      {/* arborist helmet with ear protection, rope and gloves */}
      <group position={[0.92, 2.58, 0.2]}>
        <mesh castShadow>
          <sphereGeometry args={[0.22, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#f3b33e" roughness={0.38} />
        </mesh>
        {[-0.23, 0.23].map((x) => (
          <mesh key={x} position={[x, -0.05, 0]}>
            <cylinderGeometry args={[0.075, 0.075, 0.07, 14]} />
            <meshStandardMaterial color={CHARCOAL} />
          </mesh>
        ))}
      </group>
      <mesh position={[0.62, 0.38, 0.19]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.22, 0.04, 10, 28]} />
        <meshStandardMaterial color="#e5a54a" roughness={0.8} />
      </mesh>
      <mesh position={[-0.08, 0.23, 0.18]} rotation-z={Math.PI / 2} castShadow>
        <boxGeometry args={[0.34, 0.075, 0.15]} />
        <meshStandardMaterial color="#d9c79e" roughness={0.95} />
      </mesh>

      {/* long-handled loppers */}
      <group position={[-0.48, 0.38, 0.2]}>
        {[-0.12, 0.12].map((x) => (
          <group key={x} rotation-z={x * 0.48}>
            <mesh position={[x, 0.2, 0]}>
              <cylinderGeometry args={[0.026, 0.032, 0.72, 12]} />
              <meshStandardMaterial color="#d6a15d" roughness={0.7} />
            </mesh>
            <mesh position={[x, -0.18, 0]}>
              <capsuleGeometry args={[0.034, 0.16, 5, 10]} />
              <meshStandardMaterial color={FOREST} roughness={0.7} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 0.6, 0]} rotation-z={0.38}>
          <torusGeometry args={[0.16, 0.035, 9, 18, Math.PI * 0.95]} />
          <meshStandardMaterial color={CHARCOAL} metalness={0.48} roughness={0.38} />
        </mesh>
      </group>

      {/* fan rake with dimensional tines */}
      <group position={[0.28, 0.42, 0.2]}>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.022, 0.026, 0.65, 12]} />
          <meshStandardMaterial color="#cf9a54" roughness={0.76} />
        </mesh>
        {[-0.22, -0.15, -0.08, 0, 0.08, 0.15, 0.22].map((x) => (
          <mesh key={x} position={[x * 0.66, 0.59, 0]} rotation-z={-x * 1.25}>
            <cylinderGeometry args={[0.009, 0.009, 0.38, 7]} />
            <meshStandardMaterial color="#263e30" roughness={0.7} />
          </mesh>
        ))}
      </group>

      {/* compact shovel with a D-grip and rounded blade */}
      <group position={[1.05, 0.65, 0.2]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.022, 0.026, 0.76, 12]} />
          <meshStandardMaterial color="#d4a15f" roughness={0.74} />
        </mesh>
        <mesh position={[0, -0.48, 0]} scale={[0.72, 1, 0.24]}>
          <sphereGeometry args={[0.18, 18, 12]} />
          <meshStandardMaterial color={CHARCOAL} metalness={0.32} roughness={0.48} />
        </mesh>
        <mesh position={[0, 0.48, 0]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.11, 0.025, 8, 20, Math.PI]} />
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

      {/* cheerful sun wearing shades, with a soft glow and rays */}
      <group position={[1.25, 2.68, -1.68]}>
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
          position={[x, y, -1.585 + index * 0.014]}
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
      {[-1.05, -0.82, 0.78, 1.02].map((x, index) => (
        <group key={x} position={[x, 0.64, -1.44 + index * 0.008]}>
          <mesh scale={[1.3, 0.7, 1]}>
            <circleGeometry args={[0.21, 18]} />
            <meshBasicMaterial color="#336e42" />
          </mesh>
          <mesh position={[-0.07, 0.05, 0.004]} scale={[1, 0.82, 1]}>
            <circleGeometry args={[0.13, 16]} />
            <meshBasicMaterial color="#3f8449" />
          </mesh>
          <mesh position={[0.09, 0.04, 0.006]} scale={[1, 0.8, 1]}>
            <circleGeometry args={[0.11, 16]} />
            <meshBasicMaterial color="#4a9152" />
          </mesh>
          <mesh position={[-0.05, 0.1, 0.012]}>
            <circleGeometry args={[0.028, 10]} />
            <meshBasicMaterial color={index % 2 ? "#fff0ad" : "#f5a1a8"} />
          </mesh>
          <mesh position={[0.08, 0.09, 0.012]}>
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
      <mesh rotation-x={-Math.PI / 2}>
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
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.012, -0.6]}>
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
        <mesh position={[0, 1.95, 0.04]}>
          <boxGeometry args={[0.07, 2.2, 0.07]} />
          <meshStandardMaterial color={CREAM} />
        </mesh>
        <mesh position={[0, 1.95, 0.04]}>
          <boxGeometry args={[3.4, 0.07, 0.07]} />
          <meshStandardMaterial color={CREAM} />
        </mesh>
      </group>
      {/* side walls */}
      <mesh position={[-6, 1.8, 0]} rotation-y={Math.PI / 2} receiveShadow>
        <planeGeometry args={[10.4, 3.6]} />
        <meshStandardMaterial color={WALL} roughness={1} />
      </mesh>
      <mesh position={[6, 1.8, 0]} rotation-y={-Math.PI / 2}>
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

function CornerPlant() {
  return <LeafyPlant position={[4.65, 0, -4.35]} scale={1.15} />;
}

export function OfficeScene({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <>
      <color attach="background" args={["#e8e2d3"]} />
      <hemisphereLight args={["#dfefff", "#a07c56", 1.0]} />
      <ambientLight intensity={0.55} />
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
        shadow-normalBias={0.04}
        shadow-bias={0.00008}
        shadow-radius={3}
        shadow-blurSamples={10}
      />
      <pointLight position={[0, 3.2, 0]} intensity={0.6} color="#fff0d2" />

      <Room />
      <RoomDetails />
      {/* Ground contact only: no long projections from wall-mounted tools or lights. */}
      <ContactShadows
        position={[0, 0.018, -0.4]}
        scale={14}
        opacity={0.23}
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
      <LeafyPlant position={[2.05, 0, -2.35]} scale={0.95} potColor="#e7e2d6" />
      <WallClock position={[-3.2, 2.6, -5.05]} />
    </>
  );
}
