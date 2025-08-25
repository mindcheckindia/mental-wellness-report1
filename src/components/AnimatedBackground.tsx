
import React, { useRef, useEffect } from 'react';

// Helper to generate a random number within a range
const random = (min: number, max: number) => Math.random() * (max - min) + min;

// Helper to pick a random item from an array
const randomPick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

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

        // --- Configuration inspired by the vibrant, sunny image ---
        const SUN_POSITION = { x: width * 0.7, y: height * 0.15 };
        const SKY_COLOR_TOP = '#7dd3fc'; // Bright sky blue
        const SKY_COLOR_HORIZON = '#fefce8'; // Pale yellow horizon
        const MEADOW_COLOR_TOP = '#a3e635'; // Lime green
        const MEADOW_COLOR_BOTTOM = '#4d7c0f'; // Darker lush green
        const FLOWER_COLORS = ['#ef4444', '#3b82f6', '#eab308', '#8b5cf6', '#f472b6'];
        const BIRD_COLORS = ['#3b82f6', '#ef4444', '#f59e0b']; // Blue, Red, Yellow

        // Parallax Layers: [trunkColor, leafColor, speed, count, y_range, height_range, width_range]
        const treeLayers: [string, string, number, number, [number, number], [number, number], [number, number]][] = [
            ['#a16207', '#65a30d', 0.1, 40, [height * 0.4, height * 0.6], [100, 200], [5, 10]], // Far
            ['#854d0e', '#84cc16', 0.2, 30, [height * 0.5, height * 0.75], [200, 350], [10, 20]], // Mid
            ['#713f12', '#a3e635', 0.4, 20, [height * 0.65, height], [350, 500], [20, 35]],    // Near
        ];
        
        // --- Data structures for animated elements ---
        let trees: { x: number, y: number, h: number, w: number, layer: number }[] = [];
        let birds: { x: number, y: number, vx: number, vy: number, size: number, color: string, wingAngle: number }[] = [];
        let leaves: { x: number, y: number, vx: number, vy: number, size: number, opacity: number, rotation: number }[] = [];
        let flowers: { x: number, y: number, size: number, color: string, swayOffset: number }[] = [];
        
        const initialize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            SUN_POSITION.x = width * 0.7;
            SUN_POSITION.y = height * 0.15;

            // Initialize Trees
            trees = [];
            treeLayers.forEach((layer, layerIndex) => {
                for(let i = 0; i < layer[3]; i++) {
                    trees.push({
                        x: random(-width * 0.5, width * 1.5),
                        y: random(layer[4][0], layer[4][1]),
                        h: random(layer[5][0], layer[5][1]),
                        w: random(layer[6][0], layer[6][1]),
                        layer: layerIndex
                    });
                }
            });
            trees.sort((a,b) => a.layer - b.layer); // Draw back-to-front
            
            // Initialize Birds
            birds = [];
            for (let i = 0; i < 15; i++) {
                 birds.push({
                    x: random(0, width),
                    y: random(height * 0.1, height * 0.5),
                    vx: random(0.5, 1.5),
                    vy: random(-0.2, 0.2),
                    size: random(4, 8),
                    color: randomPick(BIRD_COLORS),
                    wingAngle: random(0, Math.PI * 2)
                });
            }

            // Initialize Falling Leaves/Petals
            leaves = [];
            for (let i = 0; i < 100; i++) {
                leaves.push({
                    x: random(0, width),
                    y: random(0, height),
                    vx: random(-0.2, 0.2),
                    vy: random(0.3, 0.8),
                    size: random(3, 6),
                    opacity: random(0.4, 0.9),
                    rotation: random(0, Math.PI * 2)
                });
            }

            // Initialize Flowers
            flowers = [];
            for (let i = 0; i < 200; i++) {
                 flowers.push({
                    x: random(0, width),
                    y: random(height * 0.8, height * 1.1),
                    size: random(5, 15),
                    color: randomPick(FLOWER_COLORS),
                    swayOffset: random(0, Math.PI * 2)
                 });
            }
            flowers.sort((a, b) => a.y - b.y); // Draw flowers in the back first
        };

        const drawSkyAndSun = () => {
            const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.7);
            skyGradient.addColorStop(0, SKY_COLOR_TOP);
            skyGradient.addColorStop(1, SKY_COLOR_HORIZON);
            ctx.fillStyle = skyGradient;
            ctx.fillRect(0, 0, width, height);

            // Sun
            const sunGradient = ctx.createRadialGradient(SUN_POSITION.x, SUN_POSITION.y, 30, SUN_POSITION.x, SUN_POSITION.y, 200);
            sunGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            sunGradient.addColorStop(0.2, 'rgba(255, 253, 186, 0.8)');
            sunGradient.addColorStop(1, 'rgba(255, 253, 186, 0)');
            ctx.fillStyle = sunGradient;
            ctx.fillRect(0, 0, width, height);
        };

        const drawLightRays = () => {
             ctx.save();
             ctx.globalCompositeOperation = 'overlay'; // Use overlay for a bright, sunny effect
             for (let i = 0; i < 12; i++) {
                 const angle = (i / 12) * Math.PI * 0.4 + Math.PI * 0.05 + (Math.sin(frame * 0.005 + i) * 0.05);
                 const rayLength = height * 1.5;
                 const rayWidth = random(2, 5);
                 
                 const x2 = SUN_POSITION.x + Math.cos(angle) * rayLength;
                 const y2 = SUN_POSITION.y + Math.sin(angle) * rayLength;

                 const opacity = (Math.sin(frame * 0.01 + i * 2) * 0.4 + 0.6) * 0.2; // Shimmering effect
                 const gradient = ctx.createLinearGradient(SUN_POSITION.x, SUN_POSITION.y, x2, y2);
                 gradient.addColorStop(0, `rgba(255, 229, 180, ${opacity})`);
                 gradient.addColorStop(0.5, `rgba(255, 229, 180, ${opacity * 0.5})`);
                 gradient.addColorStop(1, 'rgba(255, 229, 180, 0)');
                 
                 ctx.beginPath();
                 ctx.moveTo(SUN_POSITION.x, SUN_POSITION.y);
                 ctx.lineTo(x2 + rayWidth, y2);
                 ctx.lineTo(x2 - rayWidth, y2);
                 ctx.closePath();
                 
                 ctx.fillStyle = gradient;
                 ctx.fill();
             }
             ctx.restore();
        };

        const drawTree = (x: number, y: number, h: number, w: number, trunkColor: string, leafColor: string) => {
            // Trunk
            ctx.fillStyle = trunkColor;
            ctx.fillRect(x - w / 2, y - h, w, h);
            
            // Canopy
            ctx.fillStyle = leafColor;
            ctx.beginPath();
            ctx.ellipse(x, y - h, w * 2, w * 1.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(x - w, y - h * 0.8, w * 2, w * 1.5, 0, 0, Math.PI * 2);
            ctx.fill();
             ctx.beginPath();
            ctx.ellipse(x + w, y - h * 0.8, w * 2, w * 1.5, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        const drawTrees = () => {
            trees.forEach(tree => {
                const layerConfig = treeLayers[tree.layer];
                const speed = layerConfig[2];
                const trunkColor = layerConfig[0];
                const leafColor = layerConfig[1];
                const x = (tree.x - frame * speed);
                
                // Seamless loop logic
                const screenX = ((x % (width * 2)) + (width * 2)) % (width * 2) - width * 0.5;

                drawTree(screenX, tree.y, tree.h, tree.w, trunkColor, leafColor);
            });
        };
        
        const drawMeadowAndFlowers = () => {
            const meadowGradient = ctx.createLinearGradient(0, height * 0.7, 0, height);
            meadowGradient.addColorStop(0, MEADOW_COLOR_TOP);
            meadowGradient.addColorStop(1, MEADOW_COLOR_BOTTOM);
            ctx.fillStyle = meadowGradient;
            ctx.fillRect(0, height * 0.7, width, height * 0.3);

            flowers.forEach(flower => {
                const sway = Math.sin(frame * 0.02 + flower.swayOffset) * 5; // Gentle sway
                ctx.fillStyle = flower.color;
                ctx.beginPath();
                ctx.arc(flower.x + sway, flower.y, flower.size / 2, 0, Math.PI * 2);
                ctx.fill();
            });
        };

        const drawFallingLeaves = () => {
            leaves.forEach(leaf => {
                leaf.x += leaf.vx + Math.sin(frame * 0.05 + leaf.y) * 0.2; // Add some side-to-side drift
                leaf.y += leaf.vy;
                leaf.rotation += leaf.vx; // Rotate as it falls

                // Reset leaf when it goes off screen
                if (leaf.y > height + 10) {
                    leaf.y = -10;
                    leaf.x = random(0, width);
                }
                if (leaf.x > width + 10) { leaf.x = -10; }
                if (leaf.x < -10) { leaf.x = width + 10; }
                
                ctx.save();
                ctx.translate(leaf.x, leaf.y);
                ctx.rotate(leaf.rotation);
                ctx.fillStyle = `rgba(253, 186, 116, ${leaf.opacity})`; // Golden leaves
                ctx.beginPath();
                ctx.ellipse(0, 0, leaf.size, leaf.size/2, 0, 0, Math.PI*2);
                ctx.fill();
                ctx.restore();
            });
        };

        const drawBirds = () => {
            birds.forEach(bird => {
                bird.x += bird.vx;
                bird.y += bird.vy;
                bird.wingAngle += 0.3;

                if (bird.x > width + 20) {
                    bird.x = -20;
                    bird.y = random(height * 0.1, height * 0.5);
                }

                const wingYOffset = Math.sin(bird.wingAngle) * bird.size * 0.8;
                
                ctx.fillStyle = bird.color;
                ctx.beginPath();
                // Left wing
                ctx.moveTo(bird.x - bird.size * 0.2, bird.y);
                ctx.quadraticCurveTo(bird.x - bird.size, bird.y - wingYOffset, bird.x - bird.size * 1.5, bird.y);
                // Right wing
                ctx.moveTo(bird.x + bird.size * 0.2, bird.y);
                ctx.quadraticCurveTo(bird.x + bird.size, bird.y - wingYOffset, bird.x + bird.size * 1.5, bird.y);
                ctx.fill();
            });
        };
        
        const animate = () => {
            frame++;
            ctx.clearRect(0, 0, width, height);
            
            drawSkyAndSun();
            drawTrees();
            drawLightRays();
            drawMeadowAndFlowers();
            drawFallingLeaves();
            drawBirds();
            
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
