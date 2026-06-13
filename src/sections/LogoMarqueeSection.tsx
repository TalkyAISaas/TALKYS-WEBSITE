const LOGOS = [
  'Bright Smile', 'NextClinic', 'OakLaw', 'Nexter',
  'UrbanCare', 'FixIt Now', 'SkyHotels', 'RootDental',
];

const LogoMarqueeSection = () => {
  const doubled = [...LOGOS, ...LOGOS];
  return (
    <section className="bg-bg-soft pb-24 lg:pb-28 -mt-12 lg:-mt-16">
      <div className="max-w-[1100px] mx-auto">
        <div
          className="overflow-hidden relative"
          style={{
            WebkitMaskImage: 'linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)',
            maskImage:        'linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)',
          }}
        >
          <div className="flex gap-[70px] animate-scroll-logos items-center" style={{ width: 'max-content' }}>
            {doubled.map((logo, i) => (
              <span
                key={`${logo}-${i}`}
                className="font-bold text-[22px] tracking-[-0.025em] text-muted-foreground/60 whitespace-nowrap"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogoMarqueeSection;
