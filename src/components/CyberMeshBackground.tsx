import React, { useEffect, useRef } from 'react';

export default function CyberMeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    active: false,
    hoverTime: 0
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Create particles for a premium starfield / interactive data feel
    const particleCount = Math.min(60, Math.floor((width * height) / 28000));
    const particles: Array<{
      x: number;
      y: number;
      baseY: number;
      vx: number;
      vy: number;
      radius: number;
      opacity: number;
      pulseOffset: number;
      waveOffset: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      const px = Math.random() * width;
      const py = Math.random() * height;
      particles.push({
        x: px,
        y: py,
        baseY: py,
        vx: (Math.random() - 0.5) * 0.35, // Slow elegant float
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 2 + 1.2,
        opacity: 0.15 + Math.random() * 0.4,
        pulseOffset: Math.random() * Math.PI * 2,
        waveOffset: Math.random() * Math.PI * 2
      });
    }

    // Handles window resize fluidly
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse movement tracking on window
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    let time = 0;

    const animate = () => {
      time += 0.006;
      ctx.clearRect(0, 0, width, height);

      // Smoothly interpolate mouse position for a soft physical lag/inertia feel
      const mouse = mouseRef.current;
      if (mouse.active) {
        if (mouse.x === -1000) {
          mouse.x = mouse.targetX;
          mouse.y = mouse.targetY;
        } else {
          mouse.x += (mouse.targetX - mouse.x) * 0.08;
          mouse.y += (mouse.targetY - mouse.y) * 0.08;
        }
        mouse.hoverTime += 0.05;
      } else {
        mouse.targetX = -1000;
        mouse.targetY = -1000;
        mouse.x += (-1000 - mouse.x) * 0.06;
        mouse.y += (-1000 - mouse.y) * 0.06;
        mouse.hoverTime = Math.max(0, mouse.hoverTime - 0.05);
      }

      // Draw beautiful looping vertical grid lines (very faint cyan/blue cyber deck style)
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.008)';
      ctx.lineWidth = 1;
      const gridSize = 80;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw multiple premium 100% blue voice & speech waves (like an advanced oscilloscope or video loop)
      const waveCount = 5;
      for (let w = 0; w < waveCount; w++) {
        // Create variations for each wave layer
        const waveSpeedFactor = 1.0 + w * 0.4;
        const waveFrequency = 0.0015 + w * 0.0008;
        // Base amplitude
        const waveBaseHeight = height * (0.35 + w * 0.08);
        const waveAmplitude = 35 + w * 18;

        // Gradient line colors
        const grad = ctx.createLinearGradient(0, 0, width, 0);
        grad.addColorStop(0, 'rgba(59, 130, 246, 0.01)');
        grad.addColorStop(0.3, 'rgba(37, 99, 235, 0.16)');
        grad.addColorStop(0.5, 'rgba(34, 197, 94, 0.03)'); // cyan touch
        grad.addColorStop(0.7, 'rgba(29, 78, 216, 0.18)');
        grad.addColorStop(1, 'rgba(59, 130, 246, 0.01)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2 + (waveCount - w) * 0.4;
        ctx.beginPath();

        for (let x = 0; x <= width; x += 15) {
          // Calculate standard looping sine-wave position
          let waveY = waveBaseHeight + 
            Math.sin(x * waveFrequency + time * waveSpeedFactor + w) * waveAmplitude +
            Math.cos(x * 0.0005 - time * 0.6 + w) * (waveAmplitude * 0.4);

          // Apply physical hover reaction: Localized vertical ripple ("fall up, down, up, down")
          if (mouse.x !== -1000) {
            const distToMouseX = Math.abs(x - mouse.x);
            // Influence range of 250px around the cursor
            if (distToMouseX < 280) {
              const hoverProximity = 1.0 - (distToMouseX / 280); // 1 near mouse, 0 at boundary
              // Smooth easing curve
              const easeFactor = Math.pow(hoverProximity, 1.8);
              
              // Wave oscillates/wobbles vigorously ("fall up, down, up, down") based on time
              const harmonicOscillation = Math.sin(time * 9 + w * 0.7 - distToMouseX * 0.02) * Math.cos(time * 4);
              const interactiveRipple = harmonicOscillation * 68 * easeFactor;
              
              // Shift the wave up or down dynamically
              waveY += interactiveRipple;
            }
          }

          if (x === 0) {
            ctx.moveTo(x, waveY);
          } else {
            ctx.lineTo(x, waveY);
          }
        }
        ctx.stroke();
      }

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Normal drifting motion
        p.x += p.vx;
        p.baseY += p.vy;

        // Bounce back from boundaries
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.baseY < 0 || p.baseY > height) p.vy *= -1;

        // Default particle position
        p.y = p.baseY + Math.sin(time * 2 + p.waveOffset) * 12;

        let scaleMultiplier = 1.0;
        let hoverYOffset = 0;

        // Handle interactive mouse hover pull/wobble for stars/nodes inside the column
        if (mouse.x !== -1000) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 260) {
            const proximity = 1.0 - (dist / 260); // 0 to 1
            const ease = Math.pow(proximity, 2);

            // Bounces vigorously up and down when hovered ("fall up, down, up, down")
            hoverYOffset = Math.sin(time * 12 + p.pulseOffset) * 45 * ease;
            p.y += hoverYOffset;

            // Make hovered nodes glow bigger
            scaleMultiplier = 1.0 + ease * 1.5;
            p.opacity = Math.min(1.0, p.opacity + ease * 0.4);
          }
        }

        // Draw ambient glow circles behind key particles
        if (i % 8 === 0) {
          ctx.fillStyle = 'rgba(59, 130, 246, 0.05)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 6 * scaleMultiplier, 0, Math.PI * 2);
          ctx.fill();
        }

        // Pulse the opacity elegantly
        const currentOpacity = p.opacity * (0.7 + Math.sin(time * 4 + p.pulseOffset) * 0.3);

        // Core particle point
        ctx.fillStyle = `rgba(59, 130, 246, ${currentOpacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * scaleMultiplier, 0, Math.PI * 2);
        ctx.fill();

        // Connect near neighbors with faint blue filaments
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distDeltaX = p.x - p2.x;
          const distDeltaY = p.y - p2.y;
          const distance = Math.sqrt(distDeltaX * distDeltaX + distDeltaY * distDeltaY);

          if (distance < 130) {
            const alpha = (1 - distance / 130) * 0.11;
            ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="cyber-mesh-canvas"
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
