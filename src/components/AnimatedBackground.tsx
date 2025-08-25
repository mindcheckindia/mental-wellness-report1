
import React, { useRef, useEffect } from 'react';

// Helpers
const random = (min: number, max: number) => Math.random() * (max - min) + min;
const randomPick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Main Component
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
        let frame = 0;

        // --- Configuration inspired by the warm, optimistic autumn reference images ---
        const SUN_POSITION = { x: width * 0.8, y: height * 0.15 };
        const SKY_COLOR_TOP = '#a1c4fd'; // Soft, hazy blue
        const SKY_COLOR_HORIZON = '#fbc2eb'; // Warm, light pink/orange horizon
        
        const AUTUMN_COLORS = ['#c0392b', '#e74c3c', '#d35400', '#e67e22', '#f39c12', '#f1c40f'];
        const TRUNK_COLOR = '#4e342e';
        const GROUND_COLOR_NEAR = '#6d4c41';
        const GROUND_COLOR_FAR = '#8d6e63';

        // --- Data structures ---
        let trees: { x: number, y: number, depth: number, branches: { x1: number, y1: number, x2: number, y2: number, w: number }[] }[] = [];
        let leaves: { x: number, y: number, vx: number, vy: number, size: number, color: string, opacity: number, rotation: number, rotationSpeed: number }[] = [];
        let groundLeaves: { x: number, y: number, size: number, color: string }[] = [];

        // Recursive function to generate fractal-like branches
        const generateBranches = (x1: number, y1: number, angle: number, depth: number, maxDepth: number): { x1: number, y1: number, x2: number, y2: number, w: number }[] => {
            if (depth > maxDepth) return [];
            
            const len = random(15, 40) * (1 - depth / (maxDepth * 1.5));
            const w = (maxDepth - depth + 1) * 2;
            const x2 = x1 + Math.cos(angle) * len;
            const y2 = y1 + Math.sin(angle) * len;
            
            let branches: { x1: number, y1: number, x2: number, y2: number, w: number }[] = [{ x1, y1, x2, y2, w }];
            
            if (depth < maxDepth - 1) { // Branch out more towards the end
                 branches = branches.concat(generateBranches(x2, y2, angle + random(0.3, 0.6), depth + 1, maxDepth));
                 branches = branches.concat(generateBranches(x2, y2, angle - random(0.3, 0.6), depth + 1, maxDepth));
            } else {
                 branches = branches.concat(generateBranches(x2, y2, angle + random(0.2, 0.4), depth + 1, maxDepth));
            }

            return branches;
        };
        
        const initialize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            SUN_POSITION.x = width * 0.8;
            SUN_POSITION.y = height * 0.15;

            // Initialize Trees
            trees = [];
            for (let i = 0; i < 20; i++) {
                const depth = random(0.2, 1);
                const groundY = height * 0.85 + (1 - depth) * height * 0.15;
                const startX = random(-width * 0.2, width * 1.2);
                const treeHeight = (height - groundY) * random(0.7, 1.1) * 2.5;

                const trunkBase = { x1: startX, y1: groundY, x2: startX, y2: groundY - treeHeight, w: depth * 12 };
                const branches = generateBranches(trunkBase.x2, trunkBase.y2, -Math.PI / 2, 0, 5);

                trees.push({ x: startX, y: groundY, depth, branches: [trunkBase, ...branches] });
            }
            trees.sort((a, b) => a.depth - b.depth);

            // Initialize Falling Leaves
            leaves = [];
            for (let i = 0; i < 100; i++) {
                leaves.push({
                    x: random(0, width), y: random(0, height),
                    vx: random(-0.2, 0.2), vy: random(0.3, 0.8),
                    size: random(4, 10), color: randomPick(AUTUMN_COLORS),
                    opacity: random(0.5, 1),
                    rotation: random(0, Math.PI * 2),
                    rotationSpeed: random(-0.02, 0.02)
                });
            }

            // Initialize Ground Leaves
            groundLeaves = [];
            for (let i = 0; i < 500; i++) {
                 groundLeaves.push({
                    x: random(-width * 0.1, width * 1.1), y: random(height * 0.85, height * 1.1),
                    size: random(3, 15), color: randomPick(AUTUMN_COLORS)
                 });
            }
            groundLeaves.sort((a, b) => a.y - b.y);
        };
        
        // --- Drawing Functions ---
        const drawSkyAndSun = () => {
            const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.9);
            skyGradient.addColorStop(0, SKY_COLOR_TOP);
            skyGradient.addColorStop(1, SKY_COLOR_HORIZON);
            ctx.fillStyle = skyGradient;
            ctx.fillRect(0, 0, width, height);

            const sunGradient = ctx.createRadialGradient(SUN_POSITION.x, SUN_POSITION.y, 50, SUN_POSITION.x, SUN_POSITION.y, 400);
            sunGradient.addColorStop(0, 'rgba(255, 255, 224, 0.8)');
            sunGradient.addColorStop(0.1, 'rgba(255, 204, 188, 0.6)');
            sunGradient.addColorStop(1, 'rgba(255, 204, 188, 0)');
            ctx.fillStyle = sunGradient;
            ctx.fillRect(0, 0, width, height);
        };

        const drawGround = () => {
            const groundGradient = ctx.createLinearGradient(0, height * 0.85, 0, height);
            groundGradient.addColorStop(0, GROUND_COLOR_FAR);
            groundGradient.addColorStop(1, GROUND_COLOR_NEAR);
            ctx.fillStyle = groundGradient;
            ctx.fillRect(0, height * 0.85, width, height * 0.15);

            // Draw fallen leaves
            groundLeaves.forEach(leaf => {
                ctx.fillStyle = leaf.color;
                ctx.globalAlpha = 0.7;
                ctx.beginPath();
                ctx.ellipse(leaf.x, leaf.y, leaf.size, leaf.size * 0.5, random(0, Math.PI), 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1;
        };

        const drawTree = (tree: { x: number, depth: number, branches: any[] }) => {
            // No parallax for a calmer scene
            
            ctx.lineCap = 'round';
            ctx.strokeStyle = TRUNK_COLOR;

            tree.branches.forEach(b => {
                ctx.lineWidth = b.w * tree.depth;
                ctx.beginPath();
                ctx.moveTo(b.x1, b.y1);
                ctx.lineTo(b.x2, b.y2);
                ctx.stroke();
                
                // Draw leaf clusters at branch ends
                if (b.w < 5 && Math.random() > 0.5) { // Only on thinner branches
                    for(let i = 0; i < 10; i++) {
                        ctx.fillStyle = randomPick(AUTUMN_COLORS);
                        ctx.globalAlpha = 0.8 * tree.depth;
                        ctx.beginPath();
                        ctx.arc(b.x2 + random(-15, 15), b.y2 + random(-15, 15), random(5, 20) * tree.depth, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            });
            ctx.globalAlpha = 1;
        };

        const drawFallingLeaves = () => {
             leaves.forEach(leaf => {
                leaf.x += leaf.vx + Math.sin(frame * 0.02 + leaf.y * 0.05) * 0.4;
                leaf.y += leaf.vy;
                leaf.rotation += leaf.rotationSpeed;

                // Reset leaf when it goes off screen
                if (leaf.y > height + 10) { 
                    leaf.y = -10; 
                    leaf.x = random(0, width); 
                }

                ctx.save();
                ctx.translate(leaf.x, leaf.y);
                ctx.rotate(leaf.rotation);
                
                ctx.fillStyle = leaf.color;
                ctx.globalAlpha = leaf.opacity;
                ctx.beginPath();
                ctx.ellipse(0, 0, leaf.size, leaf.size * 0.6, 0, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            });
            ctx.globalAlpha = 1;
        };
        
        const drawLightRays = () => {
             ctx.save();
             ctx.globalCompositeOperation = 'overlay'; // Softer effect
             for (let i = 0; i < 10; i++) {
                 const angle = random(-0.1, 0.1) + Math.PI / 2.2;
                 const length = height * 1.8;
                 
                 const x2 = SUN_POSITION.x + Math.cos(angle) * length;
                 const y2 = SUN_POSITION.y + Math.sin(angle) * length;
                 
                 const opacity = (Math.sin(frame * 0.005 + i * 2.5) * 0.5 + 0.5) * 0.08;
                 const gradient = ctx.createLinearGradient(SUN_POSITION.x, SUN_POSITION.y, x2, y2);
                 gradient.addColorStop(0, `rgba(255, 239, 192, ${opacity})`);
                 gradient.addColorStop(0.3, `rgba(255, 239, 192, ${opacity * 0.5})`);
                 gradient.addColorStop(1, 'rgba(255, 239, 192, 0)');
                 
                 ctx.beginPath();
                 ctx.moveTo(SUN_POSITION.x, SUN_POSITION.y);
                 ctx.lineTo(x2 + random(-150, 150), y2);
                 ctx.lineTo(x2 + random(-150, 150), y2);
                 ctx.closePath();
                 
                 ctx.fillStyle = gradient;
                 ctx.fill();
             }
             ctx.restore();
        };

        const animate = () => {
            frame++;
            ctx.clearRect(0, 0, width, height);

            drawSkyAndSun();
            drawGround();
            trees.forEach(drawTree);
            drawLightRays(); // Draw rays behind falling leaves
            drawFallingLeaves();
            
            animationFrameId.current = window.requestAnimationFrame(animate);
        };
        
        initialize();
        // A short delay to ensure the canvas is ready before the first draw.
        // This can prevent an initial flash of unstyled content.
        setTimeout(animate, 50);

        const handleResize = () => initialize();
        window.addEventListener('resize', handleResize);
        
        return () => {
            window.cancelAnimationFrame(animationFrameId.current);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />;
};

export default AnimatedBackground;
