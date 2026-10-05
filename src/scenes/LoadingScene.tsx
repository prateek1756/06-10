import React, { useState, useEffect } from 'react';
import { BIRTHDAY_CONFIG } from '../data/birthdayConfig';
import { ParticleBG } from '../components/ParticleBG';
import { soundManager } from '../audio/soundManager';
import { Sparkles } from 'lucide-react';

interface Props {
  onDone: () => void;
}

export const LoadingScene: React.FC<Props> = ({ onDone }) => {
  const [progress, setProgress] = useState(0);
  const [phaseText, setPhaseText] = useState<string>(BIRTHDAY_CONFIG.loadingText || 'IGNITING THE COSMIC CANDLES...');

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            soundManager.playPortalUnlock();
            onDone();
          }, 450);
          return 100;
        }

        const increment = Math.floor(Math.random() * 8) + 4;
        const next = Math.min(100, prev + increment);

        if (next > 75) {
          setPhaseText('ALIGNING HER CONSTELLATIONS ✨');
        } else if (next > 45) {
          setPhaseText('PREPARING THE SWEETEST WISHES 🎂');
        } else if (next > 20) {
          setPhaseText('IGNITING THE COSMIC CANDLES 🕯️');
        }

        return next;
      });
    }, 85);

    return () => clearInterval(timer);
  }, [onDone]);

  const handleSkip = () => {
    soundManager.playClick();
    soundManager.playPortalUnlock();
    onDone();
  };

  return (
    <div className="scene loading-scene">
      <ParticleBG count={50} color="#f0cc6a" />
      <div className="vignette" />

      <div className="loading-content z1">
        <div className="cosmic-portal-glow">
          <div className="cosmic-candle-icon">
            <span className="cosmic-flame">🔥</span>
            <span className="cosmic-candle-body">🕯️</span>
          </div>
        </div>

        <p className="loading-headline-badge">
          <Sparkles size={14} className="gold-sparkle" />
          <span>CELEBRATION INITIATING</span>
          <Sparkles size={14} className="gold-sparkle" />
        </p>

        <h2 className="loading-status-text">{phaseText}</h2>

        <div className="loading-progress-container">
          <div className="loading-progress-track">
            <div
              className="loading-progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="loading-stats">
            <span className="loading-stars-glow">✦ ✦ ✦</span>
            <span className="loading-percent">{progress}%</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSkip}
          className="loading-skip-btn"
          aria-label="Skip loading"
        >
          Begin Celebration Immediately &rarr;
        </button>
      </div>
    </div>
  );
};
