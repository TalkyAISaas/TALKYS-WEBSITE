const FloatingObjects = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {/* Large teal orb - top right */}
      <div
        className="floating-shape absolute w-[600px] h-[600px] rounded-full"
        style={{
          top: '3%',
          right: '-15%',
          background: 'radial-gradient(circle, rgba(15, 76, 92, 0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'pulseGlow 6s ease-in-out infinite',
          willChange: 'opacity',
        }}
      />

      {/* Terracotta orb - mid left */}
      <div
        className="floating-shape absolute w-[400px] h-[400px] rounded-full"
        style={{
          top: '30%',
          left: '-8%',
          background: 'radial-gradient(circle, rgba(224, 122, 95, 0.06) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'pulseGlow 5s ease-in-out infinite',
          animationDelay: '2s',
          willChange: 'opacity',
        }}
      />

      {/* Teal light orb - bottom right */}
      <div
        className="floating-shape absolute w-[500px] h-[500px] rounded-full"
        style={{
          top: '60%',
          right: '-10%',
          background: 'radial-gradient(circle, rgba(26, 143, 168, 0.05) 0%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'pulseGlow 7s ease-in-out infinite',
          animationDelay: '1s',
          willChange: 'opacity',
        }}
      />

      {/* Small particles - reduced to 4 */}
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="floating-shape absolute rounded-full"
          style={{
            top: `${15 + (i * 22)}%`,
            left: `${10 + ((i * 37) % 75)}%`,
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
            background: i % 2 === 0 ? 'rgba(15, 76, 92, 0.3)' : 'rgba(224, 122, 95, 0.25)',
            animation: `float ${5 + (i % 4)}s ease-in-out infinite`,
            animationDelay: `${i * 1.2}s`,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingObjects;
