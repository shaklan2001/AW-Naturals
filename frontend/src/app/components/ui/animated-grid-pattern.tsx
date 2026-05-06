import { useEffect, useId, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "./utils";

interface AnimatedGridPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeDasharray?: any;
  numSquares?: number;
  className?: string;
  maxOpacity?: number;
  duration?: number;
  repeatDelay?: number;
}

export function AnimatedGridPattern({
  width = 60,
  height = 60,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 60,
  className,
  maxOpacity = 0.5,
  duration = 3,
  repeatDelay = 1,
  ...props
}: AnimatedGridPatternProps) {
  const id = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const [squares, setSquares] = useState<{ id: number; pos: [number, number] }[]>([]);

  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      const getPos = () => [
        Math.floor((Math.random() * dimensions.width) / width),
        Math.floor((Math.random() * dimensions.height) / height),
      ] as [number, number];
      
      const newSquares = Array.from({ length: numSquares }).map((_, i) => ({
        id: i,
        pos: getPos(),
      }));
      setSquares(newSquares);
    }
  }, [dimensions, numSquares, width, height]);

  // Update squares continuously
  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      const interval = setInterval(() => {
        setSquares((currentSquares) => {
          const newSquares = [...currentSquares];
          const randomIndex = Math.floor(Math.random() * newSquares.length);
          newSquares[randomIndex] = {
            id: currentSquares[randomIndex].id,
            pos: [
              Math.floor((Math.random() * dimensions.width) / width),
              Math.floor((Math.random() * dimensions.height) / height),
            ],
          };
          return newSquares;
        });
      }, (duration * 1000) / numSquares);

      return () => clearInterval(interval);
    }
  }, [dimensions, duration, numSquares, width, height]);

  return (
    <div ref={containerRef} className={cn("absolute inset-0 z-0 h-full w-full", className)}>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full fill-transparent stroke-[#2A2A2A]"
        {...props}
      >
        <defs>
          <pattern
            id={id}
            width={width}
            height={height}
            patternUnits="userSpaceOnUse"
            x={x}
            y={y}
          >
            <path
              d={`M.5 ${height}V.5H${width}`}
              fill="none"
              strokeDasharray={strokeDasharray}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
        
        {/* Animated Squares */}
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(({ pos: [gridX, gridY], id }) => (
            <motion.rect
              initial={{ opacity: 0 }}
              animate={{ opacity: maxOpacity }}
              transition={{
                duration,
                repeat: 1, // Only animate once per render
                repeatType: "reverse",
                ease: "easeInOut",
                repeatDelay,
              }}
              key={`${id}-${gridX}-${gridY}`}
              width={width - 1}
              height={height - 1}
              x={gridX * width + 1}
              y={gridY * height + 1}
              fill="currentColor"
              className="text-[#D4AF37]"
            />
          ))}
        </svg>
      </svg>
    </div>
  );
}
