"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas to full window size
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000);

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.1,
        });
      }
    };

    // Animation loop
    const animate = (timestamp: number) => {
      timeRef.current = timestamp * 0.001; // Convert to seconds
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Center coordinates for spotlight
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxSpotlightRadius = Math.min(
        1280,
        Math.max(canvas.width, canvas.height)
      );

      // Draw unique grid pattern
      drawUniqueGrid(
        ctx,
        canvas.width,
        canvas.height,
        centerX,
        centerY,
        maxSpotlightRadius,
        timeRef.current
      );

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Calculate distance from mouse
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Calculate distance from center for spotlight effect
        const dxCenter = centerX - particle.x;
        const dyCenter = centerY - particle.y;
        const distanceFromCenter = Math.sqrt(
          dxCenter * dxCenter + dyCenter * dyCenter
        );

        // Spotlight effect - particles are brighter near the center
        const spotlightFactor = Math.max(
          0,
          1 - distanceFromCenter / (maxSpotlightRadius / 2)
        );

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

        // Particles glow when near mouse or in spotlight
        const mouseInfluence = distance < 100 ? (1 - distance / 100) * 0.5 : 0;
        const finalOpacity =
          particle.opacity + mouseInfluence + spotlightFactor * 0.3;
        ctx.fillStyle = `rgba(164, 195, 255, ${finalOpacity})`;
        ctx.fill();

        // Draw connections between nearby particles
        particlesRef.current.forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 80) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            // Connections are also brighter in the spotlight
            const connectionOpacity =
              0.03 * (1 - distance / 80) * (1 + spotlightFactor);
            ctx.strokeStyle = `rgba(164, 195, 255, ${connectionOpacity})`;
            ctx.stroke();
          }
        });
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Function to draw unique grid pattern
    const drawUniqueGrid = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      centerX: number,
      centerY: number,
      maxRadius: number,
      time: number
    ) => {
      const horizonY = height * 0.5;
      const vanishingPointX = width * 0.5;
      const baseGridSize = 100;
      const gridRows = 20;
      const gridCols = 20;
      const breatheAmount = Math.sin(time * 0.2) * 0.05 + 1;
    
      for (let i = -gridRows; i <= gridRows; i++) {
        const y = horizonY + i * baseGridSize * breatheAmount;
        const distanceFromCenter = Math.abs(y - centerY);
        const fadeFactor = Math.max(0, 1 - distanceFromCenter / (height * 0.5));
        const lineOpacity = 0.15 * fadeFactor;
    
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.strokeStyle = `rgba(100, 140, 220, ${lineOpacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    
      for (let i = -gridCols; i <= gridCols; i++) {
        const x = vanishingPointX + i * baseGridSize * breatheAmount;
        const distanceFromCenter = Math.abs(x - centerX);
        const fadeFactor = Math.max(0, 1 - distanceFromCenter / (width * 0.5));
        const lineOpacity = 0.15 * fadeFactor;
    
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.strokeStyle = `rgba(100, 140, 220, ${lineOpacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    
      // **Intersection Points (Fade out near edges)**
      for (let i = -gridCols; i <= gridCols; i += 2) {
        for (let j = -gridRows; j <= gridRows; j += 2) {
          const x = vanishingPointX + i * baseGridSize * breatheAmount;
          const y = horizonY + j * baseGridSize * breatheAmount;
          const dx = x - centerX;
          const dy = y - centerY;
          const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
          const fadeFactor = Math.max(0, 1 - distanceFromCenter / (maxRadius * 0.5));
    
          if (fadeFactor > 0.1) {
            const nodeSize = 1 + fadeFactor * 1.5;
            const nodeOpacity = 0.1 + fadeFactor * 0.3;
    
            ctx.beginPath();
            ctx.arc(x, y, nodeSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(150, 180, 255, ${nodeOpacity})`;
            ctx.fill();
          }
        }
      }
    };
    
    

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    handleResize();
    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1}}
      className="absolute inset-0 z-0"
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
    </motion.div>
  );
}
