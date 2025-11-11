import { useEffect, useState } from "react";

const CHARSET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*()[]{}<>?/\\|";

interface Stream {
  id: number;
  left: number;
  duration: number;
  delay: number;
  color: string;
  chars: string[];
}

export const MatrixRain = () => {
  const [streams, setStreams] = useState<Stream[]>([]);

  useEffect(() => {
    // Calculate how many columns fit
    const columnWidth = 30;
    const columnCount = Math.floor(window.innerWidth / columnWidth);

    const initialStreams: Stream[] = [];

    for (let i = 0; i < columnCount; i++) {
      const color = Math.random() > 0.4 ? "text-neon-green" : "text-neon-blue";
      const length = Math.floor(Math.random() * 12) + 6;
      const chars = Array.from({ length }, () =>
        CHARSET[Math.floor(Math.random() * CHARSET.length)]
      );

      initialStreams.push({
        id: i,
        left: i * columnWidth + Math.random() * 20,
        duration: 3 + Math.random() * 6,
        delay: Math.random() * 5,
        color,
        chars,
      });
    }

    setStreams(initialStreams);

    // Flicker effect: randomly update characters
    const flickerInterval = setInterval(() => {
      setStreams((prev) =>
        prev.map((stream) => {
          if (Math.random() > 0.7) {
            const newChars = [...stream.chars];
            const randomIndex = Math.floor(Math.random() * newChars.length);
            newChars[randomIndex] =
              CHARSET[Math.floor(Math.random() * CHARSET.length)];
            return { ...stream, chars: newChars };
          }
          return stream;
        })
      );
    }, 100);

    return () => clearInterval(flickerInterval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
      {streams.map((stream) => (
        <div
          key={stream.id}
          className="absolute top-0 font-mono text-sm whitespace-pre"
          style={{
            left: `${stream.left}px`,
            animation: `matrix-fall ${stream.duration}s linear infinite`,
            animationDelay: `${stream.delay}s`,
          }}
        >
          {stream.chars.map((char, idx) => (
            <div
              key={idx}
              className={`${stream.color} ${idx === 0 ? "text-white opacity-100" : "opacity-70"}`}
              style={{
                textShadow:
                  idx === 0
                    ? "0 0 8px currentColor, 0 0 12px currentColor"
                    : "0 0 4px currentColor",
                opacity: 1 - idx * 0.08,
              }}
            >
              {char}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
