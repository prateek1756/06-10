import React, { useState } from 'react';
import { BIRTHDAY_CONFIG } from '../data/birthdayConfig';
import { ParticleBG } from '../components/ParticleBG';
import { soundManager } from '../audio/soundManager';
import confetti from 'canvas-confetti';
import { Heart, ArrowRight } from 'lucide-react';

interface Props {
  onDone: () => void;
}

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  size: number;
}

export const AnnoyScene: React.FC<Props> = ({ onDone }) => {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const [bearBounced, setBearBounced] = useState(false);

  const triggerBearReaction = (e: React.MouseEvent) => {
    soundManager.playChime(1.2);
    setBearBounced(true);
    setTimeout(() => setBearBounced(false), 500);

    // Spawn floating heart
    const newHeart: FloatingHeart = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY - 20,
      size: 20 + Math.random() * 20,
    };
    setHearts(prev => [...prev.slice(-10), newHeart]);

    // Mini confetti burst
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
      colors: ['#ff6b81', '#ff4757', '#ffffff', '#f0cc6a'],
    });
  };

  const handleProceed = () => {
    soundManager.playClick();
    onDone();
  };

  return (
    <section className="scene annoy-scene" aria-label="I want to annoy you">
      <ParticleBG color="#b03060" count={30} />
      <div className="vignette" />

      {/* Floating interactive hearts */}
      {hearts.map(h => (
        <div
          key={h.id}
          className="floating-interactive-heart"
          style={{
            left: h.x,
            top: h.y,
            width: h.size,
            height: h.size,
          }}
        >
          ❤️
        </div>
      ))}

      <div className="z1 annoy-container">
        {/* Top Floating Heart */}
        <div className="annoy-top-heart" onClick={triggerBearReaction} role="button" aria-label="Tap heart">
          <Heart size={36} fill="#c0392b" color="#e74c3c" className="beating-heart" />
        </div>

        {/* Big Romantic Headline from video */}
        <div className="annoy-headers">
          <h1 className="annoy-title">{BIRTHDAY_CONFIG.annoyHeadline}</h1>
          <p className="annoy-subtitle">{BIRTHDAY_CONFIG.annoySub}</p>
        </div>

        {/* Cute Couple Mascot Illustrations (SVG) */}
        <div className={`annoy-mascots-wrap ${bearBounced ? 'mascots-bounce' : ''}`}>
          {/* Left Bear Couple */}
          <div
            className="bear-card bear-left"
            onClick={triggerBearReaction}
            title="Tap us!"
            role="button"
            tabIndex={0}
          >
            <svg viewBox="0 0 160 140" className="bear-svg">
              {/* White Bear (Milk) */}
              <circle cx="55" cy="70" r="32" fill="#ffffff" stroke="#2c2c2c" strokeWidth="3" />
              <circle cx="34" cy="45" r="10" fill="#ffffff" stroke="#2c2c2c" strokeWidth="3" />
              <circle cx="76" cy="45" r="10" fill="#ffffff" stroke="#2c2c2c" strokeWidth="3" />
              <ellipse cx="48" cy="65" rx="3.5" ry="5" fill="#2c2c2c" />
              <ellipse cx="62" cy="65" rx="3.5" ry="5" fill="#2c2c2c" />
              <ellipse cx="55" cy="73" rx="4" ry="3" fill="#2c2c2c" />
              {/* Blush */}
              <ellipse cx="42" cy="74" rx="5" ry="3" fill="#ffb8b8" />
              <ellipse cx="68" cy="74" rx="5" ry="3" fill="#ffb8b8" />

              {/* Brown Bear (Mocha) hugging */}
              <circle cx="95" cy="72" r="32" fill="#d2996e" stroke="#2c2c2c" strokeWidth="3" />
              <circle cx="80" cy="47" r="10" fill="#d2996e" stroke="#2c2c2c" strokeWidth="3" />
              <circle cx="118" cy="47" r="10" fill="#d2996e" stroke="#2c2c2c" strokeWidth="3" />
              <ellipse cx="90" cy="68" rx="3" ry="4" fill="#2c2c2c" />
              <ellipse cx="104" cy="68" rx="3" ry="4" fill="#2c2c2c" />
              <ellipse cx="97" cy="75" rx="4" ry="3" fill="#2c2c2c" />
              {/* Blush */}
              <ellipse cx="85" cy="76" rx="5" ry="3" fill="#ff9999" />
              <ellipse cx="109" cy="76" rx="5" ry="3" fill="#ff9999" />

              {/* Little love sparks above */}
              <text x="75" y="32" fontSize="18" fill="#e74c3c" textAnchor="middle">💕</text>
            </svg>
            <span className="bear-tap-hint">tap us! 🐾</span>
          </div>

          {/* Right Hugging Duo */}
          <div
            className="bear-card bear-right"
            onClick={triggerBearReaction}
            title="Squish!"
            role="button"
            tabIndex={0}
          >
            <svg viewBox="0 0 160 140" className="bear-svg">
              {/* White Bear leaning */}
              <ellipse cx="65" cy="75" rx="30" ry="28" fill="#ffffff" stroke="#2c2c2c" strokeWidth="3" />
              <circle cx="45" cy="50" r="9" fill="#ffffff" stroke="#2c2c2c" strokeWidth="3" />
              <circle cx="85" cy="50" r="9" fill="#ffffff" stroke="#2c2c2c" strokeWidth="3" />
              <ellipse cx="58" cy="72" rx="3" ry="4" fill="#2c2c2c" />
              <ellipse cx="72" cy="72" rx="3" ry="4" fill="#2c2c2c" />
              <ellipse cx="65" cy="78" rx="3" ry="2" fill="#2c2c2c" />
              <ellipse cx="52" cy="80" rx="5" ry="3" fill="#ffb8b8" />
              <ellipse cx="78" cy="80" rx="5" ry="3" fill="#ffb8b8" />

              {/* Brown bear head resting gently */}
              <ellipse cx="100" cy="80" rx="28" ry="26" fill="#d2996e" stroke="#2c2c2c" strokeWidth="3" />
              <circle cx="90" cy="58" r="8" fill="#d2996e" stroke="#2c2c2c" strokeWidth="3" />
              <circle cx="122" cy="62" r="8" fill="#d2996e" stroke="#2c2c2c" strokeWidth="3" />
              <ellipse cx="96" cy="78" rx="3" ry="2" fill="#2c2c2c" />
              <ellipse cx="108" cy="78" rx="3" ry="2" fill="#2c2c2c" />
              <ellipse cx="102" cy="84" rx="3" ry="2" fill="#2c2c2c" />
              <ellipse cx="90" cy="86" rx="4" ry="2.5" fill="#ff9999" />
              <ellipse cx="114" cy="86" rx="4" ry="2.5" fill="#ff9999" />

              <text x="82" y="30" fontSize="18" fill="#e74c3c" textAnchor="middle">✨</text>
            </svg>
            <span className="bear-tap-hint">squish! 🐻</span>
          </div>
        </div>

        {/* Humorous and Loving Note */}
        <p className="annoy-note">
          {BIRTHDAY_CONFIG.annoyNote}
        </p>

        {/* Proceed Action Button */}
        <button
          className="proceed-btn annoy-proceed-btn"
          onClick={handleProceed}
          aria-label="Continue to make a wish"
        >
          <span>Ready for your wish? 🕯️</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
};
