import React, { useState } from 'react';
import { BIRTHDAY_CONFIG } from '../data/birthdayConfig';
import { ParticleBG } from '../components/ParticleBG';
import { soundManager } from '../audio/soundManager';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, RotateCcw, Mail } from 'lucide-react';

interface Props {
  onRestart: () => void;
}

export const LetterScene: React.FC<Props> = ({ onRestart }) => {
  const [opened, setOpened] = useState(false);
  const letter = BIRTHDAY_CONFIG.letter;

  const handleOpenEnvelope = () => {
    if (opened) return;
    setOpened(true);
    soundManager.playMemoryReveal();
    soundManager.playChime(1.2);

    setTimeout(() => {
      soundManager.playCelebrationBurst();
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.55 },
        colors: ['#e74c3c', '#ffd700', '#f0cc6a', '#ffffff', '#ff9ff3'],
      });
    }, 500);
  };

  return (
    <div className="scene letter-scene">
      <ParticleBG count={40} color="#ff6b81" />
      <div className="vignette" />

      {/* Floating lanterns in background */}
      <div className="sky-lanterns-layer" aria-hidden="true">
        <div className="lantern l1" />
        <div className="lantern l2" />
        <div className="lantern l3" />
        <div className="lantern l4" />
      </div>

      <div className="letter-content z1">
        {!opened ? (
          /* Sealed Envelope View */
          <div className="envelope-wrapper">
            <div className="scene-mini-badge">
              <Sparkles size={13} className="gold-sparkle" />
              <span>THE GRAND FINALE</span>
              <Sparkles size={13} className="gold-sparkle" />
            </div>
            <h2 className="envelope-heading">A Letter Written For You</h2>
            <p className="envelope-subheading">
              Sealed with warmth, truth, and all the love in the cosmos.
            </p>

            <div
              className="envelope-container"
              onClick={handleOpenEnvelope}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleOpenEnvelope();
              }}
            >
              <div className="envelope-body">
                <div className="envelope-flap" />
                <div className="envelope-front-pocket" />
                
                {/* Wax Seal Button */}
                <div className="wax-seal">
                  <div className="wax-seal-inner">
                    <span className="seal-monogram">P</span>
                    <Heart size={16} fill="#ffffff" color="#ffffff" className="seal-heart" />
                  </div>
                  <div className="wax-glow" />
                </div>

                <div className="envelope-address">
                  <p className="recipient-label">To:</p>
                  <p className="recipient-name-script">{BIRTHDAY_CONFIG.recipientName}</p>
                </div>
              </div>

              <div className="tap-to-open-prompt">
                <Mail size={16} />
                <span>Tap the Golden Seal to Open 💌</span>
              </div>
            </div>
          </div>
        ) : (
          /* Opened Parchment Love Letter */
          <div className="letter-parchment-card">
            {/* Elegant corner ornaments */}
            <div className="letter-corner top-left">✦</div>
            <div className="letter-corner top-right">✦</div>
            <div className="letter-corner bottom-left">✦</div>
            <div className="letter-corner bottom-right">✦</div>

            <div className="letter-header">
              <span className="letter-salutation">{letter.salutation}</span>
              <p className="letter-intro">{letter.intro}</p>
              <div className="letter-divider" />
            </div>

            <div className="letter-body">
              {letter.paragraphs.map((para, i) => (
                <p key={i} className="letter-paragraph">
                  {para}
                </p>
              ))}
            </div>

            <div className="letter-footer">
              <div className="letter-divider" />
              <p className="letter-signoff">{letter.signOff}</p>
              <p className="letter-author">&mdash; {letter.author}</p>
            </div>

            {/* Restart Button */}
            <div className="letter-actions">
              <button
                type="button"
                className="letter-restart-btn"
                onClick={() => {
                  soundManager.playClick();
                  onRestart();
                }}
              >
                <RotateCcw size={16} />
                <span>Experience The Magic Again ✨</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
