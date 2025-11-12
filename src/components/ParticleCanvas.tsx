import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  age: number;
  life: number;
}

const COLORS = [
  "#6adcff", // cyan
  "#8c50ff", // purple
  "#ff64be", // magenta
  "#78ffa0", // green
];

export const ParticleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { 
      alpha: true,
      desynchronized: true, // Better performance on mobile
    });
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x for performance
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // Detect mobile - REDUCED particle count
    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile ? 15 : 40; // MUCH fewer particles
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Initialize particles
    particlesRef.current = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 40 + 10;
      particlesRef.current.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 1.5 + 1,
        age: 0,
        life: Math.random() * 4 + 2,
      });
    }

    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;

      // Clear with semi-transparent black (fade trail effect)
      ctx.fillStyle = "rgba(10, 14, 26, 0.2)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      particlesRef.current.forEach((p) => {
        // Simple physics
        const drag = 0.98;
        p.vx *= drag;
        p.vy *= drag;

        // Gentle attraction to center
        const dx = centerX - p.x;
        const dy = centerY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy) + 1;
        const pull = 800 / dist;
        p.vx += (dx / dist) * pull * dt;
        p.vy += (dy / dist) * pull * dt;

        // Update position
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.age += dt;

        // Simple circle drawing (NO gradients for mobile performance)
        const alpha = Math.max(0, 1 - p.age / p.life);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha * 0.6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Reset particle if dead or out of bounds
        if (p.age > p.life || p.x < -50 || p.x > window.innerWidth + 50 || p.y < -50 || p.y > window.innerHeight + 50) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 40 + 10;
          p.x = Math.random() * window.innerWidth;
          p.y = Math.random() * window.innerHeight;
          p.vx = Math.cos(angle) * speed;
          p.vy = Math.sin(angle) * speed;
          p.age = 0;
          p.life = Math.random() * 4 + 2;
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.7 }} // REMOVED mixBlendMode - this was killing Android
    />
  );
};
