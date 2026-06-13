import { useEffect, useState } from 'react';
import './App.css';

import Navigation from './sections/Navigation';
import HeroSection from './sections/HeroSection';
import ProblemSection from './sections/ProblemSection';
import SolutionSection from './sections/SolutionSection';
import HowItWorksSection from './sections/HowItWorksSection';
import FeaturesSection from './sections/FeaturesSection';
import SocialMediaSection from './sections/SocialMediaSection';
import IndustriesSection from './sections/IndustriesSection';
import TestimonialsSection from './sections/TestimonialsSection';
import LogoMarqueeSection from './sections/LogoMarqueeSection';
import GettingStartedSection from './sections/GettingStartedSection';
import FooterSection from './sections/FooterSection';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={`min-h-screen bg-background transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <Navigation />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <HowItWorksSection />
        <FeaturesSection />
        <SocialMediaSection />
        <IndustriesSection />
        <TestimonialsSection />
        <LogoMarqueeSection />
        <GettingStartedSection />
      </main>
      <FooterSection />
    </div>
  );
}

export default App;
