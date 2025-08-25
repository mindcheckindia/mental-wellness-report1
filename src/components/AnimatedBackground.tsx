
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

        // --- Configuration inspired by the lush, sun-drenched reference image ---
        const SUN_POSITION = { x: width * 0.75, y: height * 0.1 };
        const SKY_COLOR_TOP = '#42a5f5'; // A richer blue
        const SKY_COLOR_HORIZON = '#fffde7'; // Warm cream
        const MEADOW_COLORS = ['#558b2f', '#7cb342', '#9ccc65'];
        const FLOWER_COLORS = ['#ff7043', '#29b6f6', '#ffee58', '#ab47bc', '#ec407a'];
        const LEAF_COLORS = ['#4d7c0f', '#65a30d', '#84cc16'];
        const TRUNK_COLOR = '#5d4037';
        const BIRD_COLORS = ['#1e88e5', '#e53935', '#fbc02d']; // Richer blue, red, yellow

        // --- Data structures ---
        let trees: { x: number, y: number, depth: number, branches: { x1: number, y1: number, x2: number, y2: number, w: number }[] }[] = [];
        let birds: { x: number, y: number, vx: number, vy: number, size: number, color: string, wingAngle: number, depth: number }[] = [];
        let particles: { x: number, y: number, vx: number, vy: number, size: number, opacity: number }[] = [];
        let flowers: { x: number, y: number, size: number, color: string, swayOffset: number }[] = [];

        // Recursive function to generate fractal-like branches
        const generateBranches = (x1: number, y1: number, angle: number, depth: number, maxDepth: number): { x1: number, y1: number, x2: number, y2: number, w: number }[] => {
            if (depth > maxDepth) return [];
            
            const len = random(10, 30) * (1 - depth / (maxDepth * 1.5));
            const w = (maxDepth - depth + 1) * 1.5;
            const x2 = x1 + Math.cos(angle) * len;
            const y2 = y1 + Math.sin(angle) * len;
            
            let branches: { x1: number, y1: number, x2: number, y2: number, w: number }[] = [{ x1, y1, x2, y2, w }];
            
            branches = branches.concat(generateBranches(x2, y2, angle + random(0.2, 0.5), depth + 1, maxDepth));
            branches = branches.concat(generateBranches(x2, y2, angle - random(0.2, 0.5), depth + 1, maxDepth));

            return branches;
        };
        
        const initialize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            SUN_POSITION.x = width * 0.75;
            SUN_POSITION.y = height * 0.1;

            // Initialize Trees (fewer, more detailed)
            trees = [];
            for (let i = 0; i < 15; i++) {
                const depth = random(0.1, 1);
                const startY = height * 0.7 + (1-depth) * height * 0.3;
                const startX = random(-width * 0.2, width * 1.2);
                const treeHeight = (height - startY) * random(0.8, 1.2);

                const trunkBase = { x1: startX, y1: startY, x2: startX, y2: startY - treeHeight, w: depth * 15 };
                const branches = generateBranches(trunkBase.x2, trunkBase.y2, -Math.PI / 2, 0, 4);

                trees.push({ x: startX, y: startY, depth, branches: [trunkBase, ...branches] });
            }
            trees.sort((a, b) => a.depth - b.depth); // Draw back to front

            // Initialize Birds
            birds = [];
            for (let i = 0; i < 12; i++) {
                 birds.push({
                    x: random(0, width), y: random(height * 0.1, height * 0.6),
                    vx: random(0.8, 2), vy: random(-0.3, 0.3),
                    size: random(3, 7), color: randomPick(BIRD_COLORS),
                    wingAngle: random(0, Math.PI * 2), depth: random(0.3, 0.9)
                });
            }

            // Initialize Particles (Leaves/Dust)
            particles = [];
            for (let i = 0; i < 150; i++) {
                particles.push({
                    x: random(0, width), y: random(0, height),
                    vx: random(-0.3, 0.3), vy: random(0.4, 1),
                    size: random(1, 4), opacity: random(0.3, 0.8)
                });
            }

            // Initialize Flowers
            flowers = [];
            for (let i = 0; i < 300; i++) {
                 flowers.push({
                    x: random(0, width), y: random(height * 0.75, height * 1.1),
                    size: random(4, 12), color: randomPick(FLOWER_COLORS),
                    swayOffset: random(0, Math.PI * 2)
                 });
            }
            flowers.sort((a, b) => a.y - b.y);
        };
        
        // --- Drawing Functions ---
        const drawSkyAndSun = () => {
            const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.8);
            skyGradient.addColorStop(0, SKY_COLOR_TOP);
            skyGradient.addColorStop(1, SKY_COLOR_HORIZON);
            ctx.fillStyle = skyGradient;
            ctx.fillRect(0, 0, width, height);

            const sunGradient = ctx.createRadialGradient(SUN_POSITION.x, SUN_POSITION.y, 40, SUN_POSITION.x, SUN_POSITION.y, 300);
            sunGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            sunGradient.addColorStop(0.1, 'rgba(255, 235, 179, 0.7)');
            sunGradient.addColorStop(1, 'rgba(255, 235, 179, 0)');
            ctx.fillStyle = sunGradient;
            ctx.fillRect(0, 0, width, height);
        };

        const drawMeadow = () => {
            const meadowGradient = ctx.createLinearGradient(0, height * 0.7, 0, height);
            meadowGradient.addColorStop(0, MEADOW_COLORS[2]);
            meadowGradient.addColorStop(0.5, MEADOW_COLORS[1]);
            meadowGradient.addColorStop(1, MEADOW_COLORS[0]);
            ctx.fillStyle = meadowGradient;
            ctx.fillRect(0, height * 0.7, width, height * 0.3);

            // Add texture
            ctx.save();
            ctx.globalAlpha = 0.2;
            for(let i = 0; i < 100; i++) {
                ctx.fillStyle = randomPick(MEADOW_COLORS);
                ctx.beginPath();
                ctx.arc(random(0, width), random(height*0.7, height), random(20, 80), 0, Math.PI*2);
                ctx.fill();
            }
            ctx.restore();

            // Flowers
            flowers.forEach(f => {
                const sway = Math.sin(frame * 0.03 + f.swayOffset) * 4;
                ctx.fillStyle = f.color;
                ctx.beginPath();
                ctx.arc(f.x + sway, f.y, f.size / 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(f.x + sway, f.y);
                ctx.lineTo(f.x + sway, f.y + f.size);
                ctx.stroke();
            });
        };

        const drawTree = (tree: { x: number, depth: number, branches: any[] }) => {
            const parallaxOffset = (frame * tree.depth * 0.1);
            const screenX = ((tree.x - parallaxOffset) % (width * 1.4)) + (width * 1.4) % (width * 1.4) - (width * 0.2);
            
            ctx.lineCap = 'round';
            ctx.strokeStyle = TRUNK_COLOR;

            tree.branches.forEach(b => {
                ctx.lineWidth = b.w * tree.depth;
                ctx.beginPath();
                ctx.moveTo(b.x1 + screenX - tree.x, b.y1);
                ctx.lineTo(b.x2 + screenX - tree.x, b.y2);
                ctx.stroke();
                
                // Draw leaves at branch ends
                if (b.w < 3) {
                    for(let i = 0; i < 5; i++) {
                        ctx.fillStyle = randomPick(LEAF_COLORS);
                        ctx.globalAlpha = 0.6;
                        ctx.beginPath();
                        ctx.arc(b.x2 + screenX - tree.x + random(-10, 10), b.y2 + random(-10, 10), random(5, 15) * tree.depth, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.globalAlpha = 1;
                }
            });
        };

        const drawParticles = () => {
             particles.forEach(p => {
                p.x += p.vx + Math.sin(frame * 0.05 + p.y * 0.1) * 0.3;
                p.y += p.vy;

                if (p.y > height + 5) { p.y = -5; p.x = random(0, width); }
                if (p.x > width + 5) { p.x = -5; }
                if (p.x < -5) { p.x = width + 5; }

                ctx.fillStyle = `rgba(255, 213, 79, ${p.opacity})`; // Golden particles
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });
        };
        
        const drawBirds = () => {
             birds.forEach(b => {
                b.x += b.vx * b.depth;
                b.y += b.vy;
                b.wingAngle += 0.4;
                
                if (b.x > width + 20) { b.x = -20; b.y = random(height * 0.1, height * 0.6); }

                const wingY = Math.sin(b.wingAngle) * b.size * 0.9;
                
                ctx.fillStyle = b.color;
                ctx.beginPath();
                ctx.ellipse(b.x, b.y, b.size * 0.7, b.size * 0.4, 0, 0, Math.PI*2); // Body
                ctx.moveTo(b.x, b.y);
                ctx.quadraticCurveTo(b.x - b.size, b.y - wingY, b.x - b.size * 1.8, b.y); // Left Wing
                ctx.moveTo(b.x, b.y);
                ctx.quadraticCurveTo(b.x + b.size, b.y - wingY, b.x + b.size * 1.8, b.y); // Right wing
                ctx.fill();
            });
        };

        const drawLightRays = () => {
             ctx.save();
             ctx.globalCompositeOperation = 'lighter';
             for (let i = 0; i < 15; i++) {
                 const angle = random(-0.2, 0.2) + Math.PI / 2.5;
                 const length = height * 1.5;
                 
                 const x2 = SUN_POSITION.x + Math.cos(angle) * length;
                 const y2 = SUN_POSITION.y + Math.sin(angle) * length;
                 
                 const opacity = (Math.sin(frame * 0.008 + i * 2) * 0.3 + 0.7) * 0.1;
                 const gradient = ctx.createLinearGradient(SUN_POSITION.x, SUN_POSITION.y, x2, y2);
                 gradient.addColorStop(0, `rgba(255, 235, 179, ${opacity})`);
                 gradient.addColorStop(0.5, `rgba(255, 235, 179, ${opacity * 0.5})`);
                 gradient.addColorStop(1, 'rgba(255, 235, 179, 0)');
                 
                 ctx.beginPath();
                 ctx.moveTo(SUN_POSITION.x, SUN_POSITION.y);
                 ctx.lineTo(x2 + random(-100, 100), y2);
                 ctx.lineTo(x2 + random(-100, 100), y2);
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
            drawMeadow();
            trees.forEach(drawTree);
            drawBirds();
            drawParticles();
            drawLightRays();
            
            animationFrameId.current = window.requestAnimationFrame(animate);
        };
        
        initialize();
        animate();

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
