

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

        // --- Configuration based on prompt ---
        const HORIZON_Y = height * 0.55;
        const SKY_COLOR_TOP = '#D1B498'; // Soft golden hour
        const SKY_COLOR_HORIZON = '#EAE0D5'; // Misty horizon
        const RIVER_COLOR = '#5A6372'; // Calm, dark water
        const SUN_GLOW_COLOR = 'rgba(255, 215, 130, 0.25)';

        // Parallax Forest Layers: [color, speed, element_count, y_range, height_range, width_range]
        const forestLayers: [string, number, number, [number, number], [number, number], [number, number]][] = [
            ['#4F6A4F', 0.05, 150, [HORIZON_Y - 50, HORIZON_Y], [50, 150], [1, 3]],   // Farthest, misty
            ['#3B5339', 0.1, 100, [HORIZON_Y - 30, HORIZON_Y + 50], [150, 250], [2, 5]], // Far
            ['#2F4F4F', 0.2, 70, [HORIZON_Y, HORIZON_Y + 150], [200, 400], [3, 8]],      // Mid
            ['#2A3C2A', 0.4, 40, [HORIZON_Y + 50, height * 0.9], [300, 500], [5, 15]],    // Near
        ];
        
        let trees: { x: number, y: number, h: number, w: number, layer: number }[] = [];
        let birds: { x: number, y: number, vx: number, vy: number, size: number, wingAngle: number }[] = [];
        let particles: { x: number, y: number, vx: number, vy: number, size: number, opacity: number }[] = [];
        
        const initialize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;

            trees = [];
            forestLayers.forEach((layer, layerIndex) => {
                for(let i = 0; i < layer[2]; i++) {
                    trees.push({
                        x: random(-width * 0.5, width * 1.5),
                        y: random(layer[3][0], layer[3][1]),
                        h: random(layer[4][0], layer[4][1]),
                        w: random(layer[5][0], layer[5][1]),
                        layer: layerIndex
                    });
                }
            });
            // Sort so we can draw back-to-front
            trees.sort((a,b) => a.layer - b.layer);
            
            birds = [];
            for (let i = 0; i < 7; i++) {
                 birds.push({
                    x: random(0, width),
                    y: random(height * 0.1, height * 0.3),
                    vx: random(0.2, 0.5),
                    vy: random(-0.1, 0.1),
                    size: random(2, 4),
                    wingAngle: random(0, Math.PI * 2)
                });
            }

            particles = [];
            for (let i = 0; i < 150; i++) {
                particles.push({
                    x: random(0, width),
                    y: random(0, height),
                    vx: random(-0.05, 0.05),
                    vy: random(-0.1, -0.05),
                    size: random(1, 3),
                    opacity: random(0.1, 0.5)
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
            const sunY = HORIZON_Y - 100;
            const sunGradient = ctx.createRadialGradient(sunX, sunY, 50, sunX, sunY, 600);
            sunGradient.addColorStop(0, SUN_GLOW_COLOR);
            sunGradient.addColorStop(1, 'rgba(255, 215, 130, 0)');
            ctx.fillStyle = sunGradient;
            ctx.fillRect(0, 0, width, height);
        };

        const drawTree = (x: number, y: number, h: number, w: number, color: string) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(x - w / 2, y);
            ctx.lineTo(x + w / 2, y);
            ctx.lineTo(x, y - h);
            ctx.closePath();
            ctx.fill();
        }

        const drawTrees = () => {
            trees.forEach(tree => {
                const layerConfig = forestLayers[tree.layer];
                const speed = layerConfig[1];
                const color = layerConfig[0];
                const x = (tree.x - frame * speed);
                
                // seamless loop logic
                const screenX = ((x % (width * 2)) + (width * 2)) % (width * 2) - width * 0.5;

                drawTree(screenX, tree.y, tree.h, tree.w, color);
            });
        };
        
        const drawRiver = () => {
            ctx.fillStyle = RIVER_COLOR;
            ctx.fillRect(0, HORIZON_Y, width, height - HORIZON_Y);
            
            // Ripples
            ctx.save();
            ctx.globalCompositeOperation = 'overlay';
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
            ctx.lineWidth = 1;
            for(let i = 0; i < 10; i++) {
                ctx.beginPath();
                const startY = HORIZON_Y + random(0, height - HORIZON_Y);
                ctx.moveTo(0, startY);
                for(let x = 0; x < width; x += 20) {
                    ctx.lineTo(x, startY + Math.sin((x + frame * 1.5 + i * 100) * 0.02) * 5);
                }
                ctx.stroke();
                ctx.closePath();
            }
             ctx.restore();
        };

        const drawMist = () => {
            // Gradient mist
            const mistGradient = ctx.createLinearGradient(0, HORIZON_Y - 150, 0, height);
            mistGradient.addColorStop(0, 'rgba(234, 224, 213, 0)');
            mistGradient.addColorStop(0.5, 'rgba(234, 224, 213, 0.7)');
            mistGradient.addColorStop(1, 'rgba(234, 224, 213, 0.8)');
            ctx.fillStyle = mistGradient;
            ctx.fillRect(0, HORIZON_Y - 150, width, height);

            // Dust motes / particles
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.y < 0) { p.y = height; }
                if (p.x < 0) { p.x = width; }
                if (p.x > width) { p.x = 0; }

                ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });
        };

        const drawBirds = () => {
            ctx.fillStyle = '#1c1917'; // dark silhouette color
            birds.forEach(bird => {
                bird.x += bird.vx;
                bird.y += bird.vy;
                bird.wingAngle += 0.2;

                if (bird.x > width + 20) {
                    bird.x = -20;
                    bird.y = random(height * 0.1, height * 0.3);
                }

                const wingYOffset = Math.sin(bird.wingAngle) * bird.size * 1.5;

                ctx.beginPath();
                ctx.moveTo(bird.x - bird.size, bird.y);
                ctx.lineTo(bird.x, bird.y - wingYOffset);
                ctx.lineTo(bird.x + bird.size, bird.y);
                ctx.closePath();
                ctx.fill();
            });
        };

        const drawLightRays = () => {
             ctx.save();
             ctx.globalCompositeOperation = 'overlay';
             for (let i = 0; i < 3; i++) {
                 const rayX = (width / 2) + Math.sin(frame * 0.001 + i * 2) * (width * 0.4);
                 const rayW = random(200, 400);
                 const opacity = (Math.sin(frame * 0.005 + i * 3) * 0.5 + 0.5) * 0.1;

                 const gradient = ctx.createLinearGradient(rayX, 0, rayX, HORIZON_Y);
                 gradient.addColorStop(0, `rgba(255, 215, 130, ${opacity})`);
                 gradient.addColorStop(1, `rgba(255, 215, 130, 0)`);
                 
                 ctx.fillStyle = gradient;
                 ctx.beginPath();
                 ctx.moveTo(rayX - rayW, 0);
                 ctx.lineTo(rayX + rayW, 0);
                 ctx.lineTo(rayX + 50, HORIZON_Y);
                 ctx.lineTo(rayX - 50, HORIZON_Y);
                 ctx.closePath();
                 ctx.fill();
             }
             ctx.restore();
        };

        const animate = () => {
            frame++;
            ctx.clearRect(0, 0, width, height);
            
            drawSkyAndSun();
            drawLightRays();
            drawTrees();
            drawRiver();
            drawMist();
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
