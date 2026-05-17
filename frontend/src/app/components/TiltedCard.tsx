import { useRef, useState, type ReactNode } from 'react';

interface TiltedCardProps {
    children: ReactNode;
    className?: string;
    containerClassName?: string;
    tiltAmount?: number;
    scaleOnHover?: number;
    glareOpacity?: number;
}

export function TiltedCard({
    children,
    className = '',
    containerClassName = '',
    tiltAmount = 8,
    scaleOnHover = 1.03,
    glareOpacity = 0.12,
}: TiltedCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        setTilt({ x: y * -tiltAmount, y: x * tiltAmount });
        setGlare({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
            opacity: glareOpacity,
        });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
        setGlare(prev => ({ ...prev, opacity: 0 }));
    };

    return (
        <div className={`perspective-[1200px] ${containerClassName}`}>
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${glare.opacity > 0 ? scaleOnHover : 1})`,
                    transition: glare.opacity > 0 ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
                    transformStyle: 'preserve-3d',
                }}
                className={`relative overflow-hidden ${className}`}
            >
                {children}
                {/* Glare overlay */}
                <div
                    className="pointer-events-none absolute inset-0 z-50 rounded-[inherit]"
                    style={{
                        background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}) 0%, transparent 60%)`,
                        transition: 'opacity 0.3s',
                    }}
                />
            </div>
        </div>
    );
}
