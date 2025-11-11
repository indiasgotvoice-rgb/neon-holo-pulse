import { useEffect, useRef, useState } from "react";
import { MatrixRain } from "./MatrixRain";
import { ParticleCanvas } from "./ParticleCanvas";

export const SplashScreen = () => {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    // Trigger random glitch effects
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.25) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 300);
      }
    }, 2000 + Math.random() * 2000);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-b from-background to-background-secondary">
      {/* Volumetric light effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[800px] rounded-full bg-glow-blue/10 blur-[120px] animate-volumetric-pulse" />
      </div>

      {/* Matrix rain background */}
      <MatrixRain />

      {/* Particle system */}
      <ParticleCanvas />

      {/* Central logo with halos */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Outer halo */}
        <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-radial from-glow-cyan/20 via-glow-blue/10 to-transparent blur-3xl animate-neon-pulse" />
        
        {/* Middle halo */}
        <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-radial from-glow-cyan/30 via-glow-purple/20 to-transparent blur-2xl animate-logo-rotate" />
        
        {/* Inner glow */}
        <div className="absolute w-[250px] h-[250px] rounded-full bg-gradient-radial from-glow-cyan/40 via-transparent to-transparent blur-xl animate-neon-pulse" />

        {/* Logo text */}
        <div className="relative z-10">
          <h1
            className={`text-7xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple neon-text animate-logo-rotate glitch-effect ${
              glitchActive ? "active" : ""
            }`}
            data-text="Pro Builder"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 900,
              letterSpacing: "0.02em",
            }}
          >
            Pro Builder
          </h1>
          
          {/* Additional glow layers */}
          <div className="absolute inset-0 text-7xl md:text-8xl font-bold text-neon-cyan blur-md opacity-50 -z-10 animate-neon-pulse">
            Pro Builder
          </div>
          <div className="absolute inset-0 text-7xl md:text-8xl font-bold text-neon-blue blur-lg opacity-30 -z-20 animate-logo-rotate">
            Pro Builder
          </div>
        </div>
      </div>

      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/80 pointer-events-none" />
    </div>
  );
};
