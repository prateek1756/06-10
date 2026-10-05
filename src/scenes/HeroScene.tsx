import React from 'react';
import { BIRTHDAY_CONFIG } from '../data/birthdayConfig';
import { ParticleBG } from '../components/ParticleBG';
import { soundManager } from '../audio/soundManager';
import confetti from 'canvas-confetti';
import { Sparkles, Heart } from 'lucide-react';

interface Props {
  onDone: () => void;
}

export const HeroScene: React.FC<Props> = ({ onDone }) => {
  const handleProceed = () => {
    soundManager.playCelebrationBurst();
    confetti({
      particleCount: 85,
      spread: 90,
      origin: { y: 0.65 },
      colors: ['#f0cc6a', '#e74c3c', '#8e44ad', '#ffd700', '#ffffff'],
    });
    setTimeout(onDone, 400);
  };

  return (
    <div className="scene hero-scene">
      <ParticleBG count={45} color="#e74c3c" />
      <div className="vignette" />

      {/* Floating Sky Lanterns / Stars in background */}
      <div className="ambient-sky-stars" aria-hidden="true">
        <span className="star s1">✦</span>
        <span className="star s2">★</span>
        <span className="star s3">✦</span>
        <span className="star s4">✨</span>
        <span className="star s5">✦</span>
      </div>

      <div className="hero-content z1">
        {/* Headline badge */}
        <div className="hero-badge">
          <Sparkles size={14} className="gold-sparkle" />
          <span>{BIRTHDAY_CONFIG.heroHeadline}</span>
          <Sparkles size={14} className="gold-sparkle" />
        </div>

        {/* Grand Typography */}
        <h1 className="hero-title">
          <span className="title-happy">HAPPY</span>
          <span className="title-birthday">BIRTHDAY</span>
        </h1>

        <p className="hero-subtitle">
          to you, <span className="highlight-name">{BIRTHDAY_CONFIG.recipientName}</span>!! ✨
        </p>

        {/* 3D Balloon Bouquet Centerpiece matching the video */}
        <div className="balloon-bouquet-centerpiece">
          <div className="balloon-cluster">
            {/* Balloon 1: Metallic Gold */}
            <div className="balloon b-gold" style={{ '--delay': '0s' } as React.CSSProperties}>
              <div className="balloon-shine" />
              <div className="balloon-string" />
            </div>
            {/* Balloon 2: Rich Burgundy */}
            <div className="balloon b-burgundy" style={{ '--delay': '0.6s' } as React.CSSProperties}>
              <div className="balloon-shine" />
              <div className="balloon-string" />
            </div>
            {/* Balloon 3: Royal Purple */}
            <div className="balloon b-purple" style={{ '--delay': '1.2s' } as React.CSSProperties}>
              <div className="balloon-shine" />
              <div className="balloon-string" />
            </div>
            {/* Balloon 4: Magenta / Rose */}
            <div className="balloon b-rose" style={{ '--delay': '0.9s' } as React.CSSProperties}>
              <div className="balloon-shine" />
              <div className="balloon-string" />
            </div>
            {/* Balloon 5: Amber Glow */}
            <div className="balloon b-amber" style={{ '--delay': '1.5s' } as React.CSSProperties}>
              <div className="balloon-shine" />
              <div className="balloon-string" />
            </div>
          </div>

          {/* Golden Cameo Photo Frame of Parineeta */}
          <div className="hero-cameo-frame">
            <div className="cameo-outer-ring">
              <img
                src="/photos/photo1.jpg"
                alt={BIRTHDAY_CONFIG.recipientName}
                className="cameo-photo"
              />
              <div className="cameo-glow-border" />
            </div>
            <div className="cameo-pendant-label">
              <Heart size={14} fill="#e74c3c" color="#e74c3c" />
              <span>Queen of the Day</span>
            </div>
          </div>
        </div>

        {/* Playful and heartwarming birthday note */}
        <div className="hero-quote-card">
          <p className="hero-quote-text">
            &ldquo;May this new chapter bring you all the warmth, laughter, and endless magic you bring to everyone around you.&rdquo;
          </p>
        </div>

        {/* Call to Action button */}
        <button
          type="button"
          onClick={handleProceed}
          className="hero-cta-btn"
          onMouseEnter={() => soundManager.playHover()}
        >
          <span>Light Her Birthday Cake 🎂</span>
          <span className="btn-arrow">&rarr;</span>
        </button>
      </div>
    </div>
  );
};
