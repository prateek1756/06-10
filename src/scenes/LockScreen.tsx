import React, { useState, useCallback, useEffect, useRef } from 'react';
import { BIRTHDAY_CONFIG } from '../data/birthdayConfig';
import { ParticleBG } from '../components/ParticleBG';
import { soundManager } from '../audio/soundManager';
import confetti from 'canvas-confetti';
import { Delete, KeyRound } from 'lucide-react';

interface Props {
  onUnlock: () => void;
}

const PASSCODE = BIRTHDAY_CONFIG.passcode;
const HINTS = BIRTHDAY_CONFIG.wrongCodeHints;

export const LockScreen: React.FC<Props> = ({ onUnlock }) => {
  const [input, setInput] = useState('');
  const [shaking, setShaking] = useState(false);
  const [hintIdx, setHintIdx] = useState(-1);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  // Physical keyboard support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) pressDigit(e.key);
      if (e.key === 'Backspace') deleteLast();
      if (e.key === 'Enter') handleAttemptUnlock();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [input]);

  const verifyPasscode = useCallback((code: string) => {
    if (code === PASSCODE) {
      soundManager.playPortalUnlock();
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#e74c3c', '#d4af37', '#ffffff', '#ff6b81'],
      });
      setTimeout(onUnlock, 450);
    } else {
      soundManager.playIncorrect();
      setTimeout(() => {
        setInput('');
        setShaking(true);
        setHintIdx(h => (h + 1) % HINTS.length);
        setTimeout(() => setShaking(false), 500);
      }, 150);
    }
  }, [onUnlock]);

  const pressDigit = useCallback((d: string) => {
    soundManager.playClick();
    setPressedKey(d);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setPressedKey(null), 180);

    setInput(prev => {
      if (prev.length >= PASSCODE.length) return prev;
      const next = prev + d;
      if (next.length === PASSCODE.length) {
        verifyPasscode(next);
      }
      return next;
    });
  }, [verifyPasscode]);

  const deleteLast = useCallback(() => {
    soundManager.playClick();
    setInput(prev => prev.slice(0, -1));
  }, []);

  const handleAttemptUnlock = useCallback(() => {
    if (input.length === 0) return;
    verifyPasscode(input);
  }, [input, verifyPasscode]);

  const KEYS = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#'],
  ];

  return (
    <section className="scene lock-scene" aria-label="Enter passcode to unlock">
      <ParticleBG color="#9b2335" count={35} />
      <div className="vignette" />

      <div className="z1 lock-content-wrap">
        {/* Heart photo frame matching video */}
        <div className="heart-frame-wrap">
          <HeartFrame />
          <span className="music-notes">♩ ♪ ♫ ♬ ♩ ♪</span>
        </div>

        {/* Title */}
        <div className="lock-text-header">
          <h1 className="lock-title">Enter a passcode</h1>
          <p className="lock-subtitle">A special key for a special day...</p>
        </div>

        {/* Hint display */}
        <div className="lock-feedback" aria-live="polite">
          {hintIdx >= 0 && (
            <span key={hintIdx} className="wrong-hint">
              {HINTS[hintIdx]}
            </span>
          )}
        </div>

        {/* Passcode square slots matching video [ * ] [ * ] [ * ] [ * ] */}
        <div
          className={`passcode-slots ${shaking ? 'slots-shake' : ''}`}
          role="status"
          aria-label={`${input.length} of ${PASSCODE.length} digits entered`}
        >
          {Array.from({ length: PASSCODE.length }).map((_, i) => {
            const isFilled = i < input.length;
            return (
              <div key={i} className={`slot ${isFilled ? 'filled' : ''}`}>
                {isFilled ? <span className="slot-asterisk">✱</span> : null}
              </div>
            );
          })}
        </div>

        {/* Keypad */}
        <div className="keypad-container">
          <div className="keypad" role="group" aria-label="Number keypad">
            {KEYS.flat().map((k) => {
              const isSpecial = k === '*' || k === '#';
              return (
                <button
                  key={k}
                  className={`key-btn ${isSpecial ? 'special-key' : ''} ${pressedKey === k ? 'pressed' : ''}`}
                  onClick={() => isSpecial ? undefined : pressDigit(k)}
                  aria-label={`Digit ${k}`}
                  tabIndex={0}
                >
                  {k}
                </button>
              );
            })}
          </div>

          {/* Action Row: Backspace & UNLOCK button matching video */}
          <div className="keypad-actions-row">
            <button
              className="keypad-action-btn backspace-btn"
              onClick={deleteLast}
              disabled={input.length === 0}
              aria-label="Delete last digit"
              title="Backspace"
            >
              <Delete size={18} />
              <span>CLEAR</span>
            </button>

            <button
              className={`keypad-action-btn unlock-pill-btn ${input.length === PASSCODE.length ? 'ready' : ''}`}
              onClick={handleAttemptUnlock}
              aria-label="Unlock"
            >
              <KeyRound size={16} />
              <span>UNLOCK</span>
            </button>
          </div>
        </div>

        <p className="lock-bottom-hint">
          Hint: Think about your special birth date (MMDD) 📅
        </p>
      </div>
    </section>
  );
};

/* ── Inline SVG Heart Frame matching video ──────────────────────────────── */
const HeartFrame: React.FC = () => (
  <div className="heart-frame">
    <svg viewBox="0 0 220 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="hg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#d93848" />
          <stop offset="100%" stopColor="#7b1f28" />
        </radialGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <clipPath id="innerHeartClip">
          <circle cx="110" cy="95" r="54" />
        </clipPath>
      </defs>

      {/* Outer Heart Shape */}
      <path
        d="M110,175 C65,150 20,120 10,80 C-2,42 22,10 56,10 C75,10 93,22 110,38 C127,22 145,10 164,10 C198,10 222,42 210,80 C200,120 155,150 110,175Z"
        fill="url(#hg)"
        filter="url(#glow)"
      />

      {/* Decorative Scalloped Lace Trim */}
      <path
        d="M110,165 C72,142 30,115 22,80 C12,48 32,20 60,20 C76,20 92,30 110,46 C128,30 144,20 160,20 C188,20 208,48 198,80 C190,115 148,142 110,165Z"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3.5"
        strokeDasharray="6 4"
        opacity="0.8"
      />

      {/* Photo cutout containing her portrait */}
      <g clipPath="url(#innerHeartClip)">
        <image
          href="/photos/photo1.jpg"
          x="54"
          y="39"
          width="112"
          height="112"
          preserveAspectRatio="xMidYMid slice"
        />
        {/* Soft subtle warm rim border */}
        <circle
          cx="110"
          cy="95"
          r="53"
          fill="none"
          stroke="#f0cc6a"
          strokeWidth="2.5"
          opacity="0.85"
        />
      </g>

      {/* Cute ribbon bow at top right */}
      <g transform="translate(160, 20)">
        <path d="M0,0 C-12,-8 -18,6 -4,8 Z" fill="#e74c3c" />
        <path d="M0,0 C12,-8 18,6 4,8 Z" fill="#e74c3c" />
        <circle cx="0" cy="2" r="3" fill="#c0392b" />
        <path d="M-2,4 Q-8,16 -12,22" stroke="#e74c3c" strokeWidth="2.5" fill="none" />
        <path d="M2,4 Q8,16 14,24" stroke="#e74c3c" strokeWidth="2.5" fill="none" />
      </g>

      {/* Sparkling Stars */}
      <text x="35" y="45" fontSize="12" fill="#ffd700">✦</text>
      <text x="185" y="110" fontSize="14" fill="#ffd700">✦</text>
      <text x="45" y="140" fontSize="10" fill="#ffd700">✨</text>
    </svg>
  </div>
);
