import React from 'react';
import { Volume2, VolumeX, Sparkles, Sliders, Eye } from 'lucide-react';
import { soundManager } from '../audio/soundManager';
import { QualityProfile } from '../three/ThreeSceneController';

interface NavigationControlsProps {
  currentScene: number;
  totalScenes: number;
  quality: QualityProfile;
  isUnlocked: boolean;
  onSceneChange: (scene: number) => void;
  onQualityChange: (quality: QualityProfile) => void;
  onToggleSecretUnlock: () => void;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  currentScene,
  totalScenes,
  quality,
  isUnlocked,
  onSceneChange,
  onQualityChange,
  onToggleSecretUnlock,
}) => {
  const [muted, setMuted] = React.useState(soundManager.getMuted());

  const handleAudioToggle = () => {
    const isNowMuted = !soundManager.toggleMute();
    setMuted(isNowMuted);
  };

  const cycleQuality = () => {
    soundManager.playClick();
    const next: QualityProfile = quality === 'HIGH' ? 'MEDIUM' : quality === 'MEDIUM' ? 'LOW' : 'HIGH';
    onQualityChange(next);
  };

  const sceneLabels = [
    'Arrival',
    'Countdown',
    'Fun Zone',
    'Unlock',
    'Celebration',
    'Make A Wish',
    'Memory Lane',
    'Final Chapter'
  ];

  return (
    <>
      {/* Top Bar Floating Controls */}
      <header className="fixed top-6 left-0 right-0 z-50 pointer-events-none px-6 flex justify-between items-center" style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Brand / Chapter Badge */}
        <div className="pointer-events-auto flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
              background: 'rgba(20, 19, 26, 0.7)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Sparkles size={14} className="text-amber-400" style={{ color: '#d4af37' }} />
            <span
              className="font-serif text-xs tracking-widest uppercase"
              style={{ color: '#dcd7ce', fontSize: '0.75rem', letterSpacing: '0.15em' }}
            >
              Scene {String(currentScene + 1).padStart(2, '0')} • {sceneLabels[currentScene]}
            </span>
          </div>

          {/* Dev / Preview Bypass Button */}
          <button
            onClick={onToggleSecretUnlock}
            title="Toggle Birthday Unlock Preview"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs transition-all outline-none"
            style={{
              background: isUnlocked ? 'rgba(74, 130, 85, 0.3)' : 'rgba(30, 28, 38, 0.65)',
              border: isUnlocked ? '1px solid #5fb375' : '1px solid rgba(255, 255, 255, 0.12)',
              color: isUnlocked ? '#bbf2cb' : '#9f9a93',
              cursor: 'pointer',
              fontSize: '0.72rem',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Eye size={12} />
            <span>{isUnlocked ? 'Unlocked' : 'Preview Mode'}</span>
          </button>
        </div>

        {/* Right Audio & Quality Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Quality Switcher */}
          <button
            onClick={cycleQuality}
            title={`Quality: ${quality} (click to toggle)`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-serif tracking-wider transition-all"
            style={{
              background: 'rgba(20, 19, 26, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#d0cbc1',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Sliders size={13} style={{ color: '#c49b38' }} />
            <span style={{ fontSize: '0.72rem' }}>{quality}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleAudioToggle}
            title={muted ? 'Unmute Atmosphere' : 'Mute Atmosphere'}
            className="p-2 rounded-full transition-all flex items-center justify-center"
            style={{
              background: muted ? 'rgba(30, 28, 38, 0.6)' : 'rgba(212, 175, 55, 0.15)',
              border: muted ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(212, 175, 55, 0.4)',
              color: muted ? '#9b968f' : '#f0d996',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              width: 36,
              height: 36,
            }}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </header>

      {/* Bottom Scene Indicator Dots */}
      <nav
        className="fixed bottom-6 left-0 right-0 z-40 pointer-events-none flex justify-center items-center"
        aria-label="Scene progress"
      >
        <div
          className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            background: 'rgba(15, 14, 19, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {Array.from({ length: totalScenes }).map((_, idx) => {
            const isActive = idx === currentScene;
            // Scene 4, 5, 6, 7 are locked until unlocked or preview mode
            const isLocked = !isUnlocked && idx >= 3;

            return (
              <button
                key={idx}
                onClick={() => {
                  if (isLocked) {
                    soundManager.playIncorrect();
                    return;
                  }
                  soundManager.playClick();
                  onSceneChange(idx);
                }}
                disabled={isLocked}
                title={`${sceneLabels[idx]}${isLocked ? ' (Locked until 06·10·2026)' : ''}`}
                style={{
                  width: isActive ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  border: 'none',
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  backgroundColor: isActive
                    ? '#d4af37'
                    : isLocked
                    ? 'rgba(255, 255, 255, 0.12)'
                    : 'rgba(255, 255, 255, 0.35)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  padding: 0,
                  opacity: isLocked ? 0.4 : 1,
                }}
              />
            );
          })}
        </div>
      </nav>
    </>
  );
};
