import React, { useState, useCallback, useEffect } from 'react';
import { LockScreen } from './scenes/LockScreen';
import { AnnoyScene } from './scenes/AnnoyScene';
import { CakeScene } from './scenes/CakeScene';
import { GiftScene } from './scenes/GiftScene';
import { MomentsScene } from './scenes/MomentsScene';
import { FinalScene } from './scenes/FinalScene';
import { AudioToggle } from './components/AudioToggle';
import { SceneBorders } from './components/SceneBorders';
import './styles/app.css';

export type Scene = 'lock' | 'annoy' | 'cake' | 'gifts' | 'moments' | 'final';

export const App: React.FC = () => {
  const [scene, setScene] = useState<Scene>('lock');
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback((next: Scene) => {
    setTransitioning(true);
    setTimeout(() => {
      setScene(next);
      setTransitioning(false);
      window.scrollTo(0, 0);
    }, 550);
  }, []);

  return (
    <div className={`app-root ${transitioning ? 'fade-out' : 'fade-in'}`}>
      <CustomCursor />
      <AudioToggle />
      <SceneBorders />
      <main className="main-content-flow">
        {scene === 'lock' && <LockScreen onUnlock={() => goTo('annoy')} />}
        {scene === 'annoy' && <AnnoyScene onDone={() => goTo('cake')} />}
        {scene === 'cake' && <CakeScene onDone={() => goTo('gifts')} />}
        {scene === 'gifts' && <GiftScene onDone={() => goTo('moments')} />}
        {scene === 'moments' && <MomentsScene onDone={() => goTo('final')} />}
        {scene === 'final' && <FinalScene onRestart={() => goTo('lock')} />}
      </main>
    </div>
  );
};

// ── Minimal Smooth Custom Cursor ──────────────────────────────────────────
const CustomCursor: React.FC = () => {
  const [p, setP] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const move = (e: MouseEvent) => {
      setP({ x: e.clientX, y: e.clientY });
      const el = e.target as HTMLElement;
      setHovering(
        !!(
          el.closest('button') ||
          el.closest('[role="button"]') ||
          el.closest('.key-btn') ||
          el.closest('.polaroid-card')
        )
      );
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div
      className="custom-cursor"
      style={{
        left: p.x,
        top: p.y,
        transform: `translate(-50%,-50%) scale(${hovering ? 1.7 : 1})`,
        background: hovering ? 'rgba(255, 215, 0, 0.45)' : 'rgba(255, 255, 255, 0.85)',
        boxShadow: hovering
          ? '0 0 20px rgba(255, 215, 0, 0.7), 0 0 40px rgba(231, 76, 60, 0.4)'
          : '0 0 8px rgba(255, 255, 255, 0.5)',
      }}
    />
  );
};
