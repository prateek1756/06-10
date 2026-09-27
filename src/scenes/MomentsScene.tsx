import React, { useState } from 'react';
import { BIRTHDAY_CONFIG } from '../data/birthdayConfig';
import { ParticleBG } from '../components/ParticleBG';
import { soundManager } from '../audio/soundManager';
import { ArrowRight, X, Heart, Camera } from 'lucide-react';

interface Props {
  onDone: () => void;
}

export const MomentsScene: React.FC<Props> = ({ onDone }) => {
  const [selectedMoment, setSelectedMoment] = useState<(typeof BIRTHDAY_CONFIG.moments)[number] | null>(null);

  const openMoment = (m: (typeof BIRTHDAY_CONFIG.moments)[number]) => {
    soundManager.playMemoryReveal();
    setSelectedMoment(m);
  };

  const closeMoment = () => {
    soundManager.playClick();
    setSelectedMoment(null);
  };

  return (
    <section className="scene moments-scene" aria-label="Moments I Cherish With You">
      <ParticleBG color="#7b241c" count={25} />
      <div className="vignette" />

      <div className="z1 moments-container">
        {/* Header matching video */}
        <div className="moments-header">
          <span className="moments-overhead-badge">
            <Heart size={14} fill="#e74c3c" color="#e74c3c" /> Chapter IV
          </span>
          <h1 className="moments-title">Moments I Cherish With You</h1>
          <p className="moments-sub">Every memory with you is my favorite story...</p>
        </div>

        {/* Clothesline String & Hanging Polaroids */}
        <div className="clothesline-container">
          {/* Wooden Clothesline Wire */}
          <div className="clothesline-wire" />

          {/* Doodles from video: forever, love >, stars */}
          <div className="doodle-forever">forever ♡</div>
          <div className="doodle-love">love &gt;</div>
          <div className="doodle-star-1">★</div>
          <div className="doodle-star-2">✨</div>

          {/* Polaroid Cards Grid */}
          <div className="polaroid-row">
            {BIRTHDAY_CONFIG.moments.map((item, idx) => (
              <div
                key={item.id}
                className="polaroid-hanger"
                style={{
                  transform: `rotate(${item.rotation}deg)`,
                  animationDelay: `${idx * 0.15}s`,
                }}
              >
                {/* Clothespin Clip */}
                <div className="wooden-clothespin">
                  <div className="clothespin-metal" />
                </div>

                {/* Polaroid Frame */}
                <button
                  className="polaroid-card"
                  onClick={() => openMoment(item)}
                  aria-label={`View memory: ${item.title}`}
                >
                  <div className="polaroid-photo-box">
                    <img
                      src={item.photo}
                      alt={item.title}
                      className="polaroid-real-img"
                      loading="lazy"
                    />
                    <span className="polaroid-date-badge">{item.date}</span>
                  </div>
                  <div className="polaroid-caption-area">
                    <h3 className="polaroid-card-title">{item.title}</h3>
                    <p className="polaroid-card-snippet">{item.caption}</p>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Modal / Zoom Inspector for Selected Moment */}
        {selectedMoment && (
          <div className="moment-modal-backdrop" onClick={closeMoment} role="dialog" aria-modal="true">
            <div className="moment-modal-card" onClick={e => e.stopPropagation()}>
              <button className="moment-modal-close" onClick={closeMoment} aria-label="Close memory modal">
                <X size={20} />
              </button>

              <div className="moment-modal-photo">
                <img
                  src={selectedMoment.photo}
                  alt={selectedMoment.title}
                  className="moment-modal-real-img"
                />
                <span className="moment-modal-date">{selectedMoment.date}</span>
              </div>

              <div className="moment-modal-content">
                <div className="moment-modal-header">
                  <Camera size={18} className="moment-camera-icon" />
                  <h2>{selectedMoment.title}</h2>
                </div>
                <p className="moment-modal-quote">"{selectedMoment.caption}"</p>
                <div className="moment-modal-footer">
                  <span>Photo keepsake from the heart</span>
                  <Heart size={16} fill="#e74c3c" color="#e74c3c" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Proceed Action Button */}
        <div className="moments-bottom-action">
          <button
            className="proceed-btn moments-proceed-btn"
            onClick={() => {
              soundManager.playClick();
              onDone();
            }}
            aria-label="Continue to birthday letter"
          >
            <span>A Letter For You 💌</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};
