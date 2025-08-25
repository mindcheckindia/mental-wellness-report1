
import React, { useRef, useEffect } from 'react';

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

        // --- Configuration ---
        const HORIZON_RATIO = 0.6;
        const SKY_COLOR_TOP = '#1e3a8a';
        const SKY_COLOR_HORIZON = '#60a5fa';
        const GROUND_COLOR = '#064e3b';
        const RIVER_COLOR = 'rgba(147, 197, 253, 0.3)';
        const RIVER_HIGHLIGHT = 'rgba(239, 246, 255, 0.4)';
        
        // --- Parallax Tree Layers ---
        const layerConfigs = [
            { speed: 0.1, count: 20, size: 80, blur: 5, color: 'rgba(6, 78, 59, 0.4)' },
            { speed: 0.2, count: 15, size: 120, blur: 3, color: 'rgba(6, 78, 59, 0.6)' },
            { speed: 0.4, count: 12, size: 200, blur: 2, color: 'rgba(5, 46, 22, 0.7)' },
            { speed: 0.8, count: 8, size: 300, blur: 1, color: 'rgba(2, 6, 23, 0.8)' },
        ];
        let treeLayers: any[] = [];
        
        // --- Birds ---
        let birds: any[] = [];
        
        // --- Light Rays ---
        let lightRays: any[] = [];
        
        const initializeElements = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            width = canvas.width;
            height = canvas.height;

            treeLayers = layerConfigs.map(layer => ({
                ...layer,
                trees: Array.from({ length: layer.count }, () => ({
                    x: Math.random() * (width + 400),
                    y: height * HORIZON_RATIO + (Math.random() - 0.5) * 50,
                    scale: 0.8 + Math.random() * 0.4,
                })),
                offsetX: 0
            }));
            
            birds = Array.from({ length: 5 }, () => ({
                x: Math.random() * width,
                y: height * 0.1 + Math.random() * height * 0.3,
                vx: 0.5 + Math.random() * 0.5,
                size: 10 + Math.random() * 10,
                flapSpeed: 0.1 + Math.random() * 0.1
            }));
            
            lightRays = Array.from({ length: 4 }, () => ({
                x: width * 0.2 + Math.random() * width * 0.6,
                angle: (Math.random() - 0.5) * 0.2,
                opacity: 0
            }));
        };

        const drawSkyAndGround = () => {
            const horizonY = height * HORIZON_RATIO;
            const skyGradient = ctx.createLinearGradient(0, 0, 0, horizonY);
            skyGradient.addColorStop(0, SKY_COLOR_TOP);
            skyGradient.addColorStop(1, SKY_COLOR_HORIZON);
            ctx.fillStyle = skyGradient;
            ctx.fillRect(0, 0, width, horizonY);

            ctx.fillStyle = GROUND_COLOR;
            ctx.fillRect(0, horizonY, width, height - horizonY);
        };
        
        const drawTree = (x: number, y: number, size: number, scale: number) => {
            const treeHeight = size * scale;
            const treeWidth = treeHeight / 3;
            ctx.beginPath();
            ctx.moveTo(x - treeWidth / 2, y);
            ctx.lineTo(x, y - treeHeight);
            ctx.lineTo(x + treeWidth / 2, y);
            ctx.closePath();
            ctx.fill();
        };

        const drawRiver = () => {
            const horizonY = height * HORIZON_RATIO;
            const riverHeight = height - horizonY;
            ctx.save();
            ctx.filter = 'blur(10px)';
            ctx.fillStyle = RIVER_COLOR;
            ctx.fillRect(0, horizonY, width, riverHeight);
            ctx.restore();

            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(-100, horizonY + riverHeight * 0.4 + Math.sin(frame * 0.01 + i * 2) * 10);
                for (let x = -100; x < width + 100; x += 20) {
                    const y = horizonY + riverHeight * 0.4 + Math.sin((x / 100) + frame * 0.01 + i * 2) * 20;
                    ctx.lineTo(x, y);
                }
                ctx.lineTo(width + 100, height + 100);
                ctx.lineTo(-100, height + 100);
                ctx.closePath();
                ctx.fillStyle = i === 1 ? RIVER_HIGHLIGHT : RIVER_COLOR;
                ctx.fill();
            }
        };

        const drawBird = (bird: any) => {
            const wingAngle = Math.sin(frame * bird.flapSpeed) * 0.5;
            ctx.beginPath();
            ctx.moveTo(bird.x - bird.size / 2, bird.y);
            ctx.quadraticCurveTo(bird.x, bird.y + wingAngle * bird.size, bird.x + bird.size / 2, bird.y);
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
        };

        const drawLightRay = (ray: any) => {
             if (ray.opacity <= 0) return;
             const horizonY = height * HORIZON_RATIO;
             ctx.save();
             ctx.translate(ray.x, horizonY);
             ctx.rotate(ray.angle);
             const gradient = ctx.createLinearGradient(0, 0, 0, -horizonY);
             gradient.addColorStop(0, `rgba(165, 214, 255, 0)`);
             gradient.addColorStop(1, `rgba(201, 228, 255, ${ray.opacity * 0.1})`);
             ctx.fillStyle = gradient;
             ctx.beginPath();
             ctx.moveTo(-100, 0);
             ctx.lineTo(100, 0);
             ctx.lineTo(50, -horizonY);
             ctx.lineTo(-150, -horizonY);
             ctx.closePath();
             ctx.fill();
             ctx.restore();
        }

        const render = () => {
            frame++;
            ctx.clearRect(0, 0, width, height);
            
            drawSkyAndGround();
            drawRiver();
            
            treeLayers.forEach(layer => {
                ctx.fillStyle = layer.color;
                ctx.save();
                ctx.filter = `blur(${layer.blur}px)`;
                layer.offsetX = (layer.offsetX + layer.speed) % (width + 400);

                layer.trees.forEach((tree: any) => {
                    const x = (tree.x - layer.offsetX + width + 400) % (width + 400);
                    drawTree(x, tree.y, layer.size, tree.scale);
                });
                ctx.restore();
            });
            
            birds.forEach(bird => {
                bird.x += bird.vx;
                if (bird.x > width + bird.size) {
                    bird.x = -bird.size;
                    bird.y = height * 0.1 + Math.random() * height * 0.3;
                }
                drawBird(bird);
            });
            
            lightRays.forEach(ray => {
                const targetOpacity = Math.max(0, Math.sin(frame * 0.005 + ray.x) * 0.5 + 0.5);
                ray.opacity += (targetOpacity - ray.opacity) * 0.05;
                drawLightRay(ray);
            });

            animationFrameId.current = window.requestAnimationFrame(render);
        };
        
        initializeElements();
        render();

        const resizeHandler = () => {
            initializeElements();
        };

        window.addEventListener('resize', resizeHandler);
        
        return () => {
            window.cancelAnimationFrame(animationFrameId.current);
            window.removeEventListener('resize', resizeHandler);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />;
};

export default AnimatedBackground;
