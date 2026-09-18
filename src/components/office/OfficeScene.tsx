import { useFrame } from "@react-three/fiber";
import { ContactShadows, useTexture } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import type { Group, InstancedMesh } from "three";
import { CanvasTexture, Object3D, SRGBColorSpace } from "three";
import { WallClock } from "./WallClock";
import { BRAND_LOGO } from "@/lib/brand";

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
  const mugLogo = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const context = canvas.getContext("2d");
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = "700 88px Outfit, Arial, sans-serif";
      context.fillStyle = "#0d563f";
      context.fillText("Kleanup", 256, 88);
      context.fillStyle = "#8fd14f";
      context.fillText("Crew", 256, 176);
    }
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 4;
    return texture;
  }, []);

  useEffect(() => () => mugLogo.dispose(), [mugLogo]);

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
        <mesh position={[0, -0.004, 0.079]}>
          <planeGeometry args={[0.12, 0.063]} />
          <meshBasicMaterial map={mugLogo} transparent toneMapped={false} />
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
      {/* cleaning bucket */}
      <group position={[-0.62, 0.78, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.17, 0.13, 0.22, 18]} />
          <meshStandardMaterial color={LIME} roughness={0.5} />
        </mesh>
      </group>
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
      {(
        [
          [-0.38, 0.28],
          [0.38, 0.28],
          [-0.38, -0.28],
          [0.38, -0.28],
        ] as Array<[number, number]>
      ).map(([x, z], i) => (
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
        <meshStandardMaterial color="#c49a66" roughness={0.9} />
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
        <mesh castShadow>
          <boxGeometry args={[0.65, 0.38, 0.25]} />
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
        <mesh position={[0.72, -0.015, 0]} castShadow>
          <boxGeometry args={[0.82, 0.13, 0.07]} />
          <meshStandardMaterial color="#bcc3be" metalness={0.72} roughness={0.3} />
        </mesh>
        {Array.from({ length: 10 }, (_, index) => (
          <mesh key={index} position={[0.38 + index * 0.075, 0.068, 0.043]}>
            <boxGeometry args={[0.035, 0.025, 0.025]} />
            <meshStandardMaterial color="#343b37" metalness={0.65} />
          </mesh>
        ))}
        <mesh position={[0.68, -0.015, 0.048]}>
          <boxGeometry args={[0.88, 0.035, 0.025]} />
          <meshStandardMaterial color="#3b433e" metalness={0.7} />
        </mesh>
      </group>

      {/* compact top-handle pruning saw */}
      <group position={[-0.28, 1.28, 0.18]} rotation-z={0.08}>
        <mesh castShadow>
          <boxGeometry args={[0.48, 0.28, 0.2]} />
          <meshStandardMaterial color={LIME} roughness={0.42} />
        </mesh>
        <mesh position={[-0.02, 0.22, 0]} rotation-z={-0.15}>
          <torusGeometry args={[0.17, 0.03, 7, 18, Math.PI * 1.35]} />
          <meshStandardMaterial color={CHARCOAL} />
        </mesh>
        <mesh position={[0.48, 0, 0]}>
          <boxGeometry args={[0.52, 0.1, 0.055]} />
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
          <meshBasicMaterial color="#709b65" />
        </mesh>
        {/* distant landscaping visible through the glass */}
        <mesh position={[0, 0.85, -1.48]}>
          <circleGeometry args={[2.8, 40, 0, Math.PI]} />
          <meshBasicMaterial color="#82aa72" />
        </mesh>
        {[-2.2, -1.35, 1.45, 2.25].map((x, index) => (
          <group key={x} position={[x, 1.05 + (index % 2) * 0.12, -1.35]}>
            <mesh position={[0, -0.35, 0]}>
              <boxGeometry args={[0.1, 0.72, 0.08]} />
              <meshBasicMaterial color="#6f4d31" />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.48, 14, 10]} />
              <meshBasicMaterial color={index % 2 ? "#527f4e" : "#5f8e57"} />
            </mesh>
          </group>
        ))}
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
