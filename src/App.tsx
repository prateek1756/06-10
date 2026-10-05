import React, { useState, useCallback, useEffect } from 'react';
import { LoadingScene } from './scenes/LoadingScene';
import { LockScreen } from './scenes/LockScreen';
import { HeroScene } from './scenes/HeroScene';
import { CakeScene } from './scenes/CakeScene';
import { SpinWheelScene } from './scenes/SpinWheelScene';
import { GalleryScene } from './scenes/GalleryScene';
import { LetterScene } from './scenes/LetterScene';
import { AudioToggle } from './components/AudioToggle';
import { StepProgress } from './components/StepProgress';
import './styles/app.css';

export type Scene = 'loading' | 'lock' | 'hero' | 'cake' | 'wheel' | 'gallery' | 'letter';

const STEP_SCENES: Scene[] = ['cake', 'wheel', 'gallery', 'letter'];

export const App: React.FC = () => {
  const [scene, setScene] = useState<Scene>('loading');
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback((next: Scene) => {
    setTransitioning(true);
    setTimeout(() => {
      setScene(next);
      setTransitioning(false);
      window.scrollTo(0, 0);
    }, 600);
  }, []);

  const currentStep = STEP_SCENES.indexOf(scene);

  return (
    <div className={`app-root ${transitioning ? 'fade-out' : 'fade-in'}`}>
      <CosmicCursor />
      <AudioToggle />
      {currentStep >= 0 && <StepProgress currentStep={currentStep} />}
      <main className="main-content-flow">
        {scene === 'loading' && <LoadingScene onDone={() => goTo('lock')} />}
        {scene === 'lock' && <LockScreen onUnlock={() => goTo('hero')} />}
        {scene === 'hero' && <HeroScene onDone={() => goTo('cake')} />}
        {scene === 'cake' && <CakeScene onDone={() => goTo('wheel')} />}
        {scene === 'wheel' && <SpinWheelScene onDone={() => goTo('gallery')} />}
        {scene === 'gallery' && <GalleryScene onDone={() => goTo('letter')} />}
        {scene === 'letter' && <LetterScene onRestart={() => goTo('loading')} />}
      </main>
    </div>
  );
};

// ── Cosmic Custom Cursor ──────────────────────────────────────────────────
const CosmicCursor: React.FC = () => {
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
          el.closest('.polaroid-card') ||
          el.closest('.wheel-spin-btn') ||
          el.closest('a')
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
        transform: `translate(-50%,-50%) scale(${hovering ? 1.8 : 1})`,
        background: hovering
          ? 'radial-gradient(circle, rgba(255,215,0,0.6), rgba(212,175,55,0.2))'
          : 'radial-gradient(circle, rgba(255,255,255,0.85), rgba(255,255,255,0.3))',
        boxShadow: hovering
          ? '0 0 25px rgba(255,215,0,0.7), 0 0 50px rgba(212,175,55,0.3)'
          : '0 0 10px rgba(255,255,255,0.4)',
      }}
    />
  );
};
