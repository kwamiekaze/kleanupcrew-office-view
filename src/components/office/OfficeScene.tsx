import { useFrame } from "@react-three/fiber";
import { ContactShadows, useTexture } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import type { Group, InstancedMesh } from "three";
import { Object3D, SRGBColorSpace } from "three";
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
      <mesh position={[-0.006, 0.13, 0.087]}>
        <planeGeometry args={[0.095, 0.1]} />
        <meshStandardMaterial color="#f4f0e4" roughness={0.72} />
      </mesh>
      <mesh position={[-0.006, 0.145, 0.089]}>
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

function DeskProps() {
  return (
    <group position={[0, 0.78, -2.4]}>
      {/* keyboard */}
      <mesh position={[0, 0.02, 0.28]} castShadow>
        <boxGeometry args={[0.72, 0.03, 0.24]} />
        <meshStandardMaterial color="#d9d2c2" roughness={0.8} />
      </mesh>
      {Array.from({ length: 7 }, (_, column) =>
        Array.from({ length: 3 }, (_, row) => (
          <mesh
            key={`${column}-${row}`}
            position={[-0.27 + column * 0.09, 0.041, 0.2 + row * 0.065]}
          >
            <boxGeometry args={[0.055, 0.008, 0.038]} />
            <meshStandardMaterial color="#767d78" roughness={0.7} />
          </mesh>
        )),
      )}
      {/* low-profile wireless mouse on a desk mat */}
      <group position={[0.55, 0, 0.3]}>
        <mesh position={[0, 0.005, 0]} receiveShadow>
          <boxGeometry args={[0.32, 0.01, 0.36]} />
          <meshStandardMaterial color="#384b40" roughness={0.95} />
        </mesh>
        <mesh position={[0, 0.022, 0]} scale={[0.075, 0.018, 0.12]} castShadow>
          <sphereGeometry args={[1, 24, 16]} />
          <meshStandardMaterial color="#343b37" roughness={0.65} />
        </mesh>
        <mesh position={[0, 0.026, 0]} scale={[0.073, 0.042, 0.117]} castShadow>
          <sphereGeometry args={[1, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#ecece5" roughness={0.42} />
        </mesh>
        <mesh position={[0, 0.063, -0.033]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.012, 0.012, 0.014, 16]} />
          <meshStandardMaterial color="#525b55" roughness={0.7} />
        </mesh>
      </group>
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
        <mesh castShadow>
          <cylinderGeometry args={[0.085, 0.075, 0.17, 20]} />
          <meshStandardMaterial color={CREAM} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.07, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.02, 20]} />
          <meshStandardMaterial color="#4a2f1d" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.085, 0]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.077, 0.008, 10, 32]} />
          <meshStandardMaterial color={CREAM} roughness={0.3} />
        </mesh>
        <mesh position={[0.09, 0.004, 0]} scale={[1, 1.18, 1]} castShadow>
          <torusGeometry args={[0.049, 0.012, 12, 32]} />
          <meshStandardMaterial color={CREAM} roughness={0.3} />
        </mesh>
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

      {/* Long-handled dustpan, stored beside the broom rather than on the shelf. */}
      <group position={[1.13, 0, 0.36]} rotation-z={0.04}>
        <mesh position={[0, 0.58, -0.03]} castShadow>
          <cylinderGeometry args={[0.018, 0.022, 0.96, 10]} />
          <meshStandardMaterial color="#47534d" roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.07, -0.03]} rotation-z={Math.PI / 2} castShadow>
          <capsuleGeometry args={[0.035, 0.08, 5, 10]} />
          <meshStandardMaterial color={LIME} roughness={0.55} />
        </mesh>
        <mesh position={[0, 0.105, 0.02]} scale={[1.35, 0.4, 0.92]} castShadow>
          <sphereGeometry args={[0.15, 20, 12]} />
          <meshStandardMaterial color={LIME} roughness={0.58} />
        </mesh>
        <mesh position={[0, 0.155, -0.11]} castShadow>
          <boxGeometry args={[0.34, 0.15, 0.055]} />
          <meshStandardMaterial color="#6cae39" roughness={0.62} />
        </mesh>
      </group>

      {/* Compact upright vacuum with rounded motor housing, hose, wheels and handle. */}
      <group position={[-1.48, 0, 0.28]}>
        <mesh position={[0, 0.13, 0.02]} scale={[1.25, 0.45, 0.95]} castShadow receiveShadow>
          <sphereGeometry args={[0.22, 22, 14]} />
          <meshStandardMaterial color={FOREST} roughness={0.48} />
        </mesh>
        <mesh position={[0, 0.47, 0]} scale={[0.92, 1.35, 0.74]} castShadow>
          <sphereGeometry args={[0.22, 22, 16]} />
          <meshStandardMaterial color="#315f43" roughness={0.46} />
        </mesh>
        <mesh position={[0, 0.5, 0.155]} castShadow>
          <circleGeometry args={[0.085, 18]} />
          <meshStandardMaterial color={LIME} roughness={0.42} />
        </mesh>
        <mesh position={[0.17, 0.57, -0.02]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.17, 0.025, 9, 24, Math.PI * 1.45]} />
          <meshStandardMaterial color="#202723" roughness={0.72} />
        </mesh>
        <mesh position={[0, 1.02, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.03, 0.7, 12]} />
          <meshStandardMaterial color={CHARCOAL} roughness={0.5} />
        </mesh>
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
      {/* substantial wood shelving with a warm recessed back */}
      <mesh position={[0, 1.6, -0.27]} receiveShadow>
        <boxGeometry args={[2.05, 2.45, 0.04]} />
        <meshStandardMaterial color="#6b4528" roughness={0.88} />
      </mesh>
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
    <group position={[-4.38, 0, -3.72]} rotation-y={0.12}>
      {/* Back-corner wall rack keeps the lawn equipment grouped against the wall. */}
      <mesh position={[0, 1.55, -0.82]} castShadow receiveShadow>
        <boxGeometry args={[2.45, 1.55, 0.09]} />
        <meshStandardMaterial color="#244832" roughness={0.82} />
      </mesh>
      {[-0.52, -0.18, 0.16, 0.5].map((y) => (
        <mesh key={y} position={[0, 1.55 + y, -0.765]}>
          <boxGeometry args={[2.3, 0.035, 0.025]} />
          <meshStandardMaterial color="#6d8d70" roughness={0.68} />
        </mesh>
      ))}

      {/* cordless leaf blower with a rounded motor shell and tapered barrel */}
      <group position={[-0.38, 1.82, -0.64]} rotation-z={Math.PI / 2}>
        <mesh scale={[1.05, 0.9, 0.84]} castShadow>
          <sphereGeometry args={[0.22, 22, 16]} />
          <meshStandardMaterial color={LIME} roughness={0.42} />
        </mesh>
        <mesh position={[0, 0.43, 0]} castShadow>
          <coneGeometry args={[0.14, 0.62, 20]} />
          <meshStandardMaterial color="#2f3a34" roughness={0.62} />
        </mesh>
        <mesh position={[0, -0.08, 0.2]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.13, 0.03, 10, 22, Math.PI * 1.45]} />
          <meshStandardMaterial color={CHARCOAL} roughness={0.65} />
        </mesh>
        <mesh position={[0, 0, 0.19]} rotation-x={Math.PI / 2}>
          <circleGeometry args={[0.085, 18]} />
          <meshStandardMaterial color={FOREST} />
        </mesh>
      </group>

      {/* rounded mower deck and sculpted electric motor cowling */}
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

      {/* string trimmer with guard, cutting head and auxiliary handle */}
      <group position={[-1.02, 0, -0.26]} rotation-z={0.12}>
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

      {/* rake and spade complete the lawn-care corner. */}
      <group position={[0.88, 0, -0.7]} rotation-z={-0.04}>
        <mesh position={[0, 0.78, 0]}>
          <cylinderGeometry args={[0.02, 0.025, 1.45, 12]} />
          <meshStandardMaterial color="#c39154" roughness={0.78} />
        </mesh>
        {[-0.22, -0.15, -0.08, 0, 0.08, 0.15, 0.22].map((x) => (
          <mesh key={x} position={[x, 1.47, 0]} rotation-z={-x * 0.55}>
            <cylinderGeometry args={[0.009, 0.009, 0.38, 7]} />
            <meshStandardMaterial color={FOREST} />
          </mesh>
        ))}
      </group>
      <group position={[1.12, 0, -0.64]}>
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
    <group position={[3.4, 0, 2.2]} rotation-y={-0.35}>
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
          <mesh position={[0, scale * 1.17, 0]} rotation-z={Math.PI / 4}>
            <coneGeometry args={[scale * 0.16, scale * 0.28, 8]} />
            <meshStandardMaterial color="#202522" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* wheeled green cleanup bin and flattened cardboard */}
      <group position={[1.65, 0, -0.52]} rotation-y={-0.1}>
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
          position={[1.95 + index * 0.045, 0.36, 0.35]}
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
        <mesh key={y} position={[0, 1.62 + y, 0.035]}>
          <boxGeometry args={[2.42, 0.035, 0.04]} />
          <meshStandardMaterial color="#75906f" roughness={0.75} />
        </mesh>
      ))}

      {/* full-size chainsaw with visible bar, chain and wrap handle */}
      <group position={[-0.15, 1.88, 0.19]} rotation-z={-0.05}>
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
      <group position={[-0.28, 1.28, 0.18]} rotation-z={0.08}>
        <mesh scale={[1.25, 0.72, 0.65]} castShadow>
          <sphereGeometry args={[0.22, 22, 15]} />
          <meshStandardMaterial color={LIME} roughness={0.42} />
        </mesh>
        <mesh position={[-0.02, 0.22, 0]} rotation-z={-0.15}>
          <torusGeometry args={[0.17, 0.03, 7, 18, Math.PI * 1.35]} />
          <meshStandardMaterial color={CHARCOAL} />
        </mesh>
        <mesh position={[0.48, 0, 0]} rotation-z={Math.PI / 2}>
          <capsuleGeometry args={[0.045, 0.45, 6, 16]} />
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
      <group position={[0.86, 1.27, 0.18]} rotation-z={-0.42}>
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
      <group position={[0.88, 2.28, 0.2]}>
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
      <mesh position={[0.93, 0.62, 0.19]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.3, 0.045, 10, 28]} />
        <meshStandardMaterial color="#e5a54a" roughness={0.8} />
      </mesh>
      <mesh position={[0.15, 0.58, 0.18]} rotation-z={Math.PI / 2} castShadow>
        <boxGeometry args={[0.55, 0.08, 0.16]} />
        <meshStandardMaterial color="#d9c79e" roughness={0.95} />
      </mesh>

      {/* long-handled loppers */}
      <group position={[-0.4, 0.72, 0.2]}>
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
      <group position={[0.36, 0.64, 0.2]}>
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.022, 0.026, 0.75, 12]} />
          <meshStandardMaterial color="#cf9a54" roughness={0.76} />
        </mesh>
        {[-0.22, -0.15, -0.08, 0, 0.08, 0.15, 0.22].map((x) => (
          <mesh key={x} position={[x * 0.7, 0.66, 0]} rotation-z={-x * 1.35}>
            <cylinderGeometry args={[0.009, 0.009, 0.46, 7]} />
            <meshStandardMaterial color="#263e30" roughness={0.7} />
          </mesh>
        ))}
      </group>

      {/* compact shovel with a D-grip and rounded blade */}
      <group position={[0.92, 1.12, 0.2]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.022, 0.026, 0.9, 12]} />
          <meshStandardMaterial color="#d4a15f" roughness={0.74} />
        </mesh>
        <mesh position={[0, -0.55, 0]} scale={[0.72, 1, 0.24]}>
          <sphereGeometry args={[0.18, 18, 12]} />
          <meshStandardMaterial color={CHARCOAL} metalness={0.32} roughness={0.48} />
        </mesh>
        <mesh position={[0, 0.55, 0]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.11, 0.025, 8, 20, Math.PI]} />
          <meshStandardMaterial color={LIME} roughness={0.55} />
        </mesh>
      </group>
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

      {/* sun and soft clouds */}
      <mesh position={[1.25, 2.68, -1.68]}>
        <circleGeometry args={[0.27, 28]} />
        <meshBasicMaterial color="#ffe579" />
      </mesh>
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
        <mesh key={x} position={[x, 1.43 + (index % 2) * 0.07, -1.61]} scale={[1.25, 0.55, 1]}>
          <circleGeometry args={[0.72, 24]} />
          <meshBasicMaterial color={index % 2 ? "#5f9d57" : "#6caa5e"} />
        </mesh>
      ))}

      {/* natural midground grove with no neighboring buildings */}
      {(
        [
          { x: -1.18, y: 1.48, scale: 0.72, color: "#4b8d50" },
          { x: -0.72, y: 1.57, scale: 0.86, color: "#397a45" },
          { x: -0.18, y: 1.52, scale: 0.76, color: "#58994f" },
          { x: 0.38, y: 1.58, scale: 0.9, color: "#3d8048" },
          { x: 0.95, y: 1.51, scale: 0.78, color: "#55954e" },
        ] as const
      ).map(({ x, y, scale, color }) => (
        <group key={x} position={[x, y, -1.55]} scale={scale}>
          <mesh position={[0, -0.43, 0]}>
            <boxGeometry args={[0.09, 0.7, 0.04]} />
            <meshBasicMaterial color="#77523a" />
          </mesh>
          <mesh scale={[1.05, 0.92, 1]}>
            <circleGeometry args={[0.44, 20]} />
            <meshBasicMaterial color={color} />
          </mesh>
          <mesh position={[-0.24, -0.08, 0.01]}>
            <circleGeometry args={[0.29, 18]} />
            <meshBasicMaterial color="#63a658" />
          </mesh>
          <mesh position={[0.25, -0.07, 0.012]}>
            <circleGeometry args={[0.31, 18]} />
            <meshBasicMaterial color="#4f934e" />
          </mesh>
        </group>
      ))}

      {/* clipped lawn stripes, garden stones, foreground trees and flower beds */}
      {[0.77, 0.9, 1.03].map((y) => (
        <mesh key={y} position={[0, y, -1.5]}>
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
        <group key={x} position={[x, 1.42, -1.46]}>
          <mesh position={[0, -0.45, 0]}>
            <boxGeometry args={[0.12, 0.9, 0.06]} />
            <meshBasicMaterial color="#755039" />
          </mesh>
          {(
            [
              [0, 0.12, 0.48],
              [-0.24, -0.02, 0.34],
              [0.25, -0.06, 0.38],
            ] as Array<[number, number, number]>
          ).map(([dx, dy, radius], leafIndex) => (
            <mesh key={leafIndex} position={[dx, dy, 0]}>
              <circleGeometry args={[radius, 20]} />
              <meshBasicMaterial color={index ? "#3f8149" : "#4a8c4f"} />
            </mesh>
          ))}
        </group>
      ))}
      {[-1.05, -0.82, 0.78, 1.02].map((x, index) => (
        <group key={x} position={[x, 0.66, -1.43]}>
          <mesh scale={[1.25, 0.65, 1]}>
            <circleGeometry args={[0.22, 16]} />
            <meshBasicMaterial color="#397648" />
          </mesh>
          <mesh position={[0, 0.09, 0.01]}>
            <circleGeometry args={[0.035, 10]} />
            <meshBasicMaterial color={index % 2 ? "#fff0ad" : "#f5a1a8"} />
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
          <mesh position={[0, 0, 0.036]}>
            <planeGeometry args={[0.7, 1]} />
            <meshStandardMaterial color="#ece4cc" />
          </mesh>
          <mesh position={[0, -0.03, 0.044]} rotation-z={index ? -0.15 : 0.15}>
            <planeGeometry args={[0.014, 0.68]} />
            <meshBasicMaterial color={FOREST} />
          </mesh>
          {[-1, 1].map((side) =>
            [0, 1, 2].map((leaf) => (
              <mesh
                key={`${side}-${leaf}`}
                position={[side * 0.1, -0.22 + leaf * 0.19, 0.048]}
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
        <mesh key={x} position={[x, 0.014, -0.6]} rotation-x={-Math.PI / 2}>
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

function CornerPlant() {
  return (
    <group position={[4.65, 0, -4.35]}>
      <mesh position={[0, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.22, 0.56, 20]} />
        <meshStandardMaterial color="#c77d4e" roughness={0.76} />
      </mesh>
      {[-0.3, -0.1, 0.12, 0.3].map((x, index) => (
        <group key={x} position={[x * 0.35, 0.58, 0]} rotation-z={x}>
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.018, 0.025, 0.7, 8]} />
            <meshStandardMaterial color="#426d42" />
          </mesh>
          <mesh position={[x * 0.38, 0.66 + index * 0.04, 0]} rotation-z={x * 1.5} castShadow>
            <sphereGeometry args={[0.22, 14, 9]} />
            <meshStandardMaterial color={index % 2 ? "#5b8c51" : "#6a9b57"} roughness={0.78} />
          </mesh>
        </group>
      ))}
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
        shadow-normalBias={0.03}
        shadow-bias={-0.00015}
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
      <DeskProps />
      <Chair reducedMotion={reducedMotion} />
      <Shelves />
      <LawnMower />
      <JunkZone />
      <TreeCareWall />
      <CornerPlant />
      <WallClock position={[-3.2, 2.6, -5.05]} />
      <DustMotes reducedMotion={reducedMotion} />
    </>
  );
}
