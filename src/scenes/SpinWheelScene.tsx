import React, { useState, useRef, useCallback } from 'react';
import { BIRTHDAY_CONFIG } from '../data/birthdayConfig';
import { ParticleBG } from '../components/ParticleBG';
import { soundManager } from '../audio/soundManager';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, ArrowRight, RotateCw } from 'lucide-react';

interface Props {
  onDone: () => void;
}

interface Segment {
  label: string;
  emoji: string;
  message: string;
}

const COLORS = [
  '#9b2335', // Rich Burgundy
  '#4a1c5d', // Midnight Violet
  '#1e3a8a', // Deep Sapphire
  '#134e4a', // Emerald Forest
  '#854d0e', // Warm Amber Gold
  '#701a75', // Sunset Plum
];

export const SpinWheelScene: React.FC<Props> = ({ onDone }) => {
  const blessings: readonly Segment[] = BIRTHDAY_CONFIG.wheelBlessings;
  const numSegments = blessings.length;
  const anglePerSegment = 360 / numSegments;

  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [selectedBlessing, setSelectedBlessing] = useState<Segment | null>(null);
  const [hasSpun, setHasSpun] = useState(false);

  const currentRotationRef = useRef(0);

  const spin = useCallback(() => {
    if (spinning) return;
    setSpinning(true);
    setSelectedBlessing(null);
    soundManager.playClick();

    // Pick a random target index (0 to numSegments - 1)
    const targetIdx = Math.floor(Math.random() * numSegments);

    // Pointer is at the top (270 deg or 0 deg depending on orientation).
    // Let's place pointer at the top (arrow pointing down at 0 deg).
    // When wheel rotates by R, the segment under the pointer at top is:
    // pointerAngle = (360 - (R % 360)) % 360.
    // Segment i occupies angles [i * anglePerSegment, (i + 1) * anglePerSegment].
    // Segment midpoint is (i + 0.5) * anglePerSegment.
    // So to make targetIdx land at top: (R % 360) = 360 - (targetIdx + 0.5) * anglePerSegment.
    const fullSpins = 5 + Math.floor(Math.random() * 3); // 5 to 7 full spins
    const targetSliceAngle = (targetIdx + 0.5) * anglePerSegment;
    const finalOffset = (360 - targetSliceAngle);
    
    // Add to current rotation
    const baseRotation = Math.ceil(currentRotationRef.current / 360) * 360;
    const nextRotation = baseRotation + fullSpins * 360 + finalOffset;
    
    currentRotationRef.current = nextRotation;
    setRotation(nextRotation);

    // Play ticking sounds during spin
    let tickCount = 0;
    const totalTicks = 25;
    const tickInterval = setInterval(() => {
      tickCount++;
      soundManager.playClick();
      if (tickCount >= totalTicks) {
        clearInterval(tickInterval);
      }
    }, 160);

    // Settle after 4.5 seconds (matching transition duration)
    setTimeout(() => {
      setSpinning(false);
      setHasSpun(true);
      const won = blessings[targetIdx];
      setSelectedBlessing(won);
      soundManager.playCorrect();
      soundManager.playCelebrationBurst();

      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#ffd700', '#f0cc6a', '#ff6b81', '#9b2335', '#ffffff'],
      });
    }, 4500);
  }, [spinning, blessings, numSegments, anglePerSegment]);

  return (
    <div className="scene wheel-scene">
      <ParticleBG count={40} color="#ffd700" />
      <div className="vignette" />

      {/* Floating lanterns in background */}
      <div className="sky-lanterns-layer" aria-hidden="true">
        <div className="lantern l1" />
        <div className="lantern l2" />
        <div className="lantern l3" />
        <div className="lantern l4" />
      </div>

      <div className="wheel-content z1">
        <div className="wheel-header">
          <div className="scene-mini-badge">
            <Sparkles size={13} className="gold-sparkle" />
            <span>SPECIAL BLESSINGS FOR PARINEETA</span>
            <Sparkles size={13} className="gold-sparkle" />
          </div>
          <h2 className="wheel-title">Spin the Golden Wheel</h2>
          <p className="wheel-subtitle">
            Every spin holds a celestial wish written especially for you ✨
          </p>
        </div>

        {/* The Golden Wheel Interactive Canvas / SVG */}
        <div className="wheel-stage-container">
          {/* Top Pointer Arrow */}
          <div className="wheel-pointer">
            <div className="pointer-arrow" />
          </div>

          <div
            className="wheel-rotator"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? 'transform 4.5s cubic-bezier(0.12, 0.8, 0.25, 1)' : 'none',
            }}
          >
            <svg
              className="wheel-svg"
              viewBox="0 0 400 400"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <radialGradient id="hubGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fcedb4" />
                  <stop offset="50%" stopColor="#d4af37" />
                  <stop offset="100%" stopColor="#8a6c1e" />
                </radialGradient>
              </defs>

              {/* Outer Golden Rim */}
              <circle
                cx="200"
                cy="200"
                r="192"
                fill="#161224"
                stroke="#d4af37"
                strokeWidth="10"
                filter="url(#goldGlow)"
              />

              {/* Slices */}
              {blessings.map((b, i) => {
                const startAngle = i * anglePerSegment;
                const endAngle = (i + 1) * anglePerSegment;
                const midAngle = startAngle + anglePerSegment / 2;

                const rad1 = (Math.PI / 180) * (startAngle - 90);
                const rad2 = (Math.PI / 180) * (endAngle - 90);
                const radMid = (Math.PI / 180) * (midAngle - 90);

                const r = 186;
                const x1 = 200 + r * Math.cos(rad1);
                const y1 = 200 + r * Math.sin(rad1);
                const x2 = 200 + r * Math.cos(rad2);
                const y2 = 200 + r * Math.sin(rad2);

                const textR = 125;
                const tx = 200 + textR * Math.cos(radMid);
                const ty = 200 + textR * Math.sin(radMid);

                return (
                  <g key={i}>
                    {/* Pie Wedge */}
                    <path
                      d={`M 200 200 L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
                      fill={COLORS[i % COLORS.length]}
                      stroke="#d4af37"
                      strokeWidth="2.5"
                    />

                    {/* Label and Emoji */}
                    <g transform={`translate(${tx}, ${ty}) rotate(${midAngle})`}>
                      <text
                        x="0"
                        y="-10"
                        textAnchor="middle"
                        fontSize="22"
                        className="wheel-emoji"
                      >
                        {b.emoji}
                      </text>
                      <text
                        x="0"
                        y="16"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="13"
                        fontWeight="700"
                        letterSpacing="1.5"
                        fontFamily="var(--f-sans)"
                      >
                        {b.label}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Outer Golden Studs / Bulbs */}
              {Array.from({ length: 18 }).map((_, i) => {
                const angle = (i * 360) / 18;
                const rad = (Math.PI / 180) * angle;
                const cx = 200 + 192 * Math.cos(rad);
                const cy = 200 + 192 * Math.sin(rad);
                return (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r="4"
                    fill="#ffeaa7"
                    stroke="#d4af37"
                    strokeWidth="1.5"
                  />
                );
              })}

              {/* Center Golden Hub Plate */}
              <circle
                cx="200"
                cy="200"
                r="45"
                fill="url(#hubGradient)"
                stroke="#ffeaa7"
                strokeWidth="3"
                filter="url(#goldGlow)"
              />
            </svg>
          </div>

          {/* Central Spin Trigger Button */}
          <button
            type="button"
            className={`wheel-center-btn ${spinning ? 'disabled' : ''}`}
            onClick={spin}
            disabled={spinning}
            aria-label="Spin the wheel"
          >
            <RotateCw size={18} className={spinning ? 'spin-anim' : ''} />
            <span>{spinning ? 'SPINNING...' : 'SPIN ✦'}</span>
          </button>
        </div>

        {/* Selected Blessing Reveal Modal / Card */}
        {selectedBlessing && (
          <div className="blessing-modal-card">
            <div className="blessing-badge">
              <Trophy size={16} color="#ffd700" />
              <span>YOUR BLESSING: {selectedBlessing.label}</span>
            </div>
            <div className="blessing-emoji">{selectedBlessing.emoji}</div>
            <p className="blessing-message">&ldquo;{selectedBlessing.message}&rdquo;</p>
            <div className="blessing-author-tag">Written with love for Parineeta ❤️</div>
          </div>
        )}

        {/* Action button to proceed */}
        <div className="wheel-actions">
          {hasSpun && (
            <button
              type="button"
              className="wheel-proceed-btn"
              onClick={() => {
                soundManager.playClick();
                soundManager.playCelebrationBurst();
                onDone();
              }}
            >
              <span>Walk Down Memory Lane 📸</span>
              <ArrowRight size={16} />
            </button>
          )}

          {!hasSpun && (
            <p className="wheel-hint-text">
              ✨ Tap the center gold button to reveal your birthday blessing!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
