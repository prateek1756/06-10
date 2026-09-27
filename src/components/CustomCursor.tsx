import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on fine pointer (desktop mouse)
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target && (target.closest('button') || target.closest('a') || target.closest('.quiz-option') || target.closest('[role="button"]'))) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 transition-transform duration-75"
      style={{
        left: pos.x,
        top: pos.y,
        transform: `translate(-50%, -50%) scale(${isHovering ? 1.6 : 1})`,
      }}
    >
      {/* Outer ambient glow */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '1px solid rgba(212, 175, 55, 0.45)',
          background: isHovering ? 'rgba(212, 175, 55, 0.12)' : 'transparent',
          boxShadow: '0 0 15px rgba(212, 175, 55, 0.25)',
          transition: 'all 0.2s ease-out',
        }}
      />
      {/* Center pinpoint */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 4,
          height: 4,
          borderRadius: '50%',
          backgroundColor: '#fffae6',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 6px #fff',
        }}
      />
    </div>
  );
};
