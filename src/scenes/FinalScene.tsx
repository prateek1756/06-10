import React, { useEffect, useRef } from 'react';
import { BIRTHDAY_CONFIG } from '../data/birthdayConfig';
import { ParticleBG } from '../components/ParticleBG';
import { soundManager } from '../audio/soundManager';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw } from 'lucide-react';

interface Props {
  onRestart: () => void;
}

const { letter, recipientName } = BIRTHDAY_CONFIG;

export const FinalScene: React.FC<Props> = ({ onRestart }) => {
  const hasLaunchedRef = useRef(false);

  const launchConfetti = () => {
    soundManager.playCelebrationBurst();

    confetti({
      particleCount: 75,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.65 },
      colors: ['#f0cc6a', '#ff69b4', '#a29bfe', '#ffffff', '#e74c3c'],
    });
    confetti({
      particleCount: 75,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.65 },
      colors: ['#ff9f43', '#f0cc6a', '#00cec9', '#ffffff', '#ff6b81'],
    });
  };

  useEffect(() => {
    if (hasLaunchedRef.current) return;
    hasLaunchedRef.current = true;

    // Grand Entrance celebration bursts
    launchConfetti();
    const t1 = setTimeout(launchConfetti, 800);
    const t2 = setTimeout(launchConfetti, 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <section className="scene final-scene" aria-label="Birthday Letter & Wishes">
      <ParticleBG color="#5e1948" count={30} />
      <div className="vignette" />

      <div className="z1 final-container">
        {/* Top Header */}
        <div className="final-header">
          <span className="final-dedication">Dedicated to {recipientName} 🤍</span>
          <h1 className="final-title">Happy Birthday</h1>
        </div>

        {/* Scalloped Vintage Love Letter Card matching video */}
        <article className="vintage-letter-card" aria-label="Personal birthday letter">
          {/* Scalloped edge decor */}
          <div className="scallop-top-border" />

          {/* Letter Headings */}
          <div className="letter-header-group">
            <h2 className="letter-salutation">{letter.salutation}</h2>
            <p className="letter-sub-salutation">{letter.intro}</p>
          </div>

          <div className="letter-body-layout">
            {/* Left/Center Text Paragraphs */}
            <div className="letter-paragraphs-column">
              {letter.paragraphs.map((para, i) => (
                <p
                  key={i}
                  className="letter-paragraph"
                  style={{ animationDelay: `${0.3 + i * 0.25}s` }}
                >
                  {para}
                </p>
              ))}

              <div className="letter-signoff-wrap">
                <p className="letter-signoff-text">{letter.signOff}</p>
                <p className="letter-author-name">{letter.author}</p>
              </div>
            </div>

            {/* Right Side: Retro Camera and Film Photo Accent matching video */}
            <div className="letter-media-sidebar">
              {/* Photo Frame with Flower */}
              <div className="sidebar-polaroid">
                <div className="sidebar-polaroid-photo">
                  <span className="sidebar-flower-accent">🌺</span>
                  <img
                    src="/photos/photo4.jpg"
                    alt="Celebration keepsake"
                    className="sidebar-real-img"
                  />
                </div>
                <span className="sidebar-polaroid-caption">Always with you</span>
              </div>

              {/* Vintage Retro Camera SVG matching video */}
              <div className="vintage-camera-wrap" title="Capturing moments forever">
                <svg viewBox="0 0 140 100" className="vintage-camera-svg">
                  {/* Camera body */}
                  <rect x="10" y="25" width="120" height="70" rx="10" fill="#2c2830" stroke="#d4af37" strokeWidth="2.5" />
                  {/* Camera top panel */}
                  <rect x="25" y="15" width="50" height="12" rx="4" fill="#3d3744" stroke="#d4af37" strokeWidth="1.5" />
                  <circle cx="95" cy="18" r="6" fill="#e74c3c" />
                  <rect x="110" y="17" width="12" height="7" rx="2" fill="#d4af37" />
                  {/* Flash */}
                  <rect x="25" y="32" width="22" height="14" rx="3" fill="#f5f0e8" opacity="0.9" />
                  {/* Lens circles */}
                  <circle cx="70" cy="60" r="26" fill="#1b1820" stroke="#d4af37" strokeWidth="3" />
                  <circle cx="70" cy="60" r="18" fill="#2a2533" />
                  <circle cx="70" cy="60" r="10" fill="#586071" opacity="0.8" />
                  <circle cx="66" cy="56" r="3" fill="#ffffff" opacity="0.9" />
                  {/* Leatherette texture band */}
                  <rect x="10" y="48" width="120" height="30" fill="#221e27" opacity="0.6" />
                </svg>
              </div>
            </div>
          </div>
        </article>

        {/* Celebration & Restart Actions */}
        <div className="final-actions-row">
          <button
            className="proceed-btn confetti-cannon-btn"
            onClick={launchConfetti}
            aria-label="Shower confetti"
          >
            <Sparkles size={18} />
            <span>Shower Confetti! 🎊</span>
          </button>

          <button
            className="restart-btn"
            onClick={() => {
              soundManager.playClick();
              onRestart();
            }}
            aria-label="Replay experience from beginning"
          >
            <RotateCcw size={16} />
            <span>Replay From Start</span>
          </button>
        </div>
      </div>
    </section>
  );
};
