import React, { useEffect, useRef } from 'react';

interface Props {
  color?: string;   // e.g. "#9b2335"
  count?: number;
}

interface Particle {
  x: number; y: number;
  r: number;
  vx: number; vy: number;
  alpha: number;
  dAlpha: number;
}

/**
 * Lightweight canvas-based floating particle background.
 * Self-contained, no deps beyond React. ~1KB runtime.
 */
export const ParticleBG: React.FC<Props> = ({ color = '#9b2335', count = 30 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const spawn = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 1 + Math.random() * 2.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(0.1 + Math.random() * 0.25),
      alpha: 0.1 + Math.random() * 0.5,
      dAlpha: (Math.random() * 0.004 + 0.001) * (Math.random() < 0.5 ? 1 : -1),
    });

    const init = () => {
      resize();
      particles = Array.from({ length: count }, spawn);
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.dAlpha;

        if (p.alpha <= 0 || p.alpha >= 1) p.dAlpha *= -1;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color + Math.round(p.alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };

    init();
    draw();

    const onResize = () => { resize(); };
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, [color, count]);

  return (
    <canvas
      ref={canvasRef}
      className="bg-canvas"
      aria-hidden
    />
  );
};
