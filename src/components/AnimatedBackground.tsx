

import React, { useRef, useEffect } from 'react';

const random = (min: number, max: number) => Math.random() * (max - min) + min;

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

        // --- Configuration for a bright, positive, lush scene ---
        const HORIZON_Y = height * 0.6;
        const SKY_COLOR_TOP = '#a0e9ff'; // Light sky blue
        const SKY_COLOR_HORIZON = '#f0f9ff'; // Soft white-blue
        const RIVER_COLOR = '#60a5fa'; // Bright, friendly blue
        const RIVER_HIGHLIGHT = 'rgba(255, 255, 255, 0.2)';
        const SUN_GLOW_COLOR = 'rgba(255, 220, 150, 0.6)';

        // --- Parallax Forest Layers (brighter, lusher greens) ---
        // color, speed, element count, y variance, height range, width range
        const forestLayers: [string, number, number, number, [number, number], [number, number]][] = [
            ['#6ee7b7', 0.08, 40, 20, [50, 150], [15, 30]],   // Far distance, light green
            ['#34d399', 0.12, 30, 30, [100, 200], [20, 40]],  // Distant, rich green
            ['#10b981', 0.2, 25, 40, [150, 300], [25, 50]],   // Mid-ground, vibrant
            ['#059669', 0.4, 20, 50, [250, 450], [35, 70]],   // Near, deep green
            ['#047857', 0.65, 15, 60, [350, 550], [45, 80]],  // Foreground, detailed
        ];
        
        let trees: { x: number, y: number, h: number, w: number, layer: number }[] = [];
        let birds: { x: number, y: number, vx: number, size: number, flapSpeed: number }[] = [];
        let lightRays: { x: number, w: number, opacity: number }[] = [];
        let flowers: { x: number, y: number, size: number, color: string }[] = [];
        
        const initialize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;

            trees = [];
            forestLayers.forEach((layer, layerIndex) => {
                for(let i = 0; i < layer[2]; i++) {
                    trees.push({
                        x: random(-width, width * 2),
                        y: HORIZON_Y + 20 - random(0, layer[3]),
                        h: random(layer[4][0], layer[4][1]),
                        w: random(layer[5][0], layer[5][1]),
                        layer: layerIndex
                    });
                }
            });
            trees.sort((a,b) => a.layer - b.layer);
            
            birds = [];
            for (let i = 0; i < 5; i++) {
                 birds.push({
                    x: random(0, width),
                    y: random(height * 0.1, height * 0.35),
                    vx: random(0.3, 0.7), // Slower speed
                    size: random(12, 20),
                    flapSpeed: random(0.06, 0.12)
                });
            }

            lightRays = [];
            for (let i = 0; i < 8; i++) {
                lightRays.push({
                    x: width / 2 + random(-width/3, width/3),
                    w: random(150, 450),
                    opacity: 0
                });
            }

            flowers = [];
            const flowerBankY = height * 0.8;
            for(let i=0; i < 200; i++) {
                flowers.push({
                    x: random(-width, width * 2),
                    y: random(flowerBankY, height + 50),
                    size: random(2, 5),
                    color: ['#ffc8dd', '#fff', '#a2d2ff', '#fef08a'][Math.floor(Math.random()*4)]
                });
            }
        };

        const drawSkyAndSun = () => {
            const skyGradient = ctx.createLinearGradient(0, 0, 0, HORIZON_Y);
            skyGradient.addColorStop(0, SKY_COLOR_TOP);
            skyGradient.addColorStop(1, SKY_COLOR_HORIZON);
            ctx.fillStyle = skyGradient;
            ctx.fillRect(0, 0, width, height);

            // Sun glow
            const sunX = width / 2;
            const sunY = HORIZON_Y - 80;
            const sunGradient = ctx.createRadialGradient(sunX, sunY, 80, sunX, sunY, 500);
            sunGradient.addColorStop(0, SUN_GLOW_COLOR);
            sunGradient.addColorStop(1, 'rgba(255, 220, 150, 0)');
            ctx.fillStyle = sunGradient;
            ctx.fillRect(0, 0, width, height);
        };

        const drawPineTree = (x: number, y: number, h: number, w: number, color: string) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(x, y); // base center
            
            const jaggedness = w * 0.1;
            const segments = 10;
            
            // Left side
            for(let i=0; i < segments; i++) {
                const progress = i / (segments-1);
                const currentH = y - h * progress;
                const currentW = (w/2) * (1 - progress);
                ctx.lineTo(x - currentW + random(-jaggedness, jaggedness), currentH);
            }
            
            // Right side
            for(let i=segments-1; i >= 0; i--) {
                const progress = i / (segments-1);
                const currentH = y - h * progress;
                const currentW = (w/2) * (1 - progress);
                ctx.lineTo(x + currentW + random(-jaggedness, jaggedness), currentH);
            }

            ctx.closePath();
            ctx.fill();
        }

        const drawTrees = () => {
            trees.forEach(tree => {
                const layerConfig = forestLayers[tree.layer];
                const speed = layerConfig[1];
                const color = layerConfig[0];
                const x = (tree.x - frame * speed) % (width * 3) - width;
                drawPineTree(x, tree.y, tree.h, tree.w, color);
            });
        };
        
        const drawRiver = () => {
            ctx.fillStyle = RIVER_COLOR;
            ctx.fillRect(0, HORIZON_Y, width, height - HORIZON_Y);
            
            // Reflection
            const reflectionGradient = ctx.createLinearGradient(0, HORIZON_Y, 0, height);
            reflectionGradient.addColorStop(0, SKY_COLOR_HORIZON);
            reflectionGradient.addColorStop(0.3, SKY_COLOR_TOP);
            reflectionGradient.addColorStop(1, RIVER_COLOR);
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = reflectionGradient;
            ctx.fillRect(0, HORIZON_Y, width, height-HORIZON_Y);
            ctx.globalAlpha = 1;

            // Ripples
            ctx.fillStyle = RIVER_HIGHLIGHT;
            for(let i=0; i < 5; i++) {
                const y = HORIZON_Y + (i * 40);
                const amplitude = 10 - i * 1.5;
                ctx.beginPath();
                ctx.moveTo(0, y);
                for (let x = 0; x < width; x+=20) {
                    ctx.lineTo(x, y + Math.sin((x + frame * 1.5) * 0.01 + i) * amplitude);
                }
                ctx.lineTo(width, height);
                ctx.lineTo(0, height);
                ctx.closePath();
                ctx.globalAlpha = 0.4 - (i * 0.08);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        };

        const drawForeground = () => {
            // Lush green banks
            const bankSpeed = 0.8; // Fastest speed
            const xOffset = (frame * bankSpeed) % width;
            
            ctx.fillStyle = '#22c55e'; // a bright, lush green
            ctx.beginPath();
            ctx.moveTo(-xOffset, height);
            ctx.lineTo(-xOffset, height * 0.8);
            for(let x = -xOffset; x < width * 2; x += 100) {
                 ctx.quadraticCurveTo(x + 50, height * 0.8 - random(20, 50), x + 100, height * 0.8);
            }
            ctx.lineTo(width, height);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#4ade80'; // a slightly lighter green for the second bank
            ctx.beginPath();
            ctx.moveTo(-xOffset, height);
            ctx.lineTo(-xOffset, height * 0.85);
            for(let x = -xOffset; x < width * 2; x += 120) {
                 ctx.quadraticCurveTo(x + 60, height * 0.85 - random(10, 40), x + 120, height * 0.85);
            }
            ctx.lineTo(width, height);
            ctx.closePath();
            ctx.fill();

            // Flowers
            flowers.forEach(flower => {
                 const x = (flower.x - frame * bankSpeed) % (width * 3) - width;
                 if (x > -10 && x < width + 10) {
                    ctx.fillStyle = flower.color;
                    ctx.beginPath();
                    ctx.arc(x, flower.y, flower.size, 0, Math.PI * 2);
                    ctx.fill();
                 }
            });
        };

        const drawBirds = () => {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.shadowColor = 'rgba(255, 255, 255, 0.7)';
            ctx.shadowBlur = 8;
            birds.forEach(bird => {
                bird.x += bird.vx;
                if (bird.x > width + bird.size) {
                    bird.x = -bird.size;
                    bird.y = random(height * 0.1, height * 0.35);
                }
                const wingY = bird.y + Math.sin(frame * bird.flapSpeed) * (bird.size / 2);
                ctx.beginPath();
                ctx.moveTo(bird.x - bird.size, bird.y);
                ctx.quadraticCurveTo(bird.x, wingY, bird.x + bird.size, bird.y);
                ctx.quadraticCurveTo(bird.x, wingY - bird.size * 0.2, bird.x - bird.size, bird.y);
                ctx.fill();
            });
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
        };

        const drawLightRays = () => {
            lightRays.forEach(ray => {
                const targetOpacity = Math.max(0, Math.sin(frame * 0.0015 + ray.x) - 0.6) * 0.1;
                ray.opacity += (targetOpacity - ray.opacity) * 0.02; 
                
                if (ray.opacity > 0.001) {
                    const gradient = ctx.createLinearGradient(0, 0, 0, HORIZON_Y);
                    gradient.addColorStop(0, `rgba(255, 220, 150, ${ray.opacity})`);
                    gradient.addColorStop(1, `rgba(255, 220, 150, 0)`);
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.moveTo(ray.x - ray.w / 2, 0);
                    ctx.lineTo(ray.x + ray.w / 2, 0);
                    ctx.lineTo(ray.x + 40, HORIZON_Y);
                    ctx.lineTo(ray.x - 40, HORIZON_Y);
                    ctx.closePath();
                    ctx.fill();
                }
            });
        };

        const animate = () => {
            frame++;
            ctx.clearRect(0, 0, width, height);
            
            drawSkyAndSun();
            drawLightRays();
            drawTrees();
            drawRiver();
            drawForeground();
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