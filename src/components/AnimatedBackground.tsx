
import React, { useRef, useEffect } from 'react';

// A simple random function.
const random = (min: number, max: number) => Math.random() * (max - min) + min;

// Tree data structure
interface Tree {
    x: number;
    y: number;
    depth: number; // 0 (far) to 1 (near)
    width: number;
    height: number;
    color: string;
}

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
            sky: '#fdeadd', // Warm, hazy beige
            fog: '#e6dace', // Soft fog color
            tree: '#6b5e58', // Muted brown for trees
            leaves: ['#d35400', '#e74c3c', '#f39c12', '#c0392b'],
        };
        const NUM_TREES = 40;
        const NUM_LEAVES = 50;

        let trees: Tree[] = [];
        let leaves: Leaf[] = [];

        const initialize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;

            // --- Initialize Trees ---
            trees = [];
            for (let i = 0; i < NUM_TREES; i++) {
                const depth = Math.random() * Math.random(); // Skew towards the background
                const perspective = 0.5 + depth * 0.5;
                
                trees.push({
                    x: random(-width * 0.1, width * 1.1),
                    y: height,
                    depth,
                    width: (10 + depth * 40) * perspective,
                    height: (height * 0.4 + depth * height * 0.5) * perspective,
                    color: PALETTE.tree,
                });
            }
            // Sort trees by depth so we draw the farthest ones first
            trees.sort((a, b) => a.depth - b.depth);

            // --- Initialize Leaves ---
            leaves = [];
            for (let i = 0; i < NUM_LEAVES; i++) {
                leaves.push({
                    x: random(0, width),
                    y: random(-height, 0),
                    size: random(3, 8),
                    color: PALETTE.leaves[Math.floor(random(0, PALETTE.leaves.length))],
                    speedY: random(0.5, 1.5),
                    sway: random(0, Math.PI * 2),
                    swaySpeed: random(0.01, 0.03),
                    swayAmplitude: random(0.5, 1.5),
                    rotation: random(0, Math.PI * 2),
                    rotationSpeed: random(-0.02, 0.02),
                });
            }
        };
        
        const animate = () => {
            // --- Clear and draw background ---
            ctx.clearRect(0, 0, width, height);

            const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
            skyGradient.addColorStop(0, PALETTE.sky);
            skyGradient.addColorStop(0.7, PALETTE.fog);
            skyGradient.addColorStop(1, PALETTE.fog);
            ctx.fillStyle = skyGradient;
            ctx.fillRect(0, 0, width, height);

            // --- Draw Trees ---
            trees.forEach(tree => {
                ctx.globalAlpha = 0.2 + tree.depth * 0.5;
                ctx.fillStyle = tree.color;
                
                // Simple triangle shape for trees to create a stylized, forest silhouette
                ctx.beginPath();
                ctx.moveTo(tree.x - tree.width / 2, tree.y);
                ctx.lineTo(tree.x, tree.y - tree.height);
                ctx.lineTo(tree.x + tree.width / 2, tree.y);
                ctx.closePath();
                ctx.fill();
            });
            ctx.globalAlpha = 1;

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
                ctx.globalAlpha = 0.8;
                
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
