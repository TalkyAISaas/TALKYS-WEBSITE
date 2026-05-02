import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '@/context/ThemeContext';
import {
  buildSpherePositions,
  buildGridLineIndices,
  buildMeridianLineIndices,
  updateWavePlanePositions,
  morphPositions,
  extractIndexedPositions,
  getThemeColors,
  computeMorphProgress,
} from '@/utils/morphUtils';

const W_SEG = 32;
const H_SEG = 32;
const WAVE_AMPLITUDE = 0.3;
const WAVE_FREQUENCY = 0.5;
const PLANE_WIDTH = 18;
const PLANE_HEIGHT = 12;
const GLOBE_RADIUS = 2.5;

function MorphMesh({ isDark }: { isDark: boolean }) {
  const morphProgressRef = useRef(0);
  const timeRef = useRef(0);
  const groupRef = useRef<THREE.Group>(null);
  const reducedMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const spherePos = useMemo(
    () => buildSpherePositions(GLOBE_RADIUS, W_SEG, H_SEG),
    []
  );
  const gridIdx = useMemo(() => buildGridLineIndices(W_SEG, H_SEG), []);
  const meridianIdx = useMemo(() => buildMeridianLineIndices(W_SEG, H_SEG, 8), []);

  const currentPlane = useMemo(
    () => new Float32Array(spherePos.length),
    [spherePos]
  );
  const morphed = useMemo(
    () => new Float32Array(spherePos),
    [spherePos]
  );
  const accentMorphed = useMemo(
    () => new Float32Array(meridianIdx.length * 3),
    [meridianIdx]
  );

  const mainGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(morphed, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('position', posAttr);
    geo.setIndex(new THREE.BufferAttribute(gridIdx, 1));
    return geo;
  }, [morphed, gridIdx]);

  const accentGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(accentMorphed, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('position', posAttr);
    return geo;
  }, [accentMorphed]);

  const mainMat = useMemo(() => {
    const { primary, opacity } = getThemeColors(isDark);
    return new THREE.LineBasicMaterial({ color: primary, transparent: true, opacity });
  }, [isDark]);

  const accentMat = useMemo(() => {
    const { accent, opacity } = getThemeColors(isDark);
    return new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: opacity * 0.8 });
  }, [isDark]);

  useEffect(() => {
    const onScroll = () => {
      morphProgressRef.current = computeMorphProgress(
        window.scrollY,
        document.body.scrollHeight,
        window.innerHeight
      );
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useFrame(() => {
    timeRef.current += 0.008;
    const progress = reducedMotion.current ? 0 : morphProgressRef.current;
    const rotSpeed = reducedMotion.current ? 0.0005 : 0.003;

    updateWavePlanePositions(
      currentPlane, PLANE_WIDTH, PLANE_HEIGHT, W_SEG, H_SEG,
      timeRef.current, WAVE_AMPLITUDE, WAVE_FREQUENCY
    );

    morphPositions(spherePos, currentPlane, progress, morphed);
    extractIndexedPositions(morphed, meridianIdx, accentMorphed);

    (mainGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (accentGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;

    if (groupRef.current) {
      groupRef.current.rotation.y += rotSpeed;
      groupRef.current.position.x = 0.8 * (1 - progress);
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={mainGeo} material={mainMat} />
      <lineSegments geometry={accentGeo} material={accentMat} />
    </group>
  );
}

export default function BackgroundCanvas() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
        camera={{ position: [0, 0, 6], fov: 75 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
      >
        <MorphMesh isDark={isDark} />
      </Canvas>
    </div>
  );
}
