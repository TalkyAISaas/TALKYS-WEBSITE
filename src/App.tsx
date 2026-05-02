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
import GettingStartedSection from './sections/GettingStartedSection';
import FooterSection from './sections/FooterSection';
import FloatingObjects from './components/FloatingObjects';
import BackgroundCanvas from './components/BackgroundCanvas';

import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <ThemeProvider>
      <BackgroundCanvas />
      <div className={`min-h-screen bg-background transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <FloatingObjects />
        <Navigation />
        <main>
          <HeroSection />
          <ProblemSection />
          <SolutionSection />
          <HowItWorksSection />
          <FeaturesSection />
          <SocialMediaSection />
          <IndustriesSection />
          <GettingStartedSection />
        </main>
        <FooterSection />
      </div>
    </ThemeProvider>
  );
}

export default App;
