import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const StarLayer = ({ count, size, speed, opacityRange }) => {
    const stars = useMemo(() => (
        Array.from({ length: count }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * size + 0.5,
            opacity: Math.random() * (opacityRange[1] - opacityRange[0]) + opacityRange[0],
            delay: Math.random() * 4,
            twinkleDur: Math.random() * 3 + 2,
        }))
    ), [count, size, opacityRange]);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {stars.map(star => (
                <motion.div
                    key={star.id}
                    className="absolute rounded-full bg-white"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: star.size,
                        height: star.size,
                    }}
                    animate={{
                        opacity: [star.opacity * 0.3, star.opacity, star.opacity * 0.3],
                        y: [0, -speed * 20],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        opacity: { duration: star.twinkleDur, delay: star.delay, repeat: Infinity, ease: "easeInOut" },
                        y: { duration: speed * 15, delay: star.delay, repeat: Infinity, ease: "linear" },
                        scale: { duration: star.twinkleDur, delay: star.delay, repeat: Infinity, ease: "easeInOut" },
                    }}
                />
            ))}
        </div>
    );
};

const Starfield = ({ density = 'normal' }) => {
    const multiplier = density === 'high' ? 1.5 : 1;
    
    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <StarLayer count={Math.floor(120 * multiplier)} size={0.8} speed={1} opacityRange={[0.1, 0.4]} />
            <StarLayer count={Math.floor(60 * multiplier)}  size={1.2} speed={2} opacityRange={[0.2, 0.6]} />
            <StarLayer count={Math.floor(25 * multiplier)}  size={2.0} speed={3} opacityRange={[0.3, 0.9]} />
            
            {/* Cosmic Fog / Nebula */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(110,231,28,0.03),transparent_70%)] mix-blend-screen" />
            <div className="absolute top-0 left-0 w-full h-[400px] bg-[linear-gradient(to_bottom,rgba(110,231,28,0.05),transparent)] mix-blend-screen" />
        </div>
    );
};

export default Starfield;
