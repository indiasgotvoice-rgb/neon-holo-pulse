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
  trail: { x: number; y: number }[];
}

const COLORS = [
  "rgba(106, 220, 255, 0.8)", // cyan
  "rgba(140, 80, 255, 0.8)",  // purple
  "rgba(255, 100, 190, 0.8)", // magenta
  "rgba(120, 255, 160, 0.8)", // green
];

export const ParticleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Detect mobile for particle count
    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile ? 30 : 80;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Initialize particles
    particlesRef.current = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * (isMobile ? 60 : 120) + (isMobile ? 5 : 10);
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * (isMobile ? 1.5 : 2.4) + (isMobile ? 0.8 : 1.2),
        age: 0,
        life: Math.random() * 5 + 3,
        trail: [],
      });
    }

    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      ctx.fillStyle = "rgba(6, 6, 12, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        // Apply drag
        const drag = Math.pow(0.4, dt);
        p.vx *= drag;
        p.vy *= drag;

        // Attraction to center
        const dx = centerX - p.x;
        const dy = centerY - p.y;
        const dist2 = dx * dx + dy * dy + 1e-6;
        const pull = Math.min(2000 / dist2, 200);
        p.vx += dx * pull * dt;
        p.vy += dy * pull * dt;

        // Sinusoidal wander
        p.vx += Math.sin(p.age * 3.1 + p.y * 0.01) * (isMobile ? 3 : 6) * dt;
        p.vy += Math.cos(p.age * 2.3 + p.x * 0.008) * (isMobile ? 3 : 6) * dt;

        // Update position
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.age += dt;

        // Trail
        p.trail.unshift({ x: p.x, y: p.y });
        if (p.trail.length > 6) p.trail.pop();

        // Draw trail
        p.trail.forEach((pos, idx) => {
          const alpha =
            (1 - idx / p.trail.length) * (1 - Math.min(1, p.age / p.life)) * 0.3;
          const size = p.size * (1 - idx / p.trail.length) * (isMobile ? 2 : 3);

          ctx.fillStyle = p.color.replace("0.8", String(alpha));
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw particle head
        const headAlpha = 1 - Math.min(1, p.age / p.life);
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * (isMobile ? 2 : 3));
        gradient.addColorStop(0, p.color.replace("0.8", String(headAlpha * 0.9)));
        gradient.addColorStop(0.5, p.color.replace("0.8", String(headAlpha * 0.5)));
        gradient.addColorStop(1, p.color.replace("0.8", "0"));

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (isMobile ? 2 : 3), 0, Math.PI * 2);
        ctx.fill();

        // Reset particle if out of bounds or too old
        if (
          p.x < -20 ||
          p.x > canvas.width + 20 ||
          p.y < -20 ||
          p.y > canvas.height + 20 ||
          p.age > p.life
        ) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * (isMobile ? 60 : 120) + (isMobile ? 5 : 10);
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
          p.vx = Math.cos(angle) * speed;
          p.vy = Math.sin(angle) * speed;
          p.age = 0;
          p.life = Math.random() * 5 + 3;
          p.trail = [];
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
      style={{ mixBlendMode: "screen" }}
    />
  );
};
