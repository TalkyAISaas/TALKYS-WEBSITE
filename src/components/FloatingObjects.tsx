import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FloatingObjects = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const disableScrollLinkedMotion = window.matchMedia('(max-width: 1024px), (prefers-reduced-motion: reduce)').matches;
    if (disableScrollLinkedMotion) return;

    const objects = containerRef.current.querySelectorAll('.floating-shape');

    objects.forEach((obj, index) => {
      const speed = 0.02 + (index * 0.01);
      const direction = index % 2 === 0 ? 1 : -1;

      gsap.to(obj, {
        y: `${50 * direction * speed}vh`,
        rotation: index % 2 === 0 ? 8 : -8,
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 2.5,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger === document.body) st.kill();
      });
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {/* Large teal orb - top right - with pulse */}
      <div
        className="floating-shape absolute w-[600px] h-[600px] rounded-full"
        style={{
          top: '3%',
          right: '-15%',
          background: 'radial-gradient(circle, rgba(15, 76, 92, 0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'pulseGlow 6s ease-in-out infinite',
        }}
      />

      {/* Terracotta orb - mid left - floating */}
      <div
        className="floating-shape absolute w-[400px] h-[400px] rounded-full"
        style={{
          top: '30%',
          left: '-8%',
          background: 'radial-gradient(circle, rgba(224, 122, 95, 0.06) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'pulseGlow 5s ease-in-out infinite',
          animationDelay: '2s',
        }}
      />

      {/* Teal light orb - bottom center */}
      <div
        className="floating-shape absolute w-[500px] h-[500px] rounded-full"
        style={{
          top: '60%',
          right: '-10%',
          background: 'radial-gradient(circle, rgba(26, 143, 168, 0.05) 0%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'pulseGlow 7s ease-in-out infinite',
          animationDelay: '1s',
        }}
      />

      {/* Scattered small particles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="floating-shape absolute rounded-full"
          style={{
            top: `${10 + (i * 12)}%`,
            left: `${8 + ((i * 37) % 80)}%`,
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
            background: i % 2 === 0 ? 'rgba(15, 76, 92, 0.3)' : 'rgba(224, 122, 95, 0.25)',
            animation: `float ${5 + (i % 4)}s ease-in-out infinite`,
            animationDelay: `${i * 0.7}s`,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingObjects;
