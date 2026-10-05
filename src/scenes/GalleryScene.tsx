import React, { useState } from 'react';
import { BIRTHDAY_CONFIG } from '../data/birthdayConfig';
import { ParticleBG } from '../components/ParticleBG';
import { soundManager } from '../audio/soundManager';
import { Sparkles, Heart, X, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface Props {
  onDone: () => void;
}

interface Moment {
  id: string;
  title: string;
  date: string;
  caption: string;
  photo: string;
  emoji: string;
  rotation: number;
}

export const GalleryScene: React.FC<Props> = ({ onDone }) => {
  const moments: readonly Moment[] = BIRTHDAY_CONFIG.moments;
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [likes, setLikes] = useState<Record<string, number>>({});

  const handleCardClick = (idx: number) => {
    soundManager.playMemoryReveal();
    setActiveIdx(idx);
  };

  const handleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    soundManager.playChime(1.2);
    setLikes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIdx !== null) {
      soundManager.playClick();
      setActiveIdx((activeIdx + 1) % moments.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIdx !== null) {
      soundManager.playClick();
      setActiveIdx((activeIdx - 1 + moments.length) % moments.length);
    }
  };

  return (
    <div className="scene gallery-scene">
      <ParticleBG count={35} color="#f0cc6a" />
      <div className="vignette" />

      {/* Floating Sky Lanterns in background */}
      <div className="sky-lanterns-layer" aria-hidden="true">
        <div className="lantern l1" />
        <div className="lantern l2" />
        <div className="lantern l3" />
        <div className="lantern l4" />
      </div>

      <div className="gallery-content z1">
        {/* Header */}
        <div className="gallery-header">
          <div className="scene-mini-badge">
            <Sparkles size={13} className="gold-sparkle" />
            <span>MOMENTS I CHERISH</span>
            <Sparkles size={13} className="gold-sparkle" />
          </div>
          <h2 className="gallery-title">Memories of You, Parineeta</h2>
          <p className="gallery-subtitle">
            Every snapshot holds a laugh, a quiet comfort, and a sparkle of pure magic ✨
          </p>
        </div>

        {/* Polaroids Masonry / Grid */}
        <div className="polaroids-grid">
          {moments.map((m, idx) => {
            const likeCount = likes[m.id] || 0;
            return (
              <div
                key={m.id}
                className="polaroid-card"
                style={{
                  transform: `rotate(${m.rotation}deg)`,
                }}
                onClick={() => handleCardClick(idx)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleCardClick(idx);
                }}
              >
                {/* Vintage Gold Tape at the top */}
                <div className="polaroid-tape" />

                <div className="polaroid-image-wrap">
                  <img
                    src={m.photo}
                    alt={m.title}
                    className="polaroid-img"
                    loading="lazy"
                  />
                  <div className="polaroid-overlay-shimmer" />
                </div>

                <div className="polaroid-caption-block">
                  <div className="polaroid-text-row">
                    <span className="polaroid-title">{m.title}</span>
                    <span className="polaroid-emoji">{m.emoji}</span>
                  </div>
                  <div className="polaroid-bottom-row">
                    <span className="polaroid-date">{m.date}</span>
                    <button
                      type="button"
                      className="polaroid-like-btn"
                      onClick={(e) => handleLike(e, m.id)}
                      title="Heart this memory"
                    >
                      <Heart
                        size={14}
                        fill={likeCount > 0 ? '#e74c3c' : 'none'}
                        color={likeCount > 0 ? '#e74c3c' : '#9a9490'}
                      />
                      {likeCount > 0 && <span className="like-count">{likeCount}</span>}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Proceed CTA */}
        <div className="gallery-actions">
          <button
            type="button"
            className="gallery-proceed-btn"
            onClick={() => {
              soundManager.playCelebrationBurst();
              onDone();
            }}
          >
            <span>Open Your Birthday Letter 💌</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeIdx !== null && (
        <div
          className="lightbox-overlay"
          onClick={() => setActiveIdx(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="lightbox-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={() => setActiveIdx(null)}
              aria-label="Close photo preview"
            >
              <X size={20} />
            </button>

            <div className="lightbox-img-box">
              <img
                src={moments[activeIdx].photo}
                alt={moments[activeIdx].title}
                className="lightbox-img"
              />
            </div>

            <div className="lightbox-details">
              <div className="lightbox-badge-row">
                <span className="lightbox-emoji">{moments[activeIdx].emoji}</span>
                <span className="lightbox-date">{moments[activeIdx].date}</span>
              </div>
              <h3 className="lightbox-title">{moments[activeIdx].title}</h3>
              <p className="lightbox-caption">{moments[activeIdx].caption}</p>

              <div className="lightbox-nav-buttons">
                <button
                  type="button"
                  className="lightbox-nav-btn prev"
                  onClick={handlePrev}
                  aria-label="Previous photo"
                >
                  <ChevronLeft size={20} />
                  <span>Previous</span>
                </button>
                <button
                  type="button"
                  className="lightbox-nav-btn next"
                  onClick={handleNext}
                  aria-label="Next photo"
                >
                  <span>Next</span>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
