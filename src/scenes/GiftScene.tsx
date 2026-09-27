import React, { useState, useCallback } from 'react';
import { BIRTHDAY_CONFIG } from '../data/birthdayConfig';
import { ParticleBG } from '../components/ParticleBG';
import { soundManager } from '../audio/soundManager';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight } from 'lucide-react';

interface Props {
  onDone: () => void;
}

const GIFTS = BIRTHDAY_CONFIG.gifts;

export const GiftScene: React.FC<Props> = ({ onDone }) => {
  const [openedIds, setOpenedIds] = useState<Set<string>>(new Set());
  const [activeGift, setActiveGift] = useState<(typeof GIFTS)[number] | null>(null);

  const openGift = useCallback(
    (gift: (typeof GIFTS)[number]) => {
      const isAlreadyOpen = openedIds.has(gift.id);
      soundManager.playCorrect();

      if (!isAlreadyOpen) {
        const newOpened = new Set(openedIds).add(gift.id);
        setOpenedIds(newOpened);

        // Confetti burst
        confetti({
          particleCount: 85,
          spread: 75,
          origin: { y: 0.5 },
          colors: [gift.color, '#f0cc6a', '#ffffff', '#ff69b4', '#00cec9'],
          startVelocity: 38,
        });
      }

      setActiveGift(gift);
    },
    [openedIds]
  );

  const allOpened = openedIds.size === GIFTS.length;

  return (
    <section className="scene gift-scene" aria-label="Open your gifts">
      <ParticleBG color="#3d1a5c" count={25} />
      <div className="vignette" />

      <div className="z1 gift-container">
        {/* Header from video */}
        <div className="gift-scene-header">
          <span className="gift-step-badge">
            <Sparkles size={14} /> Chapter III
          </span>
          <h1 className="gift-scene-title">CLICK ON GIFTS TO OPEN</h1>
          <p className="gift-scene-sub">Three personalized surprises are waiting inside...</p>
        </div>

        {/* Progress indicators */}
        <div className="gift-progress" aria-label={`${openedIds.size} of ${GIFTS.length} opened`}>
          {GIFTS.map((g) => (
            <div
              key={g.id}
              className={`gift-dot ${openedIds.has(g.id) ? 'done' : ''}`}
              title={g.label}
            />
          ))}
        </div>

        {/* Gifts Grid */}
        <div className="gifts-grid">
          {GIFTS.map((gift, i) => {
            const opened = openedIds.has(gift.id);
            return (
              <div
                key={gift.id}
                className={`gift-box ${opened ? 'opened' : ''}`}
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                <button
                  className="gift-box-visual"
                  onClick={() => openGift(gift)}
                  aria-label={`Open gift: ${gift.label}`}
                  style={{
                    background: `linear-gradient(135deg, ${gift.color}cc 0%, ${gift.color}88 100%)`,
                    boxShadow: opened
                      ? `0 10px 32px ${gift.color}99, 0 0 0 2px ${gift.color}66`
                      : `0 6px 22px ${gift.color}55`,
                    borderColor: opened ? `${gift.color}aa` : 'rgba(255,255,255,0.15)',
                  }}
                >
                  {/* Decorative Ribbons */}
                  <div className="ribbon" />
                  <div className="ribbon-h" />
                  <span className="bow" aria-hidden>
                    🎀
                  </span>
                  <span className="gift-emoji" aria-hidden>
                    {opened ? gift.emoji : '🎁'}
                  </span>
                </button>
                <span className="gift-label">{gift.label}</span>
                <span className="gift-status-hint">{opened ? '✓ Unwrapped' : 'Tap to open'}</span>
              </div>
            );
          })}
        </div>

        {/* Surprise card reveal */}
        {activeGift && (
          <div
            key={activeGift.id}
            className="gift-message-card"
            style={{ borderColor: `${activeGift.color}77` }}
            role="status"
            aria-live="polite"
          >
            <div className="gift-msg-header">
              <span className="gift-msg-icon" aria-hidden>
                {activeGift.emoji}
              </span>
              <span className="gift-msg-title">{activeGift.label}</span>
            </div>
            <p className="gift-msg-body">{activeGift.message}</p>
          </div>
        )}

        {/* Proceed Action Button */}
        {allOpened ? (
          <button
            className="proceed-btn gift-proceed-btn"
            onClick={() => {
              soundManager.playClick();
              onDone();
            }}
            aria-label="Continue to moments"
          >
            <span>Moments I Cherish With You 📸</span>
            <ArrowRight size={18} />
          </button>
        ) : (
          <p className="gift-remaining-hint">
            Unwrap all {GIFTS.length} surprises to unlock the memory corridor... ({openedIds.size}/{GIFTS.length})
          </p>
        )}
      </div>
    </section>
  );
};
