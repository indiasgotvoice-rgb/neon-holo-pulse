import { useEffect, useState } from "react";

const CHARSET = "01アイウエオカキクケコ";

interface Stream {
  id: number;
  left: number;
  chars: string;
}

export const MatrixRain = () => {
  const [streams, setStreams] = useState<Stream[]>([]);

  useEffect(() => {
    // Much fewer columns for mobile
    const isMobile = window.innerWidth <= 768;
    const columnWidth = isMobile ? 40 : 30;
    const columnCount = Math.min(Math.floor(window.innerWidth / columnWidth), isMobile ? 10 : 20);

    const initialStreams: Stream[] = [];

    for (let i = 0; i < columnCount; i++) {
      const length = Math.floor(Math.random() * 8) + 4;
      const chars = Array.from({ length }, () =>
        CHARSET[Math.floor(Math.random() * CHARSET.length)]
      ).join('\n');

      initialStreams.push({
        id: i,
        left: i * columnWidth + Math.random() * 15,
        chars,
      });
    }

    setStreams(initialStreams);

    // MUCH slower flicker - 500ms instead of 100ms
    const flickerInterval = setInterval(() => {
      setStreams((prev) =>
        prev.map((stream) => {
          if (Math.random() > 0.85) { // Less frequent updates
            const length = Math.floor(Math.random() * 8) + 4;
            const chars = Array.from({ length }, () =>
              CHARSET[Math.floor(Math.random() * CHARSET.length)]
            ).join('\n');
            return { ...stream, chars };
          }
          return stream;
        })
      );
    }, 500); // 500ms instead of 100ms

    return () => clearInterval(flickerInterval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
      {streams.map((stream) => (
        <div
          key={stream.id}
          className="absolute top-0 font-mono text-xs whitespace-pre text-green-400"
          style={{
            left: `${stream.left}px`,
            animation: `matrix-fall ${6 + Math.random() * 4}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
            textShadow: '0 0 5px currentColor', // Simplified shadow
          }}
        >
          {stream.chars}
        </div>
      ))}
    </div>
  );
};
