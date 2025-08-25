

import React, { useRef, useEffect } from 'react';

// A simple random function.
const random = (min: number, max: number) => Math.random() * (max - min) + min;

// Leaf data structure
interface Leaf {
    x: number;
    y: number;
    size: number;
    color: string;
    speedY: number;
    sway: number;
    swaySpeed: number;
    swayAmplitude: number;
    rotation: number;
    rotationSpeed: number;
}

const AnimatedBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameId = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        // --- Configuration ---
        const PALETTE = {
            sky: ['#ffecd1', '#fec48f'], // Brighter, warmer gradient
            leaves: ['#e74c3c', '#f1c40f', '#e67e22', '#d35400', '#c0392b'],
        };
        const NUM_LEAVES = 60;

        let leaves: Leaf[] = [];

        const initialize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;

            // --- Initialize Leaves ---
            leaves = [];
            for (let i = 0; i < NUM_LEAVES; i++) {
                leaves.push({
                    x: random(0, width),
                    y: random(-height, 0),
                    size: random(4, 10),
                    color: PALETTE.leaves[Math.floor(random(0, PALETTE.leaves.length))],
                    speedY: random(0.2, 0.8), // Reduced speed for a slower, calmer effect
                    sway: random(0, Math.PI * 2),
                    swaySpeed: random(0.01, 0.03),
                    swayAmplitude: random(0.5, 2.0),
                    rotation: random(0, Math.PI * 2),
                    rotationSpeed: random(-0.02, 0.02),
                });
            }
        };
        
        const animate = () => {
            // --- Clear and draw background ---
            ctx.clearRect(0, 0, width, height);

            const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
            skyGradient.addColorStop(0, PALETTE.sky[0]);
            skyGradient.addColorStop(1, PALETTE.sky[1]);
            ctx.fillStyle = skyGradient;
            ctx.fillRect(0, 0, width, height);

            // --- Update and Draw Leaves ---
            leaves.forEach(leaf => {
                // Update properties
                leaf.y += leaf.speedY;
                leaf.sway += leaf.swaySpeed;
                leaf.rotation += leaf.rotationSpeed;
                const currentSway = Math.sin(leaf.sway) * leaf.swayAmplitude;

                // Reset leaf if it's off-screen
                if (leaf.y > height + leaf.size) {
                    leaf.y = -leaf.size;
                    leaf.x = random(0, width);
                }

                // Draw leaf
                ctx.save();
                ctx.translate(leaf.x + currentSway, leaf.y);
                ctx.rotate(leaf.rotation);
                ctx.fillStyle = leaf.color;
                ctx.globalAlpha = 0.85;
                
                // Simple ellipse shape for leaves
                ctx.beginPath();
                ctx.ellipse(0, 0, leaf.size, leaf.size * 0.6, 0, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            });

            animationFrameId.current = window.requestAnimationFrame(animate);
        };
        
        initialize();
        animate();

        const handleResize = () => initialize();
        window.addEventListener('resize', handleResize);
        
        // Cleanup function
        return () => {
            window.cancelAnimationFrame(animationFrameId.current);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />;
};

export default AnimatedBackground;