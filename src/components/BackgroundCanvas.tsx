import { Canvas } from '@react-three/fiber';
import { useTheme } from '@/context/ThemeContext';

function MorphMesh({ isDark }: { isDark: boolean }) {
  // Placeholder — full implementation in Task 4
  void isDark;
  return null;
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
