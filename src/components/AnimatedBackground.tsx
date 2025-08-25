

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

        // --- Configuration inspired by the reference image ---
        const HORIZON_Y = height * 0.65;
        const SKY_COLOR_HORIZON = '#fecdd3'; // Soft pink
        const SKY_COLOR_TOP = '#fde68a'; // Soft yellow
        const MIST_COLOR = 'rgba(255, 255, 255, 0.2)';
        const RIVER_COLOR = '#4b5563'; // Gray
        const RIVER_HIGHLIGHT = 'rgba(253, 224, 190, 0.15)';
        const SUN_GLOW_COLOR = 'rgba(253, 224, 190, 0.5)';

        // --- Parallax Forest Layers ---
        // color, speed, element count, y variance, height range, width range
        const forestLayers: [string, number, number, number, [number, number], [number, number]][] = [
            ['#2f6d54', 0.1, 40, 20, [50, 150], [10, 30]],   // Distant, detailed
            ['#3b82f640', 0.15, 30, 30, [100, 200], [15, 40]], // Distant, misty blue
            ['#265c45', 0.25, 25, 40, [150, 300], [20, 50]],  // Mid-ground
            ['#1b4332', 0.5, 20, 50, [250, 450], [30, 70]],  // Near
            ['#081c15', 0.8, 15, 60, [350, 550], [40, 80]],  // Foreground silhouette
        ];
        
        let trees: { x: number, y: number, h: number, w: number, layer: number }[] = [];
        let birds: { x: number, y: number, vx: number, size: number, flapSpeed: number }[] = [];
        let lightRays: { x: number, w: number, opacity: number }[] = [];
        
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
                    y: random(height * 0.1, height * 0.4),
                    vx: random(0.4, 0.9),
                    size: random(10, 18),
                    flapSpeed: random(0.08, 0.15)
                });
            }

            lightRays = [];
            for (let i = 0; i < 6; i++) {
                lightRays.push({
                    x: width / 2 + random(-width/4, width/4),
                    w: random(100, 400),
                    opacity: 0
                });
            }
        };

        const drawSkyAndSun = () => {
            // Sun glow
            const sunX = width / 2;
            const sunY = HORIZON_Y - 50;
            const sunGradient = ctx.createRadialGradient(sunX, sunY, 50, sunX, sunY, 400);
            sunGradient.addColorStop(0, SUN_GLOW_COLOR);
            sunGradient.addColorStop(1, 'rgba(253, 224, 190, 0)');
            ctx.fillStyle = sunGradient;
            ctx.fillRect(0, 0, width, height);

            const skyGradient = ctx.createLinearGradient(0, 0, 0, HORIZON_Y);
            skyGradient.addColorStop(0, SKY_COLOR_TOP);
            skyGradient.addColorStop(1, SKY_COLOR_HORIZON);
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = skyGradient;
            ctx.fillRect(0, 0, width, HORIZON_Y);
            ctx.globalCompositeOperation = 'source-over';
        };

        const drawMist = () => {
            ctx.fillStyle = MIST_COLOR;
            const mistLayers = 2;
            for (let i = 0; i < mistLayers; i++) {
                const y = HORIZON_Y - 60 + (i * 30);
                const speed = (i + 1) * 0.08;
                const xOffset = (frame * speed);
                ctx.globalAlpha = 0.5;
                for(let j = 0; j < 15; j++){
                    const x = (j * (width/10) - xOffset) % (width + width/5) - width/10;
                    ctx.beginPath();
                    ctx.ellipse(x, y + random(-10,10), random(100,250), random(20,40), 0, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.globalAlpha = 1;
            }
        };

        const drawTrees = () => {
            trees.forEach(tree => {
                const layerConfig = forestLayers[tree.layer];
                const speed = layerConfig[1];
                const color = layerConfig[0];
                
                const x = (tree.x - frame * speed) % (width * 3) - width;
                
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.moveTo(x - tree.w / 2, tree.y);
                ctx.lineTo(x, tree.y - tree.h);
                ctx.lineTo(x + tree.w / 2, tree.y);
                ctx.closePath();
                ctx.fill();
            });
        };
        
        const drawRiver = () => {
            ctx.fillStyle = RIVER_COLOR;
            ctx.fillRect(0, HORIZON_Y, width, height - HORIZON_Y);
            
            // Reflection
            const reflectionGradient = ctx.createLinearGradient(0, HORIZON_Y, 0, height);
            reflectionGradient.addColorStop(0, SKY_COLOR_HORIZON);
            reflectionGradient.addColorStop(0.5, SKY_COLOR_TOP);
            reflectionGradient.addColorStop(1, RIVER_COLOR);
            ctx.globalAlpha = 0.2;
            ctx.fillStyle = reflectionGradient;
            ctx.fillRect(0, HORIZON_Y, width, height-HORIZON_Y);
            ctx.globalAlpha = 1;

            // Ripples
            ctx.fillStyle = RIVER_HIGHLIGHT;
            const ripples = 5;
            for(let i=0; i < ripples; i++) {
                const y = HORIZON_Y + (i * 40);
                const amplitude = 15 - i * 2;
                
                ctx.beginPath();
                ctx.moveTo(0, y);
                for (let x = 0; x < width; x+=20) {
                    ctx.lineTo(x, y + Math.sin((x + frame * 2) * 0.01 + i) * amplitude);
                }
                ctx.lineTo(width, height);
                ctx.lineTo(0, height);
                ctx.closePath();
                ctx.globalAlpha = 0.5 - (i * 0.1);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        };

        const drawBirds = () => {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.lineWidth = 2;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
            ctx.shadowBlur = 5;
            birds.forEach(bird => {
                bird.x += bird.vx;
                if (bird.x > width + bird.size) {
                    bird.x = -bird.size;
                    bird.y = random(height * 0.1, height * 0.4);
                }
                
                const wingAngle = Math.sin(frame * bird.flapSpeed) * 0.5;
                ctx.beginPath();
                ctx.moveTo(bird.x - bird.size / 2, bird.y);
                ctx.quadraticCurveTo(bird.x, bird.y - wingAngle * bird.size, bird.x + bird.size / 2, bird.y);
                ctx.stroke();
            });
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
        };

        const drawLightRays = () => {
            lightRays.forEach(ray => {
                const targetOpacity = Math.max(0, Math.sin(frame * 0.002 + ray.x) - 0.7) * 0.15;
                ray.opacity += (targetOpacity - ray.opacity) * 0.02; 
                
                if (ray.opacity > 0.001) {
                    const gradient = ctx.createLinearGradient(0, 0, 0, HORIZON_Y);
                    gradient.addColorStop(0, `rgba(253, 224, 190, ${ray.opacity})`);
                    gradient.addColorStop(1, `rgba(253, 224, 190, 0)`);

                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.moveTo(ray.x - ray.w / 2, 0);
                    ctx.lineTo(ray.x + ray.w / 2, 0);
                    ctx.lineTo(ray.x + 20, HORIZON_Y);
                    ctx.lineTo(ray.x - 20, HORIZON_Y);
                    ctx.closePath();
                    ctx.fill();
                }
            });
        };

        const animate = () => {
            frame++;
            ctx.clearRect(0, 0, width, height);
            
            drawSkyAndSun();
            drawMist();
            drawLightRays();
            drawTrees();
            drawRiver();
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
