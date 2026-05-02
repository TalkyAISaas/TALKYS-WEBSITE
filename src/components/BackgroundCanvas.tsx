// src/components/BackgroundCanvas.tsx
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { RibbonLayerConfig } from '@/utils/ribbonUtils';
import {
  RIBBON_LAYERS,
  NUM_POINTS,
  buildRibbonPointsInto,
  buildSpinePointsInto,
  computeRibbonScroll,
} from '@/utils/ribbonUtils';

// ─── RibbonLayer ─────────────────────────────────────────────

interface RibbonLayerProps {
  config: RibbonLayerConfig;
  timeRef: React.MutableRefObject<number>;
  scrollRef: React.MutableRefObject<number>;
}

function RibbonLayer({ config, timeRef, scrollRef }: RibbonLayerProps) {
  const attrRef = useRef<THREE.BufferAttribute>(null!);
  const posArr  = useMemo(() => new Float32Array(NUM_POINTS * 3), []);

  useFrame(() => {
    buildRibbonPointsInto(timeRef.current, scrollRef.current, config, 20, posArr);
    attrRef.current.needsUpdate = true;
  });

  return (
    <line>
      <bufferGeometry>
        {/* @ts-expect-error — ref on bufferAttribute is valid in R3F */}
        <bufferAttribute
          ref={attrRef}
          attach="attributes-position"
          array={posArr}
          count={NUM_POINTS}
          itemSize={3}
          usage={THREE.DynamicDrawUsage}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color={config.color}
        transparent
        opacity={config.opacity}
      />
    </line>
  );
}

// ─── SpineLine ───────────────────────────────────────────────

interface SpineLineProps {
  timeRef: React.MutableRefObject<number>;
  scrollRef: React.MutableRefObject<number>;
}

function SpineLine({ timeRef, scrollRef }: SpineLineProps) {
  const attrRef = useRef<THREE.BufferAttribute>(null!);
  const posArr  = useMemo(() => new Float32Array(NUM_POINTS * 3), []);

  useFrame(() => {
    buildSpinePointsInto(timeRef.current, scrollRef.current, 20, posArr);
    attrRef.current.needsUpdate = true;
  });

  return (
    <line>
      <bufferGeometry>
        {/* @ts-expect-error — ref on bufferAttribute is valid in R3F */}
        <bufferAttribute
          ref={attrRef}
          attach="attributes-position"
          array={posArr}
          count={NUM_POINTS}
          itemSize={3}
          usage={THREE.DynamicDrawUsage}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#ffffff" transparent opacity={0.7} />
    </line>
  );
}

// ─── RibbonScene ─────────────────────────────────────────────

function RibbonScene() {
  const timeRef   = useRef(0);
  const scrollRef = useRef(0);
  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const onScroll = () => {
      scrollRef.current = computeRibbonScroll(
        window.scrollY,
        document.body.scrollHeight,
        window.innerHeight
      );
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useFrame((_, delta) => {
    if (!reducedMotion.current) timeRef.current += delta;
  });

  return (
    <group>
      {RIBBON_LAYERS.map((layer, i) => (
        <RibbonLayer
          key={i}
          config={layer}
          timeRef={timeRef}
          scrollRef={scrollRef}
        />
      ))}
      <SpineLine timeRef={timeRef} scrollRef={scrollRef} />
    </group>
  );
}

// ─── BackgroundCanvas ────────────────────────────────────────

export default function BackgroundCanvas() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
      >
        <RibbonScene />
      </Canvas>
    </div>
  );
}
